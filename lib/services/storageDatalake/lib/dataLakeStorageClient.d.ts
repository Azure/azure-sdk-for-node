/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import { ServiceClientCredentials } from 'ms-rest';
import { AzureServiceClient, AzureServiceClientOptions } from 'ms-rest-azure';
import * as models from "./models";
import * as operations from "./operations";

/**
 * DataLakeStorageClientOptions for DataLakeStorageClient.
 */
declare interface DataLakeStorageClientOptions extends AzureServiceClientOptions {
  /**
   * @property {string} [xMsVersion] - Specifies the version of the REST protocol used for processing the request. This is required when using shared key authorization.
   */
  xMsVersion?: string;
  /**
   * @property {string} [dnsSuffix] - The DNS suffix for the Azure Data Lake Storage endpoint.
   */
  dnsSuffix?: string;
  /**
   * @property {string} [acceptLanguage] - Gets or sets the preferred language for the response.
   */
  acceptLanguage?: string;
  /**
   * @property {number} [longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
   */
  longRunningOperationRetryTimeout?: number;
  /**
   * @property {boolean} [generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
   */
  generateClientRequestId?: boolean;
}

export default class DataLakeStorageClient extends AzureServiceClient {
  /**
   * Initializes a new instance of the DataLakeStorageClient class.
   * @constructor
   *
   * @class
   * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
   *
   * @param {string} accountName - The Azure Storage account name.
   *
   * @param {object} [options] - The parameter options
   *
   * @param {Array} [options.filters] - Filters to be added to the request pipeline
   *
   * @param {object} [options.requestOptions] - Options for the underlying request object
   * {@link https://github.com/request/request#requestoptions-callback Options doc}
   *
   * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
   *
   * @param {string} [options.xMsVersion] - Specifies the version of the REST protocol used for processing the request. This is required when using shared key authorization.
   *
   * @param {string} [options.dnsSuffix] - The DNS suffix for the Azure Data Lake Storage endpoint.
   *
   * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
   *
   * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
   *
   * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
   *
   */
  constructor(credentials: ServiceClientCredentials, accountName: string, options?: DataLakeStorageClientOptions);

  credentials: ServiceClientCredentials;

  xMsVersion: string;

  accountName: string;

  dnsSuffix: string;

  acceptLanguage: string;

  longRunningOperationRetryTimeout: number;

  generateClientRequestId: boolean;

  // Operation groups
  filesystemOperations: operations.FilesystemOperations;
  pathOperations: operations.PathOperations;
}

export { DataLakeStorageClient, models as DataLakeStorageModels };
