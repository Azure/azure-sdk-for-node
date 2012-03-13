var commander = require('commander');
var fs = require('fs');
var path = require('path');

var waz = new commander.Command();

waz.output = require('winston');

waz.output.setLevel = function (level) {
    waz.output.remove(waz.output.transports.Console);
    waz.output.add(waz.output.transports.Console, { level: level });
    waz.output.cli();
};

waz.output.setLevel('info');


waz.categories = {};

waz.category = function (name) {
    if (!waz.categories[name]) {
        waz.categories[name] = new commander.Command();
        enableNestedCommands(waz.categories[name]);
    }
    return waz.categories[name];
}

//waz
//    .command('*')
//    .action(function (name) {
//        console.log('waz.rawArgs', waz);

//        if (!waz.categories[name]) {
//            throw new Error("Unknown command category " + name)
//        } else {
//            if (waz.rawArgs[2] != name) {
//                throw new Error('Commands may not be preceded by options or switches');
//            }
//            var args = [];
//            for (var index = 0; index != waz.rawArgs.length; ++index) {
//                if (index != 2) {
//                    args.push(waz.rawArgs[index]);
//                }
//            }
//            waz.categories[name].parse(args);
//        }
//    });

function enableNestedCommands(command) {
    command.on('*', function () {
        var args = command.rawArgs.slice(0, 2);
        var raw = command.normalize(command.rawArgs.slice(2));

        var verbose = 0;
        var category = '*';
        for (var i = 0, len = raw.length; i < len; ++i) {
            if (raw[i] === '-v' || raw[i] === '--verbose') {
                ++verbose;
            } else if (category === '*') {
                category = raw[i];
            } else {
                args.push(raw[i]);
            }
        }
        if (verbose == 1) {
            waz.output.setLevel('verbose');
        } else if (verbose >= 2) {
            waz.output.setLevel('silly');
        }
        
        if (!waz.categories[category]) {
            waz.output.error("Unknown command", category);
        } else {
            command.categories[category].parse(args);
        }
    });
}

enableNestedCommands(waz);

var commandsPath = path.join(path.dirname(__filename), 'commands');
var commandFiles = fs.readdirSync(commandsPath);

for (var i = 0; i < commandFiles.length; i++) {
    var commandFile = path.join(commandsPath, commandFiles[i]);
    if (!fs.statSync(commandFile).isFile()) {
        continue;
    }
    require(commandFile).init(waz);
}

exports = module.exports = waz;
