var fs = require('fs');
var vhdTools = require('../../lib/cli/iaas/upload/vhdTools');
var inVhd = process.argv[2];
var outVhd = process.argv[3];

if (!inVhd || !outVhd || inVhd == outVhd) {
  throw 'Need in and out VHD names. Names should be different.';
}

console.log(inVhd + ' --> ' + outVhd);
var info = vhdTools.getVHDInfo(inVhd);
var inStream = info.getReadStream();
var fdOut = fs.openSync(outVhd, 'w');
var pos = 0;

var status = '';
function displayStatus() {
  var newStatus = ('                            ' + (pos / 1024 / 1024).toFixed()).slice(-20) + ' / ' + info.footer.currentSize / 1024 / 1024 + ' MB                   \r';
  if (status !== newStatus) {
    status = newStatus;
    fs.writeSync(1, status);
  }
}

inStream.on('data', function(data) {
  //console.log('pos= 0x'+pos.toString(16));
  fs.writeSync(fdOut, data, 0, data.length);
  pos += data.length;
  displayStatus();
});

inStream.on('end', function() {
  fs.closeSync(fdOut);
  console.log('Done!');
});

