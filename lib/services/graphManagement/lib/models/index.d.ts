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
 * Represents a group of URIs that provide terms of service, marketing, support and privacy policy
 * information about an application. The default value for each string is null.
 */
export interface InformationalUrl {
  /**
   * The terms of service URI
   */
  termsOfService?: string;
  /**
   * The marketing URI
   */
  marketing?: string;
  /**
   * The privacy policy URI
   */
  privacy?: string;
  /**
   * The support URI
   */
  support?: string;
}

/**
 * Represents an OAuth 2.0 delegated permission scope. The specified OAuth 2.0 delegated permission
 * scopes may be requested by client applications (through the requiredResourceAccess collection on
 * the Application object) when calling a resource application. The oauth2Permissions property of
 * the ServicePrincipal entity and of the Application entity is a collection of OAuth2Permission.
 */
export interface OAuth2Permission {
  /**
   * Permission help text that appears in the admin consent and app assignment experiences.
   */
  adminConsentDescription?: string;
  /**
   * Display name for the permission that appears in the admin consent and app assignment
   * experiences.
   */
  adminConsentDisplayName?: string;
  /**
   * Unique scope permission identifier inside the oauth2Permissions collection.
   */
  id?: string;
  /**
   * When creating or updating a permission, this property must be set to true (which is the
   * default). To delete a permission, this property must first be set to false. At that point, in
   * a subsequent call, the permission may be removed.
   */
  isEnabled?: boolean;
  /**
   * Specifies whether this scope permission can be consented to by an end user, or whether it is a
   * tenant-wide permission that must be consented to by a Company Administrator. Possible values
   * are "User" or "Admin".
   */
  type?: string;
  /**
   * Permission help text that appears in the end user consent experience.
   */
  userConsentDescription?: string;
  /**
   * Display name for the permission that appears in the end user consent experience.
   */
  userConsentDisplayName?: string;
  /**
   * The value of the scope claim that the resource application should expect in the OAuth 2.0
   * access token.
   */
  value?: string;
}

/**
 * Specifying the claims to be included in a token.
 */
export interface OptionalClaim {
  /**
   * Claim name.
   */
  name?: string;
  /**
   * Claim source.
   */
  source?: string;
  /**
   * Is this a requied claim.
   */
  essential?: boolean;
  additionalProperties?: any;
}

/**
 * Specifying the claims to be included in the token.
*/
export interface OptionalClaims {
  /**
   * Optional claims requested to be included in the id token.
  */
  idToken?: OptionalClaim[];
  /**
   * Optional claims requested to be included in the access token.
  */
  accessToken?: OptionalClaim[];
  /**
   * Optional claims requested to be included in the saml token.
  */
  samlToken?: OptionalClaim[];
}

/**
 * Contains information about the pre-authorized permissions.
*/
export interface PreAuthorizedApplicationPermission {
  /**
   * Indicates whether the permission set is DirectAccess or impersonation.
  */
  directAccessGrant?: boolean;
  /**
   * The list of permissions.
  */
  accessGrants?: string[];
}

/**
 * Representation of an app PreAuthorizedApplicationExtension required by a pre authorized client
 * app.
*/
export interface PreAuthorizedApplicationExtension {
  /**
   * The extension's conditions.
  */
  conditions?: string[];
}

/**
 * Contains information about pre authorized client application.
*/
export interface PreAuthorizedApplication {
  /**
   * Represents the application id.
  */
  appId?: string;
  /**
   * Collection of required app permissions/entitlements from the resource application.
  */
  permissions?: PreAuthorizedApplicationPermission[];
  /**
   * Collection of extensions from the resource application.
  */
  extensions?: PreAuthorizedApplicationExtension[];
}

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
 * Active Directive Application common properties shared among GET, POST and PATCH
*/
export interface ApplicationBase {
  /**
   * A property on the application to indicate if the application accepts other IDPs or not or
   * partially accepts.
  */
  allowGuestsSignIn?: boolean;
  /**
   * Indicates that the application supports pass through users who have no presence in the
   * resource tenant.
  */
  allowPassthroughUsers?: boolean;
  /**
   * The url for the application logo image stored in a CDN.
  */
  appLogoUrl?: string;
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
   * Whether the application is available to other tenants.
  */
  availableToOtherTenants?: boolean;
  /**
   * A URL provided by the author of the application to report errors when using the application.
  */
  errorUrl?: string;
  /**
   * Configures the groups claim issued in a user or OAuth 2.0 access token that the app expects.
  */
  groupMembershipClaims?: any;
  /**
   * The home page of the application.
  */
  homepage?: string;
  /**
   * urls with more informations of the application.
  */
  informationalUrls?: InformationalUrl;
  /**
   * Specifies whether this application supports device authentication without a user. The default
   * is false.
  */
  isDeviceOnlyAuthSupported?: boolean;
  /**
   * A collection of KeyCredential objects.
  */
  keyCredentials?: KeyCredential[];
  /**
   * Client applications that are tied to this resource application. Consent to any of the known
   * client applications will result in implicit consent to the resource application through a
   * combined consent dialog (showing the OAuth permission scopes required by the client and the
   * resource).
  */
  knownClientApplications?: string[];
  /**
   * the url of the logout page
  */
  logoutUrl?: string;
  /**
   * Whether to allow implicit grant flow for OAuth2
  */
  oauth2AllowImplicitFlow?: boolean;
  /**
   * Specifies whether during a token Request Azure AD will allow path matching of the redirect URI
   * against the applications collection of replyURLs. The default is false.
  */
  oauth2AllowUrlPathMatching?: boolean;
  /**
   * The collection of OAuth 2.0 permission scopes that the web API (resource) application exposes
   * to client applications. These permission scopes may be granted to client applications during
   * consent.
  */
  oauth2Permissions?: OAuth2Permission[];
  /**
   * Specifies whether, as part of OAuth 2.0 token requests, Azure AD will allow POST requests, as
   * opposed to GET requests. The default is false, which specifies that only GET requests will be
   * allowed.
  */
  oauth2RequirePostResponse?: boolean;
  /**
   * A list of tenants allowed to access application.
  */
  orgRestrictions?: string[];
  optionalClaims?: OptionalClaims;
  /**
   * A collection of PasswordCredential objects
  */
  passwordCredentials?: PasswordCredential[];
  /**
   * list of pre-authorizaed applications.
  */
  preAuthorizedApplications?: PreAuthorizedApplication[];
  /**
   * Specifies whether this application is a public client (such as an installed application
   * running on a mobile device). Default is false.
  */
  publicClient?: boolean;
  /**
   * Reliable domain which can be used to identify an application.
  */
  publisherDomain?: string;
  /**
   * A collection of reply URLs for the application.
  */
  replyUrls?: string[];
  /**
   * Specifies resources that this application requires access to and the set of OAuth permission
   * scopes and application roles that it needs under each of those resources. This
   * pre-configuration of required resource access drives the consent experience.
  */
  requiredResourceAccess?: RequiredResourceAccess[];
  /**
   * The URL to the SAML metadata for the application.
  */
  samlMetadataUrl?: string;
  /**
   * Audience for signing in to the application (AzureADMyOrganizatio, AzureADAllorganizations,
   * AzureADAndMicrosofAccounts).
  */
  signInAudience?: string;
  /**
   * The primary Web page.
  */
  wwwHomepage?: string;
}

/**
 * Request parameters for creating a new application.
*/
export interface ApplicationCreateParameters extends ApplicationBase {
  /**
   * The display name of the application.
  */
  displayName: string;
  /**
   * A collection of URIs for the application.
  */
  identifierUris: string[];
}

/**
 * Request parameters for updating a new application.
*/
export interface ApplicationUpdateParameters extends ApplicationBase {
  /**
   * The display name of the application.
  */
  displayName?: string;
  /**
   * A collection of URIs for the application.
  */
  identifierUris?: string[];
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
   * A property on the application to indicate if the application accepts other IDPs or not or
   * partially accepts.
  */
  allowGuestsSignIn?: boolean;
  /**
   * Indicates that the application supports pass through users who have no presence in the
   * resource tenant.
  */
  allowPassthroughUsers?: boolean;
  /**
   * The url for the application logo image stored in a CDN.
  */
  appLogoUrl?: string;
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
   * Whether the application is available to other tenants.
  */
  availableToOtherTenants?: boolean;
  /**
   * The display name of the application.
  */
  displayName?: string;
  /**
   * A URL provided by the author of the application to report errors when using the application.
  */
  errorUrl?: string;
  /**
   * Configures the groups claim issued in a user or OAuth 2.0 access token that the app expects.
  */
  groupMembershipClaims?: any;
  /**
   * The home page of the application.
  */
  homepage?: string;
  /**
   * A collection of URIs for the application.
  */
  identifierUris?: string[];
  /**
   * urls with more informations of the application.
  */
  informationalUrls?: InformationalUrl;
  /**
   * Specifies whether this application supports device authentication without a user. The default
   * is false.
  */
  isDeviceOnlyAuthSupported?: boolean;
  /**
   * A collection of KeyCredential objects.
  */
  keyCredentials?: KeyCredential[];
  /**
   * Client applications that are tied to this resource application. Consent to any of the known
   * client applications will result in implicit consent to the resource application through a
   * combined consent dialog (showing the OAuth permission scopes required by the client and the
   * resource).
  */
  knownClientApplications?: string[];
  /**
   * the url of the logout page
  */
  logoutUrl?: string;
  /**
   * Whether to allow implicit grant flow for OAuth2
  */
  oauth2AllowImplicitFlow?: boolean;
  /**
   * Specifies whether during a token Request Azure AD will allow path matching of the redirect URI
   * against the applications collection of replyURLs. The default is false.
  */
  oauth2AllowUrlPathMatching?: boolean;
  /**
   * The collection of OAuth 2.0 permission scopes that the web API (resource) application exposes
   * to client applications. These permission scopes may be granted to client applications during
   * consent.
  */
  oauth2Permissions?: OAuth2Permission[];
  /**
   * Specifies whether, as part of OAuth 2.0 token requests, Azure AD will allow POST requests, as
   * opposed to GET requests. The default is false, which specifies that only GET requests will be
   * allowed.
  */
  oauth2RequirePostResponse?: boolean;
  /**
   * A list of tenants allowed to access application.
  */
  orgRestrictions?: string[];
  optionalClaims?: OptionalClaims;
  /**
   * A collection of PasswordCredential objects
  */
  passwordCredentials?: PasswordCredential[];
  /**
   * list of pre-authorizaed applications.
  */
  preAuthorizedApplications?: PreAuthorizedApplication[];
  /**
   * Specifies whether this application is a public client (such as an installed application
   * running on a mobile device). Default is false.
  */
  publicClient?: boolean;
  /**
   * Reliable domain which can be used to identify an application.
  */
  publisherDomain?: string;
  /**
   * A collection of reply URLs for the application.
  */
  replyUrls?: string[];
  /**
   * Specifies resources that this application requires access to and the set of OAuth permission
   * scopes and application roles that it needs under each of those resources. This
   * pre-configuration of required resource access drives the consent experience.
  */
  requiredResourceAccess?: RequiredResourceAccess[];
  /**
   * The URL to the SAML metadata for the application.
  */
  samlMetadataUrl?: string;
  /**
   * Audience for signing in to the application (AzureADMyOrganizatio, AzureADAllorganizations,
   * AzureADAndMicrosofAccounts).
  */
  signInAudience?: string;
  /**
   * The primary Web page.
  */
  wwwHomepage?: string;
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
 * Active Directory service principal common perperties shared among GET, POST and PATCH
*/
export interface ServicePrincipalBase {
  /**
   * whether or not the service principal account is enabled
  */
  accountEnabled?: string;
  /**
   * Specifies whether an AppRoleAssignment to a user or group is required before Azure AD will
   * issue a user or access token to the application.
  */
  appRoleAssignmentRequired?: boolean;
  /**
   * The collection of key credentials associated with the service principal.
  */
  keyCredentials?: KeyCredential[];
  /**
   * The collection of password credentials associated with the service principal.
  */
  passwordCredentials?: PasswordCredential[];
  /**
   * the type of the servie principal
  */
  servicePrincipalType?: string;
  /**
   * Optional list of tags that you can apply to your service principals. Not nullable.
  */
  tags?: string[];
}

/**
 * Request parameters for creating a new service principal.
*/
export interface ServicePrincipalCreateParameters extends ServicePrincipalBase {
  /**
   * The application ID.
  */
  appId: string;
}

/**
 * Request parameters for update an existing service principal.
*/
export interface ServicePrincipalUpdateParameters extends ServicePrincipalBase {
}

/**
 * Active Directory service principal information.
*/
export interface ServicePrincipal extends DirectoryObject {
  /**
   * whether or not the service principal account is enabled
  */
  accountEnabled?: string;
  /**
   * altenative names
  */
  alternativeNames?: string[];
  /**
   * The display name exposed by the associated application.
  */
  readonly appDisplayName?: string;
  /**
   * The application ID.
  */
  appId?: string;
  readonly appOwnerTenantId?: string;
  /**
   * Specifies whether an AppRoleAssignment to a user or group is required before Azure AD will
   * issue a user or access token to the application.
  */
  appRoleAssignmentRequired?: boolean;
  /**
   * The collection of application roles that an application may declare. These roles can be
   * assigned to users, groups or service principals.
  */
  appRoles?: AppRole[];
  /**
   * The display name of the service principal.
  */
  displayName?: string;
  /**
   * A URL provided by the author of the associated application to report errors when using the
   * application.
  */
  errorUrl?: string;
  /**
   * The URL to the homepage of the associated application.
  */
  homepage?: string;
  /**
   * The collection of key credentials associated with the service principal.
  */
  keyCredentials?: KeyCredential[];
  /**
   * A URL provided by the author of the associated application to logout
  */
  logoutUrl?: string;
  /**
   * The OAuth 2.0 permissions exposed by the associated application.
  */
  readonly oauth2Permissions?: OAuth2Permission[];
  /**
   * The collection of password credentials associated with the service principal.
  */
  passwordCredentials?: PasswordCredential[];
  /**
   * The thubmbprint of preferred certificate to sign the token
  */
  preferredTokenSigningKeyThumbprint?: string;
  /**
   * The publisher's name of the associated application
  */
  publisherName?: string;
  /**
   * The URLs that user tokens are sent to for sign in with the associated application.  The
   * redirect URIs that the oAuth 2.0 authorization code and access tokens are sent to for the
   * associated application.
  */
  replyUrls?: string[];
  /**
   * The URL to the SAML metadata of the associated application
  */
  samlMetadataUrl?: string;
  /**
   * A collection of service principal names.
  */
  servicePrincipalNames?: string[];
  /**
   * the type of the servie principal
  */
  servicePrincipalType?: string;
  /**
   * Optional list of tags that you can apply to your service principals. Not nullable.
  */
  tags?: string[];
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

export interface OAuth2PermissionGrant {
  /**
   * Microsoft.DirectoryServices.OAuth2PermissionGrant
  */
  odatatype?: string;
  /**
   * The id of the resource's service principal granted consent to impersonate the user when
   * accessing the resource (represented by the resourceId property).
  */
  clientId?: string;
  /**
   * The id of the permission grant
  */
  objectId?: string;
  /**
   * Indicates if consent was provided by the administrator (on behalf of the organization) or by
   * an individual. Possible values include: 'AllPrincipals', 'Principal'
  */
  consentType?: string;
  /**
   * When consent type is Principal, this property specifies the id of the user that granted
   * consent and applies only for that user.
  */
  principalId?: string;
  /**
   * Object Id of the resource you want to grant
  */
  resourceId?: string;
  /**
   * Specifies the value of the scope claim that the resource application should expect in the
   * OAuth 2.0 access token. For example, User.Read
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

/**
 * Server response for get oauth2 permissions grants
*/
export interface OAuth2PermissionGrantListResult extends Array<OAuth2PermissionGrant> {
  /**
   * the URL to get the next set of results.
  */
  odatanextLink?: string;
}
