'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the DeploymentOperationProperties class.
 * @constructor
 */
function DeploymentOperationProperties() { }

/**
 * Validate the payload against the DeploymentOperationProperties schema
 *
 * @param {JSON} payload
 *
 */
DeploymentOperationProperties.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('DeploymentOperationProperties cannot be null.');
  }
  if (payload['provisioningState'] !== null && payload['provisioningState'] !== undefined && typeof payload['provisioningState'].valueOf() !== 'string') {
    throw new Error('payload[\'provisioningState\'] must be of type string.');
  }

  if (payload['timestamp'] && !(payload['timestamp'] instanceof Date || 
      (typeof payload['timestamp'].valueOf() === 'string' && !isNaN(Date.parse(payload['timestamp']))))) {
    throw new Error('payload[\'timestamp\'] must be of type date.');
  }

  if (payload['statusCode'] !== null && payload['statusCode'] !== undefined && typeof payload['statusCode'].valueOf() !== 'string') {
    throw new Error('payload[\'statusCode\'] must be of type string.');
  }


  if (payload['targetResource']) {
    models['TargetResource'].validate(payload['targetResource']);
  }
};

/**
 * Deserialize the instance to DeploymentOperationProperties schema
 *
 * @param {JSON} instance
 *
 */
DeploymentOperationProperties.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.timestamp !== null && instance.timestamp !== undefined) {
      instance.timestamp = new Date(instance.timestamp);
    }

    if (instance.targetResource !== null && instance.targetResource !== undefined) {
      instance.targetResource = models['TargetResource'].deserialize(instance.targetResource);
    }
  }
  return instance;
};

module.exports = new DeploymentOperationProperties();
