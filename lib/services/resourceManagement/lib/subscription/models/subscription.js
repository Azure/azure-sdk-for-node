'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the Subscription class.
 * @constructor
 */
function Subscription() { }

/**
 * Validate the payload against the Subscription schema
 *
 * @param {JSON} payload
 *
 */
Subscription.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('Subscription cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['subscriptionId'] !== null && payload['subscriptionId'] !== undefined && typeof payload['subscriptionId'].valueOf() !== 'string') {
    throw new Error('payload[\'subscriptionId\'] must be of type string.');
  }

  if (payload['displayName'] !== null && payload['displayName'] !== undefined && typeof payload['displayName'].valueOf() !== 'string') {
    throw new Error('payload[\'displayName\'] must be of type string.');
  }

  if (payload['state'] !== null && payload['state'] !== undefined && typeof payload['state'].valueOf() !== 'string') {
    throw new Error('payload[\'state\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to Subscription schema
 *
 * @param {JSON} instance
 *
 */
Subscription.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new Subscription();
