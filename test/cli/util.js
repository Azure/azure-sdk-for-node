
exports = module.exports = {
    capture: capture,
};

function capture(action) {
    var result = {
        text: '',
    }

    var processStdoutWrite = process.stdout.write
    var processExit = process.exit
    
    process.stdout.write = function(data, encoding, fd) {
        result.text = result.text + data;
    };
    process.exit = function(status) {
        result.exitStatus = status;
        throw new Error('process exit');
    };
    
    try {
        action();
    }
    catch(err) {
        result.error = err;
    }
    process.stdout.write = processStdoutWrite;
    process.exit = processExit;
    return result;
}
