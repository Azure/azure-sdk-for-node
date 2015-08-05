'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the BasicDependency class.
 * @constructor
 */
function BasicDependency() { }

/**
 * Validate the payload against the BasicDependency schema
 *
 * @param {JSON} payload
 *
 */
BasicDependency.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('BasicDependency cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['resourceType'] !== null && payload['resourceType'] !== undefined && typeof payload['resourceType'].valueOf() !== 'string') {
    throw new Error('payload[\'resourceType\'] must be of type string.');
  }

  if (payload['resourceName'] !== null && payload['resourceName'] !== undefined && typeof payload['resourceName'].valueOf() !== 'string') {
    throw new Error('payload[\'resourceName\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to BasicDependency schema
 *
 * @param {JSON} instance
 *
 */
BasicDependency.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new BasicDependency();
