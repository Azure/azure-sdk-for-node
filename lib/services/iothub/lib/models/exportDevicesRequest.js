/*
 * MIT
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the ExportDevicesRequest class.
 * @constructor
 * Use to provide parameters when requesting an export of all devices in the
 * IoT hub.
 *
 * @member {string} exportBlobContainerUri The export blob container URI.
 *
 * @member {boolean} excludeKeys The value indicating whether keys should be
 * excluded during export.
 *
 */
class ExportDevicesRequest {
  constructor() {
  }

  /**
   * Defines the metadata of ExportDevicesRequest
   *
   * @returns {object} metadata of ExportDevicesRequest
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ExportDevicesRequest',
      type: {
        name: 'Composite',
        className: 'ExportDevicesRequest',
        modelProperties: {
          exportBlobContainerUri: {
            required: true,
            serializedName: 'ExportBlobContainerUri',
            type: {
              name: 'String'
            }
          },
          excludeKeys: {
            required: true,
            serializedName: 'ExcludeKeys',
            type: {
              name: 'Boolean'
            }
          }
        }
      }
    };
  }
}

module.exports = ExportDevicesRequest;
