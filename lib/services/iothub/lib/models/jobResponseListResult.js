/*
 * MIT
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the JobResponseListResult class.
 * @constructor
 * The JSON-serialized array of JobResponse objects with a next link.
 *
 * @member {string} [nextLink] The next link.
 *
 */
class JobResponseListResult extends Array {
  constructor() {
    super();
  }

  /**
   * Defines the metadata of JobResponseListResult
   *
   * @returns {object} metadata of JobResponseListResult
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'JobResponseListResult',
      type: {
        name: 'Composite',
        className: 'JobResponseListResult',
        modelProperties: {
          value: {
            required: false,
            serializedName: '',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'JobResponseElementType',
                  type: {
                    name: 'Composite',
                    className: 'JobResponse'
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

module.exports = JobResponseListResult;
