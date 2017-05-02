/*
 * MIT
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the OperationInputs class.
 * @constructor
 * Input values.
 *
 * @member {string} name The name of the IoT hub to check.
 *
 */
class OperationInputs {
  constructor() {
  }

  /**
   * Defines the metadata of OperationInputs
   *
   * @returns {object} metadata of OperationInputs
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'OperationInputs',
      type: {
        name: 'Composite',
        className: 'OperationInputs',
        modelProperties: {
          name: {
            required: true,
            serializedName: 'Name',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = OperationInputs;
