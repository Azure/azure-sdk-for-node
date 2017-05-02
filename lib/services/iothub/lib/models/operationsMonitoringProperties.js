/*
 * MIT
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the OperationsMonitoringProperties class.
 * @constructor
 * The operations monitoring properties for the IoT hub. The possible keys to
 * the dictionary are Connections, DeviceTelemetry, C2DCommands,
 * DeviceIdentityOperations, FileUploadOperations, Routes, D2CTwinOperations,
 * C2DTwinOperations, TwinQueries, JobsOperations, DirectMethods.
 *
 * @member {object} [events]
 *
 */
class OperationsMonitoringProperties {
  constructor() {
  }

  /**
   * Defines the metadata of OperationsMonitoringProperties
   *
   * @returns {object} metadata of OperationsMonitoringProperties
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'OperationsMonitoringProperties',
      type: {
        name: 'Composite',
        className: 'OperationsMonitoringProperties',
        modelProperties: {
          events: {
            required: false,
            serializedName: 'events',
            type: {
              name: 'Dictionary',
              value: {
                  required: false,
                  serializedName: 'StringElementType',
                  type: {
                    name: 'String'
                  }
              }
            }
          }
        }
      }
    };
  }
}

module.exports = OperationsMonitoringProperties;
