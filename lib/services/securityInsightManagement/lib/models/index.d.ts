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
 * Properties of the operation
 */
export interface OperationDisplay {
  /**
   * Provider name
   */
  provider?: string;
  /**
   * Resource name
   */
  resource?: string;
  /**
   * Operation name
   */
  operation?: string;
  /**
   * Description of the operation
   */
  description?: string;
}

/**
 * Operation provided by provider
 */
export interface Operation {
  /**
   * Name of the operation
   */
  name?: string;
  /**
   * Properties of the operation
   */
  display?: OperationDisplay;
}

/**
 * Alert rule.
 */
export interface AlertRule {
  /**
   * Azure resource Id
   */
  readonly id?: string;
  /**
   * Azure resource type
   */
  readonly type?: string;
  /**
   * Azure resource name
   */
  readonly name?: string;
  /**
   * Etag of the alert rule.
   */
  etag?: string;
  /**
   * Polymorphic Discriminator
   */
  kind: string;
}

/**
 * Describes an Azure resource with kind.
 */
export interface AlertRuleKind1 {
  /**
   * The kind of the alert rule. Possible values include: 'Scheduled'
   */
  kind?: string;
}

/**
 * Represents scheduled alert rule.
 */
export interface ScheduledAlertRule extends AlertRule {
  /**
   * The display name for alerts created by this alert rule.
   */
  displayName: string;
  /**
   * The description of the alert rule.
   */
  description: string;
  /**
   * The severity for alerts created by this alert rule. Possible values include: 'High', 'Medium',
   * 'Low', 'Informational'
   */
  severity: string;
  /**
   * Determines whether this alert rule is enabled or disabled.
   */
  enabled: boolean;
  /**
   * The query that creates alerts for this rule.
   */
  query: string;
  /**
   * The frequency (in ISO 8601 duration format) for this alert rule to run.
   */
  queryFrequency: moment.Duration;
  /**
   * The period (in ISO 8601 duration format) that this alert rule looks at.
   */
  queryPeriod: moment.Duration;
  /**
   * The operation against the threshold that triggers alert rule. Possible values include:
   * 'GreaterThan', 'LessThan', 'Equal', 'NotEqual'
   */
  triggerOperator: string;
  /**
   * The threshold triggers this alert rule.
   */
  triggerThreshold: number;
  /**
   * Determines whether the suppression for this alert rule is enabled or disabled.
   */
  suppressionEnabled: boolean;
  /**
   * The suppression (in ISO 8601 duration format) to wait since last time this alert rule been
   * triggered.
   */
  suppressionDuration: moment.Duration;
  /**
   * The last time that this alert has been modified.
   */
  readonly lastModifiedUtc?: string;
}

/**
 * An azure resource object
 */
export interface Resource extends BaseResource {
  /**
   * Azure resource Id
   */
  readonly id?: string;
  /**
   * Azure resource type
   */
  readonly type?: string;
  /**
   * Azure resource name
   */
  readonly name?: string;
}

/**
 * Action for alert rule.
 */
export interface Action extends Resource {
  /**
   * Etag of the action.
   */
  etag?: string;
  /**
   * The uri for the action to trigger.
   */
  triggerUri?: string;
}

/**
 * User information that made some action
 */
export interface UserInfo {
  /**
   * The object id of the user.
   */
  objectId?: string;
  /**
   * The email of the user.
   */
  email?: string;
  /**
   * The name of the user.
   */
  name?: string;
}

/**
 * Represents a case in Azure Security Insights.
 */
export interface CaseModel extends Resource {
  /**
   * Etag of the alert rule.
   */
  etag?: string;
  /**
   * The last time the case was updated
   */
  lastUpdatedTimeUtc?: Date;
  /**
   * The time the case was created
   */
  createdTimeUtc?: Date;
  /**
   * The end time of the case
   */
  endTimeUtc?: Date;
  /**
   * The start time of the case
   */
  startTimeUtc?: Date;
  /**
   * List of labels relevant to this case
   */
  labels?: string[];
  /**
   * The description of the case
   */
  description?: string;
  /**
   * The title of the case
   */
  title: string;
  /**
   * Describes a user that the case is assigned to
   */
  assignedTo?: UserInfo;
  /**
   * The severity of the case. Possible values include: 'Critical', 'High', 'Medium', 'Low',
   * 'Informational'
   */
  severity: string;
  /**
   * The status of the case. Possible values include: 'Draft', 'Open', 'InProgress', 'Closed'
   */
  status: string;
  /**
   * The reason the case was closed. Possible values include: 'Resolved', 'Dismissed', 'Other'
   */
  closeReason?: string;
}

/**
 * Represents a bookmark in Azure Security Insights.
 */
export interface Bookmark extends Resource {
  /**
   * Etag of the bookmark.
   */
  etag?: string;
  /**
   * The display name of the bookmark
   */
  displayName: string;
  /**
   * The last time the bookmark was updated
   */
  lastUpdatedTimeUtc?: Date;
  /**
   * The time the bookmark was created
   */
  createdTimeUtc?: Date;
  /**
   * Describes a user that created the bookmark
   */
  createdBy?: UserInfo;
  /**
   * Describes a user that updated the bookmark
   */
  updatedBy?: UserInfo;
  /**
   * The notes of the bookmark
   */
  notes?: string;
  /**
   * List of labels relevant to this bookmark
   */
  labels?: string[];
  /**
   * The query of the bookmark.
   */
  query: string;
}

/**
 * Data connector.
 */
export interface DataConnector {
  /**
   * Azure resource Id
   */
  readonly id?: string;
  /**
   * Azure resource type
   */
  readonly type?: string;
  /**
   * Azure resource name
   */
  readonly name?: string;
  /**
   * Etag of the data connector.
   */
  etag?: string;
  /**
   * Polymorphic Discriminator
   */
  kind: string;
}

/**
 * Describes an Azure resource with kind.
 */
export interface DataConnectorKind1 {
  /**
   * The kind of the data connector. Possible values include: 'AzureActiveDirectory',
   * 'AzureSecurityCenter', 'MicrosoftCloudAppSecurity', 'ThreatIntelligence', 'Office365'
   */
  kind?: string;
}

/**
 * Properties data connector on tenant level.
 */
export interface DataConnectorTenantId {
  /**
   * The tenant id to connect to, and get the data from.
   */
  tenantId?: string;
}

/**
 * Common field for data type in data connectors.
 */
export interface DataConnectorDataTypeCommon {
  /**
   * Describe whether this data type connection is enabled or not. Possible values include:
   * 'Enabled', 'Disabled'
   */
  state?: string;
}

/**
 * SharePoint data type connection.
 */
export interface OfficeDataConnectorDataTypesSharePoint extends DataConnectorDataTypeCommon {
}

/**
 * Exchange data type connection.
 */
export interface OfficeDataConnectorDataTypesExchange extends DataConnectorDataTypeCommon {
}

/**
 * The available data types for office data connector.
 */
export interface OfficeDataConnectorDataTypes {
  /**
   * SharePoint data type connection.
   */
  sharePoint?: OfficeDataConnectorDataTypesSharePoint;
  /**
   * Exchange data type connection.
   */
  exchange?: OfficeDataConnectorDataTypesExchange;
}

/**
 * Represents office data connector.
 */
export interface OfficeDataConnector extends DataConnector {
  /**
   * The tenant id to connect to, and get the data from.
   */
  tenantId?: string;
  /**
   * The available data types for the connector.
   */
  dataTypes?: OfficeDataConnectorDataTypes;
}

/**
 * Data type for indicators connection.
 */
export interface TIDataConnectorDataTypesIndicators extends DataConnectorDataTypeCommon {
}

/**
 * The available data types for TI (Threat Intelligence) data connector.
 */
export interface TIDataConnectorDataTypes {
  /**
   * Data type for indicators connection.
   */
  indicators?: TIDataConnectorDataTypesIndicators;
}

/**
 * Represents threat intelligence data connector.
 */
export interface TIDataConnector extends DataConnector {
  /**
   * The tenant id to connect to, and get the data from.
   */
  tenantId?: string;
  /**
   * The available data types for the connector.
   */
  dataTypes?: TIDataConnectorDataTypes;
}

/**
 * Alerts data type connection.
 */
export interface AlertsDataTypeOfDataConnectorAlerts extends DataConnectorDataTypeCommon {
}

/**
 * Alerts data type for data connectors.
 */
export interface AlertsDataTypeOfDataConnector {
  /**
   * Alerts data type connection.
   */
  alerts?: AlertsDataTypeOfDataConnectorAlerts;
}

/**
 * Represents AAD (Azure Active Directory) data connector.
 */
export interface AADDataConnector extends DataConnector {
  /**
   * The tenant id to connect to, and get the data from.
   */
  tenantId?: string;
  /**
   * The available data types for the connector.
   */
  dataTypes?: AlertsDataTypeOfDataConnector;
}

/**
 * Represents ASC (Azure Security Center) data connector.
 */
export interface ASCDataConnector extends DataConnector {
  /**
   * The available data types for the connector.
   */
  dataTypes?: AlertsDataTypeOfDataConnector;
  /**
   * The subscription id to connect to, and get the data from.
   */
  subscriptionId?: string;
}

/**
 * Represents MCAS (Microsoft Cloud App Security) data connector.
 */
export interface MCASDataConnector extends DataConnector {
  /**
   * The tenant id to connect to, and get the data from.
   */
  tenantId?: string;
  /**
   * The available data types for the connector.
   */
  dataTypes?: AlertsDataTypeOfDataConnector;
}

/**
 * Data connector properties.
 */
export interface DataConnectorWithAlertsProperties {
  /**
   * The available data types for the connector.
   */
  dataTypes?: AlertsDataTypeOfDataConnector;
}

/**
 * Specific entity.
 */
export interface Entity {
  /**
   * Azure resource Id
   */
  readonly id?: string;
  /**
   * Azure resource type
   */
  readonly type?: string;
  /**
   * Azure resource name
   */
  readonly name?: string;
  /**
   * Polymorphic Discriminator
   */
  kind: string;
}

/**
 * Describes an Azure resource with kind.
 */
export interface EntityKind1 {
  /**
   * The kind of the entity. Possible values include: 'Account', 'Host', 'File'
   */
  kind?: string;
}

/**
 * Represents an account entity.
 */
export interface AccountEntity extends Entity {
  /**
   * The name of the account. This field should hold only the name without any domain added to it,
   * i.e. administrator.
   */
  readonly accountName?: string;
  /**
   * The NetBIOS domain name as it appears in the alert format – domain\username. Examples: NT
   * AUTHORITY.
   */
  readonly ntDomain?: string;
  /**
   * The user principal name suffix for the account, in some cases it is also the domain name.
   * Examples: contoso.com.
   */
  readonly upnSuffix?: string;
  /**
   * The account security identifier, e.g. S-1-5-18.
   */
  readonly sid?: string;
  /**
   * The Azure Active Directory tenant id.
   */
  readonly aadTenantId?: string;
  /**
   * The Azure Active Directory user id.
   */
  readonly aadUserId?: string;
  /**
   * The Azure Active Directory Passport User ID.
   */
  readonly puid?: string;
  /**
   * Determines whether this is a domain account.
   */
  readonly isDomainJoined?: boolean;
  /**
   * The objectGUID attribute is a single-value attribute that is the unique identifier for the
   * object, assigned by active directory.
   */
  readonly objectGuid?: string;
}

/**
 * Represents a host entity.
 */
export interface HostEntity extends Entity {
  /**
   * The DNS domain that this host belongs to. Should contain the compete DNS suffix for the domain
   */
  readonly dnsDomain?: string;
  /**
   * The NT domain that this host belongs to.
   */
  readonly ntDomain?: string;
  /**
   * The hostname without the domain suffix.
   */
  readonly hostName?: string;
  /**
   * The host name (pre-windows2000).
   */
  readonly netBiosName?: string;
  /**
   * The azure resource id of the VM.
   */
  readonly azureID?: string;
  /**
   * The OMS agent id, if the host has OMS agent installed.
   */
  readonly omsAgentID?: string;
  /**
   * The operating system type. Possible values include: 'Linux', 'Windows', 'Android', 'IOS'
   */
  osFamily?: string;
  /**
   * A free text representation of the operating system. This field is meant to hold specific
   * versions the are more fine grained than OSFamily or future values not supported by OSFamily
   * enumeration
   */
  readonly osVersion?: string;
  /**
   * Determines whether this host belongs to a domain.
   */
  readonly isDomainJoined?: boolean;
}

/**
 * Represents a file entity.
 */
export interface FileEntity extends Entity {
  /**
   * The full path to the file.
   */
  readonly directory?: string;
  /**
   * The file name without path (some alerts might not include path).
   */
  readonly fileName?: string;
}

/**
 * Consent for Office365 tenant that already made.
 */
export interface OfficeConsent extends Resource {
  /**
   * The tenantId of the Office365 with the consent.
   */
  tenantId?: string;
  /**
   * The tenant name of the Office365 with the consent.
   */
  readonly tenantName?: string;
}

/**
 * The Setting.
 */
export interface Settings {
  /**
   * Azure resource Id
   */
  readonly id?: string;
  /**
   * Azure resource type
   */
  readonly type?: string;
  /**
   * Azure resource name
   */
  readonly name?: string;
  /**
   * Polymorphic Discriminator
   */
  kind: string;
}

/**
 * Describes an Azure resource with kind.
 */
export interface SettingsKind {
  /**
   * The kind of the setting. Possible values include: 'UebaSettings', 'ToggleSettings'
   */
  kind?: string;
}

/**
 * Represents settings for User and Entity Behavior Analytics enablement.
 */
export interface UebaSettings extends Settings {
  /**
   * Determines whether User and Entity Behavior Analytics is enabled for this workspace.
   */
  isEnabled?: boolean;
  /**
   * Determines whether User and Entity Behavior Analytics is enabled from MCAS (Microsoft Cloud
   * App Security). Possible values include: 'Enabled', 'Disabled'
   */
  readonly statusInMcas?: string;
  /**
   * Determines whether the tenant has ATP (Advanced Threat Protection) license.
   */
  readonly atpLicenseStatus?: boolean;
}

/**
 * Settings with single toggle.
 */
export interface ToggleSettings extends Settings {
  /**
   * Determines whether the setting is enable or disabled.
   */
  isEnabled?: boolean;
}

/**
 * Lists the operations available in the SecurityInsights RP.
 */
export interface OperationsList extends Array<Operation> {
  /**
   * URL to fetch the next set of operations.
   */
  nextLink?: string;
}

/**
 * List all the alert rules.
 */
export interface AlertRulesList extends Array<AlertRule> {
  /**
   * URL to fetch the next set of alert rules.
   */
  readonly nextLink?: string;
}

/**
 * List all the actions.
 */
export interface ActionsList extends Array<Action> {
  /**
   * URL to fetch the next set of actions.
   */
  readonly nextLink?: string;
}

/**
 * List all the cases.
 */
export interface CaseList extends Array<CaseModel> {
  /**
   * URL to fetch the next set of cases.
   */
  readonly nextLink?: string;
}

/**
 * List all the bookmarks.
 */
export interface BookmarkList extends Array<Bookmark> {
  /**
   * URL to fetch the next set of cases.
   */
  readonly nextLink?: string;
}

/**
 * List all the data connectors.
 */
export interface DataConnectorList extends Array<DataConnector> {
  /**
   * URL to fetch the next set of data connectors.
   */
  readonly nextLink?: string;
}

/**
 * List of all the entities.
 */
export interface EntityList extends Array<Entity> {
  /**
   * URL to fetch the next set of entities.
   */
  readonly nextLink?: string;
}

/**
 * List of all the office365 consents.
 */
export interface OfficeConsentList extends Array<OfficeConsent> {
  /**
   * URL to fetch the next set of office consents.
   */
  readonly nextLink?: string;
}
