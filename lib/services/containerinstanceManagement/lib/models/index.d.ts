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
 * Initializes a new instance of the ContainerPort class.
 * @constructor
 * The port exposed on the container instance.
 *
 * @member {string} [protocol] The protocol associated with the port. Possible
 * values include: 'TCP', 'UDP'
 * @member {number} port The port number exposed within the container group.
 */
export interface ContainerPort {
  protocol?: string;
  port: number;
}

/**
 * @class
 * Initializes a new instance of the EnvironmentVariable class.
 * @constructor
 * The environment variable to set within the container instance.
 *
 * @member {string} name The name of the environment variable.
 * @member {string} [value] The value of the environment variable.
 * @member {string} [secureValue] The value of the secure environment variable.
 */
export interface EnvironmentVariable {
  name: string;
  value?: string;
  secureValue?: string;
}

/**
 * @class
 * Initializes a new instance of the ContainerState class.
 * @constructor
 * The container instance state.
 *
 * @member {string} [state] The state of the container instance.
 * @member {date} [startTime] The date-time when the container instance state
 * started.
 * @member {number} [exitCode] The container instance exit codes correspond to
 * those from the `docker run` command.
 * @member {date} [finishTime] The date-time when the container instance state
 * finished.
 * @member {string} [detailStatus] The human-readable status of the container
 * instance state.
 */
export interface ContainerState {
  state?: string;
  startTime?: Date;
  exitCode?: number;
  finishTime?: Date;
  detailStatus?: string;
}

/**
 * @class
 * Initializes a new instance of the Event class.
 * @constructor
 * A container group or container instance event.
 *
 * @member {number} [count] The count of the event.
 * @member {date} [firstTimestamp] The date-time of the earliest logged event.
 * @member {date} [lastTimestamp] The date-time of the latest logged event.
 * @member {string} [name] The event name.
 * @member {string} [message] The event message.
 * @member {string} [type] The event type.
 */
export interface Event {
  count?: number;
  firstTimestamp?: Date;
  lastTimestamp?: Date;
  name?: string;
  message?: string;
  type?: string;
}

/**
 * @class
 * Initializes a new instance of the ContainerPropertiesInstanceView class.
 * @constructor
 * The instance view of the container instance. Only valid in response.
 *
 * @member {number} [restartCount] The number of times that the container
 * instance has been restarted.
 * @member {object} [currentState] Current container instance state.
 * @member {string} [currentState.state] The state of the container instance.
 * @member {date} [currentState.startTime] The date-time when the container
 * instance state started.
 * @member {number} [currentState.exitCode] The container instance exit codes
 * correspond to those from the `docker run` command.
 * @member {date} [currentState.finishTime] The date-time when the container
 * instance state finished.
 * @member {string} [currentState.detailStatus] The human-readable status of
 * the container instance state.
 * @member {object} [previousState] Previous container instance state.
 * @member {string} [previousState.state] The state of the container instance.
 * @member {date} [previousState.startTime] The date-time when the container
 * instance state started.
 * @member {number} [previousState.exitCode] The container instance exit codes
 * correspond to those from the `docker run` command.
 * @member {date} [previousState.finishTime] The date-time when the container
 * instance state finished.
 * @member {string} [previousState.detailStatus] The human-readable status of
 * the container instance state.
 * @member {array} [events] The events of the container instance.
 */
export interface ContainerPropertiesInstanceView {
  readonly restartCount?: number;
  readonly currentState?: ContainerState;
  readonly previousState?: ContainerState;
  readonly events?: Event[];
}

/**
 * @class
 * Initializes a new instance of the ResourceRequests class.
 * @constructor
 * The resource requests.
 *
 * @member {number} memoryInGB The memory request in GB of this container
 * instance.
 * @member {number} cpu The CPU request of this container instance.
 */
export interface ResourceRequests {
  memoryInGB: number;
  cpu: number;
}

/**
 * @class
 * Initializes a new instance of the ResourceLimits class.
 * @constructor
 * The resource limits.
 *
 * @member {number} [memoryInGB] The memory limit in GB of this container
 * instance.
 * @member {number} [cpu] The CPU limit of this container instance.
 */
export interface ResourceLimits {
  memoryInGB?: number;
  cpu?: number;
}

/**
 * @class
 * Initializes a new instance of the ResourceRequirements class.
 * @constructor
 * The resource requirements.
 *
 * @member {object} requests The resource requests of this container instance.
 * @member {number} [requests.memoryInGB] The memory request in GB of this
 * container instance.
 * @member {number} [requests.cpu] The CPU request of this container instance.
 * @member {object} [limits] The resource limits of this container instance.
 * @member {number} [limits.memoryInGB] The memory limit in GB of this
 * container instance.
 * @member {number} [limits.cpu] The CPU limit of this container instance.
 */
export interface ResourceRequirements {
  requests: ResourceRequests;
  limits?: ResourceLimits;
}

/**
 * @class
 * Initializes a new instance of the VolumeMount class.
 * @constructor
 * The properties of the volume mount.
 *
 * @member {string} name The name of the volume mount.
 * @member {string} mountPath The path within the container where the volume
 * should be mounted. Must not contain colon (:).
 * @member {boolean} [readOnly] The flag indicating whether the volume mount is
 * read-only.
 */
export interface VolumeMount {
  name: string;
  mountPath: string;
  readOnly?: boolean;
}

/**
 * @class
 * Initializes a new instance of the ContainerExec class.
 * @constructor
 * The container execution command, for liveness or readiness probe
 *
 * @member {array} [command] The commands to execute within the container.
 */
export interface ContainerExec {
  command?: string[];
}

/**
 * @class
 * Initializes a new instance of the ContainerHttpGet class.
 * @constructor
 * The container Http Get settings, for liveness or readiness probe
 *
 * @member {string} [path] The path to probe.
 * @member {number} port The port number to probe.
 * @member {string} [scheme] The scheme. Possible values include: 'http',
 * 'https'
 */
export interface ContainerHttpGet {
  path?: string;
  port: number;
  scheme?: string;
}

/**
 * @class
 * Initializes a new instance of the ContainerProbe class.
 * @constructor
 * The container probe, for liveness or readiness
 *
 * @member {object} [exec] The execution command to probe
 * @member {array} [exec.command] The commands to execute within the container.
 * @member {object} [httpGet] The Http Get settings to probe
 * @member {string} [httpGet.path] The path to probe.
 * @member {number} [httpGet.port] The port number to probe.
 * @member {string} [httpGet.scheme] The scheme. Possible values include:
 * 'http', 'https'
 * @member {number} [initialDelaySeconds] The initial delay seconds.
 * @member {number} [periodSeconds] The period seconds.
 * @member {number} [failureThreshold] The failure threshold.
 * @member {number} [successThreshold] The success threshold.
 * @member {number} [timeoutSeconds] The timeout seconds.
 */
export interface ContainerProbe {
  exec?: ContainerExec;
  httpGet?: ContainerHttpGet;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  failureThreshold?: number;
  successThreshold?: number;
  timeoutSeconds?: number;
}

/**
 * @class
 * Initializes a new instance of the Container class.
 * @constructor
 * A container instance.
 *
 * @member {string} name The user-provided name of the container instance.
 * @member {string} image The name of the image used to create the container
 * instance.
 * @member {array} [command] The commands to execute within the container
 * instance in exec form.
 * @member {array} [ports] The exposed ports on the container instance.
 * @member {array} [environmentVariables] The environment variables to set in
 * the container instance.
 * @member {object} [instanceView] The instance view of the container instance.
 * Only valid in response.
 * @member {number} [instanceView.restartCount] The number of times that the
 * container instance has been restarted.
 * @member {object} [instanceView.currentState] Current container instance
 * state.
 * @member {string} [instanceView.currentState.state] The state of the
 * container instance.
 * @member {date} [instanceView.currentState.startTime] The date-time when the
 * container instance state started.
 * @member {number} [instanceView.currentState.exitCode] The container instance
 * exit codes correspond to those from the `docker run` command.
 * @member {date} [instanceView.currentState.finishTime] The date-time when the
 * container instance state finished.
 * @member {string} [instanceView.currentState.detailStatus] The human-readable
 * status of the container instance state.
 * @member {object} [instanceView.previousState] Previous container instance
 * state.
 * @member {string} [instanceView.previousState.state] The state of the
 * container instance.
 * @member {date} [instanceView.previousState.startTime] The date-time when the
 * container instance state started.
 * @member {number} [instanceView.previousState.exitCode] The container
 * instance exit codes correspond to those from the `docker run` command.
 * @member {date} [instanceView.previousState.finishTime] The date-time when
 * the container instance state finished.
 * @member {string} [instanceView.previousState.detailStatus] The
 * human-readable status of the container instance state.
 * @member {array} [instanceView.events] The events of the container instance.
 * @member {object} resources The resource requirements of the container
 * instance.
 * @member {object} [resources.requests] The resource requests of this
 * container instance.
 * @member {number} [resources.requests.memoryInGB] The memory request in GB of
 * this container instance.
 * @member {number} [resources.requests.cpu] The CPU request of this container
 * instance.
 * @member {object} [resources.limits] The resource limits of this container
 * instance.
 * @member {number} [resources.limits.memoryInGB] The memory limit in GB of
 * this container instance.
 * @member {number} [resources.limits.cpu] The CPU limit of this container
 * instance.
 * @member {array} [volumeMounts] The volume mounts available to the container
 * instance.
 * @member {object} [livenessProbe] The liveness probe.
 * @member {object} [livenessProbe.exec] The execution command to probe
 * @member {array} [livenessProbe.exec.command] The commands to execute within
 * the container.
 * @member {object} [livenessProbe.httpGet] The Http Get settings to probe
 * @member {string} [livenessProbe.httpGet.path] The path to probe.
 * @member {number} [livenessProbe.httpGet.port] The port number to probe.
 * @member {string} [livenessProbe.httpGet.scheme] The scheme. Possible values
 * include: 'http', 'https'
 * @member {number} [livenessProbe.initialDelaySeconds] The initial delay
 * seconds.
 * @member {number} [livenessProbe.periodSeconds] The period seconds.
 * @member {number} [livenessProbe.failureThreshold] The failure threshold.
 * @member {number} [livenessProbe.successThreshold] The success threshold.
 * @member {number} [livenessProbe.timeoutSeconds] The timeout seconds.
 * @member {object} [readinessProbe] The readiness probe.
 * @member {object} [readinessProbe.exec] The execution command to probe
 * @member {array} [readinessProbe.exec.command] The commands to execute within
 * the container.
 * @member {object} [readinessProbe.httpGet] The Http Get settings to probe
 * @member {string} [readinessProbe.httpGet.path] The path to probe.
 * @member {number} [readinessProbe.httpGet.port] The port number to probe.
 * @member {string} [readinessProbe.httpGet.scheme] The scheme. Possible values
 * include: 'http', 'https'
 * @member {number} [readinessProbe.initialDelaySeconds] The initial delay
 * seconds.
 * @member {number} [readinessProbe.periodSeconds] The period seconds.
 * @member {number} [readinessProbe.failureThreshold] The failure threshold.
 * @member {number} [readinessProbe.successThreshold] The success threshold.
 * @member {number} [readinessProbe.timeoutSeconds] The timeout seconds.
 */
export interface Container {
  name: string;
  image: string;
  command?: string[];
  ports?: ContainerPort[];
  environmentVariables?: EnvironmentVariable[];
  readonly instanceView?: ContainerPropertiesInstanceView;
  resources: ResourceRequirements;
  volumeMounts?: VolumeMount[];
  livenessProbe?: ContainerProbe;
  readinessProbe?: ContainerProbe;
}

/**
 * @class
 * Initializes a new instance of the AzureFileVolume class.
 * @constructor
 * The properties of the Azure File volume. Azure File shares are mounted as
 * volumes.
 *
 * @member {string} shareName The name of the Azure File share to be mounted as
 * a volume.
 * @member {boolean} [readOnly] The flag indicating whether the Azure File
 * shared mounted as a volume is read-only.
 * @member {string} storageAccountName The name of the storage account that
 * contains the Azure File share.
 * @member {string} [storageAccountKey] The storage account access key used to
 * access the Azure File share.
 */
export interface AzureFileVolume {
  shareName: string;
  readOnly?: boolean;
  storageAccountName: string;
  storageAccountKey?: string;
}

/**
 * @class
 * Initializes a new instance of the GitRepoVolume class.
 * @constructor
 * Represents a volume that is populated with the contents of a git repository
 *
 * @member {string} [directory] Target directory name. Must not contain or
 * start with '..'.  If '.' is supplied, the volume directory will be the git
 * repository.  Otherwise, if specified, the volume will contain the git
 * repository in the subdirectory with the given name.
 * @member {string} repository Repository URL
 * @member {string} [revision] Commit hash for the specified revision.
 */
export interface GitRepoVolume {
  directory?: string;
  repository: string;
  revision?: string;
}

/**
 * @class
 * Initializes a new instance of the Volume class.
 * @constructor
 * The properties of the volume.
 *
 * @member {string} name The name of the volume.
 * @member {object} [azureFile] The Azure File volume.
 * @member {string} [azureFile.shareName] The name of the Azure File share to
 * be mounted as a volume.
 * @member {boolean} [azureFile.readOnly] The flag indicating whether the Azure
 * File shared mounted as a volume is read-only.
 * @member {string} [azureFile.storageAccountName] The name of the storage
 * account that contains the Azure File share.
 * @member {string} [azureFile.storageAccountKey] The storage account access
 * key used to access the Azure File share.
 * @member {object} [emptyDir] The empty directory volume.
 * @member {object} [secret] The secret volume.
 * @member {object} [gitRepo] The git repo volume.
 * @member {string} [gitRepo.directory] Target directory name. Must not contain
 * or start with '..'.  If '.' is supplied, the volume directory will be the
 * git repository.  Otherwise, if specified, the volume will contain the git
 * repository in the subdirectory with the given name.
 * @member {string} [gitRepo.repository] Repository URL
 * @member {string} [gitRepo.revision] Commit hash for the specified revision.
 */
export interface Volume {
  name: string;
  azureFile?: AzureFileVolume;
  emptyDir?: any;
  secret?: { [propertyName: string]: string };
  gitRepo?: GitRepoVolume;
}

/**
 * @class
 * Initializes a new instance of the ContainerGroupIdentityUserAssignedIdentitiesValue class.
 * @constructor
 * @member {string} [principalId] The principal id of user assigned identity.
 * @member {string} [clientId] The client id of user assigned identity.
 */
export interface ContainerGroupIdentityUserAssignedIdentitiesValue {
  readonly principalId?: string;
  readonly clientId?: string;
}

/**
 * @class
 * Initializes a new instance of the ContainerGroupIdentity class.
 * @constructor
 * Identity for the container group.
 *
 * @member {string} [principalId] The principal id of the container group
 * identity. This property will only be provided for a system assigned
 * identity.
 * @member {string} [tenantId] The tenant id associated with the container
 * group. This property will only be provided for a system assigned identity.
 * @member {string} [type] The type of identity used for the container group.
 * The type 'SystemAssigned, UserAssigned' includes both an implicitly created
 * identity and a set of user assigned identities. The type 'None' will remove
 * any identities from the container group. Possible values include:
 * 'SystemAssigned', 'UserAssigned', 'SystemAssigned, UserAssigned', 'None'
 * @member {object} [userAssignedIdentities] The list of user identities
 * associated with the container group. The user identity dictionary key
 * references will be ARM resource ids in the form:
 * '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.
 */
export interface ContainerGroupIdentity {
  readonly principalId?: string;
  readonly tenantId?: string;
  type?: string;
  userAssignedIdentities?: { [propertyName: string]: ContainerGroupIdentityUserAssignedIdentitiesValue };
}

/**
 * @class
 * Initializes a new instance of the ImageRegistryCredential class.
 * @constructor
 * Image registry credential.
 *
 * @member {string} server The Docker image registry server without a protocol
 * such as "http" and "https".
 * @member {string} username The username for the private registry.
 * @member {string} [password] The password for the private registry.
 */
export interface ImageRegistryCredential {
  server: string;
  username: string;
  password?: string;
}

/**
 * @class
 * Initializes a new instance of the Port class.
 * @constructor
 * The port exposed on the container group.
 *
 * @member {string} [protocol] The protocol associated with the port. Possible
 * values include: 'TCP', 'UDP'
 * @member {number} port The port number.
 */
export interface Port {
  protocol?: string;
  port: number;
}

/**
 * @class
 * Initializes a new instance of the IpAddress class.
 * @constructor
 * IP address for the container group.
 *
 * @member {array} ports The list of ports exposed on the container group.
 * @member {string} type Specifies if the IP is exposed to the public internet
 * or private VNET. Possible values include: 'Public', 'Private'
 * @member {string} [ip] The IP exposed to the public internet.
 * @member {string} [dnsNameLabel] The Dns name label for the IP.
 * @member {string} [fqdn] The FQDN for the IP.
 */
export interface IpAddress {
  ports: Port[];
  type: string;
  ip?: string;
  dnsNameLabel?: string;
  readonly fqdn?: string;
}

/**
 * @class
 * Initializes a new instance of the ContainerGroupPropertiesInstanceView class.
 * @constructor
 * The instance view of the container group. Only valid in response.
 *
 * @member {array} [events] The events of this container group.
 * @member {string} [state] The state of the container group. Only valid in
 * response.
 */
export interface ContainerGroupPropertiesInstanceView {
  readonly events?: Event[];
  readonly state?: string;
}

/**
 * @class
 * Initializes a new instance of the LogAnalytics class.
 * @constructor
 * Container group log analytics information.
 *
 * @member {string} workspaceId The workspace id for log analytics
 * @member {string} workspaceKey The workspace key for log analytics
 * @member {string} [logType] The log type to be used. Possible values include:
 * 'ContainerInsights', 'ContainerInstanceLogs'
 * @member {object} [metadata] Metadata for log analytics.
 */
export interface LogAnalytics {
  workspaceId: string;
  workspaceKey: string;
  logType?: string;
  metadata?: { [propertyName: string]: string };
}

/**
 * @class
 * Initializes a new instance of the ContainerGroupDiagnostics class.
 * @constructor
 * Container group diagnostic information.
 *
 * @member {object} [logAnalytics] Container group log analytics information.
 * @member {string} [logAnalytics.workspaceId] The workspace id for log
 * analytics
 * @member {string} [logAnalytics.workspaceKey] The workspace key for log
 * analytics
 * @member {string} [logAnalytics.logType] The log type to be used. Possible
 * values include: 'ContainerInsights', 'ContainerInstanceLogs'
 * @member {object} [logAnalytics.metadata] Metadata for log analytics.
 */
export interface ContainerGroupDiagnostics {
  logAnalytics?: LogAnalytics;
}

/**
 * @class
 * Initializes a new instance of the ContainerGroupNetworkProfile class.
 * @constructor
 * Container group network profile information.
 *
 * @member {string} id The identifier for a network profile.
 */
export interface ContainerGroupNetworkProfile {
  id: string;
}

/**
 * @class
 * Initializes a new instance of the Resource class.
 * @constructor
 * The Resource model definition.
 *
 * @member {string} [id] The resource id.
 * @member {string} [name] The resource name.
 * @member {string} [type] The resource type.
 * @member {string} [location] The resource location.
 * @member {object} [tags] The resource tags.
 */
export interface Resource extends BaseResource {
  readonly id?: string;
  readonly name?: string;
  readonly type?: string;
  location?: string;
  tags?: { [propertyName: string]: string };
}

/**
 * @class
 * Initializes a new instance of the ContainerGroup class.
 * @constructor
 * A container group.
 *
 * @member {object} [identity] The identity of the container group, if
 * configured.
 * @member {string} [identity.principalId] The principal id of the container
 * group identity. This property will only be provided for a system assigned
 * identity.
 * @member {string} [identity.tenantId] The tenant id associated with the
 * container group. This property will only be provided for a system assigned
 * identity.
 * @member {string} [identity.type] The type of identity used for the container
 * group. The type 'SystemAssigned, UserAssigned' includes both an implicitly
 * created identity and a set of user assigned identities. The type 'None' will
 * remove any identities from the container group. Possible values include:
 * 'SystemAssigned', 'UserAssigned', 'SystemAssigned, UserAssigned', 'None'
 * @member {object} [identity.userAssignedIdentities] The list of user
 * identities associated with the container group. The user identity dictionary
 * key references will be ARM resource ids in the form:
 * '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.
 * @member {string} [provisioningState] The provisioning state of the container
 * group. This only appears in the response.
 * @member {array} containers The containers within the container group.
 * @member {array} [imageRegistryCredentials] The image registry credentials by
 * which the container group is created from.
 * @member {string} [restartPolicy] Restart policy for all containers within
 * the container group.
 * - `Always` Always restart
 * - `OnFailure` Restart on failure
 * - `Never` Never restart
 * . Possible values include: 'Always', 'OnFailure', 'Never'
 * @member {object} [ipAddress] The IP address type of the container group.
 * @member {array} [ipAddress.ports] The list of ports exposed on the container
 * group.
 * @member {string} [ipAddress.type] Specifies if the IP is exposed to the
 * public internet or private VNET. Possible values include: 'Public',
 * 'Private'
 * @member {string} [ipAddress.ip] The IP exposed to the public internet.
 * @member {string} [ipAddress.dnsNameLabel] The Dns name label for the IP.
 * @member {string} [ipAddress.fqdn] The FQDN for the IP.
 * @member {string} osType The operating system type required by the containers
 * in the container group. Possible values include: 'Windows', 'Linux'
 * @member {array} [volumes] The list of volumes that can be mounted by
 * containers in this container group.
 * @member {object} [instanceView] The instance view of the container group.
 * Only valid in response.
 * @member {array} [instanceView.events] The events of this container group.
 * @member {string} [instanceView.state] The state of the container group. Only
 * valid in response.
 * @member {object} [diagnostics] The diagnostic information for a container
 * group.
 * @member {object} [diagnostics.logAnalytics] Container group log analytics
 * information.
 * @member {string} [diagnostics.logAnalytics.workspaceId] The workspace id for
 * log analytics
 * @member {string} [diagnostics.logAnalytics.workspaceKey] The workspace key
 * for log analytics
 * @member {string} [diagnostics.logAnalytics.logType] The log type to be used.
 * Possible values include: 'ContainerInsights', 'ContainerInstanceLogs'
 * @member {object} [diagnostics.logAnalytics.metadata] Metadata for log
 * analytics.
 * @member {object} [networkProfile] The network profile information for a
 * container group.
 * @member {string} [networkProfile.id] The identifier for a network profile.
 */
export interface ContainerGroup extends Resource {
  identity?: ContainerGroupIdentity;
  readonly provisioningState?: string;
  containers: Container[];
  imageRegistryCredentials?: ImageRegistryCredential[];
  restartPolicy?: string;
  ipAddress?: IpAddress;
  osType: string;
  volumes?: Volume[];
  readonly instanceView?: ContainerGroupPropertiesInstanceView;
  diagnostics?: ContainerGroupDiagnostics;
  networkProfile?: ContainerGroupNetworkProfile;
}

/**
 * @class
 * Initializes a new instance of the OperationDisplay class.
 * @constructor
 * The display information of the operation.
 *
 * @member {string} [provider] The name of the provider of the operation.
 * @member {string} [resource] The name of the resource type of the operation.
 * @member {string} [operation] The friendly name of the operation.
 * @member {string} [description] The description of the operation.
 */
export interface OperationDisplay {
  provider?: string;
  resource?: string;
  operation?: string;
  description?: string;
}

/**
 * @class
 * Initializes a new instance of the Operation class.
 * @constructor
 * An operation for Azure Container Instance service.
 *
 * @member {string} name The name of the operation.
 * @member {object} display The display information of the operation.
 * @member {string} [display.provider] The name of the provider of the
 * operation.
 * @member {string} [display.resource] The name of the resource type of the
 * operation.
 * @member {string} [display.operation] The friendly name of the operation.
 * @member {string} [display.description] The description of the operation.
 * @member {string} [origin] The intended executor of the operation. Possible
 * values include: 'User', 'System'
 */
export interface Operation {
  name: string;
  display: OperationDisplay;
  origin?: string;
}

/**
 * @class
 * Initializes a new instance of the OperationListResult class.
 * @constructor
 * The operation list response that contains all operations for Azure Container
 * Instance service.
 *
 * @member {array} [value] The list of operations.
 * @member {string} [nextLink] The URI to fetch the next page of operations.
 */
export interface OperationListResult {
  value?: Operation[];
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the UsageName class.
 * @constructor
 * The name object of the resource
 *
 * @member {string} [value] The name of the resource
 * @member {string} [localizedValue] The localized name of the resource
 */
export interface UsageName {
  readonly value?: string;
  readonly localizedValue?: string;
}

/**
 * @class
 * Initializes a new instance of the Usage class.
 * @constructor
 * A single usage result
 *
 * @member {string} [unit] Unit of the usage result
 * @member {number} [currentValue] The current usage of the resource
 * @member {number} [limit] The maximum permitted usage of the resource.
 * @member {object} [name] The name object of the resource
 * @member {string} [name.value] The name of the resource
 * @member {string} [name.localizedValue] The localized name of the resource
 */
export interface Usage {
  readonly unit?: string;
  readonly currentValue?: number;
  readonly limit?: number;
  readonly name?: UsageName;
}

/**
 * @class
 * Initializes a new instance of the UsageListResult class.
 * @constructor
 * The response containing the usage data
 *
 * @member {array} [value]
 */
export interface UsageListResult {
  readonly value?: Usage[];
}

/**
 * @class
 * Initializes a new instance of the Logs class.
 * @constructor
 * The logs.
 *
 * @member {string} [content] The content of the log.
 */
export interface Logs {
  content?: string;
}

/**
 * @class
 * Initializes a new instance of the ContainerExecRequestTerminalSize class.
 * @constructor
 * The size of the terminal.
 *
 * @member {number} [rows] The row size of the terminal
 * @member {number} [cols] The column size of the terminal
 */
export interface ContainerExecRequestTerminalSize {
  rows?: number;
  cols?: number;
}

/**
 * @class
 * Initializes a new instance of the ContainerExecRequest class.
 * @constructor
 * The container exec request.
 *
 * @member {string} [command] The command to be executed.
 * @member {object} [terminalSize] The size of the terminal.
 * @member {number} [terminalSize.rows] The row size of the terminal
 * @member {number} [terminalSize.cols] The column size of the terminal
 */
export interface ContainerExecRequest {
  command?: string;
  terminalSize?: ContainerExecRequestTerminalSize;
}

/**
 * @class
 * Initializes a new instance of the ContainerExecResponse class.
 * @constructor
 * The information for the container exec command.
 *
 * @member {string} [webSocketUri] The uri for the exec websocket.
 * @member {string} [password] The password to start the exec command.
 */
export interface ContainerExecResponse {
  webSocketUri?: string;
  password?: string;
}


/**
 * @class
 * Initializes a new instance of the ContainerGroupListResult class.
 * @constructor
 * The container group list response that contains the container group
 * properties.
 *
 * @member {string} [nextLink] The URI to fetch the next page of container
 * groups.
 */
export interface ContainerGroupListResult extends Array<ContainerGroup> {
  nextLink?: string;
}
