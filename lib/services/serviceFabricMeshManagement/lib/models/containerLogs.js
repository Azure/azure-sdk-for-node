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
 * The logs of the container.
 *
 */
class ContainerLogs {
  /**
   * Create a ContainerLogs.
   * @member {string} [content] content of the log.
   */
  constructor() {
  }

  /**
   * Defines the metadata of ContainerLogs
   *
   * @returns {object} metadata of ContainerLogs
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ContainerLogs',
      type: {
        name: 'Composite',
        className: 'ContainerLogs',
        modelProperties: {
          content: {
            required: false,
            serializedName: 'content',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = ContainerLogs;