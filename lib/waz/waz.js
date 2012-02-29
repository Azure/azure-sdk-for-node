var commander = require('commander');
var fs = require('fs');
var path = require('path');

var waz = new commander.Command();

waz.categories = {};

waz.category = function(name) {
    if (!waz.categories[name]) {
        waz.categories[name] = new commander.Command();
    }
    return waz.categories[name];
}

waz
    .command('*')
    .action(function(name) {
        if (!waz.categories[name]) {
            throw new Error("Unknown command category " + name)
        }
        else {
            if (waz.rawArgs[2] != name) {
                throw new Error('Commands may not be preceded by options or switches');
            }
            var args = [];
            for(var index = 0; index != waz.rawArgs.length; ++index) {
                if (index != 2) {
                    args.push(waz.rawArgs[index]);
                }
            }
            waz.categories[name].parse(args);
        }
    });

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
