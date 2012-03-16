
exports.init = function (cli) {

    cli.command('help [command]')
        .description('Display help for a given command')
        .action(function (name, a, b, c) {
            if (!name) {
                var args = ['', '', '-h'];
                cli.parse(args);
            } else if (!cli.categories[name]) {
                throw new Error("Unknown command name " + name)
            } else {
                var args = ['', ''].concat(cli.rawArgs.slice(4), ['-h']);
                cli.categories[name].parse(args);
            }
        });

};
