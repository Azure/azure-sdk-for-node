'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the StorageAccountProperties class.
 * @constructor
 */
function StorageAccountProperties() { }

/**
 * Validate the payload against the StorageAccountProperties schema
 *
 * @param {JSON} payload
 *
 */
StorageAccountProperties.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('StorageAccountProperties cannot be null.');
  }
  if (payload['accountType'] !== null && payload['accountType'] !== undefined) {
    var allowedValues = [ 'Standard_LRS', 'Standard_ZRS', 'Standard_GRS', 'Standard_RAGRS', 'Premium_LRS' ];
    if (!allowedValues.some( function(item) { return item === payload['accountType']; })) {
      throw new Error(payload["accountType"] + ' is not a valid value. The valid values are: ' + allowedValues);
    }
  }

  if (payload['primaryEndpoints'] !== null && payload['primaryEndpoints'] !== undefined) {
    models['Endpoints'].validate(payload['primaryEndpoints']);
  }

  if (payload['primaryLocation'] !== null && payload['primaryLocation'] !== undefined && typeof payload['primaryLocation'] !== 'string') {
    throw new Error('payload["primaryLocation"] must be of type string.');
  }

  if (payload['statusOfPrimary'] !== null && payload['statusOfPrimary'] !== undefined) {
    var allowedValues1 = [ 'Available', 'Unavailable' ];
    if (!allowedValues1.some( function(item) { return item === payload['statusOfPrimary']; })) {
      throw new Error(payload["statusOfPrimary"] + ' is not a valid value. The valid values are: ' + allowedValues1);
    }
  }

  if (payload['lastGeoFailoverTime'] !== null && payload['lastGeoFailoverTime'] !== undefined && 
      !(payload['lastGeoFailoverTime'] instanceof Date || 
        (typeof payload['lastGeoFailoverTime'] === 'string' && !isNaN(Date.parse(payload['lastGeoFailoverTime']))))) {
    throw new Error('payload["lastGeoFailoverTime"] must be of type date.');
  }

  if (payload['secondaryLocation'] !== null && payload['secondaryLocation'] !== undefined && typeof payload['secondaryLocation'] !== 'string') {
    throw new Error('payload["secondaryLocation"] must be of type string.');
  }

  if (payload['statusOfSecondary'] !== null && payload['statusOfSecondary'] !== undefined) {
    var allowedValues2 = [ 'Available', 'Unavailable' ];
    if (!allowedValues2.some( function(item) { return item === payload['statusOfSecondary']; })) {
      throw new Error(payload["statusOfSecondary"] + ' is not a valid value. The valid values are: ' + allowedValues2);
    }
  }

  if (payload['creationTime'] !== null && payload['creationTime'] !== undefined && 
      !(payload['creationTime'] instanceof Date || 
        (typeof payload['creationTime'] === 'string' && !isNaN(Date.parse(payload['creationTime']))))) {
    throw new Error('payload["creationTime"] must be of type date.');
  }

  if (payload['customDomain'] !== null && payload['customDomain'] !== undefined) {
    models['CustomDomain'].validate(payload['customDomain']);
  }

  if (payload['secondaryEndpoints'] !== null && payload['secondaryEndpoints'] !== undefined) {
    models['Endpoints'].validate(payload['secondaryEndpoints']);
  }

};

/**
 * Deserialize the instance to StorageAccountProperties schema
 *
 * @param {JSON} instance
 *
 */
StorageAccountProperties.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.primaryEndpoints !== null && instance.primaryEndpoints !== undefined) {
      instance.primaryEndpoints = models['Endpoints'].deserialize(instance.primaryEndpoints);
    }

    if (instance.lastGeoFailoverTime !== null && instance.lastGeoFailoverTime !== undefined) {
      instance.lastGeoFailoverTime = new Date(instance.lastGeoFailoverTime);
    }

    if (instance.creationTime !== null && instance.creationTime !== undefined) {
      instance.creationTime = new Date(instance.creationTime);
    }

    if (instance.customDomain !== null && instance.customDomain !== undefined) {
      instance.customDomain = models['CustomDomain'].deserialize(instance.customDomain);
    }

    if (instance.secondaryEndpoints !== null && instance.secondaryEndpoints !== undefined) {
      instance.secondaryEndpoints = models['Endpoints'].deserialize(instance.secondaryEndpoints);
    }

  }
  return instance;
};

module.exports = new StorageAccountProperties();
