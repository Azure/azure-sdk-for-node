/**
* Copyright (c) Microsoft.  All rights reserved.
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

var http = require('http');
var util = require('util');
var Logger = require('../../../diagnostics/logger');

function BatchHttpAgent(options) {
  http.Agent.call(this, options);
  this.freeSockets = {};
  this.removeAllListeners('free');
  this.logger = options.logger || new Logger(Logger.LogLevels.INFO);
  this.on('free', this.freeSocket.bind(this));
}

util.inherits(BatchHttpAgent, http.Agent);
module.exports = BatchHttpAgent;

BatchHttpAgent.prototype.addRequest = function(req, host, port, localAddress) {
  this.logger.debug('Add request');
  var name = this.getName(host, port, localAddress);
  if (!this.sockets[name]) {
    this.sockets[name] = [];
  }

  if (this.freeSockets[name] && this.freeSockets[name].length) {
    // we have a free socket, so use that.
    var socket = this.freeSockets[name].shift();

    // don't leak
    if (!this.freeSockets[name].length) {
      delete this.freeSockets[name];
    }
    socket.removeAllListeners('error');
    socket.ref();
    this.logger.debug('Use free socket');
    req.onSocket(socket);
  } else if (this.sockets[name].length < this.maxSockets) {
    // If we are under maxSockets create a new one.
    this.logger.debug('create a new socket');
    req.onSocket(this.createSocket(name, host, port, localAddress, req));
  } else {
    // We are over limit so we'll add it to the queue.
    if (!this.requests[name]) {
      this.requests[name] = [];
    }
    this.requests[name].push(req);
    this.logger.debug('queue request');
  }
  this.logger.debug('Add request end');
};

BatchHttpAgent.prototype.getName = function(host, port, localAddress) {
	var name = host + ':' + port;
  if (localAddress) {
    name += ':' + localAddress;
  }
  return name;
}

BatchHttpAgent.prototype.freeSocket = function(socket, host, port, localAddress) {
  this.logger.debug('free socket');
	var name = this.getName(host, port, localAddress);
	if (!socket.destroyed &&
    this.requests[name] && this.requests[name].length) {
    this.requests[name].shift().onSocket(socket);
    this.logger.debug('Start queued request');
    if (this.requests[name].length === 0) {
      // don't leak
      delete this.requests[name];
    }
  } else {
    // If there are no pending requests, then put it in
    // the freeSockets pool, but only if we're allowed to do so.
	  if(!socket.destroyed) {
		  var freeSockets = this.freeSockets[name];
		  var count = freeSockets ? freeSockets.length : 0;
        if (this.sockets[name]) {
          count += this.sockets[name].length;
		  }
		  
		  if (count > this.maxSockets) {
        socket.destroy();
      } else {
        freeSockets = freeSockets || [];
        this.freeSockets[name] = freeSockets;
		    socket.removeAllListeners('error');
        socket.on('error', function(error) {this.logger.debug('Socket error:' + error)});
        socket.setKeepAlive(true, 10000);
        socket.unref();
        freeSockets.push(socket);
        this.logger.debug('put the socket into free socket list');
        this.emit('drain');
      }
    }
  }
  this.logger.debug('free socket completely');
}
