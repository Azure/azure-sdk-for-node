'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the Endpoints class.
 * @constructor
 */
function Endpoints() { }

/**
 * Validate the payload against the Endpoints schema
 *
 * @param {JSON} payload
 *
 */
Endpoints.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('Endpoints cannot be null.');
  }
  if (payload['blob'] !== null && payload['blob'] !== undefined && typeof payload['blob'] !== 'string') {
    throw new Error('payload["blob"] must be of type string.');
  }

  if (payload['queue'] !== null && payload['queue'] !== undefined && typeof payload['queue'] !== 'string') {
    throw new Error('payload["queue"] must be of type string.');
  }

  if (payload['table'] !== null && payload['table'] !== undefined && typeof payload['table'] !== 'string') {
    throw new Error('payload["table"] must be of type string.');
  }

};

/**
 * Deserialize the instance to Endpoints schema
 *
 * @param {JSON} instance
 *
 */
Endpoints.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new Endpoints();
