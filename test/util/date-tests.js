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

var should = require('should');
var sinon = require('sinon');

var testutil = require('./util');
var azure = testutil.libRequire('azure');

suite('date-tests', function () {
  setup(function () {
    this.clock = sinon.useFakeTimers(0);
  });

  teardown(function () {
    if (this.clock.restore) {
      this.clock.restore();
    }
  });

  test('daysFromNow', function () {
    var daysInterval = 1;
    var expectedDate = new Date('Jan 2, 1970 00:00:00 am GMT');

    azure.date.daysFromNow(daysInterval).getTime().should.equal(expectedDate.getTime());
  });

  test('hoursFromNow', function () {
    var hoursInterval = 3;
    var expectedDate = new Date('Jan 1, 1970 03:00:00 am GMT');

    azure.date.hoursFromNow(hoursInterval).getTime().should.equal(expectedDate.getTime());
  });

  test('minutesFromNow', function () {
    var minutesInterval = 10;
    var expectedDate = new Date('Jan 1, 1970 00:10:00 am GMT');

    azure.date.minutesFromNow(minutesInterval).getTime().should.equal(expectedDate.getTime());
  });

  test('secondsFromNow', function () {
    var secondsInterval = 20;
    var expectedDate = new Date('Jan 1, 1970 00:00:20 am GMT');

    azure.date.secondsFromNow(secondsInterval).getTime().should.equal(expectedDate.getTime());
  });
});