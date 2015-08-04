'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the DeploymentExtended class.
 * @constructor
 */
function DeploymentExtended() { }

/**
 * Validate the payload against the DeploymentExtended schema
 *
 * @param {JSON} payload
 *
 */
DeploymentExtended.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('DeploymentExtended cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['name'] !== null && payload['name'] !== undefined && typeof payload['name'].valueOf() !== 'string') {
    throw new Error('payload[\'name\'] must be of type string.');
  }

  if (payload['properties']) {
    models['DeploymentPropertiesExtended'].validate(payload['properties']);
  }
};

/**
 * Deserialize the instance to DeploymentExtended schema
 *
 * @param {JSON} instance
 *
 */
DeploymentExtended.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.properties !== null && instance.properties !== undefined) {
      instance.properties = models['DeploymentPropertiesExtended'].deserialize(instance.properties);
    }
  }
  return instance;
};

module.exports = new DeploymentExtended();
