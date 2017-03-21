// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

/**
 * @class
 * Initializes a new instance of the Resource class.
 * @constructor
 */
class BaseResource {
  constructor() { }

  /**
   * Defines the metadata of BaseResource
   *
   * @returns {object} metadata of BaseResource
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'BaseResource',
      type: {
        name: 'Composite',
        className: 'BaseResource',
        modelProperties: {
        }
      }
    };
  }

  /**
   * Validate the payload against the Resource schema
   *
   * @param {JSON} payload
   *
   */
  serialize() {
    return {};
  }

  /**
   * Deserialize the instance to Resource schema
   *
   * @param {JSON} instance
   *
   */
  deserialize(instance) {
    return instance;
  }
}

module.exports = BaseResource;
