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
 * Active Directory error information.
 */
export interface GraphError {
  /**
   * Error code.
   */
  code?: string;
  /**
   * Error message value.
   */
  message?: string;
}

/**
 * Represents an Azure Active Directory object.
 */
export interface DirectoryObject {
  /**
   * The object ID.
   */
  readonly objectId?: string;
  /**
   * The time at which the directory object was deleted.
   */
  readonly deletionTimestamp?: Date;
  /**
   * Polymorphic Discriminator
   */
  objectType: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
   */
  [additionalPropertyName: string]: any;
}

/**
 * Active Directory Key Credential information.
 */
export interface KeyCredential {
  /**
   * Start date.
   */
  startDate?: Date;
  /**
   * End date.
   */
  endDate?: Date;
  /**
   * Key value.
   */
  value?: string;
  /**
   * Key ID.
   */
  keyId?: string;
  /**
   * Usage. Acceptable values are 'Verify' and 'Sign'.
   */
  usage?: string;
  /**
   * Type. Acceptable values are 'AsymmetricX509Cert' and 'Symmetric'.
   */
  type?: string;
  /**
   * Custom Key Identifier
   */
  customKeyIdentifier?: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
   */
  [additionalPropertyName: string]: any;
}

/**
 * Active Directory Password Credential information.
 */
export interface PasswordCredential {
  /**
   * Start date.
   */
  startDate?: Date;
  /**
   * End date.
   */
  endDate?: Date;
  /**
   * Key ID.
   */
  keyId?: string;
  /**
   * Key value.
   */
  value?: string;
  /**
   * Custom Key Identifier
   */
  customKeyIdentifier?: Buffer;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
   */
  [additionalPropertyName: string]: any;
}

/**
 * Specifies an OAuth 2.0 permission scope or an app role that an application requires. The
 * resourceAccess property of the RequiredResourceAccess type is a collection of ResourceAccess.
 */
export interface ResourceAccess {
  /**
   * The unique identifier for one of the OAuth2Permission or AppRole instances that the resource
   * application exposes.
   */
  id: string;
  /**
   * Specifies whether the id property references an OAuth2Permission or an AppRole. Possible
   * values are "scope" or "role".
   */
  type?: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
   */
  [additionalPropertyName: string]: any;
}

/**
 * Specifies the set of OAuth 2.0 permission scopes and app roles under the specified resource that
 * an application requires access to. The specified OAuth 2.0 permission scopes may be requested by
 * client applications (through the requiredResourceAccess collection) when calling a resource
 * application. The requiredResourceAccess property of the Application entity is a collection of
 * RequiredResourceAccess.
 */
export interface RequiredResourceAccess {
  /**
   * The list of OAuth2.0 permission scopes and app roles that the application requires from the
   * specified resource.
   */
  resourceAccess: ResourceAccess[];
  /**
   * The unique identifier for the resource that the application requires access to. This should be
   * equal to the appId declared on the target resource application.
   */
  resourceAppId?: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
   */
  [additionalPropertyName: string]: any;
}

export interface AppRole {
  /**
   * Unique role identifier inside the appRoles collection.
  */
  id?: string;
  /**
   * Specifies whether this app role definition can be assigned to users and groups by setting to
   * 'User', or to other applications (that are accessing this application in daemon service
   * scenarios) by setting to 'Application', or to both.
  */
  allowedMemberTypes?: string[];
  /**
   * Permission help text that appears in the admin app assignment and consent experiences.
  */
  description?: string;
  /**
   * Display name for the permission that appears in the admin consent and app assignment
   * experiences.
  */
  displayName?: string;
  /**
   * When creating or updating a role definition, this must be set to true (which is the default).
   * To delete a role, this must first be set to false. At that point, in a subsequent call, this
   * role may be removed.
  */
  isEnabled?: boolean;
  /**
   * Specifies the value of the roles claim that the application should expect in the
   * authentication and access tokens.
  */
  value?: string;
}

/**
 * Request parameters for creating a new application.
*/
export interface ApplicationCreateParameters {
  /**
   * The collection of application roles that an application may declare. These roles can be
   * assigned to users, groups or service principals.
  */
  appRoles?: AppRole[];
  /**
   * Whether the application is available to other tenants.
  */
  availableToOtherTenants: boolean;
  /**
   * The display name of the application.
  */
  displayName: string;
  /**
   * The home page of the application.
  */
  homepage?: string;
  /**
   * A collection of URIs for the application.
  */
  identifierUris: string[];
  /**
   * A collection of reply URLs for the application.
  */
  replyUrls?: string[];
  /**
   * The list of KeyCredential objects.
  */
  keyCredentials?: KeyCredential[];
  /**
   * The list of PasswordCredential objects.
  */
  passwordCredentials?: PasswordCredential[];
  /**
   * Whether to allow implicit grant flow for OAuth2
  */
  oauth2AllowImplicitFlow?: boolean;
  /**
   * Specifies resources that this application requires access to and the set of OAuth permission
   * scopes and application roles that it needs under each of those resources. This
   * pre-configuration of required resource access drives the consent experience.
  */
  requiredResourceAccess?: RequiredResourceAccess[];
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Request parameters for updating an existing application.
*/
export interface ApplicationUpdateParameters {
  /**
   * The collection of application roles that an application may declare. These roles can be
   * assigned to users, groups or service principals.
  */
  appRoles?: AppRole[];
  /**
   * Whether the application is available to other tenants
  */
  availableToOtherTenants?: boolean;
  /**
   * The display name of the application.
  */
  displayName?: string;
  /**
   * The home page of the application.
  */
  homepage?: string;
  /**
   * A collection of URIs for the application.
  */
  identifierUris?: string[];
  /**
   * A collection of reply URLs for the application.
  */
  replyUrls?: string[];
  /**
   * The list of KeyCredential objects.
  */
  keyCredentials?: KeyCredential[];
  /**
   * The list of PasswordCredential objects.
  */
  passwordCredentials?: PasswordCredential[];
  /**
   * Whether to allow implicit grant flow for OAuth2
  */
  oauth2AllowImplicitFlow?: boolean;
  /**
   * Specifies resources that this application requires access to and the set of OAuth permission
   * scopes and application roles that it needs under each of those resources. This
   * pre-configuration of required resource access drives the consent experience.
  */
  requiredResourceAccess?: RequiredResourceAccess[];
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Active Directory application information.
*/
export interface Application extends DirectoryObject {
  /**
   * The application ID.
  */
  appId?: string;
  /**
   * The collection of application roles that an application may declare. These roles can be
   * assigned to users, groups or service principals.
  */
  appRoles?: AppRole[];
  /**
   * The application permissions.
  */
  appPermissions?: string[];
  /**
   * Whether the application is be available to other tenants.
  */
  availableToOtherTenants?: boolean;
  /**
   * The display name of the application.
  */
  displayName?: string;
  /**
   * A collection of URIs for the application.
  */
  identifierUris?: string[];
  /**
   * A collection of reply URLs for the application.
  */
  replyUrls?: string[];
  /**
   * The home page of the application.
  */
  homepage?: string;
  /**
   * Whether to allow implicit grant flow for OAuth2
  */
  oauth2AllowImplicitFlow?: boolean;
  /**
   * Specifies resources that this application requires access to and the set of OAuth permission
   * scopes and application roles that it needs under each of those resources. This
   * pre-configuration of required resource access drives the consent experience.
  */
  requiredResourceAccess?: RequiredResourceAccess[];
  /**
   * A collection of KeyCredential objects.
  */
  keyCredentials?: KeyCredential[];
  /**
   * A collection of PasswordCredential objects
  */
  passwordCredentials?: PasswordCredential[];
}

/**
 * Request parameters for adding a owner to an application.
*/
export interface AddOwnerParameters {
  /**
   * A owner object URL, such as
   * "https://graph.windows.net/0b1f9851-1bf0-433f-aec3-cb9272f093dc/directoryObjects/f260bbc4-c254-447b-94cf-293b5ec434dd",
   * where "0b1f9851-1bf0-433f-aec3-cb9272f093dc" is the tenantId and
   * "f260bbc4-c254-447b-94cf-293b5ec434dd" is the objectId of the owner (user, application,
   * servicePrincipal, group) to be added.
  */
  url: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Request parameters for a KeyCredentials update operation
*/
export interface KeyCredentialsUpdateParameters {
  /**
   * A collection of KeyCredentials.
  */
  value: KeyCredential[];
}

/**
 * Request parameters for a PasswordCredentials update operation.
*/
export interface PasswordCredentialsUpdateParameters {
  /**
   * A collection of PasswordCredentials.
  */
  value: PasswordCredential[];
}

/**
 * Request parameters for adding a member to a group.
*/
export interface GroupAddMemberParameters {
  /**
   * A member object URL, such as
   * "https://graph.windows.net/0b1f9851-1bf0-433f-aec3-cb9272f093dc/directoryObjects/f260bbc4-c254-447b-94cf-293b5ec434dd",
   * where "0b1f9851-1bf0-433f-aec3-cb9272f093dc" is the tenantId and
   * "f260bbc4-c254-447b-94cf-293b5ec434dd" is the objectId of the member (user, application,
   * servicePrincipal, group) to be added.
  */
  url: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Request parameters for creating a new group.
*/
export interface GroupCreateParameters {
  /**
   * Group display name
  */
  displayName: string;
  /**
   * Mail nickname
  */
  mailNickname: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Active Directory group information.
*/
export interface ADGroup extends DirectoryObject {
  /**
   * The display name of the group.
  */
  displayName?: string;
  /**
   * Whether the group is mail-enabled. Must be false. This is because only pure security groups
   * can be created using the Graph API.
  */
  mailEnabled?: boolean;
  /**
   * The mail alias for the group.
  */
  mailNickname?: string;
  /**
   * Whether the group is security-enable.
  */
  securityEnabled?: boolean;
  /**
   * The primary email address of the group.
  */
  mail?: string;
}

/**
 * Request parameters for GetMemberGroups API call.
*/
export interface GroupGetMemberGroupsParameters {
  /**
   * If true, only membership in security-enabled groups should be checked. Otherwise, membership
   * in all groups should be checked.
  */
  securityEnabledOnly: boolean;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Request parameters for IsMemberOf API call.
*/
export interface CheckGroupMembershipParameters {
  /**
   * The object ID of the group to check.
  */
  groupId: string;
  /**
   * The object ID of the contact, group, user, or service principal to check for membership in the
   * specified group.
  */
  memberId: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Server response for IsMemberOf API call
*/
export interface CheckGroupMembershipResult {
  /**
   * True if the specified user, group, contact, or service principal has either direct or
   * transitive membership in the specified group; otherwise, false.
  */
  value?: boolean;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Request parameters for creating a new service principal.
*/
export interface ServicePrincipalCreateParameters {
  /**
   * Whether the account is enabled
  */
  accountEnabled?: boolean;
  /**
   * application Id
  */
  appId: string;
  /**
   * Specifies whether an AppRoleAssignment to a user or group is required before Azure AD will
   * issue a user or access token to the application.
  */
  appRoleAssignmentRequired?: boolean;
  /**
   * The display name for the service principal.
  */
  displayName?: string;
  errorUrl?: string;
  /**
   * The URL to the homepage of the associated application.
  */
  homepage?: string;
  /**
   * A collection of KeyCredential objects.
  */
  keyCredentials?: KeyCredential[];
  /**
   * A collection of PasswordCredential objects
  */
  passwordCredentials?: PasswordCredential[];
  /**
   * The display name of the tenant in which the associated application is specified.
  */
  publisherName?: string;
  /**
   * A collection of reply URLs for the service principal.
  */
  replyUrls?: string[];
  samlMetadataUrl?: string;
  /**
   * A collection of service principal names.
  */
  servicePrincipalNames?: string[];
  tags?: string[];
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Request parameters for creating a new service principal.
*/
export interface ServicePrincipalUpdateParameters {
  /**
   * Whether the account is enabled
  */
  accountEnabled?: boolean;
  /**
   * application Id
  */
  appId?: string;
  /**
   * Specifies whether an AppRoleAssignment to a user or group is required before Azure AD will
   * issue a user or access token to the application.
  */
  appRoleAssignmentRequired?: boolean;
  /**
   * The display name for the service principal.
  */
  displayName?: string;
  errorUrl?: string;
  /**
   * The URL to the homepage of the associated application.
  */
  homepage?: string;
  /**
   * A collection of KeyCredential objects.
  */
  keyCredentials?: KeyCredential[];
  /**
   * A collection of PasswordCredential objects
  */
  passwordCredentials?: PasswordCredential[];
  /**
   * The display name of the tenant in which the associated application is specified.
  */
  publisherName?: string;
  /**
   * A collection of reply URLs for the service principal.
  */
  replyUrls?: string[];
  samlMetadataUrl?: string;
  /**
   * A collection of service principal names.
  */
  servicePrincipalNames?: string[];
  tags?: string[];
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Active Directory service principal information.
*/
export interface ServicePrincipal extends DirectoryObject {
  /**
   * The display name of the service principal.
  */
  displayName?: string;
  /**
   * The application ID.
  */
  appId?: string;
  /**
   * The collection of application roles that an application may declare. These roles can be
   * assigned to users, groups or service principals.
  */
  appRoles?: AppRole[];
  /**
   * A collection of service principal names.
  */
  servicePrincipalNames?: string[];
}

/**
 * The password profile associated with a user.
*/
export interface PasswordProfile {
  /**
   * Password
  */
  password: string;
  /**
   * Whether to force a password change on next login.
  */
  forceChangePasswordNextLogin?: boolean;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

export interface UserBase {
  /**
   * This must be specified if you are using a federated domain for the user's userPrincipalName
   * (UPN) property when creating a new user account. It is used to associate an on-premises Active
   * Directory user account with their Azure AD user object.
  */
  immutableId?: string;
  /**
   * A two letter country code (ISO standard 3166). Required for users that will be assigned
   * licenses due to legal requirement to check for availability of services in countries. Examples
   * include: "US", "JP", and "GB".
  */
  usageLocation?: string;
  /**
   * The given name for the user.
  */
  givenName?: string;
  /**
   * The user's surname (family name or last name).
  */
  surname?: string;
  /**
   * A string value that can be used to classify user types in your directory, such as 'Member' and
   * 'Guest'. Possible values include: 'Member', 'Guest'
  */
  userType?: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Request parameters for creating a new work or school account user.
*/
export interface UserCreateParameters extends UserBase {
  /**
   * Whether the account is enabled.
  */
  accountEnabled: boolean;
  /**
   * The display name of the user.
  */
  displayName: string;
  /**
   * Password Profile
  */
  passwordProfile: PasswordProfile;
  /**
   * The user principal name (someuser@contoso.com). It must contain one of the verified domains
   * for the tenant.
  */
  userPrincipalName: string;
  /**
   * The mail alias for the user.
  */
  mailNickname: string;
  /**
   * The primary email address of the user.
  */
  mail?: string;
}

/**
 * Request parameters for updating an existing work or school account user.
*/
export interface UserUpdateParameters extends UserBase {
  /**
   * Whether the account is enabled.
  */
  accountEnabled?: boolean;
  /**
   * The display name of the user.
  */
  displayName?: string;
  /**
   * The password profile of the user.
  */
  passwordProfile?: PasswordProfile;
  /**
   * The user principal name (someuser@contoso.com). It must contain one of the verified domains
   * for the tenant.
  */
  userPrincipalName?: string;
  /**
   * The mail alias for the user.
  */
  mailNickname?: string;
}

/**
 * Contains information about a sign-in name of a local account user in an Azure Active Directory
 * B2C tenant.
*/
export interface SignInName {
  /**
   * A string value that can be used to classify user sign-in types in your directory, such as
   * 'emailAddress' or 'userName'.
  */
  type?: string;
  /**
   * The sign-in used by the local account. Must be unique across the company/tenant. For example,
   * 'johnc@example.com'.
  */
  value?: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Active Directory user information.
*/
export interface User extends DirectoryObject {
  /**
   * This must be specified if you are using a federated domain for the user's userPrincipalName
   * (UPN) property when creating a new user account. It is used to associate an on-premises Active
   * Directory user account with their Azure AD user object.
  */
  immutableId?: string;
  /**
   * A two letter country code (ISO standard 3166). Required for users that will be assigned
   * licenses due to legal requirement to check for availability of services in countries. Examples
   * include: "US", "JP", and "GB".
  */
  usageLocation?: string;
  /**
   * The given name for the user.
  */
  givenName?: string;
  /**
   * The user's surname (family name or last name).
  */
  surname?: string;
  /**
   * A string value that can be used to classify user types in your directory, such as 'Member' and
   * 'Guest'. Possible values include: 'Member', 'Guest'
  */
  userType?: string;
  /**
   * Whether the account is enabled.
  */
  accountEnabled?: boolean;
  /**
   * The display name of the user.
  */
  displayName?: string;
  /**
   * The principal name of the user.
  */
  userPrincipalName?: string;
  /**
   * The mail alias for the user.
  */
  mailNickname?: string;
  /**
   * The primary email address of the user.
  */
  mail?: string;
  /**
   * The sign-in names of the user.
  */
  signInNames?: SignInName[];
}

/**
 * Request parameters for GetMemberGroups API call.
*/
export interface UserGetMemberGroupsParameters {
  /**
   * If true, only membership in security-enabled groups should be checked. Otherwise, membership
   * in all groups should be checked.
  */
  securityEnabledOnly: boolean;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Request parameters for the GetObjectsByObjectIds API.
*/
export interface GetObjectsParameters {
  /**
   * The requested object IDs.
  */
  objectIds?: string[];
  /**
   * The requested object types.
  */
  types?: string[];
  /**
   * If true, also searches for object IDs in the partner tenant.
  */
  includeDirectoryObjectReferences?: boolean;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Active Directory Domain information.
*/
export interface Domain {
  /**
   * the type of the authentication into the domain.
  */
  readonly authenticationType?: string;
  /**
   * if this is the default domain in the tenant.
  */
  readonly isDefault?: boolean;
  /**
   * if this domain's ownership is verified.
  */
  readonly isVerified?: boolean;
  /**
   * the domain name.
  */
  name: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

export interface Permissions {
  /**
   * Microsoft.DirectoryServices.OAuth2PermissionGrant
  */
  odatatype?: string;
  /**
   * The objectId of the Service Principal associated with the app
  */
  clientId?: string;
  /**
   * Typically set to AllPrincipals
  */
  consentType?: string;
  /**
   * Set to null if AllPrincipals is set
  */
  principalId?: any;
  /**
   * Service Principal Id of the resource you want to grant
  */
  resourceId?: string;
  /**
   * Typically set to user_impersonation
  */
  scope?: string;
  /**
   * Start time for TTL
  */
  startTime?: string;
  /**
   * Expiry time for TTL
  */
  expiryTime?: string;
}

/**
 * DirectoryObject list operation result.
*/
export interface DirectoryObjectListResult extends Array<DirectoryObject> {
  /**
   * The URL to get the next set of results.
  */
  odatanextLink?: string;
}

/**
 * Application list operation result.
*/
export interface ApplicationListResult extends Array<Application> {
  /**
   * The URL to get the next set of results.
  */
  odatanextLink?: string;
}

/**
 * KeyCredential list operation result.
*/
export interface KeyCredentialListResult extends Array<KeyCredential> {
}

/**
 * PasswordCredential list operation result.
*/
export interface PasswordCredentialListResult extends Array<PasswordCredential> {
}

/**
 * Server response for Get tenant groups API call
*/
export interface GroupListResult extends Array<ADGroup> {
  /**
   * The URL to get the next set of results.
  */
  odatanextLink?: string;
}

/**
 * Server response for GetMemberGroups API call.
*/
export interface GroupGetMemberGroupsResult extends Array<string> {
}

/**
 * Server response for get tenant service principals API call.
*/
export interface ServicePrincipalListResult extends Array<ServicePrincipal> {
  /**
   * the URL to get the next set of results.
  */
  odatanextLink?: string;
}

/**
 * Server response for Get tenant users API call.
*/
export interface UserListResult extends Array<User> {
  /**
   * The URL to get the next set of results.
  */
  odatanextLink?: string;
}

/**
 * Server response for GetMemberGroups API call.
*/
export interface UserGetMemberGroupsResult extends Array<string> {
}

/**
 * Server response for Get tenant domains API call.
*/
export interface DomainListResult extends Array<Domain> {
}
