'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the DeploymentOperation class.
 * @constructor
 */
function DeploymentOperation() { }

/**
 * Validate the payload against the DeploymentOperation schema
 *
 * @param {JSON} payload
 *
 */
DeploymentOperation.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('DeploymentOperation cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['operationId'] !== null && payload['operationId'] !== undefined && typeof payload['operationId'].valueOf() !== 'string') {
    throw new Error('payload[\'operationId\'] must be of type string.');
  }

  if (payload['properties']) {
    models['DeploymentOperationProperties'].validate(payload['properties']);
  }
};

/**
 * Deserialize the instance to DeploymentOperation schema
 *
 * @param {JSON} instance
 *
 */
DeploymentOperation.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.properties !== null && instance.properties !== undefined) {
      instance.properties = models['DeploymentOperationProperties'].deserialize(instance.properties);
    }
  }
  return instance;
};

module.exports = new DeploymentOperation();
