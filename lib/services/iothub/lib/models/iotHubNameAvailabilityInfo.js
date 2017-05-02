/*
 * MIT
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the IotHubNameAvailabilityInfo class.
 * @constructor
 * The properties indicating whether a given IoT hub name is available.
 *
 * @member {boolean} [nameAvailable] The value which indicates whether the
 * provided name is available.
 *
 * @member {string} [reason] The reason for unavailability. Possible values
 * include: 'Invalid', 'AlreadyExists'
 *
 * @member {string} [message] The detailed reason message.
 *
 */
class IotHubNameAvailabilityInfo {
  constructor() {
  }

  /**
   * Defines the metadata of IotHubNameAvailabilityInfo
   *
   * @returns {object} metadata of IotHubNameAvailabilityInfo
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'IotHubNameAvailabilityInfo',
      type: {
        name: 'Composite',
        className: 'IotHubNameAvailabilityInfo',
        modelProperties: {
          nameAvailable: {
            required: false,
            readOnly: true,
            serializedName: 'nameAvailable',
            type: {
              name: 'Boolean'
            }
          },
          reason: {
            required: false,
            readOnly: true,
            serializedName: 'reason',
            type: {
              name: 'Enum',
              allowedValues: [ 'Invalid', 'AlreadyExists' ]
            }
          },
          message: {
            required: false,
            serializedName: 'message',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = IotHubNameAvailabilityInfo;
