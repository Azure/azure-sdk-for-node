/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

// Module dependencies.
var xmlbuilder = require('xmlbuilder');

var Constants = require('../../../util/constants');

// Expose 'ServicePropertiesResult'.
exports = module.exports = ServicePropertiesResult;

function ServicePropertiesResult () {}

ServicePropertiesResult.serialize = function (servicePropertiesJs) {
  var doc = xmlbuilder.create();
  doc = doc.begin(Constants.STORAGE_SERVICE_PROPERTIES_ELEMENT, { version: '1.0', encoding: 'utf-8' });

  if (typeof servicePropertiesJs.Logging !== 'undefined') {
    doc = doc.ele(Constants.LOGGING_ELEMENT);
    if (servicePropertiesJs.Logging.Version) {
      doc = doc.ele(Constants.VERSION_ELEMENT)
              .txt(servicePropertiesJs.Logging.Version)
            .up();
    }

    if (typeof servicePropertiesJs.Logging.Delete !== 'undefined') {
      doc = doc.ele(Constants.DELETE_ELEMENT)
              .txt(servicePropertiesJs.Logging.Delete)
            .up();
    }

    if (typeof servicePropertiesJs.Logging.Read !== 'undefined') {
      doc = doc.ele(Constants.READ_ELEMENT)
              .txt(servicePropertiesJs.Logging.Read)
            .up();
    }

    if (typeof servicePropertiesJs.Logging.Write !== 'undefined') {
      doc = doc.ele(Constants.WRITE_ELEMENT)
              .txt(servicePropertiesJs.Logging.Write)
            .up();
    }

    if (typeof servicePropertiesJs.Logging.RetentionPolicy !== 'undefined') {
      doc = doc.ele(Constants.RETENTION_POLICY_ELEMENT);
      if (typeof servicePropertiesJs.Logging.RetentionPolicy.Enabled !== 'undefined') {
        doc = doc.ele(Constants.ENABLED_ELEMENT)
                   .txt(servicePropertiesJs.Logging.RetentionPolicy.Enabled)
                 .up();
      }

      if (typeof servicePropertiesJs.Logging.RetentionPolicy.Days !== 'undefined') {
        doc = doc.ele(Constants.DAYS_ELEMENT)
                   .txt(servicePropertiesJs.Logging.RetentionPolicy.Days)
                 .up();
      }

      doc = doc.up();
    }

    doc = doc.up();
  }

  if (typeof servicePropertiesJs.Metrics !== 'undefined') {
    doc = doc.ele(Constants.METRICS_ELEMENT);
    if (typeof servicePropertiesJs.Metrics.Version !== 'undefined') {
      doc = doc.ele(Constants.VERSION_ELEMENT)
              .txt(servicePropertiesJs.Metrics.Version)
            .up();
    }

    if (typeof servicePropertiesJs.Metrics.Enabled !== 'undefined') {
      doc = doc.ele(Constants.ENABLED_ELEMENT)
              .txt(servicePropertiesJs.Metrics.Enabled)
            .up();
    }

    if (typeof servicePropertiesJs.Metrics.IncludeAPIs !== 'undefined') {
      doc = doc.ele(Constants.INCLUDE_APIS_ELEMENT)
              .txt(servicePropertiesJs.Metrics.IncludeAPIs)
            .up();
    }

    if (typeof servicePropertiesJs.Metrics.RetentionPolicy !== 'undefined') {
      doc = doc.ele(Constants.RETENTION_POLICY_ELEMENT);
      if (typeof servicePropertiesJs.Metrics.RetentionPolicy.Enabled !== 'undefined') {
        doc = doc.ele(Constants.ENABLED_ELEMENT)
                   .txt(servicePropertiesJs.Metrics.RetentionPolicy.Enabled)
                 .up();
      }

      if (typeof servicePropertiesJs.Metrics.RetentionPolicy.Days !== 'undefined') {
        doc = doc.ele(Constants.DAYS_ELEMENT)
                   .txt(servicePropertiesJs.Metrics.RetentionPolicy.Days)
                 .up();
      }

      doc = doc.up();
    }

    doc = doc.up();
  }

  if (typeof servicePropertiesJs.DefaultServiceVersion !== 'undefined') {
    doc = doc.ele(Constants.DEFAULT_SERVICE_VERSION_ELEMENT)
               .txt(servicePropertiesJs.DefaultServiceVersion)
             .up();
  }

  return doc.doc().toString();
};

ServicePropertiesResult.parse = function (servicePropertiesXml) {
  var serviceProperties = {};

  if (servicePropertiesXml.Logging) {
    serviceProperties.Logging = {};
    if (servicePropertiesXml.Logging[0].Version) {
      serviceProperties.Logging.Version = servicePropertiesXml.Logging[0].Version[0];
    }

    if (servicePropertiesXml.Logging[0].Delete) {
      serviceProperties.Logging.Delete = servicePropertiesXml.Logging[0].Delete[0] === 'true';
    }

    if (servicePropertiesXml.Logging[0].Read) {
      serviceProperties.Logging.Read = servicePropertiesXml.Logging[0].Read[0] === 'true';
    }

    if (servicePropertiesXml.Logging[0].Write) {
      serviceProperties.Logging.Write = servicePropertiesXml.Logging[0].Write[0] === 'true';
    }

    if (servicePropertiesXml.Logging[0].RetentionPolicy) {
      serviceProperties.Logging.RetentionPolicy = {};

      if (servicePropertiesXml.Logging[0].RetentionPolicy[0].Enabled) {
        serviceProperties.Logging.RetentionPolicy.Enabled = servicePropertiesXml.Logging[0].RetentionPolicy[0].Enabled[0] === 'true';
      }

      if (servicePropertiesXml.Logging[0].RetentionPolicy[0].Days) {
        serviceProperties.Logging.RetentionPolicy.Days = parseInt(servicePropertiesXml.Logging[0].RetentionPolicy[0].Days[0], 10);
      }
    }
  }

  if (servicePropertiesXml.Metrics) {
    serviceProperties.Metrics = {};
    if (servicePropertiesXml.Metrics[0].Version) {
      serviceProperties.Metrics.Version = servicePropertiesXml.Metrics[0].Version[0];
    }

    if (servicePropertiesXml.Metrics[0].Enabled) {
      serviceProperties.Metrics.Enabled = servicePropertiesXml.Metrics[0].Enabled[0] === 'true';
    }

    if (servicePropertiesXml.Metrics[0].IncludeAPIs) {
      serviceProperties.Metrics.IncludeAPIs = servicePropertiesXml.Metrics[0].IncludeAPIs[0] === 'true';
    }

    if (servicePropertiesXml.Metrics[0].RetentionPolicy) {
      serviceProperties.Metrics.RetentionPolicy = {};

      if (servicePropertiesXml.Metrics[0].RetentionPolicy[0].Enabled) {
        serviceProperties.Metrics.RetentionPolicy.Enabled = servicePropertiesXml.Metrics[0].RetentionPolicy[0].Enabled[0] === 'true';
      }

      if (servicePropertiesXml.Metrics[0].RetentionPolicy[0].Days) {
        serviceProperties.Metrics.RetentionPolicy.Days = parseInt(servicePropertiesXml.Metrics[0].RetentionPolicy[0].Days[0], 10);
      }
    }
  }

  if (servicePropertiesXml.DefaultServiceVersion) {
    serviceProperties.DefaultServiceVersion = servicePropertiesXml.DefaultServiceVersion[0];
  }

  return serviceProperties;
};