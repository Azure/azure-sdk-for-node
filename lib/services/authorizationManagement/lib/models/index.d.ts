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
import * as moment from 'moment';

export { BaseResource } from 'ms-rest-azure';
export { CloudError } from 'ms-rest-azure';


/**
 * @class
 * Initializes a new instance of the ClassicAdministrator class.
 * @constructor
 * Classic Administrators
 *
 * @member {string} [id] The ID of the administrator.
 * @member {string} [name] The name of the administrator.
 * @member {string} [type] The type of the administrator.
 * @member {string} [emailAddress] The email address of the administrator.
 * @member {string} [role] The role of the administrator.
 */
export interface ClassicAdministrator {
  id?: string;
  name?: string;
  type?: string;
  emailAddress?: string;
  role?: string;
}

/**
 * @class
 * Initializes a new instance of the ProviderOperation class.
 * @constructor
 * Operation
 *
 * @member {string} [name] The operation name.
 * @member {string} [displayName] The operation display name.
 * @member {string} [description] The operation description.
 * @member {string} [origin] The operation origin.
 * @member {object} [properties] The operation properties.
 * @member {boolean} [isDataAction] The dataAction flag to specify the
 * operation type.
 */
export interface ProviderOperation {
  name?: string;
  displayName?: string;
  description?: string;
  origin?: string;
  properties?: any;
  isDataAction?: boolean;
}

/**
 * @class
 * Initializes a new instance of the ResourceType class.
 * @constructor
 * Resource Type
 *
 * @member {string} [name] The resource type name.
 * @member {string} [displayName] The resource type display name.
 * @member {array} [operations] The resource type operations.
 */
export interface ResourceType {
  name?: string;
  displayName?: string;
  operations?: ProviderOperation[];
}

/**
 * @class
 * Initializes a new instance of the ProviderOperationsMetadata class.
 * @constructor
 * Provider Operations metadata
 *
 * @member {string} [id] The provider id.
 * @member {string} [name] The provider name.
 * @member {string} [type] The provider type.
 * @member {string} [displayName] The provider display name.
 * @member {array} [resourceTypes] The provider resource types
 * @member {array} [operations] The provider operations.
 */
export interface ProviderOperationsMetadata {
  id?: string;
  name?: string;
  type?: string;
  displayName?: string;
  resourceTypes?: ResourceType[];
  operations?: ProviderOperation[];
}

/**
 * @class
 * Initializes a new instance of the Permission class.
 * @constructor
 * Role definition permissions.
 *
 * @member {array} [actions] Allowed actions.
 * @member {array} [notActions] Denied actions.
 * @member {array} [dataActions] Allowed Data actions.
 * @member {array} [notDataActions] Denied Data actions.
 */
export interface Permission {
  actions?: string[];
  notActions?: string[];
  dataActions?: string[];
  notDataActions?: string[];
}

/**
 * @class
 * Initializes a new instance of the RoleDefinitionFilter class.
 * @constructor
 * Role Definitions filter
 *
 * @member {string} [roleName] Returns role definition with the specific name.
 * @member {string} [type] Returns role definition with the specific type.
 */
export interface RoleDefinitionFilter {
  roleName?: string;
  type?: string;
}

/**
 * @class
 * Initializes a new instance of the RoleDefinition class.
 * @constructor
 * Role definition.
 *
 * @member {string} [id] The role definition ID.
 * @member {string} [name] The role definition name.
 * @member {string} [type] The role definition type.
 * @member {string} [roleName] The role name.
 * @member {string} [description] The role definition description.
 * @member {string} [roleType] The role type.
 * @member {array} [permissions] Role definition permissions.
 * @member {array} [assignableScopes] Role definition assignable scopes.
 */
export interface RoleDefinition {
  readonly id?: string;
  readonly name?: string;
  readonly type?: string;
  roleName?: string;
  description?: string;
  roleType?: string;
  permissions?: Permission[];
  assignableScopes?: string[];
}

/**
 * @class
 * Initializes a new instance of the RoleAssignmentFilter class.
 * @constructor
 * Role Assignments filter
 *
 * @member {string} [principalId] Returns role assignment of the specific
 * principal.
 * @member {boolean} [canDelegate] The Delegation flag for the roleassignment
 */
export interface RoleAssignmentFilter {
  principalId?: string;
  canDelegate?: boolean;
}

/**
 * @class
 * Initializes a new instance of the RoleAssignment class.
 * @constructor
 * Role Assignments
 *
 * @member {string} [id] The role assignment ID.
 * @member {string} [name] The role assignment name.
 * @member {string} [type] The role assignment type.
 * @member {string} [scope] The role assignment scope.
 * @member {string} [roleDefinitionId] The role definition ID.
 * @member {string} [principalId] The principal ID.
 * @member {boolean} [canDelegate] The Delegation flag for the roleassignment
 */
export interface RoleAssignment {
  readonly id?: string;
  readonly name?: string;
  readonly type?: string;
  scope?: string;
  roleDefinitionId?: string;
  principalId?: string;
  canDelegate?: boolean;
}

/**
 * @class
 * Initializes a new instance of the RoleAssignmentCreateParameters class.
 * @constructor
 * Role assignment create parameters.
 *
 * @member {string} [roleDefinitionId] The role definition ID used in the role
 * assignment.
 * @member {string} [principalId] The principal ID assigned to the role. This
 * maps to the ID inside the Active Directory. It can point to a user, service
 * principal, or security group.
 * @member {string} [principalType] The principal type of the assigned
 * principal ID, e.g. user, service principal.
 * @member {boolean} [canDelegate] The delgation flag used for creating a role
 * assignment
 */
export interface RoleAssignmentCreateParameters {
  roleDefinitionId?: string;
  principalId?: string;
  principalType?: string;
  canDelegate?: boolean;
}


/**
 * @class
 * Initializes a new instance of the ClassicAdministratorListResult class.
 * @constructor
 * ClassicAdministrator list result information.
 *
 * @member {string} [nextLink] The URL to use for getting the next set of
 * results.
 */
export interface ClassicAdministratorListResult extends Array<ClassicAdministrator> {
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the ProviderOperationsMetadataListResult class.
 * @constructor
 * Provider operations metadata list
 *
 * @member {string} [nextLink] The URL to use for getting the next set of
 * results.
 */
export interface ProviderOperationsMetadataListResult extends Array<ProviderOperationsMetadata> {
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the PermissionGetResult class.
 * @constructor
 * Permissions information.
 *
 * @member {string} [nextLink] The URL to use for getting the next set of
 * results.
 */
export interface PermissionGetResult extends Array<Permission> {
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the RoleAssignmentListResult class.
 * @constructor
 * Role assignment list operation result.
 *
 * @member {string} [nextLink] The URL to use for getting the next set of
 * results.
 */
export interface RoleAssignmentListResult extends Array<RoleAssignment> {
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the RoleDefinitionListResult class.
 * @constructor
 * Role definition list operation result.
 *
 * @member {string} [nextLink] The URL to use for getting the next set of
 * results.
 */
export interface RoleDefinitionListResult extends Array<RoleDefinition> {
  nextLink?: string;
}
