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

function BlockListResult(committedBlocks, uncommittedBlocks, latestBlocks) {
  if (latestBlocks) {
    this.LatestBlocks = latestBlocks;
  }

  if (committedBlocks) {
    this.CommittedBlocks = committedBlocks;
  }

  if (uncommittedBlocks) {
    this.UncommittedBlocks = uncommittedBlocks;
  }
}

/**
* Builds an XML representation for a block list.
*
* @param  {array}  The block list.
* @return {string} The XML block list.
*/
BlockListResult.serialize = function (blockListJs) {
  var blockListDoc = xmlbuilder.create();
  blockListDoc = blockListDoc.begin(Constants.BLOCK_LIST_ELEMENT, { version: '1.0', encoding: 'utf-8' });

  if (blockListJs.LatestBlocks) {
    blockListJs.LatestBlocks.forEach(function (block) {
      blockListDoc = blockListDoc.ele(Constants.LATEST_ELEMENT)
        .txt(new Buffer(block).toString('base64'))
        .up();
    });
  }

  if (blockListJs.CommittedBlocks) {
    blockListJs.CommittedBlocks.forEach(function (block) {
      blockListDoc = blockListDoc.ele(Constants.COMMITTED_ELEMENT)
        .txt(new Buffer(block).toString('base64'))
        .up();
    });
  }

  if (blockListJs.UncommittedBlocks) {
    blockListJs.UncommittedBlocks.forEach(function (block) {
      blockListDoc = blockListDoc.ele(Constants.UNCOMMITTED_ELEMENT)
        .txt(new Buffer(block).toString('base64'))
        .up();
    });
  }

  return blockListDoc.doc().toString();
};

BlockListResult.parse = function (blockListXml) {
  var blockListResult = new BlockListResult();

  if (blockListXml.CommittedBlocks && blockListXml.CommittedBlocks.Block && blockListXml.CommittedBlocks.Block.length > 0) {
    blockListResult.CommittedBlocks = blockListXml.CommittedBlocks.Block;
  }

  if (blockListXml.UncommittedBlocks && blockListXml.UncommittedBlocks.Block && blockListXml.UncommittedBlocks.Block.length > 0) {
    blockListResult.UncommittedBlocks = blockListXml.UncommittedBlocks.Block;
  }

  if (blockListXml.LatestBlocks && blockListXml.LatestBlocks.Block && blockListXml.LatestBlocks.Block.length > 0) {
    blockListResult.LatestBlocks = blockListXml.LatestBlocks.Block;
  }

  return blockListResult;
};

module.exports = BlockListResult;