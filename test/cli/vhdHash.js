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


var fs = require('fs');
var crypto = require('crypto');

var vhdTools = require('../../lib/cli/iaas/upload/vhdTools');

var quiet = false;
var noFooter = false;
for (var i = process.argv.length - 1; i >=2 ; --i) {
  switch (process.argv[i].slice(0, 2)) {
  case '-q': 
    quiet = true;
    break;
  case '-n':
    noFooter = true;
    break;
  default:
    continue;
  }
  process.argv.splice(i, 1); // delete element i
}
	
var inVhd = process.argv[2];
if (!inVhd || process.argv[5]) {
	console.error('VHD <file-name> [md5|md4|md2|rmd160|sha|sha1] [base64|hex] [-q|-quiet] [-n|-nofooter]\n Defaults are: md5 base64');
	process.exit(1);
}

var hashName = process.argv[3] || 'md5';


var pos = 0;

var info = vhdTools.getVHDInfo(inVhd);

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

function calculateHash(callback) {
  var hash = crypto.createHash(hashName);
  var size = info.footer.currentSize;
  console.log(inVhd, ': size =', size, ', type =', info.footer.diskType);
  var stream = info.getReadStream(noFooter ? {start : 0, end : size - 1} : undefined);
  stream.on('data', function (data) {
    hash.update(data);
    if (!quiet) {
      pos += data.length;
      displayStatus();
    }
  });
  stream.on('end', function () {
    callback(hash.digest(process.argv[4] || 'base64'));
  });
  stream.on('error', function (e) {
    callback(null, e);
  });
}

calculateHash(function(result, error) {
  if (error) {
    console.error(error);
    throw error;
  }
  console.log(hashName, '=', result);
});
