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

'use strict';

var Testutil = require('../../util/util');
var KeyVault = Testutil.libRequire('services/keyVault');
var AuthenticationContext = require('adal-node').AuthenticationContext;
var Forge = require('node-forge');
var BigInteger = Forge.jsbn.BigInteger;
var Random = require('random-js');
var util = require('util');

var exports = module.exports;

exports.getRandom = function() {
  return new Random(Random.engines.mt19937().seed(123));
};

exports.authenticator = function(challenge, callback) {

  var clientId = process.env['AZURE_KV_CLIENT_ID'];
  var clientSecret = process.env['AZURE_KV_CLIENT_SECRET'];
  
  if (!clientId) clientId = 'mocked';
  if (!clientSecret) clientSecret = 'mocked';

  // Create a new authentication context.
  var context = new AuthenticationContext(challenge.authorization);

  // Use the context to acquire an authentication token.
  return context.acquireTokenWithClientCredentials(challenge.resource, clientId, clientSecret, function(err, tokenResponse) {
      if (err) throw err;
      // Calculate the value to be set in the request's Authorization header and resume the call.
      var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
      return callback(null, authorizationValue);
  });

};

exports.assertExactly = function(expected, actual) {
  if (actual !== expected) {
    throw new Error(util.format('Expected %s, found %s.', expected, actual));
  }
};

exports.compareObjects = function(expected, actual) {
  function compare(level, name, x, y) {
    if (level > 5) {
      throw new Error('Nesting level too high for ' + name);
    }
    if (x === y) {
        return;
    }    
    var xType = typeof x;
    var yType = typeof y;    
    if (xType !== yType) {
      throw new Error(util.format('%s should be %s (%s), but is %s (%s)', name, xType, x, yType, y));
    }
    if (x instanceof Buffer && y instanceof Buffer) {
      return compare(level, name, x.toString('base64'), y.toString('base64'));
    }
    if (!(x instanceof Object) || !(y instanceof Object)) {
      throw new Error(util.format('%s: expected %s, found %s', name, x, y));
    }
    for (var p in x) {
      var propName = name + '.' + p;
      var xHas = x.hasOwnProperty(p);
      var yHas = y.hasOwnProperty(p);
      if (xHas !== yHas) {
        if (xHas) {
          throw new Error('Missing property: ' + propName);
        } else {
          throw new Error('Extra property: ' + propName);
        }
      }
      if (xHas) {
        compare(level + 1, propName, x[p], y[p]);
      }
    }
  }
  
  compare(0, '<root>', expected, actual);  
};

function clone(obj) {
  var result, i, p;
  if (obj instanceof Array) {
    result = obj.slice(0);
    for (i = 0; i < obj.length; ++i) {
      result[i] = clone(obj[i]);      
    }
    return result;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof Buffer) {
    return new Buffer(obj);
  }
  if (obj instanceof Object) {
    if (obj instanceof KeyVault.JsonWebKey) result = new KeyVault.JsonWebKey();
    else
    if (obj instanceof KeyVault.KeyAttributes) result = new KeyVault.KeyAttributes();
    else
    if (obj instanceof KeyVault.SecretAttributes) result = new KeyVault.SecretAttributes();
    else
      result = {};

    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        result[p] = clone(obj[p]);
      }
    }
    return result;
  }
  return obj;
}

exports.clone = clone;

exports.series = function(methods) {

  var i = -1;

  var next = function() {
      //console.info('===========================================');
      ++i;
      if (i == methods.length) {
          //console.info('All methods were executed.');
          return;
      }
      var testMethod = methods[i];
      //console.info('===========================================');
      //console.info('Running ' + testMethod);
      methods[i](next);
  };

  next();
};

exports.validateSecretBundle = function(bundle, vault, secretName, secretValue) {
  //console.log('secretBundle: ' + JSON.stringify(bundle, null, ' '));
  var prefix = vault + '/secrets/' + secretName + '/';
  var id = bundle.id;
  if (id.indexOf(prefix) !== 0) {
    throw new Error(util.format('String should start with "%s", but value is "%s".', prefix, id));
  }
  if (bundle.value !== secretValue) {
    throw new Error(util.format('value should be "%s", but is "%s".', secretValue, bundle.value)); 
  }
  var attributes = bundle.attributes;
  if (!attributes.created || !attributes.updated) {
    throw new Error('Missing required date attributes.');
  }
};

exports.validateSecretList = function(result, expected) {
  var secrets = result.value;
  if (secrets && secrets.length) {
    for (var i = 0; i < secrets.length; ++i) {
      var secret = secrets[i];
      KeyVault.parseSecretIdentifier(secret.id);
      var attributes = expected[secret.id];
      if (attributes) {
        exports.compareObjects(attributes, secret.attributes);
        delete expected[secret.id];
      }
    }
  }
};

exports.validateRsaKeyBundle = function(bundle, vault, keyName, kty, key_ops) {
  var prefix = vault + '/keys/' + keyName + '/';
  var key = bundle.key;
  var kid = key.kid;
  if (kid.indexOf(prefix) !== 0) {
    throw new Error(util.format('String should start with "%s", but value is "%s".', prefix, kid));
  }
  if (key.kty !== kty) {
    throw new Error(util.format('kty should be "%s", but is "%s".', kty, key.kty)); 
  }
  if (!key.n || !key.e) {
    throw new Error('Bad RSA public material.');
  }
  if (key_ops != null) {
      var expected = JSON.stringify(key_ops);
      var actual = JSON.stringify(key.key_ops);
      if (actual !== expected) {
        throw new Error(util.format('key_ops should be %s, but is %s.', expected, actual)); 
      }
  }
  var attributes = bundle.attributes;
  if (!attributes.created || !attributes.updated) {
    throw new Error('Missing required date attributes.');
  }
};

exports.validateKeyList = function(result, expected) {
  var keys = result.value;
  if (keys && keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];
      KeyVault.parseKeyIdentifier(key.kid);
      var attributes = expected[key.kid];
      if (attributes) {
        exports.compareObjects(attributes, key.attributes);
        delete expected[key.kid];
      }
    }
  }
};

exports.getTestKey = function(suiteUtil) {  
  return getWellKnownKey();
};

function getWellKnownKey() {
  var key = {n:{data:[31403165,173515265,63388853,41445484,28572798,41983158,179892955,184539795,195496834,186371485,105099914,124126195,220355614,62597291,211257834,180260588,50093174,71664730,168573911,132471092,92855735,240596985,236098769,173925533,21038343,184422189,50979118,214529292,171289383,178021279,227518712,217740520,81983906,73408747,267914051,229529180,16559719,5537837,68640078,173929251,81539991,237912588,235382838,104343409,52196777,197367866,158395070,117971489,160834890,231935437,38538604,134498263,37612848,134625325,50358689,235472466,72917894,703321,50980314,120571588,214503569,14882466,71451463,38484115,211379782,199265141,167739796,236529689,110194265,252283980,242275601,45048505,139306567,13],t:74,s:0},e:{data:[65537],t:1,s:0},d:{data:[45687901,82912839,136844883,32867876,209589627,114760643,188378503,262495278,145440185,65785046,86798789,62386434,50560554,61549169,202839320,47223801,16345679,183718797,215606790,260736332,152310689,243692743,252563899,55901901,20486148,164420346,116855152,217658322,158370826,94231438,27528988,67335341,174899203,109090394,250630291,9002457,203943974,156578180,115625150,114683304,26974288,508888,171821311,128703059,7667499,75449693,176959654,55586600,67092631,147722039,47625305,179087115,68335990,160396405,27300777,218451174,232237402,237108697,210447563,20554934,167197589,83310674,139749301,41733981,16245554,49622864,194380346,105816513,256316339,38893666,192649829,99609567,117074140,6],t:74,s:0},p:{data:[33083239,162132243,220369741,45039546,222307487,179206041,256947704,245855772,249899507,28771428,14980020,148159943,19126604,110980923,232620253,200804176,193146776,1849395,38163760,205096501,123623920,77315574,131394591,41619980,234834515,7977638,258636778,44457951,40027731,226143479,195688366,19044599,23412006,147023142,222017947,33779866,62482],t:37,s:0},q:{data:[252056923,84721184,208820342,98257526,257711757,170210495,211611252,70482129,164129480,138844182,56855320,236397981,200230378,1345179,23830734,224624556,110311189,37776986,172599799,192572556,60025524,221499009,261656032,138834403,207844105,22896659,40314333,65995283,96406231,167203684,62595788,200386123,90252701,140191004,267133432,24172080,58080],t:37,s:0},dP:{data:[201993265,47821091,261789604,27756464,81622509,134233349,251725677,237658138,151857794,249347443,31788651,33789622,253087540,158289247,259273148,65044487,113510107,172257746,130321730,75880872,243610460,176804584,222782578,136118430,32479779,88296461,45617733,83305291,97037456,67918464,97435219,168410452,234985976,238394001,22331653,267371287,1349,199116946,123989676,107034094,192688242,85537734,173262414,44240895,113520276,236524933,161774153,174144730,191215545,62177699,80851160,134899343,259263575,121357616,156648819,255499481,103280063,231493924,4634332,236843526,156104816,246744594,112844480,42556164,94418795,254142946,8374346,95569210,181034034,47641170,125752615,266787505,241003275,27650,0],t:37,s:0},dQ:{data:[84475683,45186766,37599068,34522187,265058634,129988009,226913475,58582850,115308212,131964294,196466844,151174458,225261037,207233351,84725934,141546365,163838731,202239901,154853708,175227927,184335942,133762496,92997640,33570977,56137749,74033413,88232389,177734406,169854856,216277089,160231444,28162890,96721484,49993185,259099732,107900074,52851,234929,97512319,179816523,203072779,220703111,150012141,44886341,59462775,130019454,227743067,161683730,153831298,165320796,152113376,151476367,167450232,129591314,57629678,84105489,206226099,235738210,119902853,113106688,22829142,208571155,244917660,74554550,255318099,233351844,215611320,259557115,139301223,196032562,41364499,212828041,168778543,29746,0],t:37,s:0},qInv:{data:[257191369,24789324,179088888,4877263,229824703,180005485,140588854,162932877,148164403,251171427,37629294,154026114,253932472,64590117,134661418,36207596,237045424,88285250,196080720,103392332,203915656,113894996,31803101,103603699,98869410,182818866,105506928,66214245,239517111,197997650,218541095,255370546,25288449,253555509,158329635,150487361,51171],t:37,s:0}};
  var propNames = Object.keys(key);
  for (var i = 0; i < propNames.length; ++i) {
    // Hack to let it compatible with node-forge lib.
    /* jshint proto:false */
    key[propNames[i]].__proto__ = BigInteger.prototype;
    /* jshint proto:true */
  }
  return key;
}

exports.setRsaParameters = function(dest, key) {
  dest.n = bigIntegerToBuffer(key.n);
  dest.e = bigIntegerToBuffer(key.e);
  dest.d = bigIntegerToBuffer(key.d);
  dest.p = bigIntegerToBuffer(key.p);
  dest.q = bigIntegerToBuffer(key.q);
  dest.dp = bigIntegerToBuffer(key.dP);
  dest.dq = bigIntegerToBuffer(key.dQ);
  dest.qi = bigIntegerToBuffer(key.qInv);
};

function bigIntegerToBuffer(n) {

  // Convert to binary and remove leading zeroes.
  var data = n.toByteArray();
  var leadingZeroes = 0;
  while (leadingZeroes < data.length && data[leadingZeroes] === 0) {
    ++leadingZeroes;
  }
  if (leadingZeroes) {
    data = data.slice(leadingZeroes);
  }
  return new Buffer(data);
}
