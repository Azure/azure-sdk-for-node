/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 * 
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
// TODO: Include PageTemplateModels here too?? Probably
 */


/**
 * @class
 * Initializes a new instance of the KeyCredential class.
 * @constructor
 * Active Directory service principal Key Credential information
 *
 * @member {date} [startDate] Gets or sets start date
 * 
 * @member {date} [endDate] Gets or sets end date
 * 
 * @member {string} [value] Gets or sets value
 * 
 * @member {string} [keyId] Gets or sets key Id
 * 
 * @member {string} [usage] Gets or sets usage
 * 
 * @member {string} [type] Gets or sets type
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
 * Active Directory service principal Password Credential information
 *
 * @member {date} [startDate] Gets or sets start date
 * 
 * @member {date} [endDate] Gets or sets end date
 * 
 * @member {string} [keyId] Gets or sets key Id
 * 
 * @member {string} [value] Gets or sets value
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
 * Request parameters for create a new application
 *
 * @member {boolean} availableToOtherTenants Indicates if the application will
 * be available to other tenants
 * 
 * @member {string} displayName Application display name
 * 
 * @member {string} homepage Application homepage
 * 
 * @member {array} identifierUris Application Uris
 * 
 * @member {array} [replyUrls] Application reply Urls
 * 
 * @member {array} [keyCredentials] Gets or sets the list of KeyCredential
 * objects
 * 
 * @member {array} [passwordCredentials] Gets or sets the list of
 * PasswordCredential objects
 * 
 */
export interface ApplicationCreateParameters {
    availableToOtherTenants: boolean;
    displayName: string;
    homepage: string;
    identifierUris: string[];
    replyUrls?: string[];
    keyCredentials?: KeyCredential[];
    passwordCredentials?: PasswordCredential[];
}

/**
 * @class
 * Initializes a new instance of the ApplicationUpdateParameters class.
 * @constructor
 * Request parameters for updating an existing application
 *
 * @member {string} [displayName] Application display name
 * 
 * @member {string} [homepage] Application homepage
 * 
 * @member {array} [identifierUris] Application Uris
 * 
 * @member {array} [replyUrls] Application reply Urls
 * 
 * @member {array} [keyCredentials] Gets or sets the list of KeyCredential
 * objects
 * 
 * @member {array} [passwordCredentials] Gets or sets the list of
 * PasswordCredential objects
 * 
 */
export interface ApplicationUpdateParameters {
    displayName?: string;
    homepage?: string;
    identifierUris?: string[];
    replyUrls?: string[];
    keyCredentials?: KeyCredential[];
    passwordCredentials?: PasswordCredential[];
}

/**
 * @class
 * Initializes a new instance of the ApplicationFilter class.
 * @constructor
 * Filter parameters for listing applications
 *
 * @member {string} [displayNameStartsWith] Application display name starts
 * with
 * 
 * @member {string} [appId] ApplicationId
 * 
 * @member {string} [identifierUri] Identifier Uri
 * 
 */
export interface ApplicationFilter {
    displayNameStartsWith?: string;
    appId?: string;
    identifierUri?: string;
}

/**
 * @class
 * Initializes a new instance of the Application class.
 * @constructor
 * Active Directory user information
 *
 * @member {string} [objectId] Gets or sets object Id
 * 
 * @member {string} [objectType] Gets or sets object type
 * 
 * @member {string} [appId] Gets or sets application Id
 * 
 * @member {array} [appPermissions] Gets or sets application permissions
 * 
 * @member {boolean} [availableToOtherTenants] Indicates if the application
 * will be available to other tenants
 * 
 * @member {string} [displayName] Gets or sets the displayName
 * 
 * @member {array} [identifierUris] Gets or sets the application identifier
 * Uris
 * 
 * @member {array} [replyUrls] Gets or sets the application reply Urls
 * 
 * @member {string} [homepage] Application homepage
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
 * Initializes a new instance of the AADObject class.
 * @constructor
 * Active Directory object information
 *
 * @member {string} [objectId] Gets or sets object Id
 * 
 * @member {string} [objectType] Gets or sets object type
 * 
 * @member {string} [displayName] Gets or sets object display name
 * 
 * @member {string} [userPrincipalName] Gets or sets principal name
 * 
 * @member {string} [mail] Gets or sets mail
 * 
 * @member {boolean} [mailEnabled] Gets or sets MailEnabled field
 * 
 * @member {boolean} [securityEnabled] Gets or sets SecurityEnabled field
 * 
 * @member {string} [signInName] Gets or sets signIn name
 * 
 * @member {array} [servicePrincipalNames] Gets or sets the list of service
 * principal names.
 * 
 * @member {string} [userType] Gets or sets the user type
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
 * Initializes a new instance of the GroupAddMemberParameters class.
 * @constructor
 * Request parameters for adding a member to a group
 *
 * @member {string} url Member Object Url as
 * "https://graph.windows.net/0b1f9851-1bf0-433f-aec3-cb9272f093dc/directoryObjects/f260bbc4-c254-447b-94cf-293b5ec434dd",
 * where "0b1f9851-1bf0-433f-aec3-cb9272f093dc" is the tenantId and
 * "f260bbc4-c254-447b-94cf-293b5ec434dd" is the objectId of the member
 * (user, application, servicePrincipal, group) to be added.
 * 
 */
export interface GroupAddMemberParameters {
    url: string;
}

/**
 * @class
 * Initializes a new instance of the GroupCreateParameters class.
 * @constructor
 * Request parameters for create a new group
 *
 * @member {string} displayName Group display name
 * 
 * @member {string} mailNickname Mail nick name
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
 * Active Directory group information
 *
 * @member {string} [objectId] Gets or sets object Id
 * 
 * @member {string} [objectType] Gets or sets object type
 * 
 * @member {string} [displayName] Gets or sets group display name
 * 
 * @member {boolean} [securityEnabled] Gets or sets security enabled field
 * 
 * @member {string} [mail] Gets or sets mail field
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
 * Initializes a new instance of the GroupGetMemberGroupsParameters class.
 * @constructor
 * Request parameters for GetMemberGroups API call
 *
 * @member {boolean} securityEnabledOnly If true only membership in security
 * enabled groups should be checked. Otherwise membership in all groups
 * should be checked
 * 
 */
export interface GroupGetMemberGroupsParameters {
    securityEnabledOnly: boolean;
}

/**
 * @class
 * Initializes a new instance of the CheckGroupMembershipParameters class.
 * @constructor
 * Request parameters for IsMemberOf API call
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
 * @member {boolean} [value] true if the specified user, group, contact, or
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
 * Request parameters for create a new service principal
 *
 * @member {string} appId Gets or sets application Id
 * 
 * @member {boolean} accountEnabled Specifies if the account is enabled
 * 
 */
export interface ServicePrincipalCreateParameters {
    appId: string;
    accountEnabled: boolean;
}

/**
 * @class
 * Initializes a new instance of the ServicePrincipal class.
 * @constructor
 * Active Directory service principal information
 *
 * @member {string} [objectId] Gets or sets object Id
 * 
 * @member {string} [objectType] Gets or sets object type
 * 
 * @member {string} [displayName] Gets or sets service principal display name
 * 
 * @member {string} [appId] Gets or sets app id
 * 
 * @member {array} [servicePrincipalNames] Gets or sets the list of names.
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
 * Initializes a new instance of the PasswordProfile class.
 * @constructor
 * Contains the password profile associated with a user.
 *
 * @member {string} password Password
 * 
 * @member {boolean} [forceChangePasswordNextLogin] Force change password on
 * next login
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
 * Request parameters for create a new work or school account user
 *
 * @member {boolean} accountEnabled Enable the account. If it is enabled then
 * true else false.
 * 
 * @member {string} displayName User display name
 * 
 * @member {object} passwordProfile Password Profile
 * 
 * @member {string} [passwordProfile.password] Password
 * 
 * @member {boolean} [passwordProfile.forceChangePasswordNextLogin] Force
 * change password on next login
 * 
 * @member {string} userPrincipalName The user principal name
 * (someuser@contoso.com). It must contain one of the verified domains for
 * the tenant.
 * 
 * @member {string} mailNickname The mail alias for the user
 * 
 * @member {string} [immutableId] Needs to be specified if you are using a
 * federated domain for the user's userPrincipalName (UPN) property while
 * creating a new user account. It is used to associate an on-premises Active
 * Directory user account to their Azure AD user object.
 * 
 */
export interface UserCreateParameters {
    accountEnabled: boolean;
    displayName: string;
    passwordProfile: PasswordProfile;
    userPrincipalName: string;
    mailNickname: string;
    immutableId?: string;
}

/**
 * @class
 * Initializes a new instance of the UserUpdateParameters class.
 * @constructor
 * Request parameters for updating an existing work or school account user
 *
 * @member {boolean} [accountEnabled] Enable the account. If it is enabled
 * then true else false.
 * 
 * @member {string} [displayName] User display name
 * 
 * @member {object} [passwordProfile] Password Profile
 * 
 * @member {string} [passwordProfile.password] Password
 * 
 * @member {boolean} [passwordProfile.forceChangePasswordNextLogin] Force
 * change password on next login
 * 
 * @member {string} [mailNickname] The mail alias for the user
 * 
 */
export interface UserUpdateParameters {
    accountEnabled?: boolean;
    displayName?: string;
    passwordProfile?: PasswordProfile;
    mailNickname?: string;
}

/**
 * @class
 * Initializes a new instance of the User class.
 * @constructor
 * Active Directory user information
 *
 * @member {string} [objectId] Gets or sets object Id
 * 
 * @member {string} [objectType] Gets or sets object type
 * 
 * @member {string} [userPrincipalName] Gets or sets user principal name
 * 
 * @member {string} [displayName] Gets or sets user display name
 * 
 * @member {string} [signInName] Gets or sets user signIn name
 * 
 * @member {string} [mail] Gets or sets user mail
 * 
 * @member {string} [mailNickname] The mail alias for the user
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
}

/**
 * @class
 * Initializes a new instance of the UserGetMemberGroupsParameters class.
 * @constructor
 * Request parameters for GetMemberGroups API call
 *
 * @member {boolean} securityEnabledOnly If true only membership in security
 * enabled groups should be checked. Otherwise membership in all groups
 * should be checked
 * 
 */
export interface UserGetMemberGroupsParameters {
    securityEnabledOnly: boolean;
}

/**
 * @class
 * Initializes a new instance of the GetObjectsParameters class.
 * @constructor
 * Request parameters for GetObjectsByObjectIds API call
 *
 * @member {array} [objectIds] Requested object Ids
 * 
 * @member {array} [types] Requested object types
 * 
 * @member {boolean} includeDirectoryObjectReferences If true, also searches
 * for object ids in the partner tenant
 * 
 */
export interface GetObjectsParameters {
    objectIds?: string[];
    types?: string[];
    includeDirectoryObjectReferences: boolean;
}
