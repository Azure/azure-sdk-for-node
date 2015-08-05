'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the CustomDomain class.
 * @constructor
 */
function CustomDomain() { }

/**
 * Validate the payload against the CustomDomain schema
 *
 * @param {JSON} payload
 *
 */
CustomDomain.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('CustomDomain cannot be null.');
  }
  if (payload['name'] !== null && payload['name'] !== undefined && typeof payload['name'].valueOf() !== 'string') {
    throw new Error('payload[\'name\'] must be of type string.');
  }

  if (payload['useSubDomain'] !== null && payload['useSubDomain'] !== undefined && typeof payload['useSubDomain'] !== 'boolean') {
    throw new Error('payload[\'useSubDomain\'] must be of type boolean.');
  }
};

/**
 * Deserialize the instance to CustomDomain schema
 *
 * @param {JSON} instance
 *
 */
CustomDomain.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new CustomDomain();
