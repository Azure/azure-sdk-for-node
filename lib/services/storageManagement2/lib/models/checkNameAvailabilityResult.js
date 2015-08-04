'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the CheckNameAvailabilityResult class.
 * @constructor
 */
function CheckNameAvailabilityResult() { }

/**
 * Validate the payload against the CheckNameAvailabilityResult schema
 *
 * @param {JSON} payload
 *
 */
CheckNameAvailabilityResult.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('CheckNameAvailabilityResult cannot be null.');
  }
  if (payload['nameAvailable'] !== null && payload['nameAvailable'] !== undefined && typeof payload['nameAvailable'] !== 'boolean') {
    throw new Error('payload[\'nameAvailable\'] must be of type boolean.');
  }

  if (payload['reason']) {
    var allowedValues = [ 'AccountNameInvalid', 'AlreadyExists' ];
    if (!allowedValues.some( function(item) { return item === payload['reason']; })) {
      throw new Error(payload['reason'] + ' is not a valid value. The valid values are: ' + allowedValues);
    }
  }

  if (payload['message'] !== null && payload['message'] !== undefined && typeof payload['message'].valueOf() !== 'string') {
    throw new Error('payload[\'message\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to CheckNameAvailabilityResult schema
 *
 * @param {JSON} instance
 *
 */
CheckNameAvailabilityResult.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new CheckNameAvailabilityResult();
