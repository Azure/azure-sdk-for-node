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
 * The resource model definition.
 */
export interface Resource extends BaseResource {
  /**
   * Resource ID
   */
  readonly id?: string;
  /**
   * Resource name
   */
  readonly name?: string;
  /**
   * Resource type
   */
  readonly type?: string;
  /**
   * Resource location
   */
  readonly location?: string;
  /**
   * Resource tags
   */
  readonly tags?: { [propertyName: string]: string };
}

/**
 * Specifies the hardware settings for the HANA instance.
 */
export interface HardwareProfile {
  /**
   * Name of the hardware type (vendor and/or their product name). Possible values include:
   * 'Cisco_UCS', 'HPE'
   */
  readonly hardwareType?: string;
  /**
   * Specifies the HANA instance SKU. Possible values include: 'S72m', 'S144m', 'S72', 'S144',
   * 'S192', 'S192m', 'S192xm', 'S96', 'S384', 'S384m', 'S384xm', 'S384xxm', 'S576m', 'S576xm',
   * 'S768', 'S768m', 'S768xm', 'S960m'
   */
  readonly hanaInstanceSize?: string;
}

/**
 * Specifies the disk information fo the HANA instance
 */
export interface Disk {
  /**
   * The disk name.
   */
  name?: string;
  /**
   * Specifies the size of an empty data disk in gigabytes.
   */
  diskSizeGB?: number;
  /**
   * Specifies the logical unit number of the data disk. This value is used to identify data disks
   * within the VM and therefore must be unique for each data disk attached to a VM.
   */
  readonly lun?: number;
}

/**
 * Specifies the storage settings for the HANA instance disks.
 */
export interface StorageProfile {
  /**
   * IP Address to connect to storage.
   */
  readonly nfsIpAddress?: string;
  /**
   * Specifies information about the operating system disk used by the hana instance.
   */
  osDisks?: Disk[];
}

/**
 * Specifies the operating system settings for the HANA instance.
 */
export interface OSProfile {
  /**
   * Specifies the host OS name of the HANA instance.
   */
  readonly computerName?: string;
  /**
   * This property allows you to specify the type of the OS.
   */
  readonly osType?: string;
  /**
   * Specifies version of operating system.
   */
  readonly version?: string;
}

/**
 * Specifies the IP address of the network interface.
 */
export interface IpAddress {
  /**
   * Specifies the IP address of the network interface.
   */
  readonly ipAddress?: string;
}

/**
 * Specifies the network settings for the HANA instance disks.
 */
export interface NetworkProfile {
  /**
   * Specifies the network interfaces for the HANA instance.
   */
  networkInterfaces?: IpAddress[];
  /**
   * Specifies the circuit id for connecting to express route.
   */
  readonly circuitId?: string;
}

/**
 * HANA instance info on Azure (ARM properties and HANA properties)
 */
export interface HanaInstance extends Resource {
  /**
   * Specifies the hardware settings for the HANA instance.
   */
  hardwareProfile?: HardwareProfile;
  /**
   * Specifies the storage settings for the HANA instance disks.
   */
  storageProfile?: StorageProfile;
  /**
   * Specifies the operating system settings for the HANA instance.
   */
  osProfile?: OSProfile;
  /**
   * Specifies the network settings for the HANA instance.
   */
  networkProfile?: NetworkProfile;
  /**
   * Specifies the HANA instance unique ID.
   */
  readonly hanaInstanceId?: string;
  /**
   * Resource power state. Possible values include: 'starting', 'started', 'stopping', 'stopped',
   * 'restarting', 'unknown'
   */
  readonly powerState?: string;
  /**
   * Resource proximity placement group
   */
  readonly proximityPlacementGroup?: string;
  /**
   * Hardware revision of a HANA instance
   */
  readonly hwRevision?: string;
}

/**
 * Detailed HANA operation information
 */
export interface Display {
  /**
   * The localized friendly form of the resource provider name. This form is also expected to
   * include the publisher/company responsible. Use Title Casing. Begin with "Microsoft" for 1st
   * party services.
   */
  readonly provider?: string;
  /**
   * The localized friendly form of the resource type related to this action/operation. This form
   * should match the public documentation for the resource provider. Use Title Casing. For
   * examples, refer to the “name” section.
   */
  readonly resource?: string;
  /**
   * The localized friendly name for the operation as shown to the user. This name should be
   * concise (to fit in drop downs), but clear (self-documenting). Use Title Casing and include the
   * entity/resource to which it applies.
   */
  readonly operation?: string;
  /**
   * The localized friendly description for the operation as shown to the user. This description
   * should be thorough, yet concise. It will be used in tool-tips and detailed views.
   */
  readonly description?: string;
  /**
   * The intended executor of the operation; governs the display of the operation in the RBAC UX
   * and the audit logs UX. Default value is 'user,system'
   */
  readonly origin?: string;
}

/**
 * HANA operation information
 */
export interface Operation {
  /**
   * The name of the operation being performed on this particular object. This name should match
   * the action name that appears in RBAC / the event service.
   */
  readonly name?: string;
  /**
   * Displayed HANA operation information
   */
  display?: Display;
}

/**
 * Describes the format of Error response.
 */
export interface ErrorResponse {
  /**
   * Error code
   */
  code?: string;
  /**
   * Error message indicating why the operation failed.
   */
  message?: string;
}

/**
 * Tags field of the HANA instance.
 */
export interface Tags {
  /**
   * Tags field of the HANA instance.
   */
  tags?: { [propertyName: string]: string };
}

/**
 * Details needed to monitor a Hana Instance
 */
export interface MonitoringDetails {
  /**
   * ARM ID of an Azure Vnet with access to the HANA instance.
   */
  hanaVnet?: string;
  /**
   * Hostname of the HANA Instance blade.
   */
  hanaHostname?: string;
  /**
   * A number between 00 and 99, stored as a string to maintain leading zero.
   */
  hanaInstanceNum?: string;
  /**
   * Flag to specify the use of MDC(Multi Database Containers).
   */
  hanaMdc?: boolean;
  /**
   * Name of the database itself.  It only needs to be specified if using MDC
   */
  hanaDatabase?: string;
  /**
   * Username for the HANA database to login to for monitoring
   */
  hanaDbUsername?: string;
  /**
   * Password for the HANA database to login for monitoring
   */
  hanaDbPassword?: string;
}

/**
 * List of HANA operations
 */
export interface OperationList extends Array<Operation> {
}

/**
 * The response from the List HANA Instances operation.
 */
export interface HanaInstancesListResult extends Array<HanaInstance> {
  /**
   * The URL to get the next set of HANA instances.
   */
  nextLink?: string;
}
