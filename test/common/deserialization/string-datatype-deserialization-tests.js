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
var util = require('util');
var testutil = require('../../util/util');
var tc = require('../../stubs/Test.Serialization');
var fs = require('fs');
var nock = require('nock');
var azure = testutil.libRequire('azure');
var CertificateCloudCredentials = azure.CertificateCloudCredentials;
var TestSerializationClient = tc.TestSerializationClient;


suite('string-datatype-deserialization-tests', function () {
  var baseUri = 'http://helloworld';
  var subscriptionId = "c9cbd920-c00c-427c-852b-8aaf38badaeb";
  var pemfile = process.env.AZURE_CERTIFICATE_PEM_FILE;
  var credentials = new CertificateCloudCredentials({ subscriptionId: subscriptionId, pem: fs.readFileSync(pemfile).toString()});
  var testclient = new TestSerializationClient(credentials, baseUri);

  test('GetString with a json string should deserialize properly', function (done) {
    var jsonString = "{ 'foo': { 'bar': 'baz'}}";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + jsonString + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal(jsonString);
    });
    done();
  });
  
  test('GetString with a xml string with special characters like \'<\' converted to \'&lt;\' should deserialize properly', function (done) {
    var xmlString = "&lt;foo&gt;&lt;bar&gt;baz&lt;/bar&gt;&lt;/foo&gt;";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + xmlString + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal("<foo><bar>baz</bar></foo>");
    });
    done();
  });
  
  test('GetString with a xml string without converting special characters should deserialize properly', function (done) {
    var xmlString = "<foo><bar>baz</bar></foo>";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + encodeURIComponent(xmlString) + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal(encodeURIComponent(xmlString));
    });
    done();
  });
  
  test('GetString with a typewriter string should deserialize properly', function (done) {
    var encodedTypewriter = "   `~!@#$%^&*()_+1234567890-=qwertyuiop[]  {{}}QWERTYUIOP|\\asdfghjkl;'ASDFGHJKL:\"zxcvbnm,./ZXCVBNM&lt;&gt;&quot;&apos;&amp;?   ";
    var typewriter = "   `~!@#$%^&*()_+1234567890-=qwertyuiop[]  {{}}QWERTYUIOP|\\asdfghjkl;'ASDFGHJKL:\"zxcvbnm,./ZXCVBNM<>\"'&?   ";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + encodedTypewriter + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal(typewriter);
    });
    done();
  });
  
  test('GetString with a string in the following format "Extension A" should deserialize properly', function (done) {
    var str = "㐀㒣㕴㕵㙉㙊䵯䵰䶴䶵";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + str + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal(str);
    });
    done();
  });
  
  test('GetString with a string in the following format "Extension B" should deserialize properly', function (done) {
    var str = "𠀀𠀁𠀂𠀃𪛑𪛒𪛓𪛔𪛕𪛖";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + str + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal(str);
    });
    done();
  });
  
  test('GetString with a string in the following format Mongolian should deserialize properly', function (done) {
    var str = "᠀᠐᠙ᠠᡷᢀᡨᡩᡪᡫ";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + str + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal(str);
    });
    done();
  });
  
  test('GetString with a string in the following format Tibetan should deserialize properly', function (done) {
    var str = "ༀཇཉཪཱྋ྾࿌࿏ྼྙ";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + str + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal(str);
    });
    done();
  });
  
  test('GetString with a string in the following format Yi should deserialize properly', function (done) {
    var str = "ꀀꒌꂋꂌꂍꂎꂔꂕ꒐꓆";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + str + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal(str);
    });
    done();
  });
  
  test('GetString with a string in the following format Uighur should deserialize properly', function (done) {
    var str = "،؟ئبتجدرشعەﭖﭙﯓﯿﺉﺒﻺﻼ";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + str + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal(str);
    });
    done();
  });
  
  test('GetString with a string in the following format Tai Le should deserialize properly', function (done) {
    var str = "ᥐᥥᥦᥧᥨᥭᥰᥱᥲᥴ";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + str + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal(str);
    });
    done();
  });
  
  test('GetString with a string in the following format Hangul should deserialize properly', function (done) {
    var str = "ᄓᄕᇬᇌᇜᇱㄱㅣ가힝";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + str + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal(str);
    });
    done();
  });
  
  test('GetString with a string in the following format Latin should deserialize properly', function (done) {
    var str = "ĉĆăĀüøòõÝÙ¿Ã";
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + str + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal(str);
    });
    done();
  });
  
  test('GetString with empty element should deserialize into an empty string', function (done) {
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE></STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(resut);
      result.stringValue.should.equal("");
    });
    done();
  });
  
  test('GetString with null element should deserialize into an empty string', function (done) {
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE />");
    testclient.deserialization.getString(function (error, result) {
    should.not.exist(error);
    should.exist(resut);
    result.stringValue.should.equal("");
    });
    done();
  });
  
  test('GetString with null keyword should deserialize into null string', function (done) {
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE>" + null + "</STRINGVALUE>");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal('null');
    });
    done();
  });
  
  test('GetString with nil element should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getString(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot deserialize a nil element/);
    });
    done();
  });
  
  test('GetStringNilable with null element should deserialize into empty string', function (done) {
    nock("http://helloworld")
    .get("/GetString")
    .reply(200, "<STRINGVALUE />");
    testclient.deserialization.getString(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal("");
    });
    done();
  });
  
  test('GetStringNilable with a nil element should deserialize to null', function (done) {
    nock("http://helloworld")
    .get("/GetStringNilable")
    .reply(200, "<STRINGVALUE xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getStringNilable(function (error, result) {
      should.not.exist(error);
      assert.equal(result.stringValue, null);
    });
    done();
  });
  
  test('GetStringNilable with an empty element should deserialize into empty sytring', function (done) {
    nock("http://helloworld")
    .get("/GetStringNilable")
    .reply(200, "<STRINGVALUE></STRINGVALUE>");
    testclient.deserialization.getStringNilable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringValue.should.equal("");
    });
    done();
  });
  
  test('GetStringBase64Encoded with a xml string with special characters like \'<\' converted to \'&lt;\' should deserialize properly', function (done) {
    var str = "&lt;foo&gt;&lt;bar&gt;baz&lt;/bar&gt;&lt;/foo&gt;";
    var b64encodedstr = new Buffer(str).toString('base64');
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE>" + b64encodedstr + "</STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal(str);
    });
    done();
  });
  
  test('GetStringBase64Encoded with a xml string should deserialize properly', function (done) {
    var str = "<foo><bar>baz</bar></foo>";
    var b64encodedstr = new Buffer(str).toString('base64');
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE>" + b64encodedstr + "</STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal(str);
    });
    done();
  });
  
  test('GetStringBase64Encoded with a typewriter string should deserialize properly', function (done) {
    var typewriter = "   `~!@#$%^&*()_+1234567890-=qwertyuiop[]  {{}}QWERTYUIOP|\\asdfghjkl;'ASDFGHJKL:\"zxcvbnm,./ZXCVBNM&lt;&gt;&quot;?   ";
    var b64encodedstr = new Buffer(typewriter).toString('base64');
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE>" + b64encodedstr + "</STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal(typewriter);
    });
    done();
  });
  
  test('GetStringBase64Encoded with a string in the following format Extension A should deserialize properly', function (done) {
    var str = "㐀㒣㕴㕵㙉㙊䵯䵰䶴䶵";
    var b64encodedstr = new Buffer(str).toString('base64');
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE>" + b64encodedstr + "</STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal(str);
    });
    done();
  });
  
  test('GetStringBase64Encoded with a string in the following format Extension B should deserialize properly', function (done) {
    var str = "𠀀𠀁𠀂𠀃𪛑𪛒𪛓𪛔𪛕𪛖";
    var b64encodedstr = new Buffer(str).toString('base64');
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE>" + b64encodedstr + "</STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal(str);
    });
    done();
  });
  
  test('GetStringBase64Encoded with a string in the following format Mongolian should deserialize properly', function (done) {
    var str = "᠀᠐᠙ᠠᡷᢀᡨᡩᡪᡫ";
    var b64encodedstr = new Buffer(str).toString('base64');
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE>" + b64encodedstr + "</STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal(str);
    });
    done();
  });
  
  test('GetStringBase64Encoded with a string in the following format Tibetan should deserialize properly', function (done) {
    var str = "ༀཇཉཪཱྋ྾࿌࿏ྼྙ";
    var b64encodedstr = new Buffer(str).toString('base64');
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE>" + b64encodedstr + "</STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal(str);
    });
    done();
  });
  
  test('GetStringBase64Encoded with a string in the following format Yi should deserialize properly', function (done) {
    var str = "ꀀꒌꂋꂌꂍꂎꂔꂕ꒐꓆";
    var b64encodedstr = new Buffer(str).toString('base64');
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE>" + b64encodedstr + "</STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal(str);
    });
    done();
  });
  
  test('GetStringBase64Encoded with a string in the following format Uighur should deserialize properly', function (done) {
    var str = "،؟ئبتجدرشعەﭖﭙﯓﯿﺉﺒﻺﻼ";
    var b64encodedstr = new Buffer(str).toString('base64');
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE>" + b64encodedstr + "</STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal(str);
    });
    done();
  });
  
  test('GetStringBase64Encoded with a string in the following format Tai Le should deserialize properly', function (done) {
    var str = "ᥐᥥᥦᥧᥨᥭᥰᥱᥲᥴ";
    var b64encodedstr = new Buffer(str).toString('base64');
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE>" + b64encodedstr + "</STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal(str);
    });
    done();
  });
  
  test('GetStringBase64Encoded with a string in the following format Hangul should deserialize properly', function (done) {
    var str = "ᄓᄕᇬᇌᇜᇱㄱㅣ가힝";
    var b64encodedstr = new Buffer(str).toString('base64');
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE>" + b64encodedstr + "</STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal(str);
    });
    done();
  });
  
  test('GetStringBase64Encoded with a string in the following format Latin should deserialize properly', function (done) {
    var str = "ĉĆăĀüøòõÝÙ¿Ã";
    var b64encodedstr = new Buffer(str).toString('base64');
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE>" + b64encodedstr + "</STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal(str);
    });
    done();
  });
  
  test('GetStringBase64Encoded with nil value should not be deserialized', function (done) {
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(result.stringBase64EncodedValue);
    });
    done();
  });
  
  test('GetStringBase64Encoded with null element should deserialize into empty string', function (done) {
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE />");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal('');
    });
    done();
  });
  
  test('GetStringBase64Encoded with an empty element should deserialize into empty string', function (done) {
    nock("http://helloworld")
    .get("/GetStringBase64Encoded")
    .reply(200, "<STRINGBASE64ENCODEDVALUE></STRINGBASE64ENCODEDVALUE>");
    testclient.deserialization.getStringBase64Encoded(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.stringBase64EncodedValue.should.equal('');
    });
    done();
  });
});