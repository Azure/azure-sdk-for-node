'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the Usage class.
 * @constructor
 */
function Usage() { }

/**
 * Validate the payload against the Usage schema
 *
 * @param {JSON} payload
 *
 */
Usage.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('Usage cannot be null.');
  }
  if (payload['unit']) {
    var allowedValues = [ 'Count', 'Bytes', 'Seconds', 'Percent', 'CountsPerSecond', 'BytesPerSecond' ];
    if (!allowedValues.some( function(item) { return item === payload['unit']; })) {
      throw new Error(payload['unit'] + ' is not a valid value. The valid values are: ' + allowedValues);
    }
  }

  if (payload['currentValue'] !== null && payload['currentValue'] !== undefined && typeof payload['currentValue'] !== 'number') {
    throw new Error('payload[\'currentValue\'] must be of type number.');
  }

  if (payload['limit'] !== null && payload['limit'] !== undefined && typeof payload['limit'] !== 'number') {
    throw new Error('payload[\'limit\'] must be of type number.');
  }

  if (payload['name']) {
    models['UsageName'].validate(payload['name']);
  }
};

/**
 * Deserialize the instance to Usage schema
 *
 * @param {JSON} instance
 *
 */
Usage.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.name !== null && instance.name !== undefined) {
      instance.name = models['UsageName'].deserialize(instance.name);
    }
  }
  return instance;
};

module.exports = new Usage();
