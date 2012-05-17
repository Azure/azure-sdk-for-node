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

/* Note - this will fail if 'creatorApplication' field is changed to something different from 'azur'! */

require('should');
var cp = require('child_process');

suite('cli', function () {
   suite('VHD streaming conversion test', function() {
       
       test('Verifying stream conversion of dynamic VHD', function(done) {
           
         cp.execFile('node', [__dirname + '/vhdMd5.js', __dirname + '/DiskTest.vhd'], null, 
             function(exitCode, out, err) {
           out.should.include('1fK/lWWNvTijd+2UChMWUQ==');
           done();
         });
       });
       
       test('Verifying stream conversion of difference VHD with trivial difference', function(done) {
           
         cp.execFile('node', [__dirname + '/vhdMd5.js', __dirname + '/DiskTestDiff0.vhd'], null, 
             function(exitCode, out, err) {
           out.should.include('NmL+zsd6qAt1JF+UcUnm6A==');
           done();
         });
       });
       
       test('Verifying stream conversion of difference VHD', function(done) {
           
         cp.execFile('node', [__dirname + '/vhdMd5.js', __dirname + '/DiskTestDiff.vhd'], null, 
             function(exitCode, out, err) {
           out.should.include('CYOC3iwdtVlrHFdSLCwVGA==');
           done();
         });
       });
       
       test('Verifying stream conversion of a difference VHD with difference parent VHD', function(done) {
           
         cp.execFile('node', [__dirname + '/vhdMd5.js', __dirname + '/DiskTestDiffDiff.vhd'], null, 
             function(exitCode, out, err) {
           out.should.include('fb/uwHU/FrEPTTDimi5Aww==');
           done();
         });
       });
       
   });
});
