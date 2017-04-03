/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

import SearchIndexClient = require('./index/searchIndexClient');
import * as SearchIndexModels from './index/models';

import SearchServiceClient = require('./service/searchServiceClient');
import * as SearchServiceModels from './service/models';

export { SearchIndexClient, SearchIndexModels, SearchServiceClient, SearchServiceModels };