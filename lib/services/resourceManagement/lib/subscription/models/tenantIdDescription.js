'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the TenantIdDescription class.
 * @constructor
 */
function TenantIdDescription() { }

/**
 * Validate the payload against the TenantIdDescription schema
 *
 * @param {JSON} payload
 *
 */
TenantIdDescription.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('TenantIdDescription cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['tenantId'] !== null && payload['tenantId'] !== undefined && typeof payload['tenantId'].valueOf() !== 'string') {
    throw new Error('payload[\'tenantId\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to TenantIdDescription schema
 *
 * @param {JSON} instance
 *
 */
TenantIdDescription.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new TenantIdDescription();
