
var der = require('./der');
var pkcs = require('./pkcs');
var PfxDecoder = pkcs.PfxDecoder;
var fs = require('fs');
require('should');

suite('pkcs', function() {
    suite('filedecoder', function() {
        
        test('should run and produce a cert and a key', function(done) {
            fs.readFile('test/util/certificates/client-x509-rsa.pfx', function(err, data) {
                if (err) {
                    return done(err);
                }
                var pfx = new PfxDecoder();
                
                var pfxCert = null;
                pfx.on('cert', function(cert){
                    pfxCert = cert;
                });
                var pfxKey = null;
                pfx.on('key', function(key){
                    pfxKey = key;
                });

                var elements = pfx.parse(data);
                  
                (pfxCert == null).should.be.false;
                (pfxKey == null).should.be.false;
                done();
            });
        });

    });
});
