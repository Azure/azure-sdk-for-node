
/**
 * Module dependencies.
 */

var express = require('express')
  , Logger = require('./logger.js')
  , routes = require('./routes')
  , utility = require('./util.js');

var app = module.exports = express.createServer();

var Endpoint = "HttpIn";

var log = new Logger();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

utility.getListenAddress(Endpoint, function(error, host, port) {
    app.listen(port, host);
    console.log("Express server listening on hostname %s port %d in %s mode", host, port, app.settings.env);
    log.write("Express server listening on hostname " + host +", port " + port + " in " + app.settings.env + "mode");
});
