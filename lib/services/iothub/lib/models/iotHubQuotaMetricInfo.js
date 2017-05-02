/*
 * MIT
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the IotHubQuotaMetricInfo class.
 * @constructor
 * Quota metrics properties.
 *
 * @member {string} [name] The name of the quota metric.
 *
 * @member {number} [currentValue] The current value for the quota metric.
 *
 * @member {number} [maxValue] The maximum value of the quota metric.
 *
 */
class IotHubQuotaMetricInfo {
  constructor() {
  }

  /**
   * Defines the metadata of IotHubQuotaMetricInfo
   *
   * @returns {object} metadata of IotHubQuotaMetricInfo
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'IotHubQuotaMetricInfo',
      type: {
        name: 'Composite',
        className: 'IotHubQuotaMetricInfo',
        modelProperties: {
          name: {
            required: false,
            readOnly: true,
            serializedName: 'Name',
            type: {
              name: 'String'
            }
          },
          currentValue: {
            required: false,
            readOnly: true,
            serializedName: 'CurrentValue',
            type: {
              name: 'Number'
            }
          },
          maxValue: {
            required: false,
            readOnly: true,
            serializedName: 'MaxValue',
            type: {
              name: 'Number'
            }
          }
        }
      }
    };
  }
}

module.exports = IotHubQuotaMetricInfo;
