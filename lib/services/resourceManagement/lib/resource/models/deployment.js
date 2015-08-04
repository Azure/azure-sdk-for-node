'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the Deployment class.
 * @constructor
 */
function Deployment() { }

/**
 * Validate the payload against the Deployment schema
 *
 * @param {JSON} payload
 *
 */
Deployment.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('Deployment cannot be null.');
  }
  if (payload['properties']) {
    models['DeploymentProperties'].validate(payload['properties']);
  }
};

/**
 * Deserialize the instance to Deployment schema
 *
 * @param {JSON} instance
 *
 */
Deployment.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.properties !== null && instance.properties !== undefined) {
      instance.properties = models['DeploymentProperties'].deserialize(instance.properties);
    }
  }
  return instance;
};

module.exports = new Deployment();
