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

var commander = require('commander');
var fs = require('fs');
var path = require('path');
var tty = require('tty');
var util = require('util');

var log = require('winston');
var colors = require('colors');
var eyes = require('eyes');
var Table = require('easy-table');

require('./patch-winston');

var istty1 = tty.isatty(1);


function recordError(err) {
  if (err && err.stack) {
    try {
      fs.writeFileSync('azure_error', (new Date()) + ':\n' + 
          util.inspect(err) + '\n' + err.stack);
      (log.format().json ? log.error : log.info)('Error information has been recorded to azure_error');
    } catch(err2) {
      log.warn('Cannot save error information :' + util.inspect(err2));
    }
  }
}

var debug = process.env.AZURE_DEBUG === '1';
// Install global unhandled exception handler to make unexpected errors more user-friendly.
if (!debug) {
  process.on('uncaughtException', function (err) {
    clearProgress();

    var loggedFullError = false;
    if (err.message) {
      log.error(err.message);
    } else if (err.Message) {
      log.error(err.Message);
    } else {
      log.json('error', err);
      loggedFullError = true;
    }

    if (!loggedFullError) {
      if (err.stack) {
        log.verbose('stack', err.stack);
      }

      log.json('silly', err);
    }
    recordError(err);
    cli.exit('error', null, 1);
  });
}

///////////////////////////
// prepare output logger

// use cli output settings by default
log.cli();

log.format = function (options) {
  var transport = log['default'].transports.console;

  if (arguments.length === 0) {
    return {
      json: transport.json,
      terse: transport.terse,
      level: transport.level,
      logo: log.format.logo
    };
  }

  if (options.json) {
    log.padLevels = false;
    log.stripColors = true;
    transport.json = true;
    transport.terse = true;
  }

  if (options.terse) {
    log.padLevels = false;
    transport.terse = true;
  }

  if (options.level) {
    transport.level = options.level;
  }

  if (options.logo) {
    log.format.logo = options.logo;
  }
};


log.json = function (level, data) {
  if (arguments.length == 1) {
    data = level;
    level = 'data';
  }

  if (log.format().json) {
    log.log(level, typeof data, data);
  } else {
    var lines = eyes.inspect(data, level, { stream: false });
    lines.split('\n').forEach(function (line) {
      // eyes all is "cyan" by default, so this property accessor will
      // fix the entry/exit color codes of the line. it's needed because we're
      // splitting the eyes formatting and inserting winston formatting where it
      // wasn't before.
      log.log(level, line[eyes.defaults.styles.all]);
    });
  }
};


log.table = function (level, data, transform) {
  if (arguments.length == 2) {
    transform = data;
    data = level;
    level = 'data';
  }

  if (log.format().json) {
    log.log(level, 'table', data);
  } else {
    var table = new Table();
    table.LeftPadder = Table.LeftPadder;
    table.padLeft = Table.padLeft;
    table.RightPadder = Table.RightPadder;
    table.padRight = Table.padRight;

    if (data && data.forEach) {
      data.forEach(function (item) { transform(table, item); table.newLine(); });
    } else if (data) {
      for (var item in data) {
        transform(table, item);
        table.newLine();
      }
    }

    var lines = table.toString();
    lines.substring(0, lines.length - 1).split('\n').forEach(function (line) {
      log.log(level, line);
    });
  }
};

// prepare root cli command
var cli = new commander.Command();

var progressChars = ['-', '\\', '|', '/'];
var progressIndex = 0;
var activeProgressTimer;

var clearBuffer = new Buffer(79, 'utf8');
clearBuffer.fill(' ');
clearBuffer = clearBuffer.toString();

function drawAndUpdateProgress() {
  fs.writeSync(1, '\r');
  process.stdout.write(progressChars[progressIndex].cyan);

  progressIndex = progressIndex + 1;
  if (progressIndex == progressChars.length) {
    progressIndex = 0;
  }
}

function clearProgress() {
  // do not output '+' if there is no progress
  if (cli.currentProgress) {
    if (activeProgressTimer) {
      clearInterval(activeProgressTimer);
      activeProgressTimer = null;
    }
    fs.writeSync(1, '\r+\n');
    cli.currentProgress = undefined;
  }
}


cli.progress = function(label) {
  var verbose = log.format().json || log.format().level === 'verbose' || log.format().level === 'silly';
  if (!istty1 || verbose)  {
    (verbose ? log.verbose : log.info)(label);
    return { end: function() {} };
  }
  
  // clear any previous progress
  clearProgress();

  // Clear the console
  fs.writeSync(1, '\r' + clearBuffer);
    
  // Draw initial progress
  drawAndUpdateProgress();

  // Draw label
  if (label) {
    fs.writeSync(1, ' ' + label);
  }
    
  activeProgressTimer = setInterval(function() {
    drawAndUpdateProgress();
  }, 200);

  cli.currentProgress = {
    end: function() {
      clearProgress();
    }
  };
    
  return cli.currentProgress;
};

cli.output = log;
enableNestedCommands(cli);


cli.exit = function (level, message, exitCode) {
  clearProgress();
  if (message) {
    log.log(level, message);
  }
  process.exit(exitCode);
};

function setupCommand(args, raw) {
  var verbose = 0;
  var json = 0;
  var powershell = 0;
  var category = '*';

  for (var i = 0, len = raw.length; i < len; ++i) {
    if (raw[i] === '--json') {
      ++json;
    } else if (raw[i] === '-v' || raw[i] === '--verbose') {
      ++verbose;
    } else if (raw[i] === '--powershell') {
      ++powershell;
    } else if (category === '*') {
      category = raw[i];
    } else {
      args.push(raw[i]);
    }
  }

  if (verbose || json || powershell) {
    var opts = {};
    if (json) {
      opts.json = true;
      opts.level = 'data';
    }

    if (verbose == 1) {
      opts.json = false;
      opts.level = 'verbose';
    }

    if (verbose >= 2) {
      opts.json = false;
      opts.level = 'silly';
    }

    if (powershell) {
      opts.terse = true;
    }

    log.format(opts);
  }

  return category;
}

function enableNestedCommands(command) {
  command.option('-v, --verbose', 'use verbose output');
  command.option('--json', 'use json output');
  command.option('--powershell');

  command.categories = {};

  command.category = function (name) {
    var category = command.categories[name];
    if (!command.categories[name]) {
      category = command.categories[name] = new commander.Command();
      category.parent = this;
      category.name = name;
      category.helpInformation = categoryHelpInformation;
      enableNestedCommands(category);
    }

    return category;
  };

  command.on('*', function () {
    var args = command.rawArgs.slice(0, 2);
    var raw = command.normalize(command.rawArgs.slice(2));
    var category = setupCommand(args, raw);

    if (!command.categories[category]) {
      log.error('\'' + category + '\' is not an azure command. See \'azure help\'.');
    } else {
      command.categories[category].parse(args);
      if (command.categories[category].args.length === 0) {
        args.push('-h');
        command.categories[category].parse(args);
      }
    }
  });
}

// Allow commands to specify powershell name.
commander.Command.prototype.withPowershellName = function (name) {
  this.powershellName = name;
  return this;
};

commander.Command.prototype.whitelist = false;
commander.Command.prototype.whiteListPowershell = function (whitelist) {
  if (whitelist !== undefined) {
    this.whitelist = whitelist;
  } else {
    this.whitelist = true;
  }
  
  return this;
};

// Allow cli.password to accept empty passwords
commander.Command.prototype.password = function (str, mask, fn) {
  var self = this
      , buf = '';

  // default mask
  if ('function' === typeof mask) {
    fn = mask;
    mask = '';
  }

  process.stdin.resume();
  tty.setRawMode(true);
  fs.writeSync(istty1 ? 1 : 2, str);

  // keypress
  process.stdin.on('keypress', function (c, key) {
    if (key && 'enter' === key.name) {
      console.log();
      process.stdin.removeAllListeners('keypress');
      tty.setRawMode(false);
      fn(buf);
      return;
    }

    if (key && key.ctrl && 'c' === key.name) {
      console.log('%s', buf);
      process.exit();
    }

    process.stdout.write(mask);
    buf += c;
  }).resume();
};


commander.Command.prototype.execute = function (fn) {
  var self = this;
  return self.action(function () {
    if (cli.powershell) {
      log.info('\n');
    } else {
      if (log.format().json) {
        log.verbose('Executing command ' + self.fullName().bold);
      }
      else {
        log.info('Executing command ' + self.fullName().bold);
      }
    }

    try {
      
      // pass no more arguments than the function expects, including options and callback at the end (unless it expects 0 or 1)
      var argCount = fn.length <= 1 ? arguments.length : fn.length - 1; // not including callback
      var args = Array(argCount);
      var optionIndex = arguments.length - 1;
      for (var i = 0; i < arguments.length; ++i) {
        if (typeof arguments[i] === 'object') {
          optionIndex = i;
          break;
        }
        if (i < argCount - 1) {
          args[i] = arguments[i];
        }
      }
      // append with options and callback
      args[argCount - 1] = arguments[optionIndex];
      args.push(callback);
      fn.apply(this, args);
    }
    catch (err) {
      callback(err);
    }

    function callback(err) {
      if (err) {
        if (err.message) {
          log.error(err.message);
          log.json('silly', err);
        } else if (err.Message) {
          log.error(err.Message);
          log.json('verbose', err);
        } else {
          log.error(err);
        }
        
        recordError(err);
        if (err.stack) {
          (debug ? log.error : log.verbose)(err.stack);
        } 
        
        if (cli.powershell) {
          cli.exit('error', '\n', 0);
        } else {
          cli.exit('error', self.fullName().bold + ' command ' + 'failed\n'.red.bold, 1);

        }
      } else {
        if (cli.powershell) {
          cli.exit('info', '\n', 0);
        } else {
          if (log.format().json) {
            cli.exit('verbose', self.fullName().bold + ' command ' + 'OK'.green.bold, 0);
          }
          else {
            cli.exit('info', self.fullName().bold + ' command ' + 'OK'.green.bold, 0);
          }
        }
      }
    }
  });
};

// support multiple levels in commans parsing
commander.Command.prototype.parseOptions = function(argv){
  var args = []
    , len = argv.length
    , literal = false
    , option
    , arg;

  var unknownOptions = [];

  // parse options
  for (var i = 0; i < len; ++i) {
    arg = argv[i];

    // literal args after --
    if ('--' == arg) {
      literal = true;
      continue;
    }

    if (literal) {
      args.push(arg);
      continue;
    }

    // find matching Option
    option = this.optionFor(arg);
    
    //// patch begins
    var commandOption = null;
    
    if (!option && arg[0] === '-') {
      var command = this;
      var arga = null;
      for(var a = 0; a < args.length && command && !commandOption; ++a) {
        arga = args[a];
        if (command.categories && (arga in command.categories)) {
          command = command.categories[arga];
          commandOption = command.optionFor(arg);
          continue;
        }
        break;
      }
      if (!commandOption && arga && command && command.commands) {
        for(var j in command.commands) {
          if (command.commands[j].name === arga) {
            commandOption = command.commands[j].optionFor(arg);
            break;
          }
        }
      }
    }
    //// patch ends
    
    // option is defined
    if (option) {
      // requires arg
      if (option.required) {
        arg = argv[++i];
        if (null == arg) return this.optionMissingArgument(option);
        if ('-' == arg[0]) return this.optionMissingArgument(option, arg);
        this.emit(option.name(), arg);
      // optional arg
      } else if (option.optional) {
        arg = argv[i+1];
        if (null == arg || '-' == arg[0]) {
          arg = null;
        } else {
          ++i;
        }
        this.emit(option.name(), arg);
      // bool
      } else {
        this.emit(option.name());
      }
      continue;
    }
    
    // looks like an option
    if (arg.length > 1 && '-' == arg[0]) {
      unknownOptions.push(arg);
      
      // If the next argument looks like it might be
      // an argument for this option, we pass it on.
      //// patch: using commandOption if available to detect if the next value is an argument
      // If it isn't, then it'll simply be ignored
      commandOption = commandOption || {optional : 1}; // default assumption
      if (commandOption.required || (commandOption.optional && argv[i+1] && '-' != argv[i+1][0])) {
        unknownOptions.push(argv[++i]);
      }
      continue;
    }
    
    // arg
    args.push(arg);
  }
  
  return { args: args, unknown: unknownOptions };
};



//////////////////////////////
// override help subsystem

cli.helpInformation = rootHelpInformation;

commander.Command.prototype.helpInformation = commandHelpInformation;

commander.Command.prototype.fullName = function () {
  var name = this.name;
  var scan = this.parent;
  while (scan.parent !== undefined) {
    name = scan.name + ' ' + name;
    scan = scan.parent;
  }
  return name;
};

function rootHelpInformation() {
  var args = process.argv.slice(0, 2);
  var raw = cli.normalize(process.argv.slice(2));
  setupCommand(args, raw);

  if (cli.powershell) {
    log.info('\n');
  }

  if (log.format().logo === 'on') {
    log.info('         _    _____   _ ___ ___'.cyan);
    log.info('        /_\\  |_  / | | | _ \\ __|'.cyan);
    log.info('  _ ___'.grey + '/ _ \\'.cyan + '__'.grey + '/ /| |_| |   / _|'.cyan + '___ _ _'.grey);
    log.info('(___  '.grey + '/_/ \\_\\/___|\\___/|_|_\\___|'.cyan + ' _____)'.grey);
    log.info('   (_______ _ _)         _ ______ _)_ _ '.grey);
    log.info('          (______________ _ )   (___ _ _)'.grey);
    log.info('');
  }

  var packagePath = path.join(__dirname, '../../package.json');
  var packageInfo = JSON.parse(fs.readFileSync(packagePath));

  log.info('Windows Azure: Microsoft\'s Cloud Platform');
  log.info('');
  log.info('Tool version', packageInfo.version);

  helpCommands(this);
  helpCategoriesSummary(this);
  helpOptions(this);

  if (cli.powershell) {
    log.help('\n');
  }

  return '';
}

function categoryHelpInformation() {
  if (cli.powershell) {
    log.help('\n');
  }

  log.help(this.description());
  helpCommands(this);
  helpCategories(this);
  helpOptions(this);

  if (cli.powershell) {
    log.help('\n');
  }

  return '';
}

function commandHelpInformation() {
  if (cli.powershell) {
    log.help('\n');
  }

  log.help(this.description());
  log.help('');
  log.help('Usage:', this.fullName() + ' ' + this.usage());
  helpOptions(this, cli);

  if (cli.powershell) {
    log.help('\n');
  }

  return '';
}

function helpCategories(parent) {
  for (var name in parent.categories) {
    var cat = parent.categories[name];
    log.help('');
    log.help(cat.description().cyan);
    for (var index in cat.commands) {
      var cmd = cat.commands[index];
      log.help(' ', cmd.fullName() + ' ' + cmd.usage());
    }
    helpCategories(cat);
    for (var subCat in cat.categories) {
      helpCategories(cat.categories[subCat]);
      //log.help(' ', cat.categories[subCat].fullName() + ' ...');
    }
  }
}

function helpCategoriesSummary(root) {
  var categories = [];
  function scan(parent, each) {
    for (var name in parent.categories) {
      var cat = parent.categories[name];
      each(cat);
      scan(cat, each);
    }
  }

  scan(root, function (cat) { categories.push(cat); });
  var maxLength = 14;
  categories.forEach(function (cat) {
    if (maxLength < cat.fullName().length)
      maxLength = cat.fullName().length;
  });

  log.help('');
  log.help('Commands:');
  categories.forEach(function (cat) {
    var name = cat.fullName();
    while (name.length < maxLength) {
      name += ' ';
    }
    log.help('  ' + name + ' ' + cat.description().cyan);
  });
}

function helpCommands(parent) {
  parent.commands.forEach(function (cmd) {
    log.help('');
    log.help(cmd.description().cyan);
    log.help(' ', cmd.fullName() + ' ' + cmd.usage());
  });
}

function helpOptions(cmd, cmdExtra) {
  var revert = cmd.options;
  if (cmdExtra) {
    cmd.options = cmd.options.concat(cmdExtra.options);
  }

  cmd.options = cmd.options.filter(function (option) {
    return option.long != '--powershell';
  });

  log.help('');
  log.help('Options:');
  cmd.optionHelp().split('\n').forEach(function (line) { log.help(' ', line); });
  cmd.options = revert;
}



//////////////////////////////
// load command plugins

function harvestPlugins() {
  function scan(scanPath) {
    var results = fs.readdirSync(scanPath);

    results = results.filter(function (filePath) {
      if (filePath.substring(0, 5) === 'tmp--') {
        return false;
      }
      if (filePath.substring(filePath.length - 4) === '_.js') {
        return false;
      }
      return true;
    });

    // combine file path
    results = results.map(function (fileName) {
      return path.join(scanPath, fileName);
    });

    // skip directories
    results = results.filter(function (filePath) {
      return fs.statSync(filePath).isFile();
    });

    // load modules
    results = results.map(function (filePath) {
      return require(filePath);
    });

    // look for exports.init
    results = results.filter(function (entry) {
      return entry.init !== undefined;
    });
    return results;
  }

  var basePath = path.dirname(__filename);
  var plugins = scan(path.join(basePath, 'commands'));
  plugins.forEach(function (plugin) { plugin.init(cli); });
}

function harvestModules() {
  var basePath = path.dirname(__filename);

  var walkPath = path.join(basePath, '../../node_modules');
  var harvestPaths = [walkPath];

  while (path.basename(walkPath) === 'node_modules' && path.dirname(walkPath) !== 'npm') {
    var nextPath = path.join(walkPath, '../..');
    if (nextPath === walkPath) {
      break;
    }
    harvestPaths.push(nextPath);
    walkPath = nextPath;
  }

  var modules = [];
  harvestPaths.forEach(function (harvestPath) {
    modules = modules.concat(scan(harvestPath));
  });

  modules.forEach(function (module) {
    module.plugin.init(cli);
  });

  function scan(scanPath) {
    var results = fs.readdirSync(scanPath);

    results = results.map(function (moduleName) {
      return {
        moduleName: moduleName,
        modulePath: path.join(scanPath, moduleName)
      };
    });

    results = results.filter(function (item) {
      try {
        item.moduleStat = fs.statSync(item.modulePath);
      } catch(error) {
        return false;
      }
      return item.moduleStat.isDirectory();
    });

    results = results.filter(function (item) {
      item.packagePath = path.join(item.modulePath, 'package.json');
      item.packageStat = path.existsSync(item.packagePath) ? fs.statSync(item.packagePath) : undefined;
      return item.packageStat && item.packageStat.isFile();
    });

    results = results.filter(function (item) {
      try {
        item.packageInfo = JSON.parse(fs.readFileSync(item.packagePath));
        return item.packageInfo && item.packageInfo.plugins && item.packageInfo.plugins['azure-cli'];
      }
      catch (err) {
        return false;
      }
    });

    results = flatten(results.map(function (item) {
      var plugins = item.packageInfo.plugins['azure-cli'];
      if (typeof plugins !== 'array') {
        plugins = [plugins];
      }

      return plugins.map(function (relativePath) {
        return {
          context: item,
          pluginPath: path.join(item.modulePath, relativePath)
        };
      });
    }));

    results = results.filter(function (item) {
      item.plugin = require(item.pluginPath);
      return item.plugin.init;
    });

    return results;
  }

  function flatten(arrays) {
    var result = [];
    arrays.forEach(function (array) {
      result = result.concat(array);
    });
    return result;
  }
}

//Check node.js version.
//Do it after changing exception handler.
checkVersion();

function checkVersion() {
  // Uploading VHD needs 0.6.15 on Windows
  var version = process.version;
  var ver = version.split('.');
  var ver1num = parseInt(ver[1]);
  var ver2num = parseInt(ver[2]);
  if (ver[0] === 'v0') {
    if (ver1num < 6 || (ver1num === 6 && ver2num < 15)) {
      throw new Error('You need node.js v0.6.15 or higher to run this code. Your version: ' + 
          version);
    }
    if (ver1num === 7 && ver2num <= 7) {
      throw new Error('You need node.js v0.6.15 or higher to run this code. Your version ' +
          version + ' won\'t work either.');
    }
  }
}



harvestPlugins();
harvestModules();

exports = module.exports = cli;
