/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

/**
 * Filters to list the jobs.
 *
 */
class JobQueryObject {
  /**
   * Create a JobQueryObject.
   * @member {string} [status] Status of the job. Possible values include:
   * 'Invalid', 'InProgress', 'Completed', 'Failed', 'CompletedWithWarnings',
   * 'Cancelled', 'Cancelling'
   * @member {string} [backupManagementType] Type of backup managmenent for the
   * job. Possible values include: 'Invalid', 'AzureIaasVM', 'MAB', 'DPM',
   * 'AzureBackupServer', 'AzureSql', 'AzureStorage', 'AzureWorkload',
   * 'DefaultBackup'
   * @member {string} [operation] Type of operation. Possible values include:
   * 'Invalid', 'Register', 'UnRegister', 'ConfigureBackup', 'Backup',
   * 'Restore', 'DisableBackup', 'DeleteBackupData'
   * @member {string} [jobId] JobID represents the job uniquely.
   * @member {date} [startTime] Job has started at this time. Value is in UTC.
   * @member {date} [endTime] Job has ended at this time. Value is in UTC.
   */
  constructor() {
  }

  /**
   * Defines the metadata of JobQueryObject
   *
   * @returns {object} metadata of JobQueryObject
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'JobQueryObject',
      type: {
        name: 'Composite',
        className: 'JobQueryObject',
        modelProperties: {
          status: {
            required: false,
            serializedName: 'status',
            type: {
              name: 'String'
            }
          },
          backupManagementType: {
            required: false,
            serializedName: 'backupManagementType',
            type: {
              name: 'String'
            }
          },
          operation: {
            required: false,
            serializedName: 'operation',
            type: {
              name: 'String'
            }
          },
          jobId: {
            required: false,
            serializedName: 'jobId',
            type: {
              name: 'String'
            }
          },
          startTime: {
            required: false,
            serializedName: 'startTime',
            type: {
              name: 'DateTime'
            }
          },
          endTime: {
            required: false,
            serializedName: 'endTime',
            type: {
              name: 'DateTime'
            }
          }
        }
      }
    };
  }
}

module.exports = JobQueryObject;
