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
 * Deserialize the instance to ResourceGroup schema
 *
 * @param {JSON} instance
 *
 */
ResourceGroup.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new ResourceGroup();
