'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the UsageName class.
 * @constructor
 */
function UsageName() { }

/**
 * Validate the payload against the UsageName schema
 *
 * @param {JSON} payload
 *
 */
UsageName.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('UsageName cannot be null.');
  }
  if (payload['value'] !== null && payload['value'] !== undefined && typeof payload['value'].valueOf() !== 'string') {
    throw new Error('payload[\'value\'] must be of type string.');
  }

  if (payload['localizedValue'] !== null && payload['localizedValue'] !== undefined && typeof payload['localizedValue'].valueOf() !== 'string') {
    throw new Error('payload[\'localizedValue\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to UsageName schema
 *
 * @param {JSON} instance
 *
 */
UsageName.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new UsageName();
