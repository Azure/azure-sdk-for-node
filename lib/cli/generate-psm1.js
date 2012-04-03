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

var cli = require('./cli');


function buildModel(root) {
    var model = {
        cmdlets: []
    };

    recurse(model, "", root);
    return model;

    function recurse(model, suffix, focus) {
        for (var category in focus.categories) {
            var childSuffix = suffix + leadingCapital(category);
            recurse(model, childSuffix, focus.category(category));
        }
        focus.commands.forEach(function (command) {
            var cmdlet = {
                name: leadingCapital(command.name) + '-Azure' + suffix,
                command: command,
                parameters: []
            };
            var position = 0;
            cmdlet.command.args.forEach(function (arg) {
                cmdlet.parameters.push({
                    name: arg.name,
                    mandatory: arg.required,
                    position: ++position
                });
            });
            cmdlet.command.options.forEach(function (option) {
                cmdlet.parameters.push({
                    name: option.long.substring(2),
                    description: option.description
                });
            });
            model.cmdlets.push(cmdlet);
        });
    }

    function leadingCapital(text) {
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }
}

function renderModel(model) {
    model.cmdlets.forEach(function (cmdlet) {
        console.log('<#');
        console.log('.Synopsis');
        console.log(' ' + cmdlet.command.description());
        console.log('');
        cmdlet.parameters.forEach(function (param) {
            console.log('.Parameter ' + param.name);
            console.log(' ' + param.description);
        });
        console.log('#>');
        console.log('function ' + cmdlet.name + ' {');
        console.log('  param(');
        var delimiter = '';
        cmdlet.parameters.forEach(function (param) {
            var props = [];
            if (param.mandatory) {
                props.push('Mandatory=$True');
            }
            if (param.position) {
                props.push('Position=' + param.position);
            }
            if (param.description) {
                props.push('HelpMessage=\'' + param.description + '\'');
            }
            var line = '[Parameter(' + props.join(',') + ')][string]$' + param.name;
            console.log(delimiter + line);
            delimiter = ',';
        });
        console.log('  )');


        console.log('$Arguments = @()');
        cmdlet.command.fullName().split(' ').forEach(function (commandPart) {
            console.log('$Arguments += \"' + commandPart + '\"');
        });
        cmdlet.parameters.forEach(function (param) {
            if (param.position) {
                console.log('if($' + param.name + ') {');
                console.log('$Arguments += $' + param.name);
                console.log('}');
            } else {
                console.log('if($' + param.name + ') {');
                console.log('$Arguments += "--' + param.name + '"');
                console.log('$Arguments += $' + param.name);
                console.log('}');
            }
        });
        console.log('foreach($arg in $args)');
        console.log('{');
        console.log('$Arguments += $arg');
        console.log('}');
        console.log('  Start-Process \"azure\" $Arguments -NoNewWindow -Wait');
        console.log('}');
        console.log('export-modulemember -function ' + cmdlet.name);
    });
}

var model = buildModel(cli);
renderModel(model);

