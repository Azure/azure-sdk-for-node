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
 * The base child entity type.
 *
 */
class ChildEntity {
  /**
   * Create a ChildEntity.
   * @property {uuid} id The ID (GUID) belonging to a child entity.
   * @property {string} [name] The name of a child entity.
   */
  constructor() {
  }

  /**
   * Defines the metadata of ChildEntity
   *
   * @returns {object} metadata of ChildEntity
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ChildEntity',
      type: {
        name: 'Composite',
        className: 'ChildEntity',
        modelProperties: {
          id: {
            required: true,
            serializedName: 'id',
            type: {
              name: 'String'
            }
          },
          name: {
            required: false,
            serializedName: 'name',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = ChildEntity;