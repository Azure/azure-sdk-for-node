'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ParametersLink class.
 * @constructor
 */
function ParametersLink() { }

/**
 * Validate the payload against the ParametersLink schema
 *
 * @param {JSON} payload
 *
 */
ParametersLink.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ParametersLink cannot be null.');
  }
  if (payload['uri'] !== null && payload['uri'] !== undefined && typeof payload['uri'].valueOf() !== 'string') {
    throw new Error('payload[\'uri\'] must be of type string.');
  }

  if (payload['contentVersion'] !== null && payload['contentVersion'] !== undefined && typeof payload['contentVersion'].valueOf() !== 'string') {
    throw new Error('payload[\'contentVersion\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to ParametersLink schema
 *
 * @param {JSON} instance
 *
 */
ParametersLink.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new ParametersLink();
