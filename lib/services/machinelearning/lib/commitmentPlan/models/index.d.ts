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
 * Describes scaling information of a SKU.
 */
export interface SkuCapacity {
  /**
   * The minimum capacity.
   */
  readonly minimum?: number;
  /**
   * The maximum capacity that can be set.
   */
  readonly maximum?: number;
  /**
   * The default capacity.
   */
  readonly default?: number;
  /**
   * The scale type applicable to the sku. Possible values include: 'Automatic', 'Manual', 'None'
   */
  readonly scaleType?: string;
}

/**
 * Describes The SKU capabilities object.
 */
export interface SkuCapability {
  /**
   * The capability name.
   */
  readonly name?: string;
  /**
   * The capability value.
   */
  readonly value?: string;
}

/**
 * Describes metadata for SKU cost info.
 */
export interface SkuCost {
  /**
   * The meter used for this part of a SKU's cost.
   */
  readonly meterID?: string;
  /**
   * The multiplier for the meter ID.
   */
  readonly quantity?: number;
  /**
   * The overall duration represented by the quantity.
   */
  readonly extendedUnit?: string;
}

/**
 * Describes restrictions which would prevent a SKU from being used.
 */
export interface SkuRestrictions {
  /**
   * The type of restrictions. Possible values include: 'location', 'zone'
   */
  readonly type?: string;
  /**
   * The value of restrictions. If the restriction type is set to location. This would be different
   * locations where the SKU is restricted.
   */
  readonly values?: string[];
  /**
   * The reason for restriction. Possible values include: 'QuotaId', 'NotAvailableForSubscription'
   */
  readonly reasonCode?: string;
}

/**
 * Details of a commitment plan SKU.
 */
export interface CatalogSku {
  /**
   * Resource type name
   */
  readonly resourceType?: string;
  /**
   * SKU name
   */
  readonly name?: string;
  /**
   * SKU tier
   */
  readonly tier?: string;
  /**
   * Regions where the SKU is available.
   */
  readonly locations?: string[];
  /**
   * SKU scaling information
   */
  readonly capacity?: SkuCapacity;
  /**
   * The capability information for the specified SKU.
   */
  readonly capabilities?: SkuCapability[];
  /**
   * The cost information for the specified SKU.
   */
  readonly costs?: SkuCost[];
  /**
   * Restrictions which would prevent a SKU from being used. This is empty if there are no
   * restrictions.
   */
  readonly restrictions?: SkuRestrictions[];
}

/**
 * Common properties of an ARM resource.
 */
export interface Resource extends BaseResource {
  /**
   * Resource Id.
   */
  readonly id?: string;
  /**
   * Resource name.
   */
  readonly name?: string;
  /**
   * Resource location.
   */
  location: string;
  /**
   * Resource type.
   */
  readonly type?: string;
  /**
   * User-defined tags for the resource.
   */
  tags?: { [propertyName: string]: string };
}

/**
 * Properties of an Azure ML commitment association.
 */
export interface CommitmentAssociationProperties {
  /**
   * The ID of the resource this association points to, such as the ARM ID of an Azure ML web
   * service.
   */
  readonly associatedResourceId?: string;
  /**
   * The ARM ID of the parent Azure ML commitment plan.
   */
  readonly commitmentPlanId?: string;
  /**
   * The date at which this commitment association was created, in ISO 8601 format.
   */
  readonly creationDate?: Date;
}

/**
 * Represents the association between a commitment plan and some other resource, such as a Machine
 * Learning web service.
 */
export interface CommitmentAssociation extends Resource {
  /**
   * An entity tag used to enforce optimistic concurrency.
   */
  etag?: string;
  /**
   * The properties of the commitment association resource.
   */
  properties?: CommitmentAssociationProperties;
}

/**
 * The SKU of a resource.
 */
export interface ResourceSku {
  /**
   * The scale-out capacity of the resource. 1 is 1x, 2 is 2x, etc. This impacts the quantities and
   * cost of any commitment plan resource.
   */
  capacity?: number;
  /**
   * The SKU name. Along with tier, uniquely identifies the SKU.
   */
  name?: string;
  /**
   * The SKU tier. Along with name, uniquely identifies the SKU.
   */
  tier?: string;
}

/**
 * Specifies the destination Azure ML commitment plan for a move operation.
 */
export interface MoveCommitmentAssociationRequest {
  /**
   * The ARM ID of the commitment plan to re-parent the commitment association to.
   */
  destinationPlanId?: string;
}

/**
 * The properties of a commitment plan which may be updated via PATCH.
 */
export interface CommitmentPlanPatchPayload {
  /**
   * User-defined tags for the commitment plan.
   */
  tags?: { [propertyName: string]: string };
  /**
   * The commitment plan SKU.
   */
  sku?: ResourceSku;
}

/**
 * Represents the quantity a commitment plan provides of a metered resource.
 */
export interface PlanQuantity {
  /**
   * The quantity added to the commitment plan at an interval specified by its allowance frequency.
   */
  readonly allowance?: number;
  /**
   * The quantity available to the plan the last time usage was calculated.
   */
  readonly amount?: number;
  /**
   * The Azure meter for usage against included quantities.
   */
  readonly includedQuantityMeter?: string;
  /**
   * The Azure meter for usage which exceeds included quantities.
   */
  readonly overageMeter?: string;
}

/**
 * Properties of an Azure ML commitment plan.
 */
export interface CommitmentPlanProperties {
  /**
   * Indicates whether usage beyond the commitment plan's included quantities will be charged.
   */
  readonly chargeForOverage?: boolean;
  /**
   * Indicates whether the commitment plan will incur a charge.
   */
  readonly chargeForPlan?: boolean;
  /**
   * The date at which this commitment plan was created, in ISO 8601 format.
   */
  readonly creationDate?: Date;
  /**
   * The included resource quantities this plan gives you.
   */
  readonly includedQuantities?: { [propertyName: string]: PlanQuantity };
  /**
   * The maximum number of commitment associations that can be children of this commitment plan.
   */
  readonly maxAssociationLimit?: number;
  /**
   * The maximum scale-out capacity for this commitment plan.
   */
  readonly maxCapacityLimit?: number;
  /**
   * The minimum scale-out capacity for this commitment plan.
   */
  readonly minCapacityLimit?: number;
  /**
   * The Azure meter which will be used to charge for this commitment plan.
   */
  readonly planMeter?: string;
  /**
   * The frequency at which this commitment plan's included quantities are refilled.
   */
  readonly refillFrequencyInDays?: number;
  /**
   * Indicates whether this commitment plan will be moved into a suspended state if usage goes
   * beyond the commitment plan's included quantities.
   */
  readonly suspendPlanOnOverage?: boolean;
}

/**
 * An Azure ML commitment plan resource.
 */
export interface CommitmentPlan extends Resource {
  /**
   * An entity tag used to enforce optimistic concurrency.
   */
  etag?: string;
  /**
   * The commitment plan properties.
   */
  readonly properties?: CommitmentPlanProperties;
  /**
   * The commitment plan SKU.
   */
  sku?: ResourceSku;
}

/**
 * Represents historical information about usage of the Azure resources associated with a
 * commitment plan.
 */
export interface PlanUsageHistory {
  /**
   * Overage incurred as a result of deleting a commitment plan.
   */
  planDeletionOverage?: { [propertyName: string]: number };
  /**
   * Overage incurred as a result of migrating a commitment plan from one SKU to another.
   */
  planMigrationOverage?: { [propertyName: string]: number };
  /**
   * Included quantities remaining after usage against the commitment plan's associated resources
   * was calculated.
   */
  planQuantitiesAfterUsage?: { [propertyName: string]: number };
  /**
   * Included quantities remaining before usage against the commitment plan's associated resources
   * was calculated.
   */
  planQuantitiesBeforeUsage?: { [propertyName: string]: number };
  /**
   * Usage against the commitment plan's associated resources which was not covered by included
   * quantities and is therefore overage.
   */
  planUsageOverage?: { [propertyName: string]: number };
  /**
   * Usage against the commitment plan's associated resources.
   */
  usage?: { [propertyName: string]: number };
  /**
   * The date of usage, in ISO 8601 format.
   */
  usageDate?: Date;
}

/**
 * The API operation info.
 */
export interface OperationDisplayInfo {
  /**
   * The description of the operation.
   */
  readonly description?: string;
  /**
   * The action that users can perform, based on their permission level.
   */
  readonly operation?: string;
  /**
   * The service provider.
   */
  readonly provider?: string;
  /**
   * The resource on which the operation is performed.
   */
  readonly resource?: string;
}

/**
 * An API operation.
 */
export interface OperationEntity {
  /**
   * Operation name: {provider}/{resource}/{operation}.
   */
  readonly name?: string;
  /**
   * The API operation info.
   */
  display?: OperationDisplayInfo;
}

/**
 * The list of REST API operations.
 */
export interface OperationEntityListResult extends Array<OperationEntity> {
}

/**
 * The list of commitment plan SKUs.
 */
export interface SkuListResult extends Array<CatalogSku> {
}

/**
 * A page of commitment association resources.
 */
export interface CommitmentAssociationListResult extends Array<CommitmentAssociation> {
  /**
   * A URI to retrieve the next page of results.
   */
  nextLink?: string;
}

/**
 * A page of commitment plan resources.
 */
export interface CommitmentPlanListResult extends Array<CommitmentPlan> {
  /**
   * A URI to retrieve the next page of results.
   */
  nextLink?: string;
}

/**
 * A page of usage history.
 */
export interface PlanUsageHistoryListResult extends Array<PlanUsageHistory> {
  /**
   * A URI to retrieve the next page of results.
   */
  nextLink?: string;
}
