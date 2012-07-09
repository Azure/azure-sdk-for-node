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


var der = require('./der');
var util = require('util');
var assert = require('assert');
var crypto = require('crypto');

var Decoder = der.Decoder;

var Pkcs = {
    PfxDecoder: PfxDecoder,
    oid: {
        '1.2.840.113549.1':'pkcs',
        '1.2.840.113549.1.1':'pkcs1',
        '1.2.840.113549.1.1.1':'RSA encryption',
        '1.2.840.113549.1.7':'pkcs7',
        '1.2.840.113549.1.7.1':'data', 
        '1.2.840.113549.1.7.6':'encryptedData',
        '1.2.840.113549.1.9':'pkcs9',
        '1.2.840.113549.1.9.20':'friendlyName',
        '1.2.840.113549.1.9.21':'localKeyId',
        '1.2.840.113549.1.9.22':'certTypes',
        '1.2.840.113549.1.9.22.1':'x509Certificate',
        '1.2.840.113549.1.12':'pkcs12',
        '1.2.840.113549.1.12.1':'Password-Based Encryption identifiers',
        '1.2.840.113549.1.12.1.3':'pbeWithSHAAnd3-KeyTripleDES-CBC',
        '1.2.840.113549.1.12.1.6':'pbeWithSHAAnd40BitRC2-CBC',
        '1.2.840.113549.1.12.10.1':'Bag Types',
        '1.2.840.113549.1.12.10.1.2':'pkcs-8ShroudedKeyBag',
        '1.2.840.113549.1.12.10.1.3':'certBag',
        '1.3.6.1.4.1.311.17.1':'pkcs-12-key-provider-name-attr'
    },

    pfx2pem: pfx2pem
};


function pfx2pem(buffer) {
    var pem = '';

    var decoder = new PfxDecoder();
    decoder.on('key', function (key) {
        pem = pem +
            '-----BEGIN RSA PRIVATE KEY-----\r\n' +
            split(key.buffer.toString('base64')) + '\r\n' +
            '-----END RSA PRIVATE KEY-----\r\n';
    });
    decoder.on('cert', function (cert) {
        pem = pem +
            '-----BEGIN CERTIFICATE-----\r\n' +
            split(cert.buffer.toString('base64')) + '\r\n' +
            '-----END CERTIFICATE-----\r\n';
    });
    decoder.parse(buffer);

    function split(text) {
        var index = 0;
        var result = '';
        while (index + 64 < text.length) {
            result = result + text.substring(index, index + 64) + '\r\n';
            index += 64;
        }
        return result + text.substring(index);
    }

    return new Buffer(pem);
}


function PfxDecoder() {
    var self = this;
    Decoder.call(self);
    
    var pdu = new PfxPduDecoder();
    
    self.on('element', function(element) {
        pdu.parse(element.buffer);
    });
    pdu.on('cert', function(cert) {
        self.emit('cert', cert);
    });
    pdu.on('key', function(key) {
        self.emit('key', key);
    });
}

util.inherits(PfxDecoder, Decoder);

function PfxPduDecoder() {
    var self = this;
    Decoder.call(self);

    var generic = new Decoder();
    var authSafe = new PfxContentInfoDecoder();
    var authSafeItems = new PfxContentBagDecoder();
    var safeBag = new PfxSafeBagDecoder();

    self.on('end', function(elements) {
        authSafe.parse(elements[1].buffer);
    });
    authSafe.on('data', function(data) {
        authSafeItems.parse(data);
    });
    authSafeItems.on('data', function(data) {
        safeBag.parse(data);
    });    
    safeBag.on('cert', function(cert) {
        self.emit('cert', cert);
    });
    safeBag.on('key', function(key) {
        self.emit('key', key);
    });
}

util.inherits(PfxPduDecoder, Decoder);

function PfxContentBagDecoder() {
    var self = this;
    Decoder.call(self);
    
    var itemDecoder = new PfxContentInfoDecoder();
    itemDecoder.on('data', function(data) {
        self.emit('data', data);
    });
    self.on('element', function(element) {
        assert.equal(element.tag, der.SEQUENCE);
        itemDecoder.parse(element.buffer);
    });
}

util.inherits(PfxContentBagDecoder, Decoder);

function PfxContentInfoDecoder() {
    var self = this;
    Decoder.call(self);

    var generic = new Decoder();
    var encryptedData = new PfxEncryptedDataDecoder();
    
    encryptedData.on('data', function(data) {
        self.emit('data', data);
    });
    
    self.on('end', function(elements) {
        assert.equal(elements[0].tag, der.OBJECT_IDENTIFIER);
        var oid = elements[0].value;
        if (Pkcs.oid[oid] == 'data') {
            assert.equal(elements.length, 2);
            assert.equal(elements[1].tag, der.CONTEXT_CONSTRUCTED_0);
            elements = generic.parse(elements[1].buffer);

            assert.equal(elements.length, 1);
            assert.equal(elements[0].tag, der.OCTET_STRING);
            elements = generic.parse(elements[0].buffer);
            
            for(var index = 0; index != elements.length; ++index) {
                assert.equal(elements[index].tag, der.SEQUENCE);
                self.emit('data', elements[index].buffer);
            }
        } else if (Pkcs.oid[oid] == 'encryptedData') {
            assert.equal(elements[1].tag, der.CONTEXT_CONSTRUCTED_0);
            elements = generic.parse(elements[1].buffer);

            assert.equal(elements.length, 1);
            assert.equal(elements[0].tag, der.SEQUENCE);
            
            elements = generic.parse(elements[0].buffer);
            assert.equal(elements.length, 2);
            assert.equal(elements[0].tag, der.INTEGER);
            assert.equal(elements[0].value, 0);
            assert.equal(elements[1].tag, der.SEQUENCE);

            encryptedData.parse(elements[1].buffer);
        } else {
            throw new Error('Unknown AuthenticatedSafe oid ' + oid);
        }
    });
}

util.inherits(PfxContentInfoDecoder, Decoder);

function PfxEncryptedDataDecoder() {
    var self = this;
    Decoder.call(self);
    
    var algorithmDecoder = new PfxAlgorithmDecoder();
    var generic = new Decoder();

    self.on('end', function(elements) {
        assert.equal(elements.length, 3);
        assert.equal(elements[0].tag, der.OBJECT_IDENTIFIER);
        assert.equal(elements[1].tag, der.SEQUENCE);
        assert.equal(elements[2].tag, der.CONTEXT_PRIMATIVE_0);
        
        var algorithm = algorithmDecoder.parse(elements[1].buffer);
        var cipher = algorithm.createCipher(null);
        var data1 = cipher.update(elements[2].buffer.toString('binary'));
        var data2 = cipher.final();
        var data = new Buffer(data1 + data2, 'binary');

        elements = generic.parse(data);
        
        for(var index = 0; index != elements.length; ++index) {
            assert.equal(elements[index].tag, der.SEQUENCE);
            self.emit('data', elements[index].buffer);
        }
    });
}

util.inherits(PfxEncryptedDataDecoder, Decoder);

function PfxAlgorithmDecoder() {
    var self = this;
    Decoder.call(self);
    
    var generic = new Decoder();

    self.on('end', function(elements) {
        assert.equal(elements.length, 2);
        assert.equal(elements[0].tag, der.OBJECT_IDENTIFIER);
        assert.equal(elements[1].tag, der.SEQUENCE);

        var args = generic.parse(elements[1].buffer);
        assert.equal(args.length, 2);
        assert.equal(args[0].tag, der.OCTET_STRING);
        assert.equal(args[1].tag, der.INTEGER);

        var algorithmOid = elements[0].value;
        var salt = args[0].value;
        var iterations = args[1].value;
        
        var algorithmName = Pkcs.oid[algorithmOid];
        if (algorithmName == 'pbeWithSHAAnd40BitRC2-CBC') {
            elements.createCipher = function(password) {
                var key = createPkcs12Info(password, salt, 5, iterations, 1);
                var iv = createPkcs12Info(password, salt, 8, iterations, 2);
                return crypto.createDecipheriv('rc2-40-cbc', key.toString('binary'), iv.toString('binary'));
            };
        } else if (algorithmName == 'pbeWithSHAAnd3-KeyTripleDES-CBC') {
            elements.createCipher = function(password) {
                var key = createPkcs12Info(password, salt, 24, iterations, 1);
                var iv = createPkcs12Info(password, salt, 8, iterations, 2);
                return crypto.createDecipheriv('des-ede3-cbc', key.toString('binary'), iv.toString('binary'));
            };
        } else {
            throw new Error('Unknown algorithmId ' + algorithmOid);
        }
    });
}

util.inherits(PfxAlgorithmDecoder, Decoder);

function PfxSafeBagDecoder() {
    var self = this;
    Decoder.call(self);
    
    var generic = new Decoder();
    var pkcs8ShroudedKeyBag = new PfxPkcs8ShroudedKeyBagDecoder();
    var certBag = new PfxCertBagDecoder();
    certBag.on('cert', function(cert){self.emit('cert', cert);});
    pkcs8ShroudedKeyBag.on('key', function(key){self.emit('key', key);});
    
    self.on('element', function(element) {
        assert.equal(element.tag, der.SEQUENCE);
        var elements = generic.parse(element.buffer);
        assert.equal(elements[0].tag, der.OBJECT_IDENTIFIER);
        var bagId = elements[0].value;
        if (Pkcs.oid[bagId] == 'pkcs-8ShroudedKeyBag') {
            assert.equal(elements[1].tag, der.CONTEXT_CONSTRUCTED_0);
            elements = generic.parse(elements[1].buffer);
            
            assert.equal(elements[0].tag, der.SEQUENCE);
            pkcs8ShroudedKeyBag.parse(elements[0].buffer);
        } else if (Pkcs.oid[bagId] == 'certBag') {
            assert.equal(elements[1].tag, der.CONTEXT_CONSTRUCTED_0);
            elements = generic.parse(elements[1].buffer);
            
            assert.equal(elements[0].tag, der.SEQUENCE);
            certBag.parse(elements[0].buffer);
        } else {
            throw new Error('Unknown SafeBag bagId ' + bagId);
        }
    });
}
util.inherits(PfxSafeBagDecoder, Decoder);

function PfxPkcs8ShroudedKeyBagDecoder() {
    var self = this;
    Decoder.call(self);
    
    var generic = new Decoder();
    var algorithmDecoder = new PfxAlgorithmDecoder();
    
    self.on('end', function(elements) {
        assert.equal(elements.length, 2);
        assert.equal(elements[0].tag, der.SEQUENCE);
        assert.equal(elements[1].tag, der.OCTET_STRING);
        
        var algorithm = algorithmDecoder.parse(elements[0].buffer);
        var cipher = algorithm.createCipher(null);
        var data1 = cipher.update(elements[1].buffer.toString('binary'));
        var data2 = cipher.final();
        var data = new Buffer(data1 + data2, 'binary');

        elements = generic.parse(data);
        
        for(var index = 0; index != elements.length; ++index) {
            assert.equal(elements[index].tag, der.SEQUENCE);
            
            var fields = generic.parse(elements[index].buffer);
            assert.equal(fields.length, 3);
            assert.equal(fields[0].tag, der.INTEGER);
            assert.equal(fields[1].tag, der.SEQUENCE);
            fields[1].fields = generic.parse(fields[1].buffer);
            assert.equal(fields[1].fields[0].tag, der.OBJECT_IDENTIFIER);
            assert.equal(fields[2].tag, der.OCTET_STRING);

            self.emit('key', {
                type: fields[1].fields[0].value,
                buffer: fields[2].buffer
            });
        }
    });
}
util.inherits(PfxPkcs8ShroudedKeyBagDecoder, Decoder);

function PfxCertBagDecoder() {
    var self = this;
    Decoder.call(self);
    
    var generic = new Decoder();
    
    self.on('end', function(elements) {
        assert.equal(elements[0].tag, der.OBJECT_IDENTIFIER);
        var certId = elements[0].value;
        var certValue = elements[1].value;
        if (Pkcs.oid[certId] == 'x509Certificate') {
            assert.equal(elements[1].tag, der.CONTEXT_CONSTRUCTED_0);
            elements = generic.parse(elements[1].buffer);
            
            assert.equal(elements[0].tag, der.OCTET_STRING);
            self.emit('cert', {
                type: certId,
                buffer: elements[0].buffer
            });
        } else {
            throw new Error('Unknown CertBag certId ' + certId);
        }
    });
}
util.inherits(PfxCertBagDecoder, Decoder);

function createPkcs12Info(password, salt, keyLength, iterations, id) {
    var digestLength = 20; // sha-1 digest size constant
    var inputBytes = 64; // pkcs12 constant for sha-1
    
    var idString = new Buffer(inputBytes);
    for(var index = 0; index != idString.length; ++index) {
        idString[index] = id;
    }

    var saltString = new Buffer(strangeLength(salt.length, inputBytes));
    fillBuffer(salt, saltString);

    var passwordString = null;
    if (password === null || password.length === 0) {
        passwordString = new Buffer(0);
    } else {
        passwordString = new Buffer(strangeLength(password.length, inputBytes));
        fillBuffer(password, passwordString);
    }
    
    var inputString = new Buffer(saltString.length + passwordString.length);
    saltString.copy(inputString);
    passwordString.copy(inputString, saltString.length);
    
    var blocks = strangeLength(keyLength, digestLength) / digestLength;

    var outputString = new Buffer(digestLength);
    var holdString = new Buffer(inputBytes);
    var dataString = new Buffer(blocks * digestLength);
    
    var offset = 0;
    for(var block = 0; block != blocks; ++block) {
        outputString = digestIterations(idString, inputString, iterations);
        outputString.copy(dataString, offset);
        offset += outputString.length;
        
        if (block != blocks - 1) {
            fillBuffer(outputString, holdString);
            createInputString(inputString, holdString, holdString);
        }
    }

    var info = new Buffer(keyLength);
    dataString.copy(info, 0, 0, keyLength);
    return info;
}

function digestIterations(idString, inputString, iterations) {
    var hash = crypto.createHash('sha1');
    hash.update(idString);
    hash.update(inputString);
//    console.log('Digest D (length %d):', idString.length);
 //   console.log(idString);
 //   console.log('Digest I (length %d):', inputString.length);
 //   console.log(inputString);
    var outputString = new Buffer(hash.digest('base64'),'base64');
    for(var iteration = 1; iteration != iterations; ++iteration) {
        hash = crypto.createHash('sha1');
        hash.update(outputString);
        outputString = new Buffer(hash.digest('base64'), 'base64');
    }
//    console.log(outputString);
    return outputString;
}

function createInputString(oldInput, addedInput) {
    var inputSize = addedInput.length;
    var passes = (oldInput.length / inputSize) >> 0;
    var offset = 0;

    for (var pass = 0; pass != passes; ++pass) {
        var carry = 1;
        for (var scan = 0; scan != inputSize; ++scan) {
            var index = inputSize - scan - 1;
            var value = oldInput[index + offset] + addedInput[index] + carry;
            oldInput[index + offset] = value & 0xff;
            carry = value >> 8;
        }
        offset += inputSize;
    }
}

function strangeLength(length, blockSize) {
    return blockSize * (((length+blockSize-1)/blockSize) >> 0);
}

function fillBuffer(source, target) {
    var sourceLength = source.length;
    var targetLength = target.length;
    var targetStart = 0;
    while (targetStart + sourceLength <= targetLength) {
        source.copy(target, targetStart);
        targetStart += sourceLength;
    }
//    console.log('source.copy %d %d', targetStart, targetLength);
    if (targetLength != targetStart) {
        source.copy(target, targetStart, 0, targetLength - targetStart);
    }
//console.log('fillBuffer');
//console.log(source);
//console.log(target);
}

exports = module.exports = Pkcs;
