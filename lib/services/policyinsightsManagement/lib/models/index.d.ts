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
 * The policy details.
 */
export interface PolicyDetails {
  /**
   * The ID of the policy definition.
   */
  readonly policyDefinitionId?: string;
  /**
   * The ID of the policy assignment.
   */
  readonly policyAssignmentId?: string;
  /**
   * The display name of the policy assignment.
   */
  readonly policyAssignmentDisplayName?: string;
  /**
   * The scope of the policy assignment.
   */
  readonly policyAssignmentScope?: string;
  /**
   * The ID of the policy set definition.
   */
  readonly policySetDefinitionId?: string;
  /**
   * The policy definition reference ID within the policy set definition.
   */
  readonly policyDefinitionReferenceId?: string;
}

/**
 * The details of the policy triggered deployment that created or modified the tracked resource.
 */
export interface TrackedResourceModificationDetails {
  /**
   * The details of the policy that created or modified the tracked resource.
   */
  readonly policyDetails?: PolicyDetails;
  /**
   * The ID of the deployment that created or modified the tracked resource.
   */
  readonly deploymentId?: string;
  /**
   * Timestamp of the deployment that created or modified the tracked resource.
   */
  readonly deploymentTime?: Date;
}

/**
 * Policy tracked resource record.
 */
export interface PolicyTrackedResource {
  /**
   * The ID of the policy tracked resource.
   */
  readonly trackedResourceId?: string;
  /**
   * The details of the policy that require the tracked resource.
   */
  readonly policyDetails?: PolicyDetails;
  /**
   * The details of the policy triggered deployment that created the tracked resource.
   */
  readonly createdBy?: TrackedResourceModificationDetails;
  /**
   * The details of the policy triggered deployment that modified the tracked resource.
   */
  readonly lastModifiedBy?: TrackedResourceModificationDetails;
  /**
   * Timestamp of the last update to the tracked resource.
   */
  readonly lastUpdateUtc?: Date;
}

/**
 * Error definition.
 */
export interface QueryFailureError {
  /**
   * Service specific error code which serves as the substatus for the HTTP error code.
   */
  readonly code?: string;
  /**
   * Description of the error.
   */
  readonly message?: string;
}

/**
 * Error response.
 */
export interface QueryFailure {
  /**
   * Error definition.
   */
  error?: QueryFailureError;
}

/**
 * The filters that will be applied to determine which resources to remediate.
 */
export interface RemediationFilters {
  /**
   * The resource locations that will be remediated.
   */
  locations?: string[];
}

/**
 * The deployment status summary for all deployments created by the remediation.
 */
export interface RemediationDeploymentSummary {
  /**
   * The number of deployments required by the remediation.
   */
  totalDeployments?: number;
  /**
   * The number of deployments required by the remediation that have succeeded.
   */
  successfulDeployments?: number;
  /**
   * The number of deployments required by the remediation that have failed.
   */
  failedDeployments?: number;
}

/**
 * The remediation definition.
 */
export interface Remediation extends BaseResource {
  /**
   * The resource ID of the policy assignment that should be remediated.
   */
  policyAssignmentId?: string;
  /**
   * The policy definition reference ID of the individual definition that should be remediated.
   * Required when the policy assignment being remediated assigns a policy set definition.
   */
  policyDefinitionReferenceId?: string;
  /**
   * The status of the remediation.
   */
  readonly provisioningState?: string;
  /**
   * The time at which the remediation was created.
   */
  readonly createdOn?: Date;
  /**
   * The time at which the remediation was last updated.
   */
  readonly lastUpdatedOn?: Date;
  /**
   * The filters that will be applied to determine which resources to remediate.
   */
  filters?: RemediationFilters;
  /**
   * The deployment status summary for all deployments created by the remediation.
   */
  deploymentStatus?: RemediationDeploymentSummary;
  /**
   * The ID of the remediation.
   */
  readonly id?: string;
  /**
   * The type of the remediation.
   */
  readonly type?: string;
  /**
   * The name of the remediation.
   */
  readonly name?: string;
}

/**
 * Scenario specific error details.
 */
export interface TypedErrorInfo {
  /**
   * The type of included error details.
   */
  readonly type?: string;
  /**
   * The scenario specific error details.
   */
  readonly info?: any;
}

/**
 * Error definition.
 */
export interface ErrorDefinition {
  /**
   * Service specific error code which serves as the substatus for the HTTP error code.
   */
  readonly code?: string;
  /**
   * Description of the error.
   */
  readonly message?: string;
  /**
   * The target of the error.
   */
  readonly target?: string;
  /**
   * Internal error details.
   */
  readonly details?: ErrorDefinition[];
  /**
   * Additional scenario specific error details.
   */
  readonly additionalInfo?: TypedErrorInfo[];
}

/**
 * Details of a single deployment created by the remediation.
 */
export interface RemediationDeployment {
  /**
   * Resource ID of the resource that is being remediated by the deployment.
   */
  readonly remediatedResourceId?: string;
  /**
   * Resource ID of the template deployment that will remediate the resource.
   */
  readonly deploymentId?: string;
  /**
   * Status of the remediation deployment.
   */
  readonly status?: string;
  /**
   * Location of the resource that is being remediated.
   */
  readonly resourceLocation?: string;
  /**
   * Error encountered while remediated the resource.
   */
  readonly error?: ErrorDefinition;
  /**
   * The time at which the remediation was created.
   */
  readonly createdOn?: Date;
  /**
   * The time at which the remediation deployment was last updated.
   */
  readonly lastUpdatedOn?: Date;
}

/**
 * Error response.
 */
export interface ErrorResponse {
  /**
   * The error details.
   */
  error?: ErrorDefinition;
}

/**
 * Policy event record.
 */
export interface PolicyEvent {
  /**
   * OData entity ID; always set to null since policy event records do not have an entity ID.
   */
  odataid?: string;
  /**
   * OData context string; used by OData clients to resolve type information based on metadata.
   */
  odatacontext?: string;
  /**
   * Timestamp for the policy event record.
   */
  timestamp?: Date;
  /**
   * Resource ID.
   */
  resourceId?: string;
  /**
   * Policy assignment ID.
   */
  policyAssignmentId?: string;
  /**
   * Policy definition ID.
   */
  policyDefinitionId?: string;
  /**
   * Effective parameters for the policy assignment.
   */
  effectiveParameters?: string;
  /**
   * Flag which states whether the resource is compliant against the policy assignment it was
   * evaluated against.
   */
  isCompliant?: boolean;
  /**
   * Subscription ID.
   */
  subscriptionId?: string;
  /**
   * Resource type.
   */
  resourceType?: string;
  /**
   * Resource location.
   */
  resourceLocation?: string;
  /**
   * Resource group name.
   */
  resourceGroup?: string;
  /**
   * List of resource tags.
   */
  resourceTags?: string;
  /**
   * Policy assignment name.
   */
  policyAssignmentName?: string;
  /**
   * Policy assignment owner.
   */
  policyAssignmentOwner?: string;
  /**
   * Policy assignment parameters.
   */
  policyAssignmentParameters?: string;
  /**
   * Policy assignment scope.
   */
  policyAssignmentScope?: string;
  /**
   * Policy definition name.
   */
  policyDefinitionName?: string;
  /**
   * Policy definition action, i.e. effect.
   */
  policyDefinitionAction?: string;
  /**
   * Policy definition category.
   */
  policyDefinitionCategory?: string;
  /**
   * Policy set definition ID, if the policy assignment is for a policy set.
   */
  policySetDefinitionId?: string;
  /**
   * Policy set definition name, if the policy assignment is for a policy set.
   */
  policySetDefinitionName?: string;
  /**
   * Policy set definition owner, if the policy assignment is for a policy set.
   */
  policySetDefinitionOwner?: string;
  /**
   * Policy set definition category, if the policy assignment is for a policy set.
   */
  policySetDefinitionCategory?: string;
  /**
   * Policy set definition parameters, if the policy assignment is for a policy set.
   */
  policySetDefinitionParameters?: string;
  /**
   * Comma separated list of management group IDs, which represent the hierarchy of the management
   * groups the resource is under.
   */
  managementGroupIds?: string;
  /**
   * Reference ID for the policy definition inside the policy set, if the policy assignment is for
   * a policy set.
   */
  policyDefinitionReferenceId?: string;
  /**
   * Tenant ID for the policy event record.
   */
  tenantId?: string;
  /**
   * Principal object ID for the user who initiated the resource operation that triggered the
   * policy event.
   */
  principalOid?: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
   */
  [additionalPropertyName: string]: any;
}

/**
 * Query results.
 */
export interface PolicyEventsQueryResults {
  /**
   * OData context string; used by OData clients to resolve type information based on metadata.
   */
  odatacontext?: string;
  /**
   * OData entity count; represents the number of policy event records returned.
   */
  odatacount?: number;
  /**
   * Query results.
   */
  value?: PolicyEvent[];
}

/**
 * Evaluation details of policy language expressions.
 */
export interface ExpressionEvaluationDetails {
  /**
   * Evaluation result.
   */
  result?: string;
  /**
   * Expression evaluated.
   */
  expression?: string;
  /**
   * Property path if the expression is a field or an alias.
   */
  path?: string;
  /**
   * Value of the expression.
   */
  expressionValue?: string;
  /**
   * Target value to be compared with the expression value.
   */
  targetValue?: string;
  /**
   * Operator to compare the expression value and the target value.
   */
  operator?: string;
}

/**
 * Evaluation details of IfNotExists effect.
 */
export interface IfNotExistsEvaluationDetails {
  /**
   * ID of the last evaluated resource for IfNotExists effect.
   */
  resourceId?: string;
  /**
   * Total number of resources to which the existence condition is applicable.
   */
  totalResources?: number;
}

/**
 * Policy evaluation details.
 */
export interface PolicyEvaluationDetails {
  /**
   * Details of the evaluated expressions.
   */
  evaluatedExpressions?: ExpressionEvaluationDetails[];
  /**
   * Evaluation details of IfNotExists effect.
   */
  ifNotExistsDetails?: IfNotExistsEvaluationDetails;
}

/**
 * Policy state record.
 */
export interface PolicyState {
  /**
   * OData entity ID; always set to null since policy state records do not have an entity ID.
   */
  odataid?: string;
  /**
   * OData context string; used by OData clients to resolve type information based on metadata.
   */
  odatacontext?: string;
  /**
   * Timestamp for the policy state record.
   */
  timestamp?: Date;
  /**
   * Resource ID.
   */
  resourceId?: string;
  /**
   * Policy assignment ID.
   */
  policyAssignmentId?: string;
  /**
   * Policy definition ID.
   */
  policyDefinitionId?: string;
  /**
   * Effective parameters for the policy assignment.
   */
  effectiveParameters?: string;
  /**
   * Flag which states whether the resource is compliant against the policy assignment it was
   * evaluated against.
   */
  isCompliant?: boolean;
  /**
   * Subscription ID.
   */
  subscriptionId?: string;
  /**
   * Resource type.
   */
  resourceType?: string;
  /**
   * Resource location.
   */
  resourceLocation?: string;
  /**
   * Resource group name.
   */
  resourceGroup?: string;
  /**
   * List of resource tags.
   */
  resourceTags?: string;
  /**
   * Policy assignment name.
   */
  policyAssignmentName?: string;
  /**
   * Policy assignment owner.
   */
  policyAssignmentOwner?: string;
  /**
   * Policy assignment parameters.
   */
  policyAssignmentParameters?: string;
  /**
   * Policy assignment scope.
   */
  policyAssignmentScope?: string;
  /**
   * Policy definition name.
   */
  policyDefinitionName?: string;
  /**
   * Policy definition action, i.e. effect.
   */
  policyDefinitionAction?: string;
  /**
   * Policy definition category.
   */
  policyDefinitionCategory?: string;
  /**
   * Policy set definition ID, if the policy assignment is for a policy set.
   */
  policySetDefinitionId?: string;
  /**
   * Policy set definition name, if the policy assignment is for a policy set.
   */
  policySetDefinitionName?: string;
  /**
   * Policy set definition owner, if the policy assignment is for a policy set.
   */
  policySetDefinitionOwner?: string;
  /**
   * Policy set definition category, if the policy assignment is for a policy set.
   */
  policySetDefinitionCategory?: string;
  /**
   * Policy set definition parameters, if the policy assignment is for a policy set.
   */
  policySetDefinitionParameters?: string;
  /**
   * Comma separated list of management group IDs, which represent the hierarchy of the management
   * groups the resource is under.
   */
  managementGroupIds?: string;
  /**
   * Reference ID for the policy definition inside the policy set, if the policy assignment is for
   * a policy set.
   */
  policyDefinitionReferenceId?: string;
  /**
   * Compliance state of the resource.
   */
  complianceState?: string;
  /**
   * Policy evaluation details.
   */
  policyEvaluationDetails?: PolicyEvaluationDetails;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
   */
  [additionalPropertyName: string]: any;
}

/**
 * Query results.
 */
export interface PolicyStatesQueryResults {
  /**
   * OData context string; used by OData clients to resolve type information based on metadata.
   */
  odatacontext?: string;
  /**
   * OData entity count; represents the number of policy state records returned.
   */
  odatacount?: number;
  /**
   * Query results.
   */
  value?: PolicyState[];
}

/**
 * Non-compliance summary on a particular summary level.
 */
export interface SummaryResults {
  /**
   * HTTP POST URI for queryResults action on Microsoft.PolicyInsights to retrieve raw results for
   * the non-compliance summary.
   */
  queryResultsUri?: string;
  /**
   * Number of non-compliant resources.
   */
  nonCompliantResources?: number;
  /**
   * Number of non-compliant policies.
   */
  nonCompliantPolicies?: number;
}

/**
 * Policy definition summary.
 */
export interface PolicyDefinitionSummary {
  /**
   * Policy definition ID.
   */
  policyDefinitionId?: string;
  /**
   * Policy definition reference ID.
   */
  policyDefinitionReferenceId?: string;
  /**
   * Policy effect, i.e. policy definition action.
   */
  effect?: string;
  /**
   * Non-compliance summary for the policy definition.
   */
  results?: SummaryResults;
}

/**
 * Policy assignment summary.
 */
export interface PolicyAssignmentSummary {
  /**
   * Policy assignment ID.
   */
  policyAssignmentId?: string;
  /**
   * Policy set definition ID, if the policy assignment is for a policy set.
   */
  policySetDefinitionId?: string;
  /**
   * Non-compliance summary for the policy assignment.
   */
  results?: SummaryResults;
  /**
   * Policy definitions summary.
   */
  policyDefinitions?: PolicyDefinitionSummary[];
}

/**
 * Summary results.
 */
export interface Summary {
  /**
   * OData entity ID; always set to null since summaries do not have an entity ID.
   */
  odataid?: string;
  /**
   * OData context string; used by OData clients to resolve type information based on metadata.
   */
  odatacontext?: string;
  /**
   * Non-compliance summary for all policy assignments.
   */
  results?: SummaryResults;
  /**
   * Policy assignments summary.
   */
  policyAssignments?: PolicyAssignmentSummary[];
}

/**
 * Summarize action results.
 */
export interface SummarizeResults {
  /**
   * OData context string; used by OData clients to resolve type information based on metadata.
   */
  odatacontext?: string;
  /**
   * OData entity count; represents the number of summaries returned; always set to 1.
   */
  odatacount?: number;
  /**
   * Summarize action results.
   */
  value?: Summary[];
}

/**
 * Display metadata associated with the operation.
 */
export interface OperationDisplay {
  /**
   * Resource provider name.
   */
  provider?: string;
  /**
   * Resource name on which the operation is performed.
   */
  resource?: string;
  /**
   * Operation name.
   */
  operation?: string;
  /**
   * Operation description.
   */
  description?: string;
}

/**
 * Operation definition.
 */
export interface Operation {
  /**
   * Operation name.
   */
  name?: string;
  /**
   * Display metadata associated with the operation.
   */
  display?: OperationDisplay;
}

/**
 * List of available operations.
 */
export interface OperationsListResults {
  /**
   * OData entity count; represents the number of operations returned.
   */
  odatacount?: number;
  /**
   * List of available operations.
   */
  value?: Operation[];
}

/**
 * Additional parameters for a set of operations.
 */
export interface QueryOptions {
  /**
   * Maximum number of records to return.
   */
  top?: number;
  /**
   * OData filter expression.
   */
  filter?: string;
  /**
   * Ordering expression using OData notation. One or more comma-separated column names with an
   * optional "desc" (the default) or "asc", e.g. "$orderby=PolicyAssignmentId, ResourceId asc".
   */
  orderBy?: string;
  /**
   * Select expression using OData notation. Limits the columns on each record to just those
   * requested, e.g. "$select=PolicyAssignmentId, ResourceId".
   */
  select?: string;
  /**
   * ISO 8601 formatted timestamp specifying the start time of the interval to query. When not
   * specified, the service uses ($to - 1-day).
   */
  from?: Date;
  /**
   * ISO 8601 formatted timestamp specifying the end time of the interval to query. When not
   * specified, the service uses request time.
   */
  to?: Date;
  /**
   * OData apply expression for aggregations.
   */
  apply?: string;
  /**
   * The $expand query parameter. For example, to expand policyEvaluationDetails, use
   * $expand=policyEvaluationDetails
   */
  expand?: string;
}

/**
 * Query results.
 */
export interface PolicyTrackedResourcesQueryResults extends Array<PolicyTrackedResource> {
  /**
   * The URL to get the next set of results.
   */
  readonly nextLink?: string;
}

/**
 * List of deployments for a remediation.
 */
export interface RemediationDeploymentsListResult extends Array<RemediationDeployment> {
  /**
   * The URL to get the next set of results.
   */
  readonly nextLink?: string;
}

/**
 * List of remediations.
 */
export interface RemediationListResult extends Array<Remediation> {
  /**
   * The URL to get the next set of results.
   */
  readonly nextLink?: string;
}
