/*
 * MIT
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the EventHubConsumerGroupsListResult class.
 * @constructor
 * The JSON-serialized array of Event Hub-compatible consumer group names with
 * a next link.
 *
 * @member {string} [nextLink] The next link.
 *
 */
class EventHubConsumerGroupsListResult extends Array {
  constructor() {
    super();
  }

  /**
   * Defines the metadata of EventHubConsumerGroupsListResult
   *
   * @returns {object} metadata of EventHubConsumerGroupsListResult
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'EventHubConsumerGroupsListResult',
      type: {
        name: 'Composite',
        className: 'EventHubConsumerGroupsListResult',
        modelProperties: {
          value: {
            required: false,
            serializedName: '',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'StringElementType',
                  type: {
                    name: 'String'
                  }
              }
            }
          },
          nextLink: {
            required: false,
            readOnly: true,
            serializedName: 'nextLink',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = EventHubConsumerGroupsListResult;
