/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import { BaseResource } from 'ms-rest-azure';
import { CloudError } from 'ms-rest-azure';
import * as moment from 'moment';

export { BaseResource } from 'ms-rest-azure';
export { CloudError } from 'ms-rest-azure';


/**
 * @class
 * Initializes a new instance of the DataLakeStorageErrorError class.
 * @constructor
 * The service error response object.
 *
 * @member {string} [code] The service error code.
 * @member {string} [message] The service error message.
 */
export interface DataLakeStorageErrorError {
  code?: string;
  message?: string;
}

/**
 * @class
 * Initializes a new instance of the DataLakeStorageError class.
 * @constructor
 * @member {object} [error] The service error response object.
 * @member {string} [error.code] The service error code.
 * @member {string} [error.message] The service error message.
 */
export interface DataLakeStorageError {
  error?: DataLakeStorageErrorError;
}

/**
 * @class
 * Initializes a new instance of the Path class.
 * @constructor
 * @member {string} [name]
 * @member {boolean} [isDirectory] Default value: false .
 * @member {string} [lastModified]
 * @member {string} [eTag]
 * @member {number} [contentLength]
 * @member {string} [owner]
 * @member {string} [group]
 * @member {string} [permissions]
 */
export interface Path {
  name?: string;
  isDirectory?: boolean;
  lastModified?: string;
  eTag?: string;
  contentLength?: number;
  owner?: string;
  group?: string;
  permissions?: string;
}

/**
 * @class
 * Initializes a new instance of the Filesystem class.
 * @constructor
 * @member {string} [name]
 * @member {string} [lastModified]
 * @member {string} [eTag]
 */
export interface Filesystem {
  name?: string;
  lastModified?: string;
  eTag?: string;
}


/**
 * @class
 * Initializes a new instance of the FilesystemList class.
 * @constructor
 * @member {array} [filesystems]
 */
export interface FilesystemList extends Array<Filesystem> {
}

/**
 * @class
 * Initializes a new instance of the PathList class.
 * @constructor
 * @member {array} [paths]
 */
export interface PathList extends Array<Path> {
}
