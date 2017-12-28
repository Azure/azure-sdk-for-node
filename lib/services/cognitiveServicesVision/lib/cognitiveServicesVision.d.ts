/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

import FaceAPIClient = require('../../face/lib/faceAPIClient');
import * as FaceModels from '../../face/lib/models';
import ComputerVisionAPIClient = require('../../computerVision/lib/computerVisionAPIClient');
import * as ComputerVisionModels from '../../computerVision/lib/models';
import ContentModeratorAPIClient = require('../../contentModerator/lib/contentModeratorAPIClient');
import * as ContentModeratorModels from '../../contentModerator/lib/models';

export { FaceAPIClient, FaceModels, ComputerVisionAPIClient, ComputerVisionModels,
         ContentModeratorAPIClient, ContentModeratorModels };