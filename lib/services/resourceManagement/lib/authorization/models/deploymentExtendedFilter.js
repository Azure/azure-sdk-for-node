'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the DeploymentExtendedFilter class.
 * @constructor
 */
function DeploymentExtendedFilter() { }

/**
 * Validate the payload against the DeploymentExtendedFilter schema
 *
 * @param {JSON} payload
 *
 */
DeploymentExtendedFilter.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('DeploymentExtendedFilter cannot be null.');
  }
  if (payload['provisioningState'] !== null && payload['provisioningState'] !== undefined && typeof payload['provisioningState'].valueOf() !== 'string') {
    throw new Error('payload[\'provisioningState\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to DeploymentExtendedFilter schema
 *
 * @param {JSON} instance
 *
 */
DeploymentExtendedFilter.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new DeploymentExtendedFilter();
