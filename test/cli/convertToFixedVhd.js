/**
* Copyright 2012 Microsoft Corporation
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

/**
* Convert dynamic or different VHD to a fixed VHD
*/

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
  var newStatus = ('                            ' + 
      (pos / 1024 / 1024).toFixed()).slice(-20) + ' / ' + info.footer.currentSize / 1024 / 1024 + 
      ' MB                   \r';
  if (status !== newStatus) {
    status = newStatus;
    fs.writeSync(1, status);
  }
}

inStream.on('data', function(data) {
  fs.writeSync(fdOut, data, 0, data.length);
  pos += data.length;
  displayStatus();
});

inStream.on('end', function() {
  fs.closeSync(fdOut);
  console.log('Done!');
});

