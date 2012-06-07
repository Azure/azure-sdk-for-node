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


exports.init = function (cli) {
  cli.command('help [command]')
        .whiteListPowershell()
        .description('Display help for a given command')
        .action(function (name, a, b, c) {
          if (!name) {
            cli.parse(['', '', '-h']);
          } else if (!cli.categories[name]) {
            throw new Error("Unknown command name " + name);
          } else {
            var args = ['', ''].concat(cli.rawArgs.slice(4), ['-h']);
            cli.categories[name].parse(args);
          }
        });
};
