/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

import SubscriptionClient = require('./subscription/subscriptionClient');
import * as SubscriptionModels from './subscription/models';

import ResourceManagementClient = require('./resource/resourceManagementClient');
import * as ResourceModels from './resource/models';

import PolicyClient = require('./policy/policyClient');
import * as PolicyModels from './policy/models';

import ManagementLockClient = require('./lock/managementLockClient');
import * as LockModels from './lock/models';

import ManagementLinkClient = require('./link/managementLinkClient');
import * as LinkModels from './link/models';

import FeatureClient = require('./feature/featureClient');
import * as FeatureModels from './feature/models';

import ManagementGroupsClient = require('./management/managementGroupsClient');
import * as ManagementGroupsModels from './management/models';


export { SubscriptionClient, SubscriptionModels, ResourceManagementClient,
  ResourceModels, PolicyClient, PolicyModels, ManagementLockClient, LockModels,
  ManagementLinkClient, LinkModels, FeatureClient, FeatureModels,
  ManagementGroupsClient, ManagementGroupsModels };
