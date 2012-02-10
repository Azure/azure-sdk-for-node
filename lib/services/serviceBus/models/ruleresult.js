/**
* Copyright 2011 Microsoft Corporation
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

RuleResult.serialize = function (path, rule) {
  var ruleDescription = {
    '@': {
      'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns': 'http://schemas.microsoft.com/netservices/2010/10/servicebus/connect'
    }
  };

  var atomRule = {
    'title': '',
    'updated': ISO8061Date.format(new Date()),
    'author': {
      name: ''
    },
    'id': '',
    'content': {
      '@': { type: 'application/xml' },
      RuleDescription: ruleDescription
    }
  };

  if (rule) {
    if (rule.filter) {
      var filters = [];
      if (rule.filter.sqlExpression) {
        var sqlFilter = {
          '@': {
            'i:type': 'SqlFilterExpression'
          },
          SqlExpression: rule.filter.sqlExpression
        };

        filters.push(sqlFilter);
      } else if (rule.filter.correlationExpression) {
        var correlationFilter = {
          '@': {
            'i:type': 'CorrelationFilterExpression'
          },
          CorrelationId: rule.filter.correlationExpression
        };

        filters.push(correlationFilter);
      }

      ruleDescription.Filter = filters;
    } else if (rule.action) {
      var actions = [];

      if (rule.action.sqlExpression) {
        var sqlAction = {
          '@': {
            'i:type': 'SqlFilterExpression'
          },
          SqlExpression: rule.action.sqlExpression
        };

        actions.push(sqlAction);
      }

      ruleDescription.Action = actions;
    }
  }

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