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

var inVhd = process.argv[2];
if (!inVhd) {
	console.error('VHD (or other) file name is expected');
	process.exit(1);
}

function calculateMD5(callback) {
  var md5hash = crypto.createHash('md5');
  var stream = vhdTools.getVHDInfo(inVhd).getReadStream();
  stream.on('data', function (data) {
    md5hash.update(data);
  });
  stream.on('end', function () {
    callback(md5hash.digest('base64'));
  });
  stream.on('error', function (e) {
    callback(null, e);
  });
}

calculateMD5(function(result, error) {
  if (error) {
    console.error(error);
    throw error;
  }
  console.log(inVhd + ' : MD5 = ' + result);
});
