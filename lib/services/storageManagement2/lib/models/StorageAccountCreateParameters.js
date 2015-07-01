'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the StorageAccountCreateParameters class.
 * @constructor
 */
function StorageAccountCreateParameters() { }

/**
 * Validate the payload against the StorageAccountCreateParameters schema
 *
 * @param {JSON} payload
 *
 */
StorageAccountCreateParameters.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('StorageAccountCreateParameters cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'] !== 'string') {
    throw new Error('payload["id"] must be of type string.');
  }

  if (payload['name'] !== null && payload['name'] !== undefined && typeof payload['name'] !== 'string') {
    throw new Error('payload["name"] must be of type string.');
  }

  if (payload['type'] !== null && payload['type'] !== undefined && typeof payload['type'] !== 'string') {
    throw new Error('payload["type"] must be of type string.');
  }

  if (payload['location'] !== null && payload['location'] !== undefined && typeof payload['location'] !== 'string') {
    throw new Error('payload["location"] must be of type string.');
  }

  if (payload['tags'] !== null && payload['tags'] !== undefined && typeof payload['tags'] === 'object') {
    for(var valueElement in payload['tags']) {
      if (payload['tags'][valueElement] !== null && payload['tags'][valueElement] !== undefined && typeof payload['tags'][valueElement] !== 'string') {
        throw new Error('payload["tags"][valueElement] must be of type string.');
      }
    }
  }

  if (payload['properties'] !== null && payload['properties'] !== undefined) {
    models['StorageAccountPropertiesCreateParameters'].validate(payload['properties']);
  }

};

/**
 * Deserialize the instance to StorageAccountCreateParameters schema
 *
 * @param {JSON} instance
 *
 */
StorageAccountCreateParameters.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.properties !== null && instance.properties !== undefined) {
      instance.properties = models['StorageAccountPropertiesCreateParameters'].deserialize(instance.properties);
    }

  }
  return instance;
};

module.exports = new StorageAccountCreateParameters();
