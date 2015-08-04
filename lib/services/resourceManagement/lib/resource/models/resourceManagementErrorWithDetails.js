'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourceManagementErrorWithDetails class.
 * @constructor
 */
function ResourceManagementErrorWithDetails() { }

/**
 * Validate the payload against the ResourceManagementErrorWithDetails schema
 *
 * @param {JSON} payload
 *
 */
ResourceManagementErrorWithDetails.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourceManagementErrorWithDetails cannot be null.');
  }
  if (util.isArray(payload['details'])) {
    for (var i = 0; i < payload['details'].length; i++) {
      if (payload['details'][i]) {
        models['ResourceManagementError'].validate(payload['details'][i]);
      }
    }
  }

  if (payload['code'] !== null && payload['code'] !== undefined && typeof payload['code'].valueOf() !== 'string') {
    throw new Error('payload[\'code\'] must be of type string.');
  }

  if (payload['message'] !== null && payload['message'] !== undefined && typeof payload['message'].valueOf() !== 'string') {
    throw new Error('payload[\'message\'] must be of type string.');
  }

  if (payload['target'] !== null && payload['target'] !== undefined && typeof payload['target'].valueOf() !== 'string') {
    throw new Error('payload[\'target\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to ResourceManagementErrorWithDetails schema
 *
 * @param {JSON} instance
 *
 */
ResourceManagementErrorWithDetails.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.details !== null && instance.details !== undefined) {
      var deserializedArray = [];
      instance.details.forEach(function(element) {
        if (element !== null && element !== undefined) {
          element = models['ResourceManagementError'].deserialize(element);
        }
        deserializedArray.push(element);
      });
      instance.details = deserializedArray;
    }
  }
  return instance;
};

module.exports = new ResourceManagementErrorWithDetails();
