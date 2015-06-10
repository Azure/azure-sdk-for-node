// Helper script that can read the set of services included
// in the azure SDK dynamically.

var fs = require('fs');
var path = require('path');
var stream = require('readable-stream');
var through = require('through');
var util = require('util');

var sdkRoot = path.join(__dirname, '..');
var servicesRoot = path.join(sdkRoot, 'lib/services');

//
// Custom streams used in our implementation below.
//
// First is a readable stream that just passes through strings
// in object mode.
//

function ServiceStream() {
  var self = this;
  stream.Readable.call(self, { objectMode: true });
  fs.readdir(servicesRoot, function (err, files) {
    if (err) {
      return self.emit('error', err);
    }

    self.push(path.join(sdkRoot, 'lib/common'));
    files.map(function (f) { return path.join(servicesRoot, f); })
      .forEach(self.push.bind(self));
    self.push(null);
  });
}

util.inherits(ServiceStream, stream.Readable);

ServiceStream.prototype._read = function () {
};

//
// Transform stream that reads the package.json in the
// directory given.
//
function ReadPackageJsonStream() {
  stream.Transform.call(this, {objectMode: true});
}

util.inherits(ReadPackageJsonStream, stream.Transform);

ReadPackageJsonStream.prototype._transform = function(servicepath, encoding, callback) {
  var self = this;
  packagejsonpath = path.join(servicepath, 'package.json');
  fs.exists(packagejsonpath, function (exists) {
    if (exists) {
      fs.readFile(packagejsonpath, {encoding: 'utf8'}, function (err, text) {
        if (err) { return callback(err); }
        var json = JSON.parse(text.trim());
        self.push({path: servicepath, packageJson: json});
        callback();
      });
    } else {
      callback();
    }
  });
};

function forEachService(iterator, done) {
  var s = new ServiceStream().pipe(new ReadPackageJsonStream());
  function processNext(serviceData) {
    if (serviceData != null) {
      iterator(serviceData, function (err) {
        if (err) { return done(err); }
        processNext(s.read());
      });
    } else {
      s.once('readable', function () {
        processNext(s.read());
      });
    }
  }

  s.on('error', done);
  s.on('end', function () {
    done();
  });

  processNext(null);
}

module.exports = forEachService;
module.exports.test = function () {
  forEachService(function (service, next) {
    console.log(service.packageJson.name, ":", service.path);
    next();
  },
  function (err) {
    if (err) { console.log('Failed with error', err); }
    else { console.log('done'); }
  });
};