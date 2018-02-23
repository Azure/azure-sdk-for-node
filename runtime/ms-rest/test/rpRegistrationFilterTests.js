// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

var should = require('should');
var RPRegistrationFilter = require('../lib/filters/rpRegistrationFilter');

describe('RP RegistrationFilter', () => {
  it('should correctly parse the error message from service for new subscription', (done) => {
      var msg = "{\"error\":{\"code\":\"MissingSubscriptionRegistration\",\"message\":\"The subscription is not registered to use namespace 'Microsoft.Devices'. See https://aka.ms/rps-not-found for how to register subscriptions.\"}}";
      var rpName = RPRegistrationFilter.checkRPNotRegisteredError(msg);
      rpName.should.equal('Microsoft.Devices');
      done();
    });
    it('should correctly parse the error message from service for an existing subscription where the RP was manually unregistered', (done) => {
      var msg = "{\"error\":{\"code\":\"MissingSubscriptionRegistration\",\"message\":\"The subscription registration is in 'Unregistered' state. The subscription must be registered to use namespace 'Microsoft.Devices'. See https://aka.ms/rps-not-found for how to register subscriptions.\"}}";
      var rpName = RPRegistrationFilter.checkRPNotRegisteredError(msg);
      rpName.should.equal('Microsoft.Devices');
      done();
    });
});