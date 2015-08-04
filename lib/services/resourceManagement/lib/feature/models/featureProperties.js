'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the FeatureProperties class.
 * @constructor
 */
function FeatureProperties() { }

/**
 * Validate the payload against the FeatureProperties schema
 *
 * @param {JSON} payload
 *
 */
FeatureProperties.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('FeatureProperties cannot be null.');
  }
  if (payload['state'] !== null && payload['state'] !== undefined && typeof payload['state'].valueOf() !== 'string') {
    throw new Error('payload[\'state\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to FeatureProperties schema
 *
 * @param {JSON} instance
 *
 */
FeatureProperties.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new FeatureProperties();
