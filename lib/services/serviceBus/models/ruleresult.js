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

var queryString = require('querystring');

// Module dependencies.
var AtomHandler = require('../../../util/atomhandler');
var ISO8061Date = require('../../../util/iso8061date');
var Constants = require('../../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

// Expose 'RuleResult'.
exports = module.exports = RuleResult;

function RuleResult() { }

RuleResult.serialize = function (name, path, rule) {
  var ruleDescription = {
    '$': {
      'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns': 'http://schemas.microsoft.com/netservices/2010/10/servicebus/connect'
    }
  };

  if (rule) {
    var filters = [];
    if (rule.sqlExpressionFilter) {
      var sqlFilter = {
        '$': {
          'i:type': 'SqlFilter'
        },
        SqlExpression: rule.sqlExpressionFilter,
        CompatibilityLevel: 20
      };

      filters.push(sqlFilter);
    } else if (rule.correlationIdFilter) {
      var correlationFilter = {
        '$': {
          'i:type': 'CorrelationFilter'
        },
        CorrelationId: rule.correlationIdFilter
      };

      filters.push(correlationFilter);
    } else if (rule.trueFilter) {
      var trueFilter = {
        '$': {
          'i:type': 'TrueFilter'
        },
        SqlExpression: rule.trueFilter,
        CompatibilityLevel: 20
      };

      filters.push(trueFilter);
    } else if (rule.falseFilter) {
      var falseFilter = {
        '$': {
          'i:type': 'FalseFilter'
        },
        SqlExpression: rule.falseFilter,
        CompatibilityLevel: 20
      };

      filters.push(falseFilter);
    }

    if (filters.length > 0) {
      ruleDescription.Filter = filters;
    }

    var actions = [];

    if (rule.sqlRuleAction) {
      var sqlAction = {
        '$': {
          'i:type': 'SqlFilterExpression'
        },
        SqlExpression: rule.sqlRuleAction
      };

      actions.push(sqlAction);
    } else {
      var emptyRuleAction = {
        '$': {
          'i:type': 'EmptyRuleAction'
        }
      };

      actions.push(emptyRuleAction);
    }

    if (actions.length > 0) {
      ruleDescription.Action = actions;
    }
  }

  var atomRule = {
    'title': {
      '$': {
        'type': 'text'
      },
      '_': name
    },
    'updated': ISO8061Date.format(new Date()),
    'id': '',
    'content': {
      '$': { type: 'application/xml' },
      RuleDescription: ruleDescription
    }
  };

  var atomHandler = new AtomHandler(null, null);
  var xml = atomHandler.serialize(atomRule);
  return xml;
};

RuleResult.parse = function (ruleXml) {
  var atomHandler = new AtomHandler(null, null);
  var rule = atomHandler.parse(ruleXml, Constants.ATOM_RULE_DESCRIPTION_MARKER);

  // Extract rule name
  var pos = rule.id.lastIndexOf('/');
  rule.RuleName = rule.id.substr(pos + 1);

  if (rule.RuleName.indexOf('?') !== -1) {
    rule.RuleName = rule.RuleName.substr(0, rule.RuleName.indexOf('?'));
  }

  // Extract string up to subscription name
  pos = rule.id.indexOf('/Rules');
  var tmp = rule.id.substr(0, pos);

  // Extract subscription name
  pos = tmp.lastIndexOf('/');
  rule.SubscriptionName = tmp.substr(pos + 1);

  // Extract string up to topic name
  pos = rule.id.indexOf('/Subscriptions');
  tmp = rule.id.substr(0, pos);

  // Extract topic name
  pos = tmp.lastIndexOf('/');
  rule.TopicName = tmp.substr(pos + 1);

  return rule;
};