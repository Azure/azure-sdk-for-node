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
 * This type describes a gateway resource.
 *
 */
class GatewayResourceDescription {
  /**
   * Create a GatewayResourceDescription.
   * @member {string} name Name of the Gateway resource.
   * @member {string} [description] User readable description of the gateway.
   * @member {object} sourceNetwork Network the gateway should listen on for
   * requests.
   * @member {string} [sourceNetwork.name] Name of the network
   * @member {array} [sourceNetwork.endpointRefs] A list of endpoints that are
   * exposed on this network.
   * @member {object} destinationNetwork Network that the Application is using.
   * @member {string} [destinationNetwork.name] Name of the network
   * @member {array} [destinationNetwork.endpointRefs] A list of endpoints that
   * are exposed on this network.
   * @member {array} [tcp] Configuration for tcp connectivity for this gateway.
   * @member {array} [http] Configuration for http connectivity for this
   * gateway.
   * @member {string} [status] Status of the resource. Possible values include:
   * 'Unknown', 'Ready', 'Upgrading', 'Creating', 'Deleting', 'Failed'
   * @member {string} [statusDetails] Gives additional information about the
   * current status of the gateway.
   * @member {string} [ipAddress] IP address of the gateway. This is populated
   * in the response and is ignored for incoming requests.
   */
  constructor() {
  }

  /**
   * Defines the metadata of GatewayResourceDescription
   *
   * @returns {object} metadata of GatewayResourceDescription
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'GatewayResourceDescription',
      type: {
        name: 'Composite',
        className: 'GatewayResourceDescription',
        modelProperties: {
          name: {
            required: true,
            serializedName: 'name',
            type: {
              name: 'String'
            }
          },
          description: {
            required: false,
            serializedName: 'properties.description',
            type: {
              name: 'String'
            }
          },
          sourceNetwork: {
            required: true,
            serializedName: 'properties.sourceNetwork',
            type: {
              name: 'Composite',
              className: 'NetworkRef'
            }
          },
          destinationNetwork: {
            required: true,
            serializedName: 'properties.destinationNetwork',
            type: {
              name: 'Composite',
              className: 'NetworkRef'
            }
          },
          tcp: {
            required: false,
            serializedName: 'properties.tcp',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'TcpConfigElementType',
                  type: {
                    name: 'Composite',
                    className: 'TcpConfig'
                  }
              }
            }
          },
          http: {
            required: false,
            serializedName: 'properties.http',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'HttpConfigElementType',
                  type: {
                    name: 'Composite',
                    className: 'HttpConfig'
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
          statusDetails: {
            required: false,
            readOnly: true,
            serializedName: 'properties.statusDetails',
            type: {
              name: 'String'
            }
          },
          ipAddress: {
            required: false,
            readOnly: true,
            serializedName: 'properties.ipAddress',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = GatewayResourceDescription;