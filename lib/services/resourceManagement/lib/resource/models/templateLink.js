'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the TemplateLink class.
 * @constructor
 */
function TemplateLink() { }

/**
 * Validate the payload against the TemplateLink schema
 *
 * @param {JSON} payload
 *
 */
TemplateLink.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('TemplateLink cannot be null.');
  }
  if (payload['uri'] !== null && payload['uri'] !== undefined && typeof payload['uri'].valueOf() !== 'string') {
    throw new Error('payload[\'uri\'] must be of type string.');
  }

  if (payload['contentVersion'] !== null && payload['contentVersion'] !== undefined && typeof payload['contentVersion'].valueOf() !== 'string') {
    throw new Error('payload[\'contentVersion\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to TemplateLink schema
 *
 * @param {JSON} instance
 *
 */
TemplateLink.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new TemplateLink();
