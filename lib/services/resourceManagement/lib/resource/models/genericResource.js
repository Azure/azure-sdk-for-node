'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the GenericResource class.
 * @constructor
 */
function GenericResource() { }

/**
 * Validate the payload against the GenericResource schema
 *
 * @param {JSON} payload
 *
 */
GenericResource.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('GenericResource cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['name'] !== null && payload['name'] !== undefined && typeof payload['name'].valueOf() !== 'string') {
    throw new Error('payload[\'name\'] must be of type string.');
  }

  if (payload['type'] !== null && payload['type'] !== undefined && typeof payload['type'].valueOf() !== 'string') {
    throw new Error('payload[\'type\'] must be of type string.');
  }

  if (payload['location'] === null || payload['location'] === undefined || typeof payload['location'].valueOf() !== 'string') {
    throw new Error('payload[\'location\'] cannot be null or undefined and it must be of type string.');
  }

  if (payload['tags'] && typeof payload['tags'] === 'object') {
    for(var valueElement in payload['tags']) {
      if (payload['tags'][valueElement] !== null && payload['tags'][valueElement] !== undefined && typeof payload['tags'][valueElement].valueOf() !== 'string') {
        throw new Error('payload[\'tags\'][valueElement] must be of type string.');
      }
    }
  }

  if (payload['plan']) {
    models['Plan'].validate(payload['plan']);
  }

};

/**
 * Deserialize the instance to GenericResource schema
 *
 * @param {JSON} instance
 *
 */
GenericResource.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.plan !== null && instance.plan !== undefined) {
      instance.plan = models['Plan'].deserialize(instance.plan);
    }
  }
  return instance;
};

module.exports = new GenericResource();
