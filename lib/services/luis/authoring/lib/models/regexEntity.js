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
 * Regular Expression Entity Extractor.
 *
 */
class RegexEntity {
  /**
   * Create a RegexEntity.
   * @property {string} [name]
   * @property {string} [regexPattern]
   * @property {array} [roles]
   */
  constructor() {
  }

  /**
   * Defines the metadata of RegexEntity
   *
   * @returns {object} metadata of RegexEntity
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'RegexEntity',
      type: {
        name: 'Composite',
        className: 'RegexEntity',
        modelProperties: {
          name: {
            required: false,
            serializedName: 'name',
            type: {
              name: 'String'
            }
          },
          regexPattern: {
            required: false,
            serializedName: 'regexPattern',
            type: {
              name: 'String'
            }
          },
          roles: {
            required: false,
            serializedName: 'roles',
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
          }
        }
      }
    };
  }
}

module.exports = RegexEntity;