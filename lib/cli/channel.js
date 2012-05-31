/**
* Copyright 2011 Microsoft Corporation
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


var https = require('https');
var querystring = require('querystring');
var tunnel = require('tunnel');
var xml2js = require('xml2js');
var log = require('winston');

module.exports = Channel;

function merge() {
  var source, sourceValue;
  var target = arguments[0] || {};
  var length = arguments.length;

  for (var i = 1; i < length; i++) {
    source = arguments[i];
    if (source !== null) {
      for (var property in source) {
        sourceValue = source[property];
        if (sourceValue !== undefined) {
          if (typeof target[property] === 'object') {
            merge(target[property], sourceValue);
          } else {
            target[property] = sourceValue;
          }
        }
      }
    }
  }
  return target;
}

function Channel(options) {
  this.options = options;
}

Channel.prototype.add = function (options) {
  if (options.headers === undefined) {
    return new Channel(merge({}, this.options, options));
  }
  var headers = merge({}, this.options.headers, options.headers);
  var query = merge({}, this.options.query, options.query);
  return new Channel(merge({}, this.options, options, { headers: headers, query: query }));
};

Channel.prototype.path = function (path) {
  return this.add({ path: (this.options.path || '') + '/' + querystring.escape(path) });
};

Channel.prototype.header = function (name, value) {
  var headers = {};
  headers[name] = value;
  return this.add({ headers: headers });
};

Channel.prototype.query = function (name, value) {
  var query = {};
  query[name] = value;
  return this.add({ query: query });
};

Channel.prototype.send = function (method, data, cb) {
  var options = merge({}, this.options, { method: method });
  if (options.proxy) {
    options.agent = tunnel.httpsOverHttp(options);
  } else {
    options.agent = new https.Agent(options);
  }

  if (options.query) {
    var qs = querystring.stringify(options.query);
    if (qs) {
      options.path = options.path + '?' + qs;
    }
  }

  log.silly('Request.Method', options.method);
  log.silly('Request.Path', options.path);
  var req = https.request(options, function (res) {
    var data = [],
        dataLen = 0,
        contentType;
    log.silly('Response.Headers', res.headers);
    res.on('data', function (chunk) {
      data.push(chunk);
      dataLen += chunk.length;
      contentType = contentType || res.headers['content-type'];
    });
    res.on('end', function () {
      if (!dataLen) {
        return cb && cb(null, null);
      }
      var buf = new Buffer(dataLen);
      for (var i = 0, len = data.length, pos = 0; i < len; i++) {
        data[i].copy(buf, pos);
        pos += data[i].length;
      }
      parseContent(contentType, buf, function (err, content) {
        // for fail statusCode
        if (!err && res.statusCode && res.statusCode >= 400) {
          var ret = {};
          ret.Message = (content && content.Message) || content;
          ret.Code = (content && content.Code) || res.statusCode;
          ret.toString = function () {
            return this.Message || 'fail with ' + this.Code + ' statusCode';
          }
          return cb && cb(ret, null);
        } else {
          return cb && cb(err, content);
        }
      });
    });
  }).on('error', function (e) {
    throw new Error('Host is not reachable. This may be due to lost internet connectivity. Please check your connection.');
  });

  if (typeof (data) === 'function') {
    data(req);
  } else {
    if (data) {
      req.write(data);
    }
    req.end();
  }
};

function parseContent(contentType, buf, cb) {
  if (contentType) {
    if (contentType.indexOf('application/json') != -1) {
      return cb(null, JSON.parse(buf.toString()));
    } else if (contentType.indexOf('application/zip') != -1) {
      return cb(null, buf);
    } else if (contentType.indexOf('text/plain') != -1) {
      return cb(null, buf.toString());
    } else if (contentType.indexOf('/xml') != -1) { // support both text/xml and application/xml
      var parser = new xml2js.Parser();
      parser.on('end', function (result) {
        return cb(null, result);
      });
      return parser.parseString(buf);
    }
  }
  // for unknown contentType
  return cb(null, null);
};

Channel.prototype.GET = function (cb) {
  return this.send('GET', null, cb);
};
Channel.prototype.POST = function (data, cb) {
  return this.send('POST', data, cb);
};
Channel.prototype.PUT = function (data, cb) {
  return this.send('PUT', data, cb);
};
Channel.prototype.DELETE = function (cb) {
  return this.send('DELETE', null, cb);
};
