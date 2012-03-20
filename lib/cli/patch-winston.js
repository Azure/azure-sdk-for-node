
var util = require('util');
var winston = require('winston');
var config = require('winston/lib/winston/config');
var common = require('winston/lib/winston/common');

winston.transports.Console.prototype.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  var self = this, output = common.log({
    colorize:  this.colorize, 
    json:      this.json,
    terse:     this.terse,
    level:     level,
    message:   msg,
    meta:      meta,
    stringify: this.stringify,
    timestamp: this.timestamp
  });

  if (level === 'error' || level === 'debug') {
    util.error(output);
  }
  else {
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
      timestamp   = options.timestamp ? timestampFn() : null,
      meta        = options.meta ? common.clone(options.meta) : null,
      output;

  if (options.json) {
    output         = meta || {};
    output.level   = options.level;
    output.message = options.message;
    
    if (timestamp) {
      output.timestamp = timestamp;
    }
    
    return typeof options.stringify === 'function' 
      ? options.stringify(output)
      : JSON.stringify(output);
  }

  output = timestamp ? timestamp + ' - ' : '';
  if (options.terse) {
    output += options.message;
  }
  else {
    output += options.colorize ? config.colorize(options.level) : options.level;
    output += (': ' + options.message);
  }

  if (meta) {
    if (typeof meta !== 'object') {
      output += ' ' + meta;
    }
    else if (Object.keys(meta).length > 0) {
      output += ' ' + common.serialize(meta);
    }
  } 

  return output;
};
