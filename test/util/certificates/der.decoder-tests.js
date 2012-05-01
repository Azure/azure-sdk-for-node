
var der = require('./der');
var fs = require('fs');
require('should');


suite('der', function(){
   suite('decoder', function() {
       
       test('should have one root element', function(done) {
           fs.readFile('test/util/certificates/ca-cert-x509.base64', function(err,data) {
               if (err) {
                   return done(err);
               }
               
               var buffer = new Buffer(data.toString('ascii'), 'base64');
               var dec = new der.Decoder();
               var elements = dec.parse(buffer);
               elements.should.have.length(1);
               done();
           });
       });

   });
});
