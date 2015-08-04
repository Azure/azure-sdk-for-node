'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ManagementLockProperties class.
 * @constructor
 */
function ManagementLockProperties() { }

/**
 * Validate the payload against the ManagementLockProperties schema
 *
 * @param {JSON} payload
 *
 */
ManagementLockProperties.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ManagementLockProperties cannot be null.');
  }
  if (payload['level']) {
    var allowedValues = [ 'NotSpecified', 'CanNotDelete', 'ReadOnly' ];
    if (!allowedValues.some( function(item) { return item === payload['level']; })) {
      throw new Error(payload['level'] + ' is not a valid value. The valid values are: ' + allowedValues);
    }
  }

  if (payload['notes'] !== null && payload['notes'] !== undefined && typeof payload['notes'].valueOf() !== 'string') {
    throw new Error('payload[\'notes\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to ManagementLockProperties schema
 *
 * @param {JSON} instance
 *
 */
ManagementLockProperties.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new ManagementLockProperties();
