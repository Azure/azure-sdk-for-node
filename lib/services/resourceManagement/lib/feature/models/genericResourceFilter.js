'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the GenericResourceFilter class.
 * @constructor
 */
function GenericResourceFilter() { }

/**
 * Validate the payload against the GenericResourceFilter schema
 *
 * @param {JSON} payload
 *
 */
GenericResourceFilter.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('GenericResourceFilter cannot be null.');
  }
  if (payload['resourceType'] !== null && payload['resourceType'] !== undefined && typeof payload['resourceType'].valueOf() !== 'string') {
    throw new Error('payload[\'resourceType\'] must be of type string.');
  }

  if (payload['tagname'] !== null && payload['tagname'] !== undefined && typeof payload['tagname'].valueOf() !== 'string') {
    throw new Error('payload[\'tagname\'] must be of type string.');
  }

  if (payload['tagvalue'] !== null && payload['tagvalue'] !== undefined && typeof payload['tagvalue'].valueOf() !== 'string') {
    throw new Error('payload[\'tagvalue\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to GenericResourceFilter schema
 *
 * @param {JSON} instance
 *
 */
GenericResourceFilter.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new GenericResourceFilter();
