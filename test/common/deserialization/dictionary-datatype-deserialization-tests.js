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
var assert = require('assert');
var util = require('util');
var testutil = require('../../util/util');
var tc = require('../../stubs/Test.Serialization');
var fs = require('fs');
var nock = require('nock');
var azure = testutil.libRequire('azure');
var CertificateCloudCredentials = azure.CertificateCloudCredentials;
var TestSerializationClient = tc.TestSerializationClient;


suite('dictionary-datatype-deserialization-tests', function () {
  var baseUri = 'http://helloworld';
  var subscriptionId = "c9cbd920-c00c-427c-852b-8aaf38badaeb";
  var pemfile = process.env.AZURE_CERTIFICATE_PEM_FILE;
  var credentials = new CertificateCloudCredentials({ subscriptionId: subscriptionId, pem: fs.readFileSync(pemfile).toString()});
  var testclient = new TestSerializationClient(credentials, baseUri);

  test('GetPrimitiveDictionaryNilable with valid primitive values should deserialize properly', function (done) {
    nock("http://helloworld")
    .get("/GetPrimitiveDictionaryNilable")
    .reply(200, "<PAIRS>" +
                  "<PAIR><KEY>1</KEY><VALUE>One</VALUE></PAIR>" +
                  "<PAIR><KEY>2</KEY><VALUE>Two</VALUE></PAIR>" +
                  "<PAIR><KEY>3</KEY><VALUE></VALUE></PAIR>" +
                  "<PAIR><KEY>4</KEY><VALUE /></PAIR>" +
                  "<PAIR><KEY>5</KEY><VALUE xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" /></PAIR>" +
                  "<PAIR><KEY>Extension A</KEY><VALUE>㐀㒣㕴㕵㙉㙊䵯䵰䶴䶵</VALUE></PAIR>" +
                  "<PAIR><KEY>Extension B</KEY><VALUE>𠀀𠀁𠀂𠀃𪛑𪛒𪛓𪛔𪛕𪛖</VALUE></PAIR>" +
                  "<PAIR><KEY>Tai Le</KEY><VALUE>ᥐᥥᥦᥧᥨᥭᥰᥱᥲᥴ</VALUE></PAIR>" +
                  "<PAIR><KEY>Mongolian</KEY><VALUE>᠀᠐᠙ᠠᡷᢀᡨᡩᡪᡫ</VALUE></PAIR>" +
                  "<PAIR><KEY>Tibetan</KEY><VALUE>ༀཇཉཪཱྋ྾࿌࿏ྼྙ</VALUE></PAIR>" +
                  "<PAIR><KEY>Yi</KEY><VALUE>ꀀꒌꂋꂌꂍꂎꂔꂕ꒐꓆</VALUE></PAIR>" +
                  "<PAIR><KEY>Uighur</KEY><VALUE>،؟ئبتجدرشعەﭖﭙﯓﯿﺉﺒﻺﻼ</VALUE></PAIR>" +
                  "<PAIR><KEY>Hangul</KEY><VALUE>ᄓᄕᇬᇌᇜᇱㄱㅣ가힝</VALUE></PAIR>" +
                  "<PAIR><KEY>㐀㒣㕴㕵㙉㙊䵯䵰䶴䶵</KEY><VALUE>Extension A</VALUE></PAIR>" +
                "</PAIRS>");
    testclient.complexDeserialization.getPrimitiveDictionaryNilable(function (error, result) {
      console.log("result : " + util.inspect(result));
      should.not.exist(error);
      should.exist(result);
      assert.equal(Object.keys(result.pairs).length, 14);
      result.pairs[1].should.equal('One');
      result.pairs[2].should.equal('Two');
      result.pairs[3].should.equal('');
      result.pairs[4].should.equal('');
      assert.equal(result.pairs[5], null);
      result.pairs["Extension A"].should.equal('㐀㒣㕴㕵㙉㙊䵯䵰䶴䶵');
      result.pairs["Extension B"].should.equal('𠀀𠀁𠀂𠀃𪛑𪛒𪛓𪛔𪛕𪛖');
      result.pairs["Tai Le"].should.equal('ᥐᥥᥦᥧᥨᥭᥰᥱᥲᥴ');
      result.pairs["Mongolian"].should.equal('᠀᠐᠙ᠠᡷᢀᡨᡩᡪᡫ');
      result.pairs["Tibetan"].should.equal('ༀཇཉཪཱྋ྾࿌࿏ྼྙ');
      result.pairs["Yi"].should.equal('ꀀꒌꂋꂌꂍꂎꂔꂕ꒐꓆');
      result.pairs["Uighur"].should.equal('،؟ئبتجدرشعەﭖﭙﯓﯿﺉﺒﻺﻼ');
      result.pairs["Hangul"].should.equal('ᄓᄕᇬᇌᇜᇱㄱㅣ가힝');
      result.pairs['㐀㒣㕴㕵㙉㙊䵯䵰䶴䶵'].should.equal('Extension A');
    });
    done();
  });
  
  test('GetPrimitiveDictionaryNilable with an empty dictionary should deserialize into empty dictionary', function (done) {
    nock("http://helloworld")
    .get("/GetPrimitiveDictionaryNilable")
    .reply(200, "<PAIRS></PAIRS>");
    testclient.complexDeserialization.getPrimitiveDictionaryNilable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      assert.equal(Object.keys(result.pairs).length, 0);
    });
    done();
  });
  
  test('GetPrimitiveDictionaryNilable with a null dictionary should deserialize into empty dictionary', function (done) {
    nock("http://helloworld")
    .get("/GetPrimitiveDictionaryNilable")
    .reply(200, "<PAIRS />");
    testclient.complexDeserialization.getPrimitiveDictionaryNilable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      assert.equal(Object.keys(result.pairs).length, 0);
    });
    done();
  });
  
  test('GetPrimitiveDictionaryNilable with a nil dictionary should deserialize into null', function (done) {
    nock("http://helloworld")
    .get("/GetPrimitiveDictionaryNilable")
    .reply(200, "<PAIRS xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.complexDeserialization.getPrimitiveDictionaryNilable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      assert.equal(result.pairs, null);
    });
    done();
  });
  
  test('GetPrimitiveDictionaryNilable with pair element as empty, null and nil elements should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetPrimitiveDictionaryNilable")
    .reply(200, "<PAIRS><PAIR></PAIR><PAIR /><PAIR xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" /></PAIRS>");
    testclient.complexDeserialization.getPrimitiveDictionaryNilable(function (error, result) {
      console.log("result : " + util.inspect(result));
      should.exist(error);
      error.should.match(/Cannot deserialize an empty null or nil pair element/);
    });
    done();
  });
  
  test('GetPrimitiveDictionaryNilable with an empty key element should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetPrimitiveDictionaryNilable")
    .reply(200, "<PAIRS><PAIR><KEY></KEY><VALUE>One</VALUE></PAIR></PAIRS>");
    testclient.complexDeserialization.getPrimitiveDictionaryNilable(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot deserialize an empty key element/);
    });
    done();
  });
  
  test('GetPrimitiveDictionaryNilable with a null key element should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetPrimitiveDictionaryNilable")
    .reply(200, "<PAIRS><PAIR><KEY /><VALUE>One</VALUE></PAIR></PAIRS>");
    testclient.complexDeserialization.getPrimitiveDictionaryNilable(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot deserialize a null key element/);
    });
    done();
  });
  
  test('GetPrimitiveDictionaryNilable with a nil key element should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetPrimitiveDictionaryNilable")
    .reply(200, "<PAIRS><PAIR><KEY xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" /><VALUE>One</VALUE></PAIR></PAIRS>");
    testclient.complexDeserialization.getPrimitiveDictionaryNilable(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot deserialize a nil key element/);
    });
    done();
  });
});