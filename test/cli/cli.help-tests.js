
require('should');
var cli = require('./cli');
var capture = require('./util').capture;

suite('cli', function () {
   suite('help', function() {
       
       test('should display help with -h option', function(done) {
           
           var result = capture(function() {
               cli.parse('node cli.js -h'.split(' '));
           });

           result.text.should.include('Usage:');
           done();
       });
       
   });
});


