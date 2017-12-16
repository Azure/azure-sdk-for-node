/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

import EntitySearchAPIClient = require('./entitySearch/entitySearchAPIClient');
import * as EntitySearchModels from './entitySearch/models';
import WebSearchAPIClient = require('./webSearch/webSearchAPIClient');
import * as WebSearchModels from './webSearch/models';
import VideoSearchAPIClient = require('./videoSearch/videoSearchAPIClient');
import * as VideoSearchModels from './videoSearch/models';
import NewsSearchAPIClient = require('./newsSearch/newsSearchAPIClient');
import * as NewsSearchModels from './newsSearch/models';
import ImageSearchAPIClient = require('./imageSearch/imageSearchAPIClient');
import * as ImageSearchModels from './imageSearch/models';

export {EntitySearchAPIClient, EntitySearchModels, WebSearchAPIClient, WebSearchModels,
        VideoSearchAPIClient, VideoSearchModels, NewsSearchAPIClient, NewsSearchModels,
        ImageSearchAPIClient, ImageSearchModels};