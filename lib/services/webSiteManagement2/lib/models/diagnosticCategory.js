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

const models = require('./index');

/**
 * Class representing detector definition
 *
 * @extends models['ProxyOnlyResource']
 */
class DiagnosticCategory extends models['ProxyOnlyResource'] {
  /**
   * Create a DiagnosticCategory.
   * @member {string} [description] Description of the diagnostic category
   */
  constructor() {
    super();
  }

  /**
   * Defines the metadata of DiagnosticCategory
   *
   * @returns {object} metadata of DiagnosticCategory
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'DiagnosticCategory',
      type: {
        name: 'Composite',
        className: 'DiagnosticCategory',
        modelProperties: {
          id: {
            required: false,
            readOnly: true,
            serializedName: 'id',
            type: {
              name: 'String'
            }
          },
          name: {
            required: false,
            readOnly: true,
            serializedName: 'name',
            type: {
              name: 'String'
            }
          },
          kind: {
            required: false,
            serializedName: 'kind',
            type: {
              name: 'String'
            }
          },
          type: {
            required: false,
            readOnly: true,
            serializedName: 'type',
            type: {
              name: 'String'
            }
          },
          description: {
            required: false,
            readOnly: true,
            serializedName: 'properties.description',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = DiagnosticCategory;