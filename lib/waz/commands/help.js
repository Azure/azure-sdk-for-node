
exports.init = function (waz) {

    waz
        .command('help [command]')
        .action(function (name, a, b, c) {
            if (!name) {
                var args = ['', '', '-h'];
                waz.parse(args);
            } else if (!waz.categories[name]) {
                throw new Error("Unknown command name " + name)
            } else {
                var args = ['', ''].concat(waz.rawArgs.slice(4), ['-h']);
                waz.categories[name].parse(args);
            }
        });

};
