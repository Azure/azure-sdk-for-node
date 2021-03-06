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
 * Class representing a ResourceProviderOperationList.
 */
class ResourceProviderOperationList extends Array {
  /**
   * Create a ResourceProviderOperationList.
   * @member {string} [nextLink] The URI that can be used to request the next
   * page for list of Azure operations.
   */
  constructor() {
    super();
  }

  /**
   * Defines the metadata of ResourceProviderOperationList
   *
   * @returns {object} metadata of ResourceProviderOperationList
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ResourceProviderOperationList',
      type: {
        name: 'Composite',
        className: 'ResourceProviderOperationList',
        modelProperties: {
          value: {
            required: false,
            serializedName: '',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'ResourceProviderOperationDefinitionElementType',
                  type: {
                    name: 'Composite',
                    className: 'ResourceProviderOperationDefinition'
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

module.exports = ResourceProviderOperationList;
