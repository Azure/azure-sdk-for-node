/*
 * MIT
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the IotHubQuotaMetricInfoListResult class.
 * @constructor
 * The JSON-serialized array of IotHubQuotaMetricInfo objects with a next link.
 *
 * @member {string} [nextLink] The next link.
 *
 */
class IotHubQuotaMetricInfoListResult extends Array {
  constructor() {
    super();
  }

  /**
   * Defines the metadata of IotHubQuotaMetricInfoListResult
   *
   * @returns {object} metadata of IotHubQuotaMetricInfoListResult
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'IotHubQuotaMetricInfoListResult',
      type: {
        name: 'Composite',
        className: 'IotHubQuotaMetricInfoListResult',
        modelProperties: {
          value: {
            required: false,
            serializedName: '',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'IotHubQuotaMetricInfoElementType',
                  type: {
                    name: 'Composite',
                    className: 'IotHubQuotaMetricInfo'
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

module.exports = IotHubQuotaMetricInfoListResult;
