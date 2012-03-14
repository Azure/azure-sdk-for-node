
var der = require('./der');
var fs = require('fs');
require('should');

suite('der', function(){
   suite('decoder-pfx-root', function() {
       
       var dec = new der.Decoder();
       function readAndDecode(filename, callback) {
           fs.readFile(filename, function(err,data) {
               if (err) {
                   return callback(err);
               }               
               var elements = dec.parse(data);
               callback(null, elements);
           });
       }
       
       test('should have one root element', function(done) {
           readAndDecode('test/util/certificates/client-x509-rsa.pfx', function(err,elements) {
               if (err) {
                   return done(err);
               }
               
               elements.should.have.length(1);
               done();
           });
       });

       test('should have two or three children', function(done) {
           readAndDecode('test/util/certificates/client-x509-rsa.pfx', function(err,elements) {
               if (err) {
                   return done(err);
               }
               
               var children = dec.parse(elements[0].buffer);
               children.length.should.be.within(2,3);
               done();
           });
       });


       test('should have version number 3 and a sequence', function(done) {
           readAndDecode('test/util/certificates/client-x509-rsa.pfx', function(err,elements) {
               if (err) {
                   return done(err);
               }
               
               elements[0].should.have.property('tag', der.SEQUENCE);
               var children = dec.parse(elements[0].buffer);
               children[0].should.have.property('tag', der.INTEGER);
               children[0].should.have.property('value', 3);
               children[1].should.have.property('tag', der.SEQUENCE);
               done();
           });
       });
   });
});
