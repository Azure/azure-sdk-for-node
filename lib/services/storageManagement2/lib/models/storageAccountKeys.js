'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the StorageAccountKeys class.
 * @constructor
 */
function StorageAccountKeys() { }

/**
 * Validate the payload against the StorageAccountKeys schema
 *
 * @param {JSON} payload
 *
 */
StorageAccountKeys.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('StorageAccountKeys cannot be null.');
  }
  if (payload['key1'] !== null && payload['key1'] !== undefined && typeof payload['key1'].valueOf() !== 'string') {
    throw new Error('payload[\'key1\'] must be of type string.');
  }

  if (payload['key2'] !== null && payload['key2'] !== undefined && typeof payload['key2'].valueOf() !== 'string') {
    throw new Error('payload[\'key2\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to StorageAccountKeys schema
 *
 * @param {JSON} instance
 *
 */
StorageAccountKeys.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new StorageAccountKeys();
