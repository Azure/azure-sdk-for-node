/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

/**
 * NamedValue update Parameters.
 *
 */
class NamedValueUpdateParameters {
  /**
   * Create a NamedValueUpdateParameters.
   * @property {array} [tags] Optional tags that when provided can be used to
   * filter the NamedValue list.
   * @property {boolean} [secret] Determines whether the value is a secret and
   * should be encrypted or not. Default value is false.
   * @property {string} [displayName] Unique name of NamedValue. It may contain
   * only letters, digits, period, dash, and underscore characters.
   * @property {string} [value] Value of the NamedValue. Can contain policy
   * expressions. It may not be empty or consist only of whitespace.
   */
  constructor() {
  }

  /**
   * Defines the metadata of NamedValueUpdateParameters
   *
   * @returns {object} metadata of NamedValueUpdateParameters
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'NamedValueUpdateParameters',
      type: {
        name: 'Composite',
        className: 'NamedValueUpdateParameters',
        modelProperties: {
          tags: {
            required: false,
            serializedName: 'properties.tags',
            constraints: {
              MaxItems: 32
            },
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'StringElementType',
                  type: {
                    name: 'String'
                  }
              }
            }
          },
          secret: {
            required: false,
            serializedName: 'properties.secret',
            type: {
              name: 'Boolean'
            }
          },
          displayName: {
            required: false,
            serializedName: 'properties.displayName',
            constraints: {
              MaxLength: 256,
              MinLength: 1,
              Pattern: /^[A-Za-z0-9-._]+$/
            },
            type: {
              name: 'String'
            }
          },
          value: {
            required: false,
            serializedName: 'properties.value',
            constraints: {
              MaxLength: 4096,
              MinLength: 1
            },
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = NamedValueUpdateParameters;
