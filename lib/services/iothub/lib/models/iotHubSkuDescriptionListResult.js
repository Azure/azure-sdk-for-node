/*
 * MIT
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the IotHubSkuDescriptionListResult class.
 * @constructor
 * The JSON-serialized array of IotHubSkuDescription objects with a next link.
 *
 * @member {string} [nextLink] The next link.
 *
 */
class IotHubSkuDescriptionListResult extends Array {
  constructor() {
    super();
  }

  /**
   * Defines the metadata of IotHubSkuDescriptionListResult
   *
   * @returns {object} metadata of IotHubSkuDescriptionListResult
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'IotHubSkuDescriptionListResult',
      type: {
        name: 'Composite',
        className: 'IotHubSkuDescriptionListResult',
        modelProperties: {
          value: {
            required: false,
            serializedName: '',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'IotHubSkuDescriptionElementType',
                  type: {
                    name: 'Composite',
                    className: 'IotHubSkuDescription'
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

module.exports = IotHubSkuDescriptionListResult;
