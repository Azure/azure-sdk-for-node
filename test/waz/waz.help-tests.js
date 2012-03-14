
require('should');
var waz = require('./waz');
var capture = require('./util').capture;

suite('waz', function(){
   suite('help', function() {
       
       test('should display help with -h option', function(done) {
           
           var result = capture(function() {
               waz.parse('node waz.js -h'.split(' '));
           });

           result.text.should.include('Usage:');
           done();
       });
       
   });
});


