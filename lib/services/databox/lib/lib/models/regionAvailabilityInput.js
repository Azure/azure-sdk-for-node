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
 * Inputs to get list of supported storage regions and service regions for job
 * creation.
 *
 */
class RegionAvailabilityInput {
  /**
   * Create a RegionAvailabilityInput.
   * @member {string} countryCode Country for which the supported regions are
   * requested. Possible values include: 'US', 'NL', 'IE', 'AT', 'IT', 'BE',
   * 'LV', 'BG', 'LT', 'HR', 'LU', 'CY', 'MT', 'CZ', 'DK', 'PL', 'EE', 'PT',
   * 'FI', 'RO', 'FR', 'SK', 'DE', 'SI', 'GR', 'ES', 'HU', 'SE', 'GB'
   * @member {string} deviceType Device type for which the supported regions
   * have to be fetched. Possible values include: 'Pod', 'Disk', 'Cabinet'
   */
  constructor() {
  }

  /**
   * Defines the metadata of RegionAvailabilityInput
   *
   * @returns {object} metadata of RegionAvailabilityInput
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'RegionAvailabilityInput',
      type: {
        name: 'Composite',
        className: 'RegionAvailabilityInput',
        modelProperties: {
          countryCode: {
            required: true,
            serializedName: 'countryCode',
            type: {
              name: 'Enum',
              allowedValues: [ 'US', 'NL', 'IE', 'AT', 'IT', 'BE', 'LV', 'BG', 'LT', 'HR', 'LU', 'CY', 'MT', 'CZ', 'DK', 'PL', 'EE', 'PT', 'FI', 'RO', 'FR', 'SK', 'DE', 'SI', 'GR', 'ES', 'HU', 'SE', 'GB' ]
            }
          },
          deviceType: {
            required: true,
            serializedName: 'deviceType',
            type: {
              name: 'Enum',
              allowedValues: [ 'Pod', 'Disk', 'Cabinet' ]
            }
          }
        }
      }
    };
  }
}

module.exports = RegionAvailabilityInput;