// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

'use strict';

const ApiKeyCredentials = require('ms-rest').ApiKeyCredentials;

/**
 * Creates a new TopicSASCredentials object.
 *
 * To use SAS token we need to pass the SAS token in aeg-sas-token header instead of aeg-sas-key header.
 * Source: https://docs.microsoft.com/en-us/azure/event-grid/security-authentication
 *
 * @constructor
 * @param {string} topicKey   The EventGrid topic key.
 */
class TopicSASCredentials extends ApiKeyCredentials {
  constructor(topicToken) {
    if (!topicToken || (topicToken && typeof topicToken.valueOf() !== 'string')) {
      throw new Error (`topicKey cannot be null or undefined and must be of type string.`);
    }
    let options = {
      inHeader: {
        'aeg-sas-token': topicToken
      }
    };
    super(options);
  }
}

module.exports = TopicSASCredentials;
