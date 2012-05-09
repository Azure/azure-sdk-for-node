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
var generateutils = require('./generate-psm1-utils');

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

    focus.commands
	.filter(function (command) {
		return command.whitelist;
	})
	.forEach(function (command) {
      var powershellName;
      if (command.powershellName) {
        powershellName = command.powershellName;
      } else {
        powershellName = leadingCapital(command.name) + '-Azure' + suffix;
      }

      var cmdlet = {
        name: powershellName,
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
          description: option.description,
          option: option,
          isSwitch: !option.required && !option.optional
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
      console.log('.Parameter ' + generateutils.getNormalizedParameterName(param.name));
      if (param.description) {
        console.log(' ' + param.description);
      }
    });

    console.log('#>');
    console.log('function ' + cmdlet.name + ' {');
    console.log('  param(');

    var delimiter = '';

    cmdlet.parameters.forEach(function (param) {
      var normalizedParamName = generateutils.getNormalizedParameterName(param.name);

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

      var line;
      if (param.isSwitch) {
        line = '[Parameter(' + props.join(',') + ')][switch]$' + normalizedParamName;
      } else {
        line = '[Parameter(' + props.join(',') + ')][string]$' + normalizedParamName;
      }
      console.log(delimiter + line);
      delimiter = ',';
    });

    console.log('  )');
    console.log('$Arguments = @()');

    cmdlet.command.fullName().split(' ').forEach(function (commandPart) {
      console.log('$Arguments += \"' + commandPart + '\"');
    });

    cmdlet.parameters.forEach(function (param) {
      var normalizedParamName = generateutils.getNormalizedParameterName(param.name);

      if (param.position) {
        console.log('if($' + normalizedParamName + ') {');
        console.log('$Arguments += $' + normalizedParamName);
        console.log('}');
      } else {
        console.log('if($' + normalizedParamName + ') {');
        console.log('$Arguments += "--' + param.name + '"');
        console.log('$Arguments += $' + normalizedParamName);
        console.log('}');
      }
    });

    console.log('$Arguments += "--powershell"');

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