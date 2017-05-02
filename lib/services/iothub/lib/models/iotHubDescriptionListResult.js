/*
 * MIT
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the IotHubDescriptionListResult class.
 * @constructor
 * The JSON-serialized array of IotHubDescription objects with a next link.
 *
 * @member {string} [nextLink] The next link.
 *
 */
class IotHubDescriptionListResult extends Array {
  constructor() {
    super();
  }

  /**
   * Defines the metadata of IotHubDescriptionListResult
   *
   * @returns {object} metadata of IotHubDescriptionListResult
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'IotHubDescriptionListResult',
      type: {
        name: 'Composite',
        className: 'IotHubDescriptionListResult',
        modelProperties: {
          value: {
            required: false,
            serializedName: '',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'IotHubDescriptionElementType',
                  type: {
                    name: 'Composite',
                    className: 'IotHubDescription'
                  }
              }
            }
          },
          nextLink: {
            required: false,
            readOnly: true,
            serializedName: 'nextLink',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = IotHubDescriptionListResult;
