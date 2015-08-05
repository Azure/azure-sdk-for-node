'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourceGroup class.
 * @constructor
 */
function ResourceGroup() { }

/**
 * Validate the payload against the ResourceGroup schema
 *
 * @param {JSON} payload
 *
 */
ResourceGroup.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourceGroup cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['name'] !== null && payload['name'] !== undefined && typeof payload['name'].valueOf() !== 'string') {
    throw new Error('payload[\'name\'] must be of type string.');
  }

  if (payload['properties']) {
    models['ResourceGroupProperties'].validate(payload['properties']);
  }

  if (payload['location'] !== null && payload['location'] !== undefined && typeof payload['location'].valueOf() !== 'string') {
    throw new Error('payload[\'location\'] must be of type string.');
  }

  if (payload['tags'] && typeof payload['tags'] === 'object') {
    for(var valueElement in payload['tags']) {
      if (payload['tags'][valueElement] !== null && payload['tags'][valueElement] !== undefined && typeof payload['tags'][valueElement].valueOf() !== 'string') {
        throw new Error('payload[\'tags\'][valueElement] must be of type string.');
      }
    }
  }
};

/**
 * Deserialize the instance to ResourceGroup schema
 *
 * @param {JSON} instance
 *
 */
ResourceGroup.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.properties !== null && instance.properties !== undefined) {
      instance.properties = models['ResourceGroupProperties'].deserialize(instance.properties);
    }
  }
  return instance;
};

module.exports = new ResourceGroup();
