/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var http = require('http');
var fs = require('fs');
var url = require('url');

var sessionsRootPath = 'test/recordings';

exports.log = true;

if (!fs.existsSync) {
  fs.existsSync = require('path').existsSync;
}


function writeLog(msg) {
  if (exports.log) {
    console.log(msg);
  }
}

var driverFactory = {
  modes: {},
  create: function (proxy, session) {
    // call the factory method which matches the session.mode
    return this.modes[session.mode](proxy, session);
  }
};

var utils = {};

utils.buildRequestOptions = function (request, proxy) {
  var options = {
    host: proxy.host,
    port: proxy.port,
    method: request.method,
    path: request.url,
    headers: request.headers
  };

  if (!proxy.host) {
    var u = url.parse(request.url);
    options.host = u.hostname;
    options.port = u.port;
    if (!u.port) {
      options.port = (u.protocol == 'https') ? '443' : '80';
    }
  }

  return options;
};

// session.mode 'neutral' allows requests to pass through to actual proxy
driverFactory.modes.neutral = function (proxy, session) {
  var driver = {};
  driver.call = function (request, response) {
    writeLog('  REQUEST: ' + request.method + ' ' + request.url);

    var options = utils.buildRequestOptions(request, proxy);

    var requestStart = new Date();
    var proxyRequest = http.request(options, function (proxyResponse) {
      var requestStop = new Date();

      writeLog("    STATUS: " + proxyResponse.statusCode + ' ' + (requestStop.getTime() - requestStart.getTime()) + 'ms');

      proxyResponse.on('data', function (chunk) {
        writeLog('        >proxy_response.on data');
        response.write(chunk, 'binary');
      });
      proxyResponse.on('end', function () {
        writeLog('        >proxy_response.on end');
        response.end();
      });

      proxyResponse.on('error', function (err) {
        writeLog('        >proxy_response.on error');
        writeLog('proxy_response ' + err);
        response.end();
      });

      response.writeHead(proxyResponse.statusCode, proxyRequest.headers);
    });

    request.on('data', function (chunk) {
      writeLog('        >request.on data');
      proxyRequest.write(chunk, 'binary');
    });

    request.on('end', function () {
      writeLog('        >request.on end');
      proxyRequest.end();
    });

    proxyRequest.on('error', function (err) {
      writeLog('proxy_request ' + err + ' on ' + request.method + ' ' + request.url);
      driver.call(request, response).end();
      //response.end();
    });
    request.on('error', function (err) {
      writeLog('request' + err);
      response.end();
    });
    response.on('error', function (err) {
      writeLog('response' + err);
      response.end();
    });

    return proxyRequest;
  };
  driver.close = function () { };

  return driver;
};

// session.mode 'recording' saves all request/response information to a session subdirectory
driverFactory.modes.recording = function (proxy, session) {

  var sessionPath = sessionsRootPath + '/' + session.name;
  if (!fs.existsSync(sessionsRootPath)) {
    fs.mkdirSync(sessionsRootPath, 0755);
  }
  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, 0755);
  }

  // files.create returns a worker which creates .dat files the first time .write is called
  var files = { count: 0 };
  files.create = function (entry, entryProperty) {
    var file = {};
    var stream = null;
    file.write = function (chunk) {
      if (stream == null) {
        files.count = files.count + 1;
        var name = 'x' + files.count + '.dat';
        entry[entryProperty] = name;
        stream = fs.createWriteStream(sessionPath + '/' + name);
        writeLog('    ' + entryProperty + ' ' + name);
      }
      stream.write(chunk);
    };
    file.end = function () {
      if (stream != null) {
        stream.end();
      }
    };

    return file;
  };

  var records = [];
  var driver = {};
  driver.call = function (request, response) {
    var entry = {
      requestMethod: request.method,
      requestUrl: request.url,
      requestHeaders: request.headers
    };
    records.push(entry);

    var requestFile = files.create(entry, "requestFile");
    var responseFile = files.create(entry, "responseFile");

    writeLog('  REQUEST: ' + request.method + ' ' + request.url);
    var options = utils.buildRequestOptions(request, proxy);

    var requestStart = new Date();
    var proxyRequest = http.request(options, function (proxyResponse) {
      var responseFileContent = '';
      var requestStop = new Date();

      entry.responseStatusCode = proxyResponse.statusCode;
      entry.responseHeaders = proxyResponse.headers;

      writeLog("    STATUS: " + proxyResponse.statusCode + ' ' + (requestStop.getTime() - requestStart.getTime()) + 'ms');

      proxyResponse.on('data', function (chunk) {
        //writeLog('      >proxy_response.on data');
        responseFileContent += chunk;

        if (!response.write(chunk, 'binary')) {
          //writeLog('      >proxy_response.pause()');
          proxyResponse.pause();
        }
      });
      response.on('drain', function () {
        //writeLog('      >response.on drain');
        proxyResponse.resume();
      });
      proxyResponse.on('end', function () {
        writeLog('      >proxy_response.on end');

        if (responseFileContent) {
          // normalize line feeds by always using carriage return + line feeds on recording
          responseFileContent = responseFileContent.replace(/\n/g, '\r\n');

          responseFile.write(responseFileContent);
          responseFile.end();
        }

        response.end();
      });
      proxyResponse.on('error', function (err) {
        writeLog('      >proxy_response.on error ' + err);
      });

      response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    });

    request.on('data', function (chunk) {
      //writeLog('      >request.on data');
      requestFile.write(chunk);
      if (!proxyRequest.write(chunk, 'binary')) {
        request.pause();
      }
    });
    proxyRequest.on('drain', function () {
      request.resume();
    });
    request.on('end', function () {
      writeLog('      >request.on end');
      requestFile.end();
      proxyRequest.end();
    });

    request.on('error', function (err) {
      writeLog('      >request.on error ' + err);
    });
    response.on('error', function (err) {
      writeLog('      >response.on error ' + err);
    });
    proxyRequest.on('error', function (err) {
      writeLog('      >proxy_request.on error ' + err);
      entry.used = true; // prevent use in playback
      response.end();
    });
  };
  driver.close = function () {
    // Update records for storing
    for (var i in records) {
      // strip request authorization header
      delete records[i].requestHeaders['authorization'];

      // Strip request id header
      delete records[i].requestHeaders['x-ms-request-id'];

      // Strip request host header
      delete records[i].requestHeaders['host'];

      // Strip response request id header
      delete records[i].responseHeaders['x-ms-request-id'];

      // Strip response location header
      delete records[i].responseHeaders['location'];

      // Strip account from url and replace by "playback" account
      var u = url.parse(records[i].requestUrl);
      u.hostname = 'playback' + u.hostname.substring(u.hostname.indexOf('.'));
      u.host = u.hostname + ':' + u.port;
      delete u.href;
      records[i].requestUrl = url.format(u);
    }

    fs.writeFile(sessionPath + '/index.json', JSON.stringify(records), function (err) {
      if (err) throw err;
      writeLog('  Saved ' + sessionPath + '/index.json');
    });
  };

  return driver;
};


driverFactory.modes.playback = function (proxy, session) {
  var sessionPath = sessionsRootPath + '/' + session.name;
  if (fs.existsSync(sessionPath + '/index.json')) {

    var records = JSON.parse(fs.readFileSync(sessionPath + '/index.json'));
    var driver = {};
    driver.call = function (request, response) {
      writeLog('  REQUEST: ' + request.method + ' ' + request.url);

      request.url = url.format(url.parse(request.url));

      var entry = null;
      for (var k in records) {
        var match = records[k];
        if (match.used) {
          continue;
        }

        if (request.method != match.requestMethod ||
          request.url != match.requestUrl) {
          continue;
        }

        writeLog('    matched index ' + k);
        match.used = true;
        entry = match;
        break;
      }

      if (entry == null) {
        writeLog('    STATUS: 500 Unexpected Request');
        response.statusCode = 500;
        response.end('Unexpected request');
        return;
      }

      writeLog('    STATUS: ' + entry.responseStatusCode);

      response.statusCode = entry.responseStatusCode;
      for (k in entry.responseHeaders) {
        response.setHeader(k, entry.responseHeaders[k]);
      }

      if (!entry.responseFile) {
        response.end();
      }
      else {
        writeLog('    sending: ' + entry.responseFile);
        var responseFileContent = fs.readFileSync(sessionPath + '/' + entry.responseFile);
        // Make sure only the last line feed contains a carriage return
        if (responseFileContent) {
          responseFileContent = responseFileContent.toString().replace(/\r\n/g, '\n');

          if (responseFileContent[responseFileContent.length - 1] === '\n') {
            responseFileContent[responseFileContent.length - 1] = '\r';
            responseFileContent += '\n';
          }

          response.write(responseFileContent);
          response.end();
        }
      }
    };
    driver.close = function () { };
  }
  else {
    var driver = {};
    driver.call = function (request, response) {
      writeLog('  REQUEST: ' + request.method + ' ' + request.url);

      writeLog('    STATUS: 500 Unexpected Request');
      response.statusCode = 500;
      response.end('Unexpected request');
    };

    driver.close = function () { };
  }

  return driver;
};

// factory method for the service context
function mockProxy(host, port) {
  // this state is GET or PUT on the http://localhost:8888/proxy url
  // a test framework is expected to PUT this value to correct proxy if needed
  var proxy = { host: host, port: port };

  // this state is GET, PUT, or DELETE on the http://localhost:8888/session url
  // a test framework is expected to PUT before and DELETE after each test
  // valid modes include 'neutral', 'recording', and 'playback'
  var session = { mode: 'neutral', name: '' };

  // this is the current driver, it's updated when the /session state is altered
  var driver = driverFactory.create(proxy, session);

  return function (request, response) {
    var u = url.parse(request.url, true);
    var isLocal = request.headers.host == 'localhost:8888' || u.host == 'localhost:8888';
    if (!isLocal) {
      driver.call(request, response);
      return;
    }

    writeLog("CONTROL: " + request.method + ' ' + u.pathname);
    response.setHeader('Content-Type', 'text/plain');
    if (u.pathname == '/') {
      response.setHeader('Content-Type', 'text/html');
      response.end(fs.readFileSync("index.html"));
    }
    else if (u.pathname == '/proxy') {
      if (request.method == "GET") {
        response.end(JSON.stringify(proxy));
      }
      else if (request.method == "PUT") {
        var data = '';
        request.on('data', function (chunk) {
          data += chunk;
        });
        request.on('end', function () {
          writeLog("  " + data);
          var put = JSON.parse(data);
          proxy.host = put.host;
          proxy.port = put.port;
          response.end();
        });
      }
      else {
        response.end();
      }
    }
    else if (u.pathname == '/session') {
      if (request.method == "GET") {
        response.end(JSON.stringify(session));
      }
      else if (request.method == "PUT") {
        var data = '';
        request.on('data', function (chunk) {
          data += chunk;
        });
        request.on('end', function () {
          writeLog("  " + data);
          var put = JSON.parse(data);
          session = { mode: put.mode, name: put.name };
          driver.close();
          driver = driverFactory.create(proxy, session);
          response.end();
        });
      }
      else if (request.method == "DELETE") {
        driver.close();
        session = { mode: 'neutral', name: '' };
        driver = driverFactory.create(proxy, session);
        response.end();
      }
      else {
        response.end();
      }
    }
    else if (u.pathname == '/sessions') {
      var sessions = fs.readdirSync(sessionsRootPath);
      response.setHeader('Content-Type', 'text/html');
      response.write('<ul>');
      for (k in sessions) {
        response.write('<li><a href="sessions/');
        response.write(sessions[k]);
        response.write('">');
        response.write(sessions[k]);
        response.write('</a></li>');
      }
      response.write('</ul>');
      response.end();
    }
    else if (u.pathname.indexOf('/sessions/') == 0) {
      var records = JSON.parse(fs.readFileSync('.' + u.pathname + '/index.json'));
      response.setHeader('Content-Type', 'text/html');
      response.write('<ul>');
      for (var k in records) {
        response.write('<li>');
        response.write(records[k].requestMethod);
        response.write(' ');
        response.write(records[k].requestUrl);
        response.write('</li>');
      }

      response.write('</ul>');
      response.end();
    }
    else {
      response.statusCode = 404;
      response.write('404 Huh?');
      response.end();
    }
  };
};

exports.createServer = function () {
  var server = http.createServer(mockProxy(null, null));
  server.listen(8888);

  writeLog('Proxy server started on http://localhost:8888');

  return server;
};