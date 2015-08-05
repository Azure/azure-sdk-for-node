'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the DeploymentProperties class.
 * @constructor
 */
function DeploymentProperties() { }

/**
 * Validate the payload against the DeploymentProperties schema
 *
 * @param {JSON} payload
 *
 */
DeploymentProperties.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('DeploymentProperties cannot be null.');
  }

  if (payload['templateLink']) {
    models['TemplateLink'].validate(payload['templateLink']);
  }


  if (payload['parametersLink']) {
    models['ParametersLink'].validate(payload['parametersLink']);
  }

  if (payload['mode']) {
    var allowedValues = [ 'Incremental' ];
    if (!allowedValues.some( function(item) { return item === payload['mode']; })) {
      throw new Error(payload['mode'] + ' is not a valid value. The valid values are: ' + allowedValues);
    }
  }
};

/**
 * Deserialize the instance to DeploymentProperties schema
 *
 * @param {JSON} instance
 *
 */
DeploymentProperties.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.templateLink !== null && instance.templateLink !== undefined) {
      instance.templateLink = models['TemplateLink'].deserialize(instance.templateLink);
    }

    if (instance.parametersLink !== null && instance.parametersLink !== undefined) {
      instance.parametersLink = models['ParametersLink'].deserialize(instance.parametersLink);
    }
  }
  return instance;
};

module.exports = new DeploymentProperties();
