'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the Plan class.
 * @constructor
 */
function Plan() { }

/**
 * Validate the payload against the Plan schema
 *
 * @param {JSON} payload
 *
 */
Plan.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('Plan cannot be null.');
  }
  if (payload['name'] !== null && payload['name'] !== undefined && typeof payload['name'].valueOf() !== 'string') {
    throw new Error('payload[\'name\'] must be of type string.');
  }

  if (payload['publisher'] !== null && payload['publisher'] !== undefined && typeof payload['publisher'].valueOf() !== 'string') {
    throw new Error('payload[\'publisher\'] must be of type string.');
  }

  if (payload['product'] !== null && payload['product'] !== undefined && typeof payload['product'].valueOf() !== 'string') {
    throw new Error('payload[\'product\'] must be of type string.');
  }

  if (payload['promotionCode'] !== null && payload['promotionCode'] !== undefined && typeof payload['promotionCode'].valueOf() !== 'string') {
    throw new Error('payload[\'promotionCode\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to Plan schema
 *
 * @param {JSON} instance
 *
 */
Plan.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new Plan();
