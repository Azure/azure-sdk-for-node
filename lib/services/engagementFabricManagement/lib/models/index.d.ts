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
 * The EngagementFabric SKU
 */
export interface SKU {
  /**
   * The name of the SKU
   */
  name: string;
  /**
   * The price tier of the SKU
   */
  tier?: string;
}

/**
 * The base model for Azure resource
 */
export interface Resource extends BaseResource {
  /**
   * The ID of the resource
   */
  readonly id?: string;
  /**
   * The name of the resource
   */
  readonly name?: string;
  /**
   * The fully qualified type of the resource
   */
  readonly type?: string;
}

/**
 * The base model for the tracked Azure resource
 */
export interface TrackedResource extends Resource {
  /**
   * The location of the resource
   */
  location: string;
  /**
   * The tags of the resource
   */
  tags?: { [propertyName: string]: string };
  /**
   * The SKU of the resource
   */
  sku: SKU;
}

/**
 * The EngagementFabric account
 */
export interface Account extends TrackedResource {
}

/**
 * The patch of EngagementFabric account
 */
export interface AccountPatch {
  /**
   * The tags of the resource
   */
  tags?: { [propertyName: string]: string };
}

/**
 * The description of the EngagementFabric account key
 */
export interface KeyDescription {
  /**
   * The name of the key
   */
  readonly name?: string;
  /**
   * The rank of the key. Possible values include: 'PrimaryKey', 'SecondaryKey'
   */
  readonly rank?: string;
  /**
   * The value of the key
   */
  readonly value?: string;
}

/**
 * The parameter to regenerate single EngagementFabric account key
 */
export interface RegenerateKeyParameter {
  /**
   * The name of key to be regenerated
   */
  name: string;
  /**
   * The rank of the key to be regenerated. Possible values include: 'PrimaryKey', 'SecondaryKey'
   */
  rank: string;
}

/**
 * EngagementFabric channel description
 */
export interface ChannelTypeDescription {
  /**
   * Channel type
   */
  channelType?: string;
  /**
   * Text description for the channel
   */
  channelDescription?: string;
  /**
   * All the available functions for the channel
   */
  channelFunctions?: string[];
}

/**
 * List of the EngagementFabric channel descriptions
 */
export interface ChannelTypeDescriptionList {
  /**
   * Channel descriptions
   */
  value?: ChannelTypeDescription[];
}

/**
 * The base model for the proxy-only Azure resource
 */
export interface ProxyOnlyResource extends Resource {
}

/**
 * The EngagementFabric channel
 */
export interface Channel extends ProxyOnlyResource {
  /**
   * The channel type
   */
  channelType: string;
  /**
   * The functions to be enabled for the channel
   */
  channelFunctions?: string[];
  /**
   * The channel credentials
   */
  credentials?: { [propertyName: string]: string };
}

/**
 * The parameter for name availability check
 */
export interface CheckNameAvailabilityParameter {
  /**
   * The name to be checked
   */
  name: string;
  /**
   * The fully qualified resource type for the name to be checked
   */
  type: string;
}

/**
 * The result of name availability check
 */
export interface CheckNameAvailabilityResult {
  /**
   * The name to be checked
   */
  readonly nameAvailable?: boolean;
  /**
   * The reason if name is unavailable. Possible values include: 'Invalid', 'AlreadyExists'
   */
  readonly reason?: string;
  /**
   * The message if name is unavailable
   */
  readonly message?: string;
}

/**
 * The display information of the EngagementFabric operation
 */
export interface OperationDisplay {
  /**
   * The resource provider namespace of the EngagementFabric operation
   */
  readonly provider?: string;
  /**
   * The resource type of the EngagementFabric operation
   */
  readonly resource?: string;
  /**
   * The name of the EngagementFabric operation
   */
  readonly operation?: string;
  /**
   * The description of the EngagementFabric operation
   */
  readonly description?: string;
}

/**
 * The EngagementFabric operation
 */
export interface Operation {
  /**
   * The name of the EngagementFabric operation
   */
  readonly name?: string;
  /**
   * The display content of the EngagementFabric operation
   */
  readonly display?: OperationDisplay;
}

/**
 * The Locations and zones info for SKU
 */
export interface SkuLocationInfoItem {
  /**
   * The available location of the SKU
   */
  location?: string;
  /**
   * The available zone of the SKU
   */
  zones?: string[];
}

/**
 * The EngagementFabric SKU description of given resource type
 */
export interface SkuDescription {
  /**
   * The fully qualified resource type
   */
  readonly resourceType?: string;
  /**
   * The name of the SKU
   */
  readonly name?: string;
  /**
   * The price tier of the SKU
   */
  readonly tier?: string;
  /**
   * The set of locations that the SKU is available
   */
  readonly locations?: string[];
  /**
   * Locations and zones
   */
  readonly locationInfo?: SkuLocationInfoItem[];
  /**
   * The restrictions because of which SKU cannot be used
   */
  readonly restrictions?: any[];
}

/**
 * The list of the EngagementFabric accounts
 */
export interface AccountList extends Array<Account> {
}

/**
 * The list of the EngagementFabric account keys
 */
export interface KeyDescriptionList extends Array<KeyDescription> {
}

/**
 * The list of the EngagementFabric channels
 */
export interface ChannelList extends Array<Channel> {
}

/**
 * The list of the EngagementFabric operations
 */
export interface OperationList extends Array<Operation> {
}

/**
 * The list of the EngagementFabric SKU descriptions
 */
export interface SkuDescriptionList extends Array<SkuDescription> {
}
