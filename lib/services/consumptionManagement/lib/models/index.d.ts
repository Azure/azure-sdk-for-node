/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { BaseResource, CloudError } from "ms-rest-azure";
import * as moment from "moment";

export {

  BaseResource,
  CloudError
};

/**
 * The object that represents the operation.
 */
export interface OperationDisplay {
  /**
   * Service provider: Microsoft.Consumption.
   */
  readonly provider?: string;
  /**
   * Resource on which the operation is performed: UsageDetail, etc.
   */
  readonly resource?: string;
  /**
   * Operation type: Read, write, delete, etc.
   */
  readonly operation?: string;
}

/**
 * A Consumption REST API operation.
 */
export interface Operation {
  /**
   * Operation name: {provider}/{resource}/{operation}.
   */
  readonly name?: string;
  /**
   * The object that represents the operation.
   */
  display?: OperationDisplay;
}

/**
 * The tag resource.
 */
export interface Tag {
  /**
   * Tag key.
   */
  key?: string;
}

/**
 * The Resource model definition.
 */
export interface ProxyResource extends BaseResource {
  /**
   * Resource Id.
   */
  readonly id?: string;
  /**
   * Resource name.
   */
  readonly name?: string;
  /**
   * Resource type.
   */
  readonly type?: string;
  /**
   * eTag of the resource. To handle concurrent update scenario, this field will be used to
   * determine whether the user is updating the latest version or not.
   */
  eTag?: string;
}

/**
 * A resource listing all tags.
 */
export interface TagsResult extends ProxyResource {
  /**
   * A list of Tag.
   */
  tags?: Tag[];
}

/**
 * The details of the error.
 */
export interface ErrorDetails {
  /**
   * Error code.
   */
  readonly code?: string;
  /**
   * Error message indicating why the operation failed.
   */
  readonly message?: string;
}

/**
 * Error response indicates that the service is not able to process the incoming request. The
 * reason is provided in the error message.
 */
export interface ErrorResponse {
  /**
   * The details of the error.
   */
  error?: ErrorDetails;
}

/**
 * Result of listing consumption operations. It contains a list of operations and a URL link to get
 * the next set of results.
 */
export interface OperationListResult extends Array<Operation> {
  /**
   * URL to get the next set of operation list results if there are any.
   */
  readonly nextLink?: string;
}
