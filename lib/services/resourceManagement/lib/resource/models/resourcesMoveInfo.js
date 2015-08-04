'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourcesMoveInfo class.
 * @constructor
 */
function ResourcesMoveInfo() { }

/**
 * Validate the payload against the ResourcesMoveInfo schema
 *
 * @param {JSON} payload
 *
 */
ResourcesMoveInfo.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourcesMoveInfo cannot be null.');
  }
  if (util.isArray(payload['resources'])) {
    for (var i = 0; i < payload['resources'].length; i++) {
      if (payload['resources'][i] !== null && payload['resources'][i] !== undefined && typeof payload['resources'][i].valueOf() !== 'string') {
        throw new Error('payload[\'resources\'][i] must be of type string.');
      }
    }
  }

  if (payload['targetResourceGroup'] !== null && payload['targetResourceGroup'] !== undefined && typeof payload['targetResourceGroup'].valueOf() !== 'string') {
    throw new Error('payload[\'targetResourceGroup\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to ResourcesMoveInfo schema
 *
 * @param {JSON} instance
 *
 */
ResourcesMoveInfo.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new ResourcesMoveInfo();
