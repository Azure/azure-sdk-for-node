'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourceGroupExtended class.
 * @constructor
 */
function ResourceGroupExtended() { }

/**
 * Validate the payload against the ResourceGroupExtended schema
 *
 * @param {JSON} payload
 *
 */
ResourceGroupExtended.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourceGroupExtended cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'] !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['name'] !== null && payload['name'] !== undefined && typeof payload['name'] !== 'string') {
    throw new Error('payload[\'name\'] must be of type string.');
  }

  if (payload['properties'] !== null && payload['properties'] !== undefined) {
    models['ResourceGroupFormatResourceProperties'].validate(payload['properties']);
  }

  if (payload['location'] !== null && payload['location'] !== undefined && typeof payload['location'] !== 'string') {
    throw new Error('payload[\'location\'] must be of type string.');
  }

  if (payload['tags'] !== null && payload['tags'] !== undefined && typeof payload['tags'] === 'object') {
    for(var valueElement in payload['tags']) {
      if (payload['tags'][valueElement] !== null && payload['tags'][valueElement] !== undefined && typeof payload['tags'][valueElement] !== 'string') {
        throw new Error('payload[\'tags\'][valueElement] must be of type string.');
      }
    }
  }

  if (payload['provisioningState'] !== null && payload['provisioningState'] !== undefined && typeof payload['provisioningState'] !== 'string') {
    throw new Error('payload[\'provisioningState\'] must be of type string.');
  }

};

/**
 * Deserialize the instance to ResourceGroupExtended schema
 *
 * @param {JSON} instance
 *
 */
ResourceGroupExtended.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.properties !== null && instance.properties !== undefined) {
      instance.properties = models['ResourceGroupFormatResourceProperties'].deserialize(instance.properties);
    }

  }
  return instance;
};

module.exports = new ResourceGroupExtended();
