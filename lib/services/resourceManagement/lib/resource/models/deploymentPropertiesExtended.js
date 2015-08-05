'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the DeploymentPropertiesExtended class.
 * @constructor
 */
function DeploymentPropertiesExtended() { }

/**
 * Validate the payload against the DeploymentPropertiesExtended schema
 *
 * @param {JSON} payload
 *
 */
DeploymentPropertiesExtended.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('DeploymentPropertiesExtended cannot be null.');
  }
  if (payload['provisioningState'] !== null && payload['provisioningState'] !== undefined && typeof payload['provisioningState'].valueOf() !== 'string') {
    throw new Error('payload[\'provisioningState\'] must be of type string.');
  }

  if (payload['correlationId'] !== null && payload['correlationId'] !== undefined && typeof payload['correlationId'].valueOf() !== 'string') {
    throw new Error('payload[\'correlationId\'] must be of type string.');
  }

  if (payload['timestamp'] && !(payload['timestamp'] instanceof Date || 
      (typeof payload['timestamp'].valueOf() === 'string' && !isNaN(Date.parse(payload['timestamp']))))) {
    throw new Error('payload[\'timestamp\'] must be of type date.');
  }


  if (util.isArray(payload['providers'])) {
    for (var i = 0; i < payload['providers'].length; i++) {
      if (payload['providers'][i]) {
        models['Provider'].validate(payload['providers'][i]);
      }
    }
  }

  if (util.isArray(payload['dependencies'])) {
    for (var i1 = 0; i1 < payload['dependencies'].length; i1++) {
      if (payload['dependencies'][i1]) {
        models['Dependency'].validate(payload['dependencies'][i1]);
      }
    }
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
 * Deserialize the instance to DeploymentPropertiesExtended schema
 *
 * @param {JSON} instance
 *
 */
DeploymentPropertiesExtended.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.timestamp !== null && instance.timestamp !== undefined) {
      instance.timestamp = new Date(instance.timestamp);
    }

    if (instance.providers !== null && instance.providers !== undefined) {
      var deserializedArray = [];
      instance.providers.forEach(function(element) {
        if (element !== null && element !== undefined) {
          element = models['Provider'].deserialize(element);
        }
        deserializedArray.push(element);
      });
      instance.providers = deserializedArray;
    }

    if (instance.dependencies !== null && instance.dependencies !== undefined) {
      var deserializedArray = [];
      instance.dependencies.forEach(function(element1) {
        if (element1 !== null && element1 !== undefined) {
          element1 = models['Dependency'].deserialize(element1);
        }
        deserializedArray.push(element1);
      });
      instance.dependencies = deserializedArray;
    }

    if (instance.templateLink !== null && instance.templateLink !== undefined) {
      instance.templateLink = models['TemplateLink'].deserialize(instance.templateLink);
    }

    if (instance.parametersLink !== null && instance.parametersLink !== undefined) {
      instance.parametersLink = models['ParametersLink'].deserialize(instance.parametersLink);
    }
  }
  return instance;
};

module.exports = new DeploymentPropertiesExtended();
