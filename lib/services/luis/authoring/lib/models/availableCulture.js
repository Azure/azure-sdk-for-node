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
 * Available culture for using in a new application.
 *
 */
class AvailableCulture {
  /**
   * Create a AvailableCulture.
   * @property {string} [name] The language name.
   * @property {string} [code] The ISO value for the language.
   */
  constructor() {
  }

  /**
   * Defines the metadata of AvailableCulture
   *
   * @returns {object} metadata of AvailableCulture
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'AvailableCulture',
      type: {
        name: 'Composite',
        className: 'AvailableCulture',
        modelProperties: {
          name: {
            required: false,
            serializedName: 'name',
            type: {
              name: 'String'
            }
          },
          code: {
            required: false,
            serializedName: 'code',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = AvailableCulture;