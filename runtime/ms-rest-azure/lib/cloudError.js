// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

/**
 * @class
 * Provides additional information about an http error response returned from a Microsoft Azure service.
 * @constructor
 * @member {string} [code] The error code parsed from the body of the http error response
 * 
 * @member {string} [message] The error message parsed from the body of the http error response
 * 
 * @member {string} [target] The target of the error
 * 
 * @member {array} [details] An array of CloudError objects specifying the details
 */
class CloudError extends Error {
  constructor(parameters) {
    super();
    this.name = this.constructor.name;

    if (parameters) {
      if (parameters.code) {
        this.code = parameters.code;
      }

      if (parameters.message) {
        this.message = parameters.message;
      }

      if (parameters.target) {
        this.target = parameters.target;
      }

      if (parameters.details) {
        var tempDetails = [];
        parameters.details.forEach(function (element) {
          if (element) {
            element = new CloudError(element);
          }
          tempDetails.push(element);
        });
        this.details = tempDetails;
      }
    }
  }

  /**
   * Defines the metadata of CloudError
   *
   * @returns {object} metadata of CloudError
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'CloudError',
      type: {
        name: 'Composite',
        className: 'CloudError',
        modelProperties: {
          code: {
            required: false,
            serializedName: 'code',
            type: {
              name: 'String'
            }
          },
          message: {
            required: false,
            serializedName: 'message',
            type: {
              name: 'String'
            }
          },
          target: {
            required: false,
            serializedName: 'target',
            type: {
              name: 'String'
            }
          },
          details: {
            required: false,
            serializedName: 'details',
            type: {
              name: 'Sequence',
              element: {
                required: false,
                serializedName: 'CloudErrorElementType',
                type: {
                  name: 'Composite',
                  className: 'CloudError'
                }
              }
            }
          }
        }
      }
    };
  }
  /**
   * Serialize the instance to CloudError schema
   *
   * @param {JSON} instance
   *
   */
  serialize() {
    var payload = { error: {} };
    if (this.code) {
      payload.error.code = this.code;
    }

    if (this.message) {
      payload.error.message = this.message;
    }

    if (this.target) {
      payload.error.target = this.target;
    }

    if (this.details) {
      var deserializedArray = [];
      this.details.forEach(function (element1) {
        if (element1) {
          element1 = this.serialize(element1);
        }
        deserializedArray.push(element1);
      });
      payload.error.details = deserializedArray;
    }
    return payload;
  }

  /**
   * Deserialize the instance to CloudError schema
   *
   * @param {JSON} instance
   *
   */
  deserialize(instance) {
    if (instance) {

      if (instance.error) {

        if (instance.error.code) {
          this.code = instance.error.code;
        }

        if (instance.error.message) {
          this.message = instance.error.message;
        }

        if (instance.error.target) {
          this.target = instance.error.target;
        }

        if (instance.error.details) {
          var deserializedArray = [];
          instance.error.details.forEach(function (element1) {
            if (element1) {
              element1 = this.deserialize(element1);
            }
            deserializedArray.push(element1);
          });
          this.details = deserializedArray;
        }
      }
    }
    return this;
  }
}

module.exports = CloudError;
