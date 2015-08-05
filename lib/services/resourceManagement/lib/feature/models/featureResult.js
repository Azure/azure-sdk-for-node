'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the FeatureResult class.
 * @constructor
 */
function FeatureResult() { }

/**
 * Validate the payload against the FeatureResult schema
 *
 * @param {JSON} payload
 *
 */
FeatureResult.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('FeatureResult cannot be null.');
  }
  if (payload['name'] !== null && payload['name'] !== undefined && typeof payload['name'].valueOf() !== 'string') {
    throw new Error('payload[\'name\'] must be of type string.');
  }

  if (payload['properties']) {
    models['FeatureProperties'].validate(payload['properties']);
  }

  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['type'] !== null && payload['type'] !== undefined && typeof payload['type'].valueOf() !== 'string') {
    throw new Error('payload[\'type\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to FeatureResult schema
 *
 * @param {JSON} instance
 *
 */
FeatureResult.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.properties !== null && instance.properties !== undefined) {
      instance.properties = models['FeatureProperties'].deserialize(instance.properties);
    }
  }
  return instance;
};

module.exports = new FeatureResult();
