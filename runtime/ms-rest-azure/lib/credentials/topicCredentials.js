// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

const ApiKeyCredentials = require('ms-rest').ApiKeyCredentials;

/**
 * Creates a new TopicCredentials object.
 *
 * @constructor
 * @param {string} topicKey   The EventGrid topic key.
 */
class TopicCredentials extends ApiKeyCredentials {
  constructor(topicKey) {
    if (!topicKey || (topicKey && typeof topicKey.valueOf() !== 'string')) {
      throw new Error (`topicKey cannot be null or undefined and must be of type string.`);
    }
    let options = {
      inHeader: {
        'aeg-sas-key': topicKey
      }
    };
    super(options);
  }
}

module.exports = TopicCredentials;