'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the Provider class.
 * @constructor
 */
function Provider() { }

/**
 * Validate the payload against the Provider schema
 *
 * @param {JSON} payload
 *
 */
Provider.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('Provider cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['namespace'] !== null && payload['namespace'] !== undefined && typeof payload['namespace'].valueOf() !== 'string') {
    throw new Error('payload[\'namespace\'] must be of type string.');
  }

  if (payload['registrationState'] !== null && payload['registrationState'] !== undefined && typeof payload['registrationState'].valueOf() !== 'string') {
    throw new Error('payload[\'registrationState\'] must be of type string.');
  }

  if (util.isArray(payload['resourceTypes'])) {
    for (var i = 0; i < payload['resourceTypes'].length; i++) {
      if (payload['resourceTypes'][i]) {
        models['ProviderResourceType'].validate(payload['resourceTypes'][i]);
      }
    }
  }
};

/**
 * Deserialize the instance to Provider schema
 *
 * @param {JSON} instance
 *
 */
Provider.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.resourceTypes !== null && instance.resourceTypes !== undefined) {
      var deserializedArray = [];
      instance.resourceTypes.forEach(function(element) {
        if (element !== null && element !== undefined) {
          element = models['ProviderResourceType'].deserialize(element);
        }
        deserializedArray.push(element);
      });
      instance.resourceTypes = deserializedArray;
    }
  }
  return instance;
};

module.exports = new Provider();
