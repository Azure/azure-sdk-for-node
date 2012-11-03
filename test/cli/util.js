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

exports = module.exports = {
    capture: capture,
};

function capture(action, cb) {
  var result = {
    text: '',
  }

  var processStdoutWrite = process.stdout.write
  var processExit = process.exit

  process.stdout.write = function(data, encoding, fd) {
    result.text += data;
  };

  process.exit = function(status) {
    result.exitStatus = status;

    process.stdout.write = processStdoutWrite;
    process.exit = processExit;

    return cb(result);
  };

  try {
    action();
  } catch(err) {
    result.error = err;

    process.stdout.write = processStdoutWrite;
    process.exit = processExit;

    cb(result);
  }
}
