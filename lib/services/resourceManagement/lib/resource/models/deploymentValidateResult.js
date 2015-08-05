'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the DeploymentValidateResult class.
 * @constructor
 */
function DeploymentValidateResult() { }

/**
 * Validate the payload against the DeploymentValidateResult schema
 *
 * @param {JSON} payload
 *
 */
DeploymentValidateResult.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('DeploymentValidateResult cannot be null.');
  }
  if (payload['error']) {
    models['ResourceManagementErrorWithDetails'].validate(payload['error']);
  }

  if (payload['properties']) {
    models['DeploymentPropertiesExtended'].validate(payload['properties']);
  }
};

/**
 * Deserialize the instance to DeploymentValidateResult schema
 *
 * @param {JSON} instance
 *
 */
DeploymentValidateResult.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.error !== null && instance.error !== undefined) {
      instance.error = models['ResourceManagementErrorWithDetails'].deserialize(instance.error);
    }

    if (instance.properties !== null && instance.properties !== undefined) {
      instance.properties = models['DeploymentPropertiesExtended'].deserialize(instance.properties);
    }
  }
  return instance;
};

module.exports = new DeploymentValidateResult();
