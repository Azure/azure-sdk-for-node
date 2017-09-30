// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

const Constants = {
  /**
  * Defines constants for long running operation states.
  *
  * @const
  * @type {string}
  */
  LongRunningOperationStates: {
    InProgress: 'InProgress',
    Succeeded: 'Succeeded',
    Failed: 'Failed',
    Canceled: 'Canceled'
  },

  DEFAULT_ADAL_CLIENT_ID: '04b07795-8ddb-461a-bbee-02f9e1bf7b46',
  
  AAD_COMMON_TENANT: 'common',

  DEFAULT_LANGUAGE: 'en-us',

  AZURE_AUTH_LOCATION: 'AZURE_AUTH_LOCATION'
};

exports = module.exports = Constants;
