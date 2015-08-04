'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ManagementLock class.
 * @constructor
 */
function ManagementLock() { }

/**
 * Validate the payload against the ManagementLock schema
 *
 * @param {JSON} payload
 *
 */
ManagementLock.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ManagementLock cannot be null.');
  }
  if (payload['properties']) {
    models['ManagementLockProperties'].validate(payload['properties']);
  }

  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['type'] !== null && payload['type'] !== undefined && typeof payload['type'].valueOf() !== 'string') {
    throw new Error('payload[\'type\'] must be of type string.');
  }

  if (payload['name'] !== null && payload['name'] !== undefined && typeof payload['name'].valueOf() !== 'string') {
    throw new Error('payload[\'name\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to ManagementLock schema
 *
 * @param {JSON} instance
 *
 */
ManagementLock.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.properties !== null && instance.properties !== undefined) {
      instance.properties = models['ManagementLockProperties'].deserialize(instance.properties);
    }
  }
  return instance;
};

module.exports = new ManagementLock();
