//
// Copyright (c) Microsoft and contributors.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

module.exports = function(grunt) {
  //init stuff
  grunt.initConfig({
    packageVersions: {
      'azure': '0.10.5',
      'azure-common': '0.9.12', 
      'azure-asm-compute': '0.10.0', 
      'azure-asm-hdinsight': '0.10.0',
      'azure-asm-mgmt': '0.10.0',
      'azure-monitoring': '0.9.1-pre.16',
      'azure-asm-network': '0.10.0'
      'azure-scheduler': '0.9.1-pre.16',
      'azure-asm-scheduler': '0.10.0',
      'azure-sb': '0.9.16',
      'azure-asm-sb': '0.10.0',
      'azure-asm-sql': '0.10.0',
      'azure-asm-store': '0.10.0',
      'azure-asm-storage': '0.10.0',
      'azure-asm-subscription': '0.10.0',
      'azure-asm-trafficMnager': '0.10.0',
      'azure-asm-website': '0.10.0',
      'azure-arm-authorization': '0.10.0',
      'azure-arm-compute': '0.10.0',
      'azure-arm-dns': '0.10.0',
      'azure-arm-insights': '0.10.0',
      'azure-arm-keyvault': '0.10.0'
      'azure-arm-network': '0.10.0',
      'azure-arm-resource': '0.10.0',
      'azure-arm-storage': '0.10.0',
      'azure-arm-website': '0.10.0'
      'azure-keyvault': '0.9.2',
      'azure-gallery': '2.0.0-pre.15',
    },
    //jsdoc config
    jsdoc : {
        dist : {
            src: [
                  "README.md",
                  "lib/azure.js",
                  "lib/serviceruntime/roleenvironment.js",
                  "lib/services/blob/blobservice.js",
                  "lib/services/computeManagement/lib/computeManagementClient.js",
				          "lib/services/dnsManagement/lib/dnsManagementClient.js",
                  "lib/services/hdinsight/hdinsightservice.js",
                  "lib/services/management/lib/managementClient.js",
                  "lib/services/monitoring/lib/autoscaleClient.js",
                  "lib/services/monitoring/lib/alertsClient.js",
                  "lib/services/monitoring/lib/metricsClient.js",
                  "lib/services/monitoring/lib/eventsClient.js",
                  "lib/services/networkManagement/lib/virtualNetworkManagementClient.js",
                  "lib/services/queue/queueservice.js",
                  "lib/services/scm/scmservice.js",
                  "lib/services/serviceBus/notificationhubservice.js",
                  "lib/services/serviceBus/apnsservice.js",
                  "lib/services/serviceBus/gcmservice.js",
                  "lib/services/serviceBus/mpnsservice.js",
                  "lib/services/serviceBus/wnsservice.js",
                  "lib/services/serviceBus/servicebusservice.js",
                  "lib/services/serviceBusManagement/lib/serviceBusManagementClient.js",
                  "lib/services/sql/sqlService.js",
                  "lib/services/sqlManagement/lib/sqlManagementClient.js",
                  "lib/services/storageManagement/lib/storageManagementClient.js",
                  "lib/services/storeManagement/lib/storeManagementClient.js",
                  "lib/services/subscriptionManagement/lib/subscriptionClient.js",
                  "lib/services/table/tableservice.js",
                  "lib/services/webSiteManagement/lib/webSiteManagementClient.js",
                  "lib/services/webSiteManagement/lib/webSiteExtensionsClient.js",
                  "lib/services/authorizationManagement/lib/authorizationManagementClient.js",
                  "lib/services/graph.rbac/lib/graphRbacManagementClient.js",
                  "lib/services/webSiteManagement2/lib/webSiteManagementClient.js"
            ],
            options: {
                destination: 'docs',
                configure: 'jsdoc/jsdoc.json'
            }
        }
    },
    devserver: { options:
      { 'type' : 'http',
        'port' : 8888,
        'base' : 'docs'
      }
    }
  });
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-devserver');

  grunt.loadTasks('tasks');

  grunt.registerTask('publishdocs', ['githubPages:target']);
};
