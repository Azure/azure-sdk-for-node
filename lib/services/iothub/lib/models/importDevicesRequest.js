/*
 * MIT
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the ImportDevicesRequest class.
 * @constructor
 * Use to provide parameters when requesting an import of all devices in the
 * hub.
 *
 * @member {string} inputBlobContainerUri The input blob container URI.
 *
 * @member {string} outputBlobContainerUri The output blob container URI.
 *
 */
class ImportDevicesRequest {
  constructor() {
  }

  /**
   * Defines the metadata of ImportDevicesRequest
   *
   * @returns {object} metadata of ImportDevicesRequest
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ImportDevicesRequest',
      type: {
        name: 'Composite',
        className: 'ImportDevicesRequest',
        modelProperties: {
          inputBlobContainerUri: {
            required: true,
            serializedName: 'InputBlobContainerUri',
            type: {
              name: 'String'
            }
          },
          outputBlobContainerUri: {
            required: true,
            serializedName: 'OutputBlobContainerUri',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = ImportDevicesRequest;
