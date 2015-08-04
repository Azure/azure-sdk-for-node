'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourceManagementError class.
 * @constructor
 */
function ResourceManagementError() { }

/**
 * Validate the payload against the ResourceManagementError schema
 *
 * @param {JSON} payload
 *
 */
ResourceManagementError.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourceManagementError cannot be null.');
  }
  if (payload['code'] !== null && payload['code'] !== undefined && typeof payload['code'].valueOf() !== 'string') {
    throw new Error('payload[\'code\'] must be of type string.');
  }

  if (payload['message'] !== null && payload['message'] !== undefined && typeof payload['message'].valueOf() !== 'string') {
    throw new Error('payload[\'message\'] must be of type string.');
  }

  if (payload['target'] !== null && payload['target'] !== undefined && typeof payload['target'].valueOf() !== 'string') {
    throw new Error('payload[\'target\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to ResourceManagementError schema
 *
 * @param {JSON} instance
 *
 */
ResourceManagementError.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new ResourceManagementError();
