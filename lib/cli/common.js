
var log = require('winston');
var child_process = require('child_process');

exports.launchBrowser = function(url) {
    log.info('Launching browser to', url);
    if (process.platform == 'win32') {
        child_process.exec('start ' + url);
    } else {
        child_process.spawn('open', [url]);
    }
};

