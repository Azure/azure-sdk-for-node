'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the TargetResource class.
 * @constructor
 */
function TargetResource() { }

/**
 * Validate the payload against the TargetResource schema
 *
 * @param {JSON} payload
 *
 */
TargetResource.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('TargetResource cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['resourceName'] !== null && payload['resourceName'] !== undefined && typeof payload['resourceName'].valueOf() !== 'string') {
    throw new Error('payload[\'resourceName\'] must be of type string.');
  }

  if (payload['resourceType'] !== null && payload['resourceType'] !== undefined && typeof payload['resourceType'].valueOf() !== 'string') {
    throw new Error('payload[\'resourceType\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to TargetResource schema
 *
 * @param {JSON} instance
 *
 */
TargetResource.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new TargetResource();
