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
 * Properties of an Azure Resource Manager template parameter.
 *
 */
class ArmTemplateParameterPropertiesFragment {
  /**
   * Create a ArmTemplateParameterPropertiesFragment.
   * @member {string} [name] The name of the template parameter.
   * @member {string} [value] The value of the template parameter.
   */
  constructor() {
  }

  /**
   * Defines the metadata of ArmTemplateParameterPropertiesFragment
   *
   * @returns {object} metadata of ArmTemplateParameterPropertiesFragment
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ArmTemplateParameterPropertiesFragment',
      type: {
        name: 'Composite',
        className: 'ArmTemplateParameterPropertiesFragment',
        modelProperties: {
          name: {
            required: false,
            serializedName: 'name',
            type: {
              name: 'String'
            }
          },
          value: {
            required: false,
            serializedName: 'value',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = ArmTemplateParameterPropertiesFragment;