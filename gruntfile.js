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
      'azure-common': '0.9.11',
      'azure-mgmt-authorization': '0.9.0-pre.6',
      'azure-mgmt-compute': '0.9.16',
      'azure-gallery': '2.0.0-pre.15',
      'azure-mgmt-hdinsight': '0.9.15',
      'azure-mgmt': '0.9.16',
      'azure-monitoring': '0.9.1-pre.16',
      'azure-mgmt-vnet': '0.9.17',
      'azure-mgmt-resource': '2.0.0-pre.16',
      'azure-scheduler': '0.9.1-pre.16',
      'azure-mgmt-scheduler': '0.9.1-pre.16',
      'azure-sb': '0.9.16',
      'azure-mgmt-sb': '0.9.16',
      'azure-mgmt-sql': '0.9.17',
      'azure-mgmt-storage': '0.9.16',
      'azure-mgmt-store': '0.9.16',
      'azure-mgmt-subscription': '0.9.16',
	  'azure-mgmt-trafficManager': '0.9.0',
      'azure-mgmt-website': '0.9.16',
      'azure-rm-website': '0.9.0-pre.10',
      'azure-storage-legacy': '0.9.14',
      'azure-extra': '0.1.7'
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
				  "lib/services/trafficManagerManagement/lib/trafficManagerManagementClient.js",
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
