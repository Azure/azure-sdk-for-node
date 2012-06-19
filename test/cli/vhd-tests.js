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
           
         cp.execFile('node', [__dirname + '/vhdHash.js', '-q', __dirname + '/DiskTest'], null, 
             function(exitCode, out, err) {
           out.should.include('FUvqsIDyYn1JQUIGF6fzWQ==');
           done();
         });
       });
       
       test('Verifying stream conversion of difference VHD with trivial difference', function(done) {
           
         cp.execFile('node', [__dirname + '/vhdHash.js', '-q', __dirname + '/DiskTestDiff0'], null, 
             function(exitCode, out, err) {
           out.should.include('cM95x2r5yQtFvNsVytU4bA==');
           done();
         });
       });
       
       test('Verifying stream conversion of difference VHD', function(done) {
           
         cp.execFile('node', [__dirname + '/vhdHash.js', '-q', __dirname + '/DiskTestDiff'], null, 
             function(exitCode, out, err) {
           out.should.include('SagFXzzaYPbxl6q2t9/0XQ==');
           done();
         });
       });
       
       test('Verifying stream conversion of a difference VHD with difference parent VHD', function(done) {
           
         cp.execFile('node', [__dirname + '/vhdHash.js', '-q', __dirname + '/DiskTestDiffDiff'], null, 
             function(exitCode, out, err) {
           out.should.include('Ocw1718CwnnI1yXVVGEfgw==');
           done();
         });
       });
       
   });
});
