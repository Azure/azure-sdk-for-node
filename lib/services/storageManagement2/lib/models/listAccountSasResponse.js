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
 * The List SAS credentials operation response.
 *
 */
class ListAccountSasResponse {
  /**
   * Create a ListAccountSasResponse.
   * @property {string} [accountSasToken] List SAS credentials of storage
   * account.
   */
  constructor() {
  }

  /**
   * Defines the metadata of ListAccountSasResponse
   *
   * @returns {object} metadata of ListAccountSasResponse
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ListAccountSasResponse',
      type: {
        name: 'Composite',
        className: 'ListAccountSasResponse',
        modelProperties: {
          accountSasToken: {
            required: false,
            readOnly: true,
            serializedName: 'accountSasToken',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = ListAccountSasResponse;
