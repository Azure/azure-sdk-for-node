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
 * The SKU that defines the tier and kind of the peering.
 */
export interface PeeringSku {
  /**
   * The name of the peering SKU. Possible values include: 'Basic_Exchange_Free',
   * 'Basic_Direct_Free', 'Premium_Direct_Free', 'Premium_Exchange_Metered'
   */
  name?: string;
  /**
   * The tier of the peering SKU. Possible values include: 'Basic', 'Premium'
   */
  tier?: string;
  /**
   * The family of the peering SKU. Possible values include: 'Direct', 'Exchange'
   */
  family?: string;
  /**
   * The size of the peering SKU. Possible values include: 'Free', 'Metered', 'Unlimited'
   */
  size?: string;
}

/**
 * The properties that define a BGP session.
 */
export interface BgpSession {
  /**
   * The IPv4 prefix that contains both ends' IPv4 addresses.
   */
  sessionPrefixV4?: string;
  /**
   * The IPv6 prefix that contains both ends' IPv6 addresses.
   */
  sessionPrefixV6?: string;
  /**
   * The IPv4 session address on Microsoft's end.
   */
  readonly microsoftSessionIPv4Address?: string;
  /**
   * The IPv6 session address on Microsoft's end.
   */
  readonly microsoftSessionIPv6Address?: string;
  /**
   * The IPv4 session address on peer's end.
   */
  peerSessionIPv4Address?: string;
  /**
   * The IPv6 session address on peer's end.
   */
  peerSessionIPv6Address?: string;
  /**
   * The state of the IPv4 session. Possible values include: 'None', 'Idle', 'Connect', 'Active',
   * 'OpenSent', 'OpenConfirm', 'Established', 'PendingAdd', 'PendingUpdate', 'PendingRemove'
   */
  readonly sessionStateV4?: string;
  /**
   * The state of the IPv6 session. Possible values include: 'None', 'Idle', 'Connect', 'Active',
   * 'OpenSent', 'OpenConfirm', 'Established', 'PendingAdd', 'PendingUpdate', 'PendingRemove'
   */
  readonly sessionStateV6?: string;
  /**
   * The maximum number of prefixes advertised over the IPv4 session.
   */
  maxPrefixesAdvertisedV4?: number;
  /**
   * The maximum number of prefixes advertised over the IPv6 session.
   */
  maxPrefixesAdvertisedV6?: number;
  /**
   * The MD5 authentication key of the session.
   */
  md5AuthenticationKey?: string;
}

/**
 * The properties that define a direct connection.
 */
export interface DirectConnection {
  /**
   * The bandwidth of the connection.
   */
  bandwidthInMbps?: number;
  /**
   * The bandwidth that is actually provisioned.
   */
  provisionedBandwidthInMbps?: number;
  /**
   * The PeeringDB.com ID of the facility at which the connection has to be set up.
   */
  peeringDBFacilityId?: number;
  /**
   * The state of the connection. Possible values include: 'None', 'PendingApproval', 'Approved',
   * 'ProvisioningStarted', 'ProvisioningFailed', 'ProvisioningCompleted', 'Validating', 'Active'
   */
  readonly connectionState?: string;
  /**
   * The BGP session associated with the connection.
   */
  bgpSession?: BgpSession;
}

/**
 * The properties that define a direct peering.
 */
export interface PeeringPropertiesDirect {
  /**
   * The set of connections that constitute a direct peering.
   */
  connections?: DirectConnection[];
  /**
   * The Autonomous System Number (ASN) associated with the peering.
   */
  peerAsn?: number;
  /**
   * The flag that indicates whether or not the peering is used for peering service.
   */
  useForPeeringService?: boolean;
}

/**
 * The properties that define an exchange connection.
 */
export interface ExchangeConnection {
  /**
   * The PeeringDB.com ID of the facility at which the connection has to be set up.
   */
  peeringDBFacilityId?: number;
  /**
   * The state of the connection. Possible values include: 'None', 'PendingApproval', 'Approved',
   * 'ProvisioningStarted', 'ProvisioningFailed', 'ProvisioningCompleted', 'Validating', 'Active'
   */
  readonly connectionState?: string;
  /**
   * The BGP session associated with the connection.
   */
  bgpSession?: BgpSession;
}

/**
 * The properties that define an exchange peering.
 */
export interface PeeringPropertiesExchange {
  /**
   * The set of connections that constitute an exchange peering.
   */
  connections?: ExchangeConnection[];
  /**
   * The Autonomous System Number (ASN) associated with the peering.
   */
  peerAsn?: number;
}

/**
 * Peering is a logical representation of a set of connections to the Microsoft Cloud Edge at a
 * location.
 */
export interface Peering extends BaseResource {
  /**
   * The SKU that defines the tier and kind of the peering.
   */
  sku: PeeringSku;
  /**
   * The kind of the peering. Possible values include: 'Direct', 'Exchange'
   */
  kind: string;
  /**
   * The properties that define a direct peering.
   */
  direct?: PeeringPropertiesDirect;
  /**
   * The properties that define an exchange peering.
   */
  exchange?: PeeringPropertiesExchange;
  /**
   * The location of the peering.
   */
  peeringLocation?: string;
  /**
   * The provisioning state of the resource. Possible values include: 'Succeeded', 'Updating',
   * 'Deleting', 'Failed'
   */
  readonly provisioningState?: string;
  /**
   * The location of the resource.
   */
  location: string;
  /**
   * The resource tags.
   */
  tags?: { [propertyName: string]: string };
  /**
   * The name of the resource.
   */
  readonly name?: string;
  /**
   * The ID of the resource.
   */
  readonly id?: string;
  /**
   * The type of the resource.
   */
  readonly type?: string;
}

/**
 * The error response that indicates why an operation has failed.
 */
export interface ErrorResponse {
  /**
   * The error code.
   */
  readonly code?: string;
  /**
   * The error message.
   */
  readonly message?: string;
}

/**
 * The information related to the operation.
 */
export interface OperationDisplayInfo {
  /**
   * The name of the resource provider.
   */
  readonly provider?: string;
  /**
   * The type of the resource.
   */
  readonly resource?: string;
  /**
   * The name of the operation.
   */
  readonly operation?: string;
  /**
   * The description of the operation.
   */
  readonly description?: string;
}

/**
 * The peering API operation.
 */
export interface Operation {
  /**
   * The name of the operation.
   */
  readonly name?: string;
  /**
   * The information related to the operation.
   */
  readonly display?: OperationDisplayInfo;
  /**
   * The flag that indicates whether the operation applies to data plane.
   */
  readonly isDataAction?: boolean;
}

/**
 * The contact information of the peer.
 */
export interface ContactInfo {
  /**
   * The list of email addresses.
   */
  emails?: string[];
  /**
   * The list of contact numbers.
   */
  phone?: string[];
}

/**
 * The essential information related to the peer.
 */
export interface PeerInfo {
  /**
   * The Autonomous System Number (ASN) of the peer.
   */
  peerAsn?: number;
  /**
   * The contact information of the peer.
   */
  peerContactInfo?: ContactInfo;
  /**
   * The name of the peer.
   */
  peerName?: string;
  /**
   * The validation state of the ASN associated with the peer. Possible values include: 'None',
   * 'Pending', 'Approved', 'Failed'
   */
  validationState?: string;
}

/**
 * The properties that define a direct peering facility.
 */
export interface DirectPeeringFacility {
  /**
   * The address of the direct peering facility.
   */
  address?: string;
  /**
   * The PeeringDB.com ID of the facility.
   */
  peeringDBFacilityId?: number;
  /**
   * The PeeringDB.com URL of the facility.
   */
  peeringDBFacilityLink?: string;
}

/**
 * The properties that define a peering bandwidth offer.
 */
export interface PeeringBandwidthOffer {
  /**
   * The name of the bandwidth offer.
   */
  offerName?: string;
  /**
   * The value of the bandwidth offer in Mbps.
   */
  valueInMbps?: number;
}

/**
 * The properties that define a direct peering location.
 */
export interface PeeringLocationPropertiesDirect {
  /**
   * The list of direct peering facilities at the peering location.
   */
  peeringFacilities?: DirectPeeringFacility[];
  /**
   * The list of bandwidth offers available at the peering location.
   */
  bandwidthOffers?: PeeringBandwidthOffer[];
}

/**
 * The properties that define an exchange peering facility.
 */
export interface ExchangePeeringFacility {
  /**
   * The name of the exchange peering facility.
   */
  exchangeName?: string;
  /**
   * The bandwidth of the connection between Microsoft and the exchange peering facility.
   */
  bandwidthInMbps?: number;
  /**
   * The IPv4 address of Microsoft at the exchange peering facility.
   */
  microsoftIPv4Address?: string;
  /**
   * The IPv6 address of Microsoft at the exchange peering facility.
   */
  microsoftIPv6Address?: string;
  /**
   * The IPv4 prefixes associated with the exchange peering facility.
   */
  facilityIPv4Prefix?: string;
  /**
   * The IPv6 prefixes associated with the exchange peering facility.
   */
  facilityIPv6Prefix?: string;
  /**
   * The PeeringDB.com ID of the facility.
   */
  peeringDBFacilityId?: number;
  /**
   * The PeeringDB.com URL of the facility.
   */
  peeringDBFacilityLink?: string;
}

/**
 * The properties that define an exchange peering location.
 */
export interface PeeringLocationPropertiesExchange {
  /**
   * The list of exchange peering facilities at the peering location.
   */
  peeringFacilities?: ExchangePeeringFacility[];
}

/**
 * Peering location is where connectivity could be established to the Microsoft Cloud Edge.
 */
export interface PeeringLocation {
  /**
   * The kind of peering that the peering location supports. Possible values include: 'Direct',
   * 'Exchange'
   */
  kind?: string;
  /**
   * The properties that define a direct peering location.
   */
  direct?: PeeringLocationPropertiesDirect;
  /**
   * The properties that define an exchange peering location.
   */
  exchange?: PeeringLocationPropertiesExchange;
  /**
   * The name of the peering location.
   */
  peeringLocation?: string;
  /**
   * The country in which the peering location exists.
   */
  country?: string;
  /**
   * The Azure region associated with the peering location.
   */
  azureRegion?: string;
  /**
   * The name of the resource.
   */
  readonly name?: string;
  /**
   * The ID of the resource.
   */
  readonly id?: string;
  /**
   * The type of the resource.
   */
  readonly type?: string;
}

/**
 * The resource tags.
 */
export interface ResourceTags {
  /**
   * Gets or sets the tags, a dictionary of descriptors arm object
   */
  tags?: { [propertyName: string]: string };
}

/**
 * The paginated list of peerings.
 */
export interface PeeringListResult extends Array<Peering> {
  /**
   * The link to fetch the next page of peerings.
   */
  nextLink?: string;
}

/**
 * The paginated list of peering API operations.
 */
export interface OperationListResult extends Array<Operation> {
  /**
   * The link to fetch the next page of peering API operations.
   */
  nextLink?: string;
}

/**
 * The paginated list of peering locations.
 */
export interface PeeringLocationListResult extends Array<PeeringLocation> {
  /**
   * The link to fetch the next page of peering locations.
   */
  nextLink?: string;
}
