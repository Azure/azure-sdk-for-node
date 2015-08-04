'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ProviderResourceType class.
 * @constructor
 */
function ProviderResourceType() { }

/**
 * Validate the payload against the ProviderResourceType schema
 *
 * @param {JSON} payload
 *
 */
ProviderResourceType.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ProviderResourceType cannot be null.');
  }
  if (payload['resourceType'] !== null && payload['resourceType'] !== undefined && typeof payload['resourceType'].valueOf() !== 'string') {
    throw new Error('payload[\'resourceType\'] must be of type string.');
  }

  if (util.isArray(payload['locations'])) {
    for (var i = 0; i < payload['locations'].length; i++) {
      if (payload['locations'][i] !== null && payload['locations'][i] !== undefined && typeof payload['locations'][i].valueOf() !== 'string') {
        throw new Error('payload[\'locations\'][i] must be of type string.');
      }
    }
  }

  if (util.isArray(payload['apiVersions'])) {
    for (var i1 = 0; i1 < payload['apiVersions'].length; i1++) {
      if (payload['apiVersions'][i1] !== null && payload['apiVersions'][i1] !== undefined && typeof payload['apiVersions'][i1].valueOf() !== 'string') {
        throw new Error('payload[\'apiVersions\'][i1] must be of type string.');
      }
    }
  }

  if (payload['properties'] && typeof payload['properties'] === 'object') {
    for(var valueElement in payload['properties']) {
      if (payload['properties'][valueElement] !== null && payload['properties'][valueElement] !== undefined && typeof payload['properties'][valueElement].valueOf() !== 'string') {
        throw new Error('payload[\'properties\'][valueElement] must be of type string.');
      }
    }
  }
};

/**
 * Deserialize the instance to ProviderResourceType schema
 *
 * @param {JSON} instance
 *
 */
ProviderResourceType.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new ProviderResourceType();
