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

export { BaseResource } from 'ms-rest-azure';
export { CloudError } from 'ms-rest-azure';


/**
 * @class
 * Initializes a new instance of the GraphError class.
 * @constructor
 * Active Directory error information.
 *
 * @member {string} [code] Error code.
 *
 * @member {string} [message] Error message value.
 *
 */
export interface GraphError {
  code?: string;
  message?: string;
}

/**
 * @class
 * Initializes a new instance of the KeyCredential class.
 * @constructor
 * Active Directory Key Credential information.
 *
 * @member {date} [startDate] Start date.
 *
 * @member {date} [endDate] End date.
 *
 * @member {string} [value] Key value.
 *
 * @member {string} [keyId] Key ID.
 *
 * @member {string} [usage] Usage. Acceptable values are 'Verify' and 'Sign'.
 *
 * @member {string} [type] Type. Acceptable values are 'AsymmetricX509Cert' and
 * 'Symmetric'.
 *
 */
export interface KeyCredential {
  startDate?: Date;
  endDate?: Date;
  value?: string;
  keyId?: string;
  usage?: string;
  type?: string;
}

/**
 * @class
 * Initializes a new instance of the PasswordCredential class.
 * @constructor
 * Active Directory Password Credential information.
 *
 * @member {date} [startDate] Start date.
 *
 * @member {date} [endDate] End date.
 *
 * @member {string} [keyId] Key ID.
 *
 * @member {string} [value] Key value.
 *
 */
export interface PasswordCredential {
  startDate?: Date;
  endDate?: Date;
  keyId?: string;
  value?: string;
}

/**
 * @class
 * Initializes a new instance of the ApplicationCreateParameters class.
 * @constructor
 * Request parameters for creating a new application.
 *
 * @member {boolean} availableToOtherTenants Whether the application is
 * available to other tenants.
 *
 * @member {string} displayName The display name of the application.
 *
 * @member {string} [homepage] The home page of the application.
 *
 * @member {array} identifierUris A collection of URIs for the application.
 *
 * @member {array} [replyUrls] A collection of reply URLs for the application.
 *
 * @member {array} [keyCredentials] The list of KeyCredential objects.
 *
 * @member {array} [passwordCredentials] The list of PasswordCredential
 * objects.
 *
 */
export interface ApplicationCreateParameters {
  availableToOtherTenants: boolean;
  displayName: string;
  homepage?: string;
  identifierUris: string[];
  replyUrls?: string[];
  keyCredentials?: KeyCredential[];
  passwordCredentials?: PasswordCredential[];
}

/**
 * @class
 * Initializes a new instance of the ApplicationUpdateParameters class.
 * @constructor
 * Request parameters for updating an existing application.
 *
 * @member {boolean} [availableToOtherTenants] Whether the application is
 * available to other tenants
 *
 * @member {string} [displayName] The display name of the application.
 *
 * @member {string} [homepage] The home page of the application.
 *
 * @member {array} [identifierUris] A collection of URIs for the application.
 *
 * @member {array} [replyUrls] A collection of reply URLs for the application.
 *
 * @member {array} [keyCredentials] The list of KeyCredential objects.
 *
 * @member {array} [passwordCredentials] The list of PasswordCredential
 * objects.
 *
 */
export interface ApplicationUpdateParameters {
  availableToOtherTenants?: boolean;
  displayName?: string;
  homepage?: string;
  identifierUris?: string[];
  replyUrls?: string[];
  keyCredentials?: KeyCredential[];
  passwordCredentials?: PasswordCredential[];
}

/**
 * @class
 * Initializes a new instance of the Application class.
 * @constructor
 * Active Directory application information.
 *
 * @member {string} [objectId] The object ID.
 *
 * @member {string} [objectType] The object type.
 *
 * @member {string} [appId] The application ID.
 *
 * @member {array} [appPermissions] The application permissions.
 *
 * @member {boolean} [availableToOtherTenants] Whether the application is be
 * available to other tenants.
 *
 * @member {string} [displayName] The display name of the application.
 *
 * @member {array} [identifierUris] A collection of URIs for the application.
 *
 * @member {array} [replyUrls] A collection of reply URLs for the application.
 *
 * @member {string} [homepage] The home page of the application.
 *
 */
export interface Application {
  objectId?: string;
  objectType?: string;
  appId?: string;
  appPermissions?: string[];
  availableToOtherTenants?: boolean;
  displayName?: string;
  identifierUris?: string[];
  replyUrls?: string[];
  homepage?: string;
}

/**
 * @class
 * Initializes a new instance of the ApplicationListResult class.
 * @constructor
 * Application list operation result.
 *
 * @member {array} [value] A collection of applications.
 *
 * @member {string} [odatanextLink] The URL to get the next set of results.
 *
 */
export interface ApplicationListResult {
  value?: Application[];
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the KeyCredentialListResult class.
 * @constructor
 * KeyCredential list operation result.
 *
 * @member {array} [value] A collection of KeyCredentials.
 *
 */
export interface KeyCredentialListResult {
  value?: KeyCredential[];
}

/**
 * @class
 * Initializes a new instance of the KeyCredentialsUpdateParameters class.
 * @constructor
 * Request parameters for a KeyCredentials update operation
 *
 * @member {array} value A collection of KeyCredentials.
 *
 */
export interface KeyCredentialsUpdateParameters {
  value: KeyCredential[];
}

/**
 * @class
 * Initializes a new instance of the PasswordCredentialListResult class.
 * @constructor
 * PasswordCredential list operation result.
 *
 * @member {array} [value] A collection of PasswordCredentials.
 *
 */
export interface PasswordCredentialListResult {
  value?: PasswordCredential[];
}

/**
 * @class
 * Initializes a new instance of the PasswordCredentialsUpdateParameters class.
 * @constructor
 * Request parameters for a PasswordCredentials update operation.
 *
 * @member {array} value A collection of PasswordCredentials.
 *
 */
export interface PasswordCredentialsUpdateParameters {
  value: PasswordCredential[];
}

/**
 * @class
 * Initializes a new instance of the AADObject class.
 * @constructor
 * The properties of an Active Directory object.
 *
 * @member {string} [objectId] The ID of the object.
 *
 * @member {string} [objectType] The type of AAD object.
 *
 * @member {string} [displayName] The display name of the object.
 *
 * @member {string} [userPrincipalName] The principal name of the object.
 *
 * @member {string} [mail] The primary email address of the object.
 *
 * @member {boolean} [mailEnabled] Whether the AAD object is mail-enabled.
 *
 * @member {boolean} [securityEnabled] Whether the AAD object is
 * security-enabled.
 *
 * @member {string} [signInName] The sign-in name of the object.
 *
 * @member {array} [servicePrincipalNames] A collection of service principal
 * names associated with the object.
 *
 * @member {string} [userType] The user type of the object.
 *
 */
export interface AADObject {
  objectId?: string;
  objectType?: string;
  displayName?: string;
  userPrincipalName?: string;
  mail?: string;
  mailEnabled?: boolean;
  securityEnabled?: boolean;
  signInName?: string;
  servicePrincipalNames?: string[];
  userType?: string;
}

/**
 * @class
 * Initializes a new instance of the GetObjectsResult class.
 * @constructor
 * The response to an Active Directory object inquiry API request.
 *
 * @member {array} [value] A collection of Active Directory objects.
 *
 * @member {string} [odatanextLink] The URL to get the next set of results.
 *
 */
export interface GetObjectsResult {
  value?: AADObject[];
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the GroupAddMemberParameters class.
 * @constructor
 * Request parameters for adding a member to a group.
 *
 * @member {string} url A member object URL, such as
 * "https://graph.windows.net/0b1f9851-1bf0-433f-aec3-cb9272f093dc/directoryObjects/f260bbc4-c254-447b-94cf-293b5ec434dd",
 * where "0b1f9851-1bf0-433f-aec3-cb9272f093dc" is the tenantId and
 * "f260bbc4-c254-447b-94cf-293b5ec434dd" is the objectId of the member (user,
 * application, servicePrincipal, group) to be added.
 *
 */
export interface GroupAddMemberParameters {
  url: string;
}

/**
 * @class
 * Initializes a new instance of the GroupCreateParameters class.
 * @constructor
 * Request parameters for creating a new group.
 *
 * @member {string} displayName Group display name
 *
 * @member {string} mailNickname Mail nickname
 *
 */
export interface GroupCreateParameters {
  displayName: string;
  mailNickname: string;
}

/**
 * @class
 * Initializes a new instance of the ADGroup class.
 * @constructor
 * Active Directory group information.
 *
 * @member {string} [objectId] The object ID.
 *
 * @member {string} [objectType] The object type.
 *
 * @member {string} [displayName] The display name of the group.
 *
 * @member {boolean} [securityEnabled] Whether the group is security-enable.
 *
 * @member {string} [mail] The primary email address of the group.
 *
 */
export interface ADGroup {
  objectId?: string;
  objectType?: string;
  displayName?: string;
  securityEnabled?: boolean;
  mail?: string;
}

/**
 * @class
 * Initializes a new instance of the GroupListResult class.
 * @constructor
 * Server response for Get tenant groups API call
 *
 * @member {array} [value] A collection of Active Directory groups.
 *
 * @member {string} [odatanextLink] The URL to get the next set of results.
 *
 */
export interface GroupListResult {
  value?: ADGroup[];
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the GroupGetMemberGroupsParameters class.
 * @constructor
 * Request parameters for GetMemberGroups API call.
 *
 * @member {boolean} securityEnabledOnly If true, only membership in
 * security-enabled groups should be checked. Otherwise, membership in all
 * groups should be checked.
 *
 */
export interface GroupGetMemberGroupsParameters {
  securityEnabledOnly: boolean;
}

/**
 * @class
 * Initializes a new instance of the GroupGetMemberGroupsResult class.
 * @constructor
 * Server response for GetMemberGroups API call.
 *
 * @member {array} [value] A collection of group IDs of which the group is a
 * member.
 *
 */
export interface GroupGetMemberGroupsResult {
  value?: string[];
}

/**
 * @class
 * Initializes a new instance of the CheckGroupMembershipParameters class.
 * @constructor
 * Request parameters for IsMemberOf API call.
 *
 * @member {string} groupId The object ID of the group to check.
 *
 * @member {string} memberId The object ID of the contact, group, user, or
 * service principal to check for membership in the specified group.
 *
 */
export interface CheckGroupMembershipParameters {
  groupId: string;
  memberId: string;
}

/**
 * @class
 * Initializes a new instance of the CheckGroupMembershipResult class.
 * @constructor
 * Server response for IsMemberOf API call
 *
 * @member {boolean} [value] True if the specified user, group, contact, or
 * service principal has either direct or transitive membership in the
 * specified group; otherwise, false.
 *
 */
export interface CheckGroupMembershipResult {
  value?: boolean;
}

/**
 * @class
 * Initializes a new instance of the ServicePrincipalCreateParameters class.
 * @constructor
 * Request parameters for creating a new service principal.
 *
 * @member {string} appId application Id
 *
 * @member {boolean} accountEnabled Whether the account is enabled
 *
 * @member {array} [keyCredentials] A collection of KeyCredential objects.
 *
 * @member {array} [passwordCredentials] A collection of PasswordCredential
 * objects
 *
 */
export interface ServicePrincipalCreateParameters {
  appId: string;
  accountEnabled: boolean;
  keyCredentials?: KeyCredential[];
  passwordCredentials?: PasswordCredential[];
}

/**
 * @class
 * Initializes a new instance of the ServicePrincipal class.
 * @constructor
 * Active Directory service principal information.
 *
 * @member {string} [objectId] The object ID.
 *
 * @member {string} [objectType] The object type.
 *
 * @member {string} [displayName] The display name of the service principal.
 *
 * @member {string} [appId] The application ID.
 *
 * @member {array} [servicePrincipalNames] A collection of service principal
 * names.
 *
 */
export interface ServicePrincipal {
  objectId?: string;
  objectType?: string;
  displayName?: string;
  appId?: string;
  servicePrincipalNames?: string[];
}

/**
 * @class
 * Initializes a new instance of the ServicePrincipalListResult class.
 * @constructor
 * Server response for get tenant service principals API call.
 *
 * @member {array} [value] the list of service principals.
 *
 * @member {string} [odatanextLink] the URL to get the next set of results.
 *
 */
export interface ServicePrincipalListResult {
  value?: ServicePrincipal[];
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the PasswordProfile class.
 * @constructor
 * The password profile associated with a user.
 *
 * @member {string} password Password
 *
 * @member {boolean} [forceChangePasswordNextLogin] Whether to force a password
 * change on next login.
 *
 */
export interface PasswordProfile {
  password: string;
  forceChangePasswordNextLogin?: boolean;
}

/**
 * @class
 * Initializes a new instance of the UserCreateParameters class.
 * @constructor
 * Request parameters for creating a new work or school account user.
 *
 * @member {boolean} accountEnabled Whether the account is enabled.
 *
 * @member {string} displayName The display name of the user.
 *
 * @member {object} passwordProfile Password Profile
 *
 * @member {string} [passwordProfile.password] Password
 *
 * @member {boolean} [passwordProfile.forceChangePasswordNextLogin] Whether to
 * force a password change on next login.
 *
 * @member {string} userPrincipalName The user principal name
 * (someuser@contoso.com). It must contain one of the verified domains for the
 * tenant.
 *
 * @member {string} mailNickname The mail alias for the user.
 *
 * @member {string} [immutableId] This must be specified if you are using a
 * federated domain for the user's userPrincipalName (UPN) property when
 * creating a new user account. It is used to associate an on-premises Active
 * Directory user account with their Azure AD user object.
 *
 * @member {string} [usageLocation] A two letter country code (ISO standard
 * 3166). Required for users that will be assigned licenses due to legal
 * requirement to check for availability of services in countries. Examples
 * include: "US", "JP", and "GB".
 *
 */
export interface UserCreateParameters {
  accountEnabled: boolean;
  displayName: string;
  passwordProfile: PasswordProfile;
  userPrincipalName: string;
  mailNickname: string;
  immutableId?: string;
  usageLocation?: string;
}

/**
 * @class
 * Initializes a new instance of the UserUpdateParameters class.
 * @constructor
 * Request parameters for updating an existing work or school account user.
 *
 * @member {boolean} [accountEnabled] Whether the account is enabled.
 *
 * @member {string} [displayName] The display name of the user.
 *
 * @member {object} [passwordProfile] The password profile of the user.
 *
 * @member {string} [passwordProfile.password] Password
 *
 * @member {boolean} [passwordProfile.forceChangePasswordNextLogin] Whether to
 * force a password change on next login.
 *
 * @member {string} [mailNickname] The mail alias for the user.
 *
 * @member {string} [usageLocation] A two letter country code (ISO standard
 * 3166). Required for users that will be assigned licenses due to legal
 * requirement to check for availability of services in countries. Examples
 * include: "US", "JP", and "GB".
 *
 */
export interface UserUpdateParameters {
  accountEnabled?: boolean;
  displayName?: string;
  passwordProfile?: PasswordProfile;
  mailNickname?: string;
  usageLocation?: string;
}

/**
 * @class
 * Initializes a new instance of the User class.
 * @constructor
 * Active Directory user information.
 *
 * @member {string} [objectId] The object ID.
 *
 * @member {string} [objectType] The object type.
 *
 * @member {string} [userPrincipalName] The principal name of the user.
 *
 * @member {string} [displayName] The display name of the user.
 *
 * @member {string} [signInName] The sign-in name of the user.
 *
 * @member {string} [mail] The primary email address of the user.
 *
 * @member {string} [mailNickname] The mail alias for the user.
 *
 * @member {string} [usageLocation] A two letter country code (ISO standard
 * 3166). Required for users that will be assigned licenses due to legal
 * requirement to check for availability of services in countries. Examples
 * include: "US", "JP", and "GB".
 *
 */
export interface User {
  objectId?: string;
  objectType?: string;
  userPrincipalName?: string;
  displayName?: string;
  signInName?: string;
  mail?: string;
  mailNickname?: string;
  usageLocation?: string;
}

/**
 * @class
 * Initializes a new instance of the UserGetMemberGroupsParameters class.
 * @constructor
 * Request parameters for GetMemberGroups API call.
 *
 * @member {boolean} securityEnabledOnly If true, only membership in
 * security-enabled groups should be checked. Otherwise, membership in all
 * groups should be checked.
 *
 */
export interface UserGetMemberGroupsParameters {
  securityEnabledOnly: boolean;
}

/**
 * @class
 * Initializes a new instance of the UserGetMemberGroupsResult class.
 * @constructor
 * Server response for GetMemberGroups API call.
 *
 * @member {array} [value] A collection of group IDs of which the user is a
 * member.
 *
 */
export interface UserGetMemberGroupsResult {
  value?: string[];
}

/**
 * @class
 * Initializes a new instance of the UserListResult class.
 * @constructor
 * Server response for Get tenant users API call.
 *
 * @member {array} [value] the list of users.
 *
 * @member {string} [odatanextLink] The URL to get the next set of results.
 *
 */
export interface UserListResult {
  value?: User[];
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the GetObjectsParameters class.
 * @constructor
 * Request parameters for the GetObjectsByObjectIds API.
 *
 * @member {array} [objectIds] The requested object IDs.
 *
 * @member {array} [types] The requested object types.
 *
 * @member {boolean} includeDirectoryObjectReferences If true, also searches
 * for object IDs in the partner tenant.
 *
 */
export interface GetObjectsParameters {
  objectIds?: string[];
  types?: string[];
  includeDirectoryObjectReferences: boolean;
}

/**
 * @class
 * Initializes a new instance of the GetObjectsResult class.
 * @constructor
 * The response to an Active Directory object inquiry API request.
 *
 * @member {array} [value] A collection of Active Directory objects.
 *
 * @member {string} [odatanextLink] The URL to get the next set of results.
 *
 */
export interface GetObjectsResult {
  value?: AADObject[];
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the ApplicationListResult class.
 * @constructor
 * Application list operation result.
 *
 * @member {array} [value] A collection of applications.
 *
 * @member {string} [odatanextLink] The URL to get the next set of results.
 *
 */
export interface ApplicationListResult {
  value?: Application[];
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the KeyCredentialListResult class.
 * @constructor
 * KeyCredential list operation result.
 *
 * @member {array} [value] A collection of KeyCredentials.
 *
 */
export interface KeyCredentialListResult {
  value?: KeyCredential[];
}

/**
 * @class
 * Initializes a new instance of the PasswordCredentialListResult class.
 * @constructor
 * PasswordCredential list operation result.
 *
 * @member {array} [value] A collection of PasswordCredentials.
 *
 */
export interface PasswordCredentialListResult {
  value?: PasswordCredential[];
}

/**
 * @class
 * Initializes a new instance of the GroupListResult class.
 * @constructor
 * Server response for Get tenant groups API call
 *
 * @member {array} [value] A collection of Active Directory groups.
 *
 * @member {string} [odatanextLink] The URL to get the next set of results.
 *
 */
export interface GroupListResult {
  value?: ADGroup[];
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the GroupGetMemberGroupsResult class.
 * @constructor
 * Server response for GetMemberGroups API call.
 *
 * @member {array} [value] A collection of group IDs of which the group is a
 * member.
 *
 */
export interface GroupGetMemberGroupsResult {
  value?: string[];
}

/**
 * @class
 * Initializes a new instance of the ServicePrincipalListResult class.
 * @constructor
 * Server response for get tenant service principals API call.
 *
 * @member {array} [value] the list of service principals.
 *
 * @member {string} [odatanextLink] the URL to get the next set of results.
 *
 */
export interface ServicePrincipalListResult {
  value?: ServicePrincipal[];
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the UserListResult class.
 * @constructor
 * Server response for Get tenant users API call.
 *
 * @member {array} [value] the list of users.
 *
 * @member {string} [odatanextLink] The URL to get the next set of results.
 *
 */
export interface UserListResult {
  value?: User[];
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the UserGetMemberGroupsResult class.
 * @constructor
 * Server response for GetMemberGroups API call.
 *
 * @member {array} [value] A collection of group IDs of which the user is a
 * member.
 *
 */
export interface UserGetMemberGroupsResult {
  value?: string[];
}


/**
 * @class
 * Initializes a new instance of the GetObjectsResult class.
 * @constructor
 * The response to an Active Directory object inquiry API request.
 *
 * @member {string} [odatanextLink] The URL to get the next set of results.
 *
 */
export interface GetObjectsResult extends Array<AADObject> {
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the ApplicationListResult class.
 * @constructor
 * Application list operation result.
 *
 * @member {string} [odatanextLink] The URL to get the next set of results.
 *
 */
export interface ApplicationListResult extends Array<Application> {
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the KeyCredentialListResult class.
 * @constructor
 * KeyCredential list operation result.
 *
 */
export interface KeyCredentialListResult extends Array<KeyCredential> {
}

/**
 * @class
 * Initializes a new instance of the PasswordCredentialListResult class.
 * @constructor
 * PasswordCredential list operation result.
 *
 */
export interface PasswordCredentialListResult extends Array<PasswordCredential> {
}

/**
 * @class
 * Initializes a new instance of the GroupListResult class.
 * @constructor
 * Server response for Get tenant groups API call
 *
 * @member {string} [odatanextLink] The URL to get the next set of results.
 *
 */
export interface GroupListResult extends Array<ADGroup> {
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the GroupGetMemberGroupsResult class.
 * @constructor
 * Server response for GetMemberGroups API call.
 *
 */
export interface GroupGetMemberGroupsResult extends Array<string> {
}

/**
 * @class
 * Initializes a new instance of the ServicePrincipalListResult class.
 * @constructor
 * Server response for get tenant service principals API call.
 *
 * @member {string} [odatanextLink] the URL to get the next set of results.
 *
 */
export interface ServicePrincipalListResult extends Array<ServicePrincipal> {
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the UserListResult class.
 * @constructor
 * Server response for Get tenant users API call.
 *
 * @member {string} [odatanextLink] The URL to get the next set of results.
 *
 */
export interface UserListResult extends Array<User> {
  odatanextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the UserGetMemberGroupsResult class.
 * @constructor
 * Server response for GetMemberGroups API call.
 *
 */
export interface UserGetMemberGroupsResult extends Array<string> {
}
