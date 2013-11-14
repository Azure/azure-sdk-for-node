// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

'use strict';

var Stream = require('stream');
var fs = require('fs');
var os = require('os');

var EOL = '\n';
var debugStream = null;
var deleteInput = false;
var source;

ifFlag('-rm', function () {
  deleteInput = true;
});

ifFlag('-debug', function () {
  debugStream = fs.createWriteStream('filter-debug.log', {flags: 'w'});
});

if (process.argv.length > 2) {
  source = fs.createReadStream(process.argv[2], { flags: 'r' });
  if (deleteInput) {
    source.on('close', function () {
      fs.unlinkSync(process.argv[2]);
    });
  }
} else {
  source = process.stdin;
}

function ifFlag(flag, ifPresentCallback) {
  var flagIndex = process.argv.indexOf(flag);
  if (flagIndex !== -1) {
    process.argv.splice(flagIndex, 1);
    ifPresentCallback();
  }
}

//
// Through stream that breaks up input into individual
// lines of text and writes the lines individually.
// Makes it easier for downstream filters to operate on
// a per line basis.
//

function lineFilter() {
  var stream = new Stream();
  stream.readable = true;
  stream.writable = true;

  var pendingLines = [];
  var partialLine = null;
  var done = false;

  stream.write = write;
  stream.end = end;

  return stream;

  function sendNextLine() {
    if (pendingLines.length > 0) {
      var lineToSend = pendingLines.shift();
      stream.emit('data', lineToSend + EOL);
      if(debugStream) {
        debugStream.write('line filter sending line ' + lineToSend + EOL);
      }
      process.nextTick(sendNextLine);
    } else if (done) {
      if (partialLine !== null) {
        stream.emit('data', partialLine + EOL);
      }
      stream.emit('end');
      stream.emit('close');
    }
  }

  function splitBufferIntoLines(buffer, encoding, completionCallback) {
    if (typeof buffer !== 'string') {
      buffer = buffer.toString(encoding);
    }

    var lines = buffer.split(EOL);
    var lastLine = lines[lines.length - 1];
    if (buffer.slice(-(EOL.length)) !== EOL) {
      lines.pop();
    } else {
      lastLine = null;
    }

    completionCallback(lines, lastLine);
  }

  function write(buffer, encoding) {
    var shouldSend = (pendingLines.length === 0);

    splitBufferIntoLines(buffer, encoding, function (fullLines, leftover) {
      if (fullLines.length > 0 && partialLine !== null) {
        fullLines[0] = partialLine + fullLines[0];
        partialLine = null;
      }

      if (leftover !== null) {
        partialLine = (partialLine || '') + leftover;
      }
      pendingLines = pendingLines.concat(fullLines);
    });

    if (shouldSend) {
      process.nextTick(sendNextLine);
    }
  }

  function end(buffer, encoding) {
    if (buffer) {
      this.write(buffer, encoding);
    }
    done = true;
  }
}

//
// A simple transformation stream that reads in
// test results and filters out extraneous lines -
// everything before the first XML <testsuite> line.
// Assumes that the LineFilter above is included
// so treats every buffer as a single line.
//

function testResultFilter() {
  var stream = new Stream();
  stream.readable = true;
  stream.writable = true;

  stream.write = write;
  stream.end = end;

  var xmlFound = false;

  return stream;

  function write(buffer, encoding) {
    if (typeof buffer !== 'string') {
      buffer = buffer.toString(encoding);
    }
    checkIfXmlFound(buffer);
    if (xmlFound) {
      if (debugStream) {
       debugStream.write('received line '  + buffer + ' and it\'s in the xml\n');
      }
      var self = this;
      process.nextTick(function () { self.emit('data', buffer); });
    } else if (debugStream) {
      debugStream.write('received line ' + buffer + ' and it\'s not in the xml\n');
    }
  }

  function end(buffer, encoding) {
    if (buffer) {
      if (debugStream) {
        debugStream.write('>>>>> end received with buffer, writing');
      }
      this.write(buffer, encoding);
    }
    process.nextTick(function () {
      stream.emit('end');
      stream.emit('close');
    });
  }

  function checkIfXmlFound(line) {
    if (xmlFound) { return; }
    var openTag = '<testsuite';
    if (line.slice(0, openTag.length) === openTag) {
      xmlFound = true;
    }
  }
}

//
// Temporary workaround to tweak output report so that
// Jenkins will render it.
//
function changeSkippedFilter() {
  var stream = new Stream();
  stream.readable = true;
  stream.writable = true;

  stream.write = write;
  stream.end = end;
  return stream;

  function write(buffer, encoding) {
    if (typeof buffer !== 'string') {
      buffer = buffer.toString(encoding);
    }

    var openTag = '<testsuite';
    if(buffer.slice(0, openTag.length) === openTag) {
      buffer = buffer.replace(' skip="', ' skipped="');
    }
    this.emit('data', buffer);
  }

  function end(buffer, encoding) {
    if (buffer) {
      this.write(buffer, encoding);
    }
    this.emit('end');
    this.emit('close');
  }
}

source.resume();
source.pipe(lineFilter()).pipe(testResultFilter()).pipe(changeSkippedFilter()).pipe(process.stdout);
