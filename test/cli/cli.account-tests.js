
require('should');
var cli = require('./cli');
var capture = require('./util').capture;

suite('cli', function(){
   suite('account', function() {
       
       suite('import', function() {
           
           test('should launch browser when there is no file name', function(done) {

               var result = capture(function() {
                   cli.parse('node cli.js account import'.split(' '));
               });

               done();
           });
           
       });
   });
});


