/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

import EntitySearchAPIClient = require('../../entitySearch/lib/entitySearchAPIClient');
import * as EntitySearchModels from '../../entitySearch/lib/models';
import WebSearchAPIClient = require('../../webSearch/lib/webSearchAPIClient');
import * as WebSearchModels from '../../webSearch/lib/models';
import VideoSearchAPIClient = require('../../videoSearch/lib/videoSearchAPIClient');
import * as VideoSearchModels from '../../videoSearch/lib/models';
import NewsSearchAPIClient = require('../../newsSearch/lib/newsSearchAPIClient');
import * as NewsSearchModels from '../../newsSearch/lib/models';
import ImageSearchAPIClient = require('../../imageSearch/lib/imageSearchAPIClient');
import * as ImageSearchModels from '../../imageSearch/lib/models';
import CustomSearchAPIClient = require('../../customSearch/lib/customSearchAPIClient');
import * as CustomSearchModels from '../../customSearch/lib/models';

export {EntitySearchAPIClient, EntitySearchModels, WebSearchAPIClient, WebSearchModels,
        VideoSearchAPIClient, VideoSearchModels, NewsSearchAPIClient, NewsSearchModels,
        ImageSearchAPIClient, ImageSearchModels, CustomSearchAPIClient, CustomSearchModels};