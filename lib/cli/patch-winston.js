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

var util = require('util');
var winston = require('winston');
var config = require('winston/lib/winston/config');
var common = require('winston/lib/winston/common');

/*
    This patch overrides the winston 'Console.log' and 'common.log' methods
    in order to introduce the 'options.terse' flag.

    See "patch:" comments for alterations.
*/

winston.transports.Console.prototype.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  var self = this, output = common.log({
    colorize: this.colorize,
    json: this.json,
    terse: this.terse, /* patch: terse flag added as an option */
    level: level,
    message: msg,
    meta: meta,
    stringify: this.stringify,
    timestamp: this.timestamp
  });

  if (level === 'error' || level === 'debug') {
    util.error(output);
  } else {
    util.puts(output);
  }

  //
  // Emit the `logged` event immediately because the event loop
  // will not exit until `process.stdout` has drained anyway.
  //
  self.emit('logged');
  callback(null, true);
};

common.log = function (options) {
  var timestampFn = typeof options.timestamp === 'function' ? options.timestamp : common.timestamp,
      timestamp = options.timestamp ? timestampFn() : null,
      meta = options.meta ? common.clone(options.meta) : null,
      output;

  if (options.json) {
    output = meta || {};
    output.level = options.level;
    output.message = options.message;

    if (timestamp) {
      output.timestamp = timestamp;
    }

    return typeof options.stringify === 'function' ? options.stringify(output) : JSON.stringify(output);
  }

  output = timestamp ? timestamp + ' - ' : '';

  /* patch: terse flag will not add 'level: ' to output lines */
  if (options.terse) {
    output += options.message;
  } else {
    output += options.colorize ? config.colorize(options.level) : options.level;
    output += (': ' + options.message);
  }

  if (meta) {
    if (typeof meta !== 'object') {
      output += ' ' + meta;
    } else if (Object.keys(meta).length > 0) {
      output += ' ' + common.serialize(meta);
    }
  }

  return output;
};
