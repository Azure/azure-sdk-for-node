
var https = require('https');
var tunnel = require('tunnel');
var xml2js = require('xml2js');
var log = require('winston');

module.exports = Channel;


function merge() {
    var source, sourceValue;
    var target = arguments[0] || {};
    var length = arguments.length;

    for (var i = 1; i < length; i++) {
        if ((source = arguments[i]) != null) {
            for (var property in source) {
                sourceValue = source[property];
                if (sourceValue !== undefined) {
                    target[property] = sourceValue;
                }
            }
        }
    }
    return target;
}

function Channel(options) {
    this.options = options;
}

Channel.prototype.add = function (options) {
    if (options.headers === undefined) {
        return new Channel(merge({}, this.options, options));
    }
    var headers = merge({}, this.options.headers, options.headers);
    return new Channel(merge({}, this.options, options, { headers: headers }));
}

Channel.prototype.path = function (path) {
    return this.add({ path: (this.options.path || '') + '/' + path });
};

Channel.prototype.header = function (name, value) {
    var headers = {};
    headers[name] = value;
    return this.add({ headers: headers });
};

Channel.prototype.send = function (method, data, cb) {
    var options = merge({}, this.options, { method: method });
    if (options.proxy) {
        options.agent = tunnel.httpsOverHttp(options);
    } else {
        options.agent = new https.Agent(options);
    }

    log.silly('Request.Method', options.method);
    log.silly('Request.Path', options.path);
    var req = https.request(options, function (res) {
        var done = 0;
        var parser = new xml2js.Parser();
        log.silly('Response.Headers', res.headers);
        res.on('data', function (data) {
            log.silly('Response.Data', data.toString());
            try {
                parser.parseString(data);
            }
            catch (err) {
                cb(err);
            }
        });
        res.on('end', function () {
            if (++done == 1) cb(null, {});
        });
        parser.on('end', function (result) {
            if (result.Message && result.Code) {
                if (++done == 1) cb(result, null);
            } else {
                if (++done == 1) cb(null, result);
            }
        });
    });
    if (typeof (data) === 'function') {
        data(req);
    } else {
        if (data) {
            req.write(data);
        }
        req.end();
    }
};

Channel.prototype.GET = function (cb) {
    return this.send('GET', null, cb);
};
Channel.prototype.POST = function (data, cb) {
    return this.send('POST', data, cb);
};
Channel.prototype.PUT = function (data, cb) {
    return this.send('PUT', data, cb);
};
Channel.prototype.DELETE = function (cb) {
    return this.send('DELETE', null, cb);
};
