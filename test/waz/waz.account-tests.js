
require('should');
var waz = require('./waz');
var capture = require('./util').capture;

suite('waz', function(){
   suite('account', function() {
       
       suite('import', function() {
           
           test('should launch browser when there is no file name', function(done) {

               var result = capture(function() {
                   waz.parse('node waz.js account import'.split(' '));
               });

               done();
           });
           
       });
   });
});


