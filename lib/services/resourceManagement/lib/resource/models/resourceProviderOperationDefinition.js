'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourceProviderOperationDefinition class.
 * @constructor
 */
function ResourceProviderOperationDefinition() { }

/**
 * Validate the payload against the ResourceProviderOperationDefinition schema
 *
 * @param {JSON} payload
 *
 */
ResourceProviderOperationDefinition.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourceProviderOperationDefinition cannot be null.');
  }
  if (payload['name'] !== null && payload['name'] !== undefined && typeof payload['name'].valueOf() !== 'string') {
    throw new Error('payload[\'name\'] must be of type string.');
  }

  if (payload['display']) {
    models['ResourceProviderOperationDisplayProperties'].validate(payload['display']);
  }
};

/**
 * Deserialize the instance to ResourceProviderOperationDefinition schema
 *
 * @param {JSON} instance
 *
 */
ResourceProviderOperationDefinition.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.display !== null && instance.display !== undefined) {
      instance.display = models['ResourceProviderOperationDisplayProperties'].deserialize(instance.display);
    }
  }
  return instance;
};

module.exports = new ResourceProviderOperationDefinition();
