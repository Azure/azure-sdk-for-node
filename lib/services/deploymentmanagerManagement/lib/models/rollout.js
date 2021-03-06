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

const models = require('./index');

/**
 * Defines the rollout.
 *
 * @extends models['TrackedResource']
 */
class Rollout extends models['TrackedResource'] {
  /**
   * Create a Rollout.
   * @member {object} [identity] Identity for the resource.
   * @member {string} [identity.type] The identity type.
   * @member {array} [identity.identityIds] The list of identities.
   * @member {string} buildVersion The version of the build being deployed.
   * @member {string} [artifactSourceId] The reference to the artifact source
   * resource Id where the payload is located.
   * @member {string} targetServiceTopologyId The resource Id of the service
   * topology from which service units are being referenced in step groups to
   * be deployed.
   * @member {array} stepGroups The list of step groups that define the
   * orchestration.
   * @member {string} [status] The current status of the rollout.
   * @member {number} [totalRetryAttempts] The cardinal count of total number
   * of retries performed on the rollout at a given time.
   * @member {object} [operationInfo] Operational information of the rollout.
   * @member {number} [operationInfo.retryAttempt] The ordinal count of the
   * number of retry attempts on a rollout. 0 if no retries of the rollout have
   * been performed. If the rollout is updated with a PUT, this count is reset
   * to 0.
   * @member {boolean} [operationInfo.skipSucceededOnRetry] True, if all steps
   * that succeeded on the previous run/attempt were chosen to be skipped in
   * this retry attempt. False, otherwise.
   * @member {date} [operationInfo.startTime] The start time of the rollout in
   * UTC.
   * @member {date} [operationInfo.endTime] The start time of the rollout in
   * UTC. This property will not be set if the rollout has not completed yet.
   * @member {object} [operationInfo.error] The detailed error information for
   * any failure.
   * @member {string} [operationInfo.error.code] Error code string.
   * @member {string} [operationInfo.error.message] Descriptive error
   * information.
   * @member {string} [operationInfo.error.target] Error target
   * @member {array} [operationInfo.error.details] More detailed error
   * information.
   * @member {array} [services] The detailed information on the services being
   * deployed.
   */
  constructor() {
    super();
  }

  /**
   * Defines the metadata of Rollout
   *
   * @returns {object} metadata of Rollout
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'Rollout',
      type: {
        name: 'Composite',
        className: 'Rollout',
        modelProperties: {
          id: {
            required: false,
            readOnly: true,
            serializedName: 'id',
            type: {
              name: 'String'
            }
          },
          name: {
            required: false,
            readOnly: true,
            serializedName: 'name',
            type: {
              name: 'String'
            }
          },
          type: {
            required: false,
            readOnly: true,
            serializedName: 'type',
            type: {
              name: 'String'
            }
          },
          tags: {
            required: false,
            serializedName: 'tags',
            type: {
              name: 'Dictionary',
              value: {
                  required: false,
                  serializedName: 'StringElementType',
                  type: {
                    name: 'String'
                  }
              }
            }
          },
          location: {
            required: true,
            serializedName: 'location',
            type: {
              name: 'String'
            }
          },
          identity: {
            required: false,
            serializedName: 'identity',
            type: {
              name: 'Composite',
              className: 'Identity'
            }
          },
          buildVersion: {
            required: true,
            serializedName: 'properties.buildVersion',
            type: {
              name: 'String'
            }
          },
          artifactSourceId: {
            required: false,
            serializedName: 'properties.artifactSourceId',
            type: {
              name: 'String'
            }
          },
          targetServiceTopologyId: {
            required: true,
            serializedName: 'properties.targetServiceTopologyId',
            type: {
              name: 'String'
            }
          },
          stepGroups: {
            required: true,
            serializedName: 'properties.stepGroups',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'StepElementType',
                  type: {
                    name: 'Composite',
                    className: 'Step'
                  }
              }
            }
          },
          status: {
            required: false,
            readOnly: true,
            serializedName: 'properties.status',
            type: {
              name: 'String'
            }
          },
          totalRetryAttempts: {
            required: false,
            readOnly: true,
            serializedName: 'properties.totalRetryAttempts',
            type: {
              name: 'Number'
            }
          },
          operationInfo: {
            required: false,
            readOnly: true,
            serializedName: 'properties.operationInfo',
            type: {
              name: 'Composite',
              className: 'RolloutOperationInfo'
            }
          },
          services: {
            required: false,
            readOnly: true,
            serializedName: 'properties.services',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'ServiceElementType',
                  type: {
                    name: 'Composite',
                    className: 'Service'
                  }
              }
            }
          }
        }
      }
    };
  }
}

module.exports = Rollout;
