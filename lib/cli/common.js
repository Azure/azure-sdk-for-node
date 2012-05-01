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


var log = require('winston');
var child_process = require('child_process');

exports.launchBrowser = function (url) {
  log.info('Launching browser to', url);
  if (process.env.OS !== undefined) {
    child_process.exec('start ' + url);
  } else {
    child_process.spawn('open', [url]);
  }
};