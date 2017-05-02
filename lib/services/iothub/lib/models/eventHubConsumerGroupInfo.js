/*
 * MIT
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the EventHubConsumerGroupInfo class.
 * @constructor
 * The properties of the EventHubConsumerGroupInfo object.
 *
 * @member {object} [tags] The tags.
 *
 * @member {string} [id] The Event Hub-compatible consumer group identifier.
 *
 * @member {string} [name] The Event Hub-compatible consumer group name.
 *
 */
class EventHubConsumerGroupInfo {
  constructor() {
  }

  /**
   * Defines the metadata of EventHubConsumerGroupInfo
   *
   * @returns {object} metadata of EventHubConsumerGroupInfo
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'EventHubConsumerGroupInfo',
      type: {
        name: 'Composite',
        className: 'EventHubConsumerGroupInfo',
        modelProperties: {
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
          id: {
            required: false,
            serializedName: 'id',
            type: {
              name: 'String'
            }
          },
          name: {
            required: false,
            serializedName: 'name',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = EventHubConsumerGroupInfo;
