// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

var assert = require('assert');
var should = require('should');
var moment = require('moment');
var msRest = require('../lib/msRest');
var testClient = require('./data/TestClient/lib/testClient');

var tokenCredentials = new msRest.TokenCredentials('dummy');
var valid_uuid = 'ceaafd1e-f936-429f-bbfc-82ee75dddc33';

describe('msrest', function () {
  describe('serializeObject', function () {
    it('should correctly serialize a Date Object', function (done) {
      var dateObj = new Date('2015-01-01');
      var dateISO = '2015-01-01T00:00:00.000Z';
      msRest.serializeObject(dateObj).should.equal(dateISO);
      done();
    });

    it('should correctly serialize a Date object with max value', function (done) {
      var serializedDateString = msRest.serializeObject(new Date('9999-12-31T23:59:59-12:00'));
      serializedDateString.should.equal('+010000-01-01T11:59:59.000Z');
      done();
    });

    it('should correctly serialize a Buffer Object', function (done) {
      var bufferObj = Buffer.from('Javascript');
      var base64str = 'SmF2YXNjcmlwdA==';
      msRest.serializeObject(bufferObj).should.equal(base64str);
      done();
    });

    it('should correctly serialize Primitive types', function (done) {
      msRest.serializeObject(true).should.equal(true);
      msRest.serializeObject(false).should.equal(false);
      msRest.serializeObject('true').should.equal('true');
      msRest.serializeObject(1).should.equal(1);
      msRest.serializeObject(100.0123).should.equal(100.0123);
      assert.equal(msRest.serializeObject(null), null);
      done();
    });

    it('should correctly serialize an empty array and an empty dictionary', function (done) {
      assert.deepEqual(msRest.serializeObject([]), []);
      assert.deepEqual(msRest.serializeObject({}), {});
      done();
    });

    it('should correctly serialize a complex JSON object', function (done) {
      var o1 = {
        'p1': 'value1',
        'p2': 'value2',
        'top-buf': Buffer.from('top string', 'utf-8'),
        'top-date': new Date('2014'),
        'top-dates': [new Date('1900'), new Date('1901')],
        'insider': {
          'insider-buf': Buffer.from('insider string', 'utf-8'),
          'insider-date': new Date('2015'),
          'insider-dates': [new Date('2100'), new Date('2101')],
          'insider-dictionary': {
            'k1': new Date('2015'),
            'k2': new Date('2016'),
            'k3': new Date('2017')
          },
          'top-complex': {
            'id': 1,
            'name': 'Joey',
            'age': 23.36,
            'male': true,
            'birthday': '1992-01-01T00:00:00.000Z',
            'anniversary': new Date('2013-12-08'),
            'memory': Buffer.from('Yadadadada')
          }
        }
      };

      var o2 = {
        p1: 'value1',
        p2: 'value2',
        'top-buf': 'dG9wIHN0cmluZw==',
        'top-date': '2014-01-01T00:00:00.000Z',
        'top-dates': [
          '1900-01-01T00:00:00.000Z',
          '1901-01-01T00:00:00.000Z'
        ],
        insider: {
          'insider-buf': 'aW5zaWRlciBzdHJpbmc=',
          'insider-date': '2015-01-01T00:00:00.000Z',
          'insider-dates': [
            '2100-01-01T00:00:00.000Z',
            '2101-01-01T00:00:00.000Z'
          ],
          'insider-dictionary': {
            k1: '2015-01-01T00:00:00.000Z',
            k2: '2016-01-01T00:00:00.000Z',
            k3: '2017-01-01T00:00:00.000Z'
          },
          'top-complex': {
            id: 1,
            name: 'Joey',
            age: 23.36,
            male: true,
            birthday: '1992-01-01T00:00:00.000Z',
            anniversary: '2013-12-08T00:00:00.000Z',
            memory: 'WWFkYWRhZGFkYQ=='
          }
        }
      };
      assert.deepEqual(msRest.serializeObject(o1), o2);
      done();
    });
  });

  describe('serialize', function () {
    var mapper = {};
    var invalid_uuid = 'abcd-efgd90-90890jkh';
    it('should correctly serialize a string if the type is "any"', function (done) {
      let mapper = { type: { name: "any" }, required: false, serializedName: 'any' };
      let serializedObject = msRest.serialize(mapper, 'foo', 'anyBody');
      serializedObject.should.equal("foo");
      done();
    });
    it('should correctly serialize an array if the type is "any"', function (done) {
      let mapper = { type: { name: "any" }, required: false, serializedName: 'any' };
      let serializedObject = msRest.serialize(mapper, [1, 2], 'anyBody');
      assert.deepEqual(serializedObject, [1, 2]);
      done();
    });
    it('should correctly serialize a string', function (done) {
      mapper = { type: { name: 'String' } };
      var serializedObject = msRest.serialize(mapper, 'foo', 'stringBody');
      serializedObject.should.equal('foo');
      done();
    });
    it('should correctly serialize a uuid', function (done) {
      mapper = { type: { name: 'Uuid' } };
      var serializedObject = msRest.serialize(mapper, valid_uuid, 'uuidBody');
      serializedObject.should.equal(valid_uuid);
      done();
    });
    it('should throw an error if the value is not a valid Uuid', function (done) {
      mapper = { type: { name: 'Uuid' } };
      try {
        var serializedObject = msRest.serialize(mapper, invalid_uuid, 'uuidBody');
      } catch (error) {
        error.message.should.match(/.*with value.*must be of type string and a valid uuid/ig);
        done();
      }
    });
    it('should correctly serialize a number', function (done) {
      mapper = { type: { name: 'Number' } };
      var serializedObject = msRest.serialize(mapper, 1.506, 'stringBody');
      serializedObject.should.equal(1.506);
      done();
    });
    it('should correctly serialize a boolean', function (done) {
      mapper = { type: { name: 'boolean' } };
      var serializedObject = msRest.serialize(mapper, false, 'stringBody');
      serializedObject.should.equal(false);
      done();
    });
    it('should correctly serialize an Enum', function (done) {
      mapper = { type: { name: 'Enum', allowedValues: [1, 2, 3, 4] } };
      var serializedObject = msRest.serialize(mapper, 1, 'enumBody');
      serializedObject.should.equal(1);
      done();
    });
    it('should throw an error if the value is not valid for an Enum', function (done) {
      mapper = { type: { name: 'Enum', allowedValues: [1, 2, 3, 4] } };
      try {
        var serializedObject = msRest.serialize(mapper, 6, 'enumBody');
      } catch (error) {
        error.message.should.match(/6 is not a valid value for enumBody\. The valid values are: \[1,2,3,4\]/ig);
        done();
      }
    });
    it('should throw an error if allowedValues is not specified for an EnumType', function (done) {
      mapper = { type: { name: 'Enum' } };
      try {
        var serializedObject = msRest.serialize(mapper, 6, 'enumBody');
      } catch (error) {
        error.message.should.match(/Please provide a set of allowedValues to validate enumBody as an Enum Type\./ig);
        done();
      }
    });
    it('should correctly serialize a Buffer Object', function (done) {
      mapper = { type: { name: 'ByteArray' } };
      var bufferObj = Buffer.from('Javascript');
      var base64str = 'SmF2YXNjcmlwdA==';
      var serializedObject = msRest.serialize(mapper, bufferObj, 'stringBody');
      serializedObject.should.equal(base64str);
      done();
    });
    it('should correctly serialize a Date Object', function (done) {
      var dateObj = new Date('2015-01-01');
      var dateISO = '2015-01-01';
      mapper = { type: { name: 'Date' } };
      msRest.serialize(mapper, dateObj, 'dateObj').should.equal(dateISO);
      done();
    });
    it('should correctly serialize a Date object with max value', function (done) {
      mapper = { type: { name: 'DateTime' } };
      var serializedDateString = msRest.serialize(mapper, new Date('9999-12-31T23:59:59-12:00'), 'dateTimeObj');
      serializedDateString.should.equal('+010000-01-01T11:59:59.000Z');
      done();
    });
    it('should correctly serialize a Date object with max value and format UnixTime', function (done) {
      mapper = { type: { name: 'UnixTime' } };
      var serializedDate = msRest.serialize(mapper, new Date('9999-12-31T23:59:59-12:00'), 'dateTimeObj');
      serializedDate.should.equal(253402343999);
      done();
    });
    it('should correctly serialize a string in DateTimeRfc1123', function (done) {
      mapper = { type: { name: 'DateTimeRfc1123' } };
      var rfc = new Date('Mon, 01 Jan 0001 00:00:00 GMT');
      var serializedDateString = msRest.serialize(mapper, rfc, 'dateTimeObj');
      serializedDateString.should.equal('Mon, 01 Jan 2001 00:00:00 GMT');
      done();
    });
    it('should correctly serialize a duration object', function (done) {
      mapper = { type: { name: 'TimeSpan' } };
      var duration = moment.duration({ days: 123, hours: 22, minutes: 14, seconds: 12, milliseconds: 11 });
      var serializedDateString = msRest.serialize(mapper, duration, 'dateTimeObj');
      serializedDateString.should.equal('P123DT22H14M12.011S');
      done();
    });

    it('should fail when the given object is not a Duration like object', function (done) {
      mapper = { type: { name: 'TimeSpan' } };
      var duration = { days: 123, hours: 22, minutes: 14, seconds: 12, milliseconds: 11 };
      duration.constructor = { name: 'Duration' };
      try {
        var serializedDateString = msRest.serialize(mapper, duration, 'dateTimeObj');
      } catch (err) {
        assert.equal(err.message, 'dateTimeObj must be a TimeSpan/Duration.');
      }
      done();
    });

    it('should correctly serialize an array of primitives', function (done) {
      mapper = { type: { name: 'Sequence', element: { type: { name: 'String' } } } };
      var array = ['One', 'Two', 'three'];
      var serializedArray = msRest.serialize(mapper, array, 'arrayObj');
      assert.deepEqual(array, serializedArray);
      done();
    });

    it('should correctly serialize an array of array of primitives', function (done) {
      mapper = {
        type: {
          name: 'Sequence',
          element: {
            type: {
              name: 'Sequence',
              element: {
                type: {
                  name: 'Number'
                }
              }
            }
          }
        }
      };
      var array = [[1], [2], [1, 2, 3]];
      var serializedArray = msRest.serialize(mapper, array, 'arrayObj');
      assert.deepEqual(array, serializedArray);
      done();
    });

    it('should correctly serialize an array of array of object types', function (done) {
      mapper = {
        type: {
          name: 'Sequence',
          element: {
            type: {
              name: 'Sequence',
              element: {
                type: {
                  name: 'Object'
                }
              }
            }
          }
        }
      };
      var array = [[1], ['2'], [1, '2', {}, true, []]];
      var serializedArray = msRest.serialize(mapper, array, 'arrayObj');
      assert.deepEqual(array, serializedArray);
      done();
    });

    it('should fail while serializing an array of array of "object" types when a null value is provided', function (done) {
      mapper = {
        type: {
          name: 'Sequence',
          element: {
            type: {
              name: 'Sequence',
              element: {
                required: true,
                type: {
                  name: 'Object'
                }
              }
            }
          }
        }
      };
      var array = [[1], ['2'], [null], [1, '2', {}, true, []]];
      var serializedArray;
      try {
        serializedArray = msRest.serialize(mapper, array, 'arrayObj');
      } catch (err) {
        assert.equal(err.message, 'arrayObj[2][0] cannot be null or undefined.');
      }
      done();
    });

    it('should correctly serialize an array of dictionary of primitives', function (done) {
      mapper = {
        type: {
          name: 'Sequence',
          element: {
            type: {
              name: 'Dictionary',
              value: {
                type: {
                  name: 'Boolean'
                }
              }
            }
          }
        }
      };
      var array = [{ 1: true }, { 2: false }, { 1: true, 2: false, 3: true }];
      var serializedArray = msRest.serialize(mapper, array, 'arrayObj');
      assert.deepEqual(array, serializedArray);
      done();
    });


    it('should correctly serialize a dictionary of primitives', function (done) {
      mapper = { type: { name: 'Dictionary', value: { type: { name: 'String' } } } };
      var dict = { 1: 'One', 2: 'Two', 3: 'three' };
      var serializedDictionary = msRest.serialize(mapper, dict, 'dictObj');
      assert.deepEqual(dict, serializedDictionary);
      done();
    });

    it('should correctly serialize a dictionary of array of primitives', function (done) {
      mapper = {
        type: {
          name: 'Dictionary',
          value: {
            type: {
              name: 'Sequence',
              element: {
                type: {
                  name: 'Number'
                }
              }
            }
          }
        }
      };
      var dict = { 'One': [1], 'Two': [1, 2], 'three': [1, 2, 3] };
      var serializedDictionary = msRest.serialize(mapper, dict, 'dictObj');
      assert.deepEqual(dict, serializedDictionary);
      done();
    });

    it('should correctly serialize a dictionary of dictionary of primitives', function (done) {
      mapper = {
        type: {
          name: 'Dictionary',
          value: {
            type: {
              name: 'Dictionary',
              value: {
                type: {
                  name: 'Boolean'
                }
              }
            }
          }
        }
      };
      var dict = { 1: { 'One': true }, 2: { 'Two': false }, 3: { 'three': true } };
      var serializedDictionary = msRest.serialize(mapper, dict, 'dictObj');
      assert.deepEqual(dict, serializedDictionary);
      done();
    });

    it('should correctly serialize a composite type', function (done) {
      var client = new testClient('http://localhost:9090');
      var product = new client.models['Product']();
      mapper = product.mapper();
      var productObj = {
        id: 101,
        name: 'TestProduct',
        provisioningState: 'Succeeded',
        tags: {
          tag1: 'value1',
          tag2: 'value2'
        },
        dispatchTime: new Date('2015-01-01T12:35:36.009Z'),
        invoiceInfo: {
          invId: 1002,
          invDate: '2015-12-25',
          invProducts: [
            {
              'Product1': {
                id: 101,
                name: 'TestProduct'
              }
            },
            {
              'Product2': {
                id: 104,
                name: 'TestProduct1'
              }
            }
          ]
        },
        subProducts: [
          {
            subId: 102,
            subName: 'SubProduct1',
            makeTime: new Date('2015-12-21T01:01:01'),
            invoiceInfo: {
              invId: 1002,
              invDate: '2015-12-25'
            }
          },
          {
            subId: 103,
            subName: 'SubProduct2',
            makeTime: new Date('2015-12-21T01:01:01'),
            invoiceInfo: {
              invId: 1003,
              invDate: '2015-12-25'
            }
          }
        ]
      };
      var serializedProduct = client.serialize(mapper, productObj, 'productObject');
      for (var prop in serializedProduct) {
        if (prop === 'properties') {
          serializedProduct[prop].provisioningState.should.equal(productObj.provisioningState);
        } else if (prop === 'id') {
          serializedProduct[prop].should.equal(productObj.id);
        } else if (prop === 'name') {
          serializedProduct[prop].should.equal(productObj.name);
        } else if (prop === 'tags') {
          JSON.stringify(serializedProduct[prop]).should.equal(JSON.stringify(productObj.tags));
        } else if (prop === 'dispatchTime') {
          JSON.stringify(serializedProduct[prop]).should.equal(JSON.stringify(productObj.dispatchTime));
        } else if (prop === 'invoiceInfo') {
          (JSON.stringify(serializedProduct[prop]).length - JSON.stringify(productObj.invoiceInfo).length).should.equal(4);
        } else if (prop === 'subProducts') {
          (JSON.stringify(serializedProduct[prop]).length - JSON.stringify(productObj.subProducts).length).should.equal(8);
        }
      }
      done();
    });

    it('should correctly serialize object version of polymorphic discriminator', function (done) {
      var client = new testClient('http://localhost:9090');
      var SawsharkModel = new client.models['Sawshark']();
      mapper = SawsharkModel.mapper();
      var sawshark = {
        'fishtype': 'sawshark',
        'age': 22,
        'birthday': new Date('2012-01-05T01:00:00Z'),
        'species': 'king',
        'length': 1.0,
        'picture': Buffer.from([255, 255, 255, 255, 254]),
        'siblings': [
          {
            'fishtype': 'shark',
            'age': 6,
            'birthday': new Date('2012-01-05T01:00:00Z'),
            'length': 20.0,
            'species': 'predator'
          },
          {
            'fishtype': 'sawshark',
            'age': 105,
            'birthday': new Date('1900-01-05T01:00:00Z'),
            'length': 10.0,
            'picture': Buffer.from([255, 255, 255, 255, 254]),
            'species': 'dangerous'
          }
        ]
      };
      var serializedSawshark = client.serialize(mapper, sawshark, 'result');
      serializedSawshark.age.should.equal(22);
      serializedSawshark['fish.type'].should.equal('sawshark');
      serializedSawshark.siblings.length.should.equal(2);
      serializedSawshark.siblings[0]['fish.type'].should.equal('shark');
      serializedSawshark.siblings[0].age.should.equal(6);
      serializedSawshark.siblings[0].birthday.should.equal(new Date('2012-01-05T01:00:00Z').toISOString());
      serializedSawshark.siblings[1]['fish.type'].should.equal('sawshark');
      serializedSawshark.siblings[1].age.should.equal(105);
      serializedSawshark.siblings[1].birthday.should.equal(new Date('1900-01-05T01:00:00Z').toISOString());
      serializedSawshark.siblings[1].picture.should.equal('//////4=');
      serializedSawshark.picture.should.equal('//////4=');
      done();
    });

    it('should correctly serialize string version of polymorphic discriminator', function (done) {
      var client = new testClient('http://localhost:9090');
      var PetGalleryModel = new client.models['PetGallery']();
      mapper = PetGalleryModel.mapper();
      var petgallery = {
        'id': 1,
        'name': 'Fav pet gallery',
        'pets': [
          {
            'id': 2,
            'name': 'moti',
            'food': 'buiscuit',
            'pet.type': 'Dog',
            'pettype': 'Dog'
          },
          {
            'id': 3,
            'name': 'billa',
            'color': 'red',
            'pet.type': 'Cat',
            'pettype': 'Cat' // In string version the user has to pass the actual property with dot and the normalized one.
          }
        ]
      };
      var serializedPetGallery = client.serialize(mapper, petgallery, 'result');
      serializedPetGallery.id.should.equal(1);
      serializedPetGallery.name.should.equal('Fav pet gallery');
      serializedPetGallery.pets.length.should.equal(2);
      serializedPetGallery.pets[0]['pet.type'].should.equal('Dog');
      serializedPetGallery.pets[0].id.should.equal(2);
      serializedPetGallery.pets[0].name.should.equal('moti');
      serializedPetGallery.pets[0].food.should.equal('buiscuit');
      serializedPetGallery.pets[1]['pet.type'].should.equal('Cat');
      serializedPetGallery.pets[1].id.should.equal(3);
      serializedPetGallery.pets[1].name.should.equal('billa');
      serializedPetGallery.pets[1].color.should.equal('red');
      done();
    });

    it('should correctly serialize additionalProperties when the mapper knows that additional properties are allowed', function (done) {
      var bodyParameter = {
        id: 5,
        name: 'Funny',
        odatalocation: 'westus',
        additionalProperties1: {
          height: 5.61,
          weight: 599,
          footsize: 11.5
        },
        color: 'red',
        city: 'Seattle',
        food: 'tikka masala',
        birthdate: new Date('2017-12-13T02:29:51Z')
      };
      var client = new testClient('http://localhost:9090');
      var petAP = new client.models['PetAP']();
      mapper = petAP.mapper();
      var result = client.serialize(mapper, bodyParameter, 'bodyParameter');
      result.id.should.equal(5);
      result.eyeColor.should.equal('brown');
      result['@odata.location'].should.equal('westus');
      result.color.should.equal('red');
      result.city.should.equal('Seattle');
      result.food.should.equal('tikka masala');
      result.additionalProperties.height.should.equal(5.61);
      result.additionalProperties.weight.should.equal(599);
      result.additionalProperties.footsize.should.equal(11.5);
      result.name.should.equal('Funny');
      result.birthdate.should.equal('2017-12-13T02:29:51.000Z');
      done();
    });

    it("should allow null when required: true and nullable: true", function() {
      const mapper = {
        required: false,
        serializedName: 'testmodel',
        type: {
          name: 'Composite',
          className: 'testmodel',
          modelProperties: {
            length: {
              required: true,
              nullable: true,
              serializedName: 'length',
              type: {
                name: 'Number'
              }
            }
          }
        }
      };

      const result = msRest.serialize(mapper, { length: null }, "testobj");
      should.exist(result);
    });

    it("should not allow undefined when required: true and nullable: true", function() {
      const mapper = {
        required: false,
        serializedName: 'testmodel',
        type: {
          name: 'Composite',
          className: 'testmodel',
          modelProperties: {
            length: {
              required: true,
              nullable: true,
              serializedName: 'length',
              type: {
                name: 'Number'
              }
            }
          }
        }
      };

      (function () { msRest.serialize(mapper, { length: undefined }, "testobj"); }).should.throw("testobj.length cannot be undefined.");
    });

    it("should not allow null when required: true and nullable: false", function() {
      const mapper = {
        required: false,
        serializedName: 'testmodel',
        type: {
          name: 'Composite',
          className: 'testmodel',
          modelProperties: {
            length: {
              required: true,
              nullable: false,
              serializedName: 'length',
              type: {
                name: 'Number'
              }
            }
          }
        }
      };

      (function () { msRest.serialize(mapper, { length: null }, "testobj"); }).should.throw("testobj.length cannot be null or undefined.");
    });

    it("should not allow undefined when required: true and nullable: false", function() {
      const mapper = {
        required: false,
        serializedName: 'testmodel',
        type: {
          name: 'Composite',
          className: 'testmodel',
          modelProperties: {
            length: {
              required: true,
              nullable: false,
              serializedName: 'length',
              type: {
                name: 'Number'
              }
            }
          }
        }
      };

      (function () { msRest.serialize(mapper, { length: undefined }, "testobj"); }).should.throw("testobj.length cannot be null or undefined.");
    });

    it("should not allow null when required: true and nullable is undefined", function() {
      const mapper = {
        required: true,
        type: {
          name: "String"
        }
      };
      (function () { msRest.serialize(mapper, null, "testobj"); }).should.throw("testobj cannot be null or undefined.");
    });

    it("should not allow undefined when required: true and nullable is undefined", function() {
      const mapper = {
        required: true,
        type: {
          name: "String"
        }
      };
      (function () { msRest.serialize(mapper, undefined, "testobj"); }).should.throw("testobj cannot be null or undefined.");
    });

    it("should allow null when required: false and nullable: true", function() {
      const mapper = {
        required: false,
        nullable: true,
        type: {
          name: "String"
        }
      };

      msRest.serialize(mapper, null, "testobj");
    });

    it("should not allow null when required: false and nullable: false", function() {
      const mapper = {
        required: false,
        nullable: false,
        type: {
          name: "String"
        }
      };
      (function () { msRest.serialize(mapper, null, "testobj"); }).should.throw("testobj cannot be null.");
    });

    it("should allow null when required: false and nullable is undefined", function() {
      const mapper = {
        required: false,
        type: {
          name: "String"
        }
      };

      msRest.serialize(mapper, null, "testobj");
    });

    it("should allow undefined when required: false and nullable: true", function() {
      const mapper = {
        required: false,
        nullable: true,
        type: {
          name: "String"
        }
      };

      msRest.serialize(mapper, undefined, "testobj");
    });

    it("should allow undefined when required: false and nullable: false", function() {
      const mapper = {
        serializedName: "fooType",
        type: {
          name: "Composite",
          className: "fooType",
          modelProperties: {
            length: {
              serializedName: "length",
              required: false,
              nullable: false,
              type: {
                name: "String"
              }
            }
          }
        }
      };

      msRest.serialize(mapper, { length: undefined }, "testobj");
    });

    it("should allow undefined when required: false and nullable is undefined", function() {
      const mapper = {
        required: false,
        type: {
          name: "String"
        }
      };

      msRest.serialize(mapper, undefined, "testobj");
    });
  });

  describe('deserialize', function () {
    var mapper = {};
    it('should correctly deserialize a Date if the type is "any"', function (done) {
      let mapper = { type: { name: "any" }, required: false, serializedName: 'any' };
      let d = new Date();
      let deserializedObject = msRest.deserialize(mapper, d, 'anyResponseBody');
      deserializedObject.should.equal(d);
      done();
    });
    it('should correctly deserialize an array if the type is "any"', function (done) {
      let mapper = { type: { name: "any" }, required: false, serializedName: 'any' };
      let buf = Buffer.from("HelloWorld!");
      let deserializedObject = msRest.deserialize(mapper, buf, 'anyBody');
      deserializedObject.should.equal(buf);
      done();
    });
    it('should correctly deserialize a uuid', function (done) {
      mapper = { type: { name: 'Uuid' } };
      var serializedObject = msRest.deserialize(mapper, valid_uuid, 'uuidBody');
      serializedObject.should.equal(valid_uuid);
      done();
    });
    it('should correctly deserialize a composite type', function (done) {
      var client = new testClient('http://localhost:9090');
      var product = new client.models['Product']();
      mapper = product.mapper();
      var responseBody = {
        id: 101,
        name: 'TestProduct',
        properties: {
          provisioningState: 'Succeeded'
        },
        tags: {
          tag1: 'value1',
          tag2: 'value2'
        },
        dispatchTime: new Date('2015-01-01T12:35:36.009Z'),
        invoiceInfo: {
          invoiceId: 1002,
          invDate: '2015-12-25',
          invProducts: [
            {
              'Product1': {
                id: 101,
                name: 'TestProduct'
              }
            },
            {
              'Product2': {
                id: 104,
                name: 'TestProduct1'
              }
            }
          ]
        },
        subProducts: [
          {
            subId: 102,
            subName: 'SubProduct1',
            makeTime: new Date('2015-12-21T01:01:01'),
            invoiceInfo: {
              invoiceId: 1002,
              invDate: '2015-12-25'
            }
          },
          {
            subId: 103,
            subName: 'SubProduct2',
            makeTime: new Date('2015-12-21T01:01:01'),
            invoiceInfo: {
              invoiceId: 1003,
              invDate: '2015-12-25'
            }
          }
        ]
      };
      var deserializedProduct = client.deserialize(mapper, responseBody, 'responseBody', client);
      for (var prop in deserializedProduct) {
        if (prop === 'provisioningState') {
          deserializedProduct.provisioningState.should.equal(responseBody.properties.provisioningState);
        } else if (prop === 'id') {
          deserializedProduct[prop].should.equal(responseBody.id);
        } else if (prop === 'name') {
          deserializedProduct[prop].should.equal(responseBody.name);
        } else if (prop === 'tags') {
          JSON.stringify(deserializedProduct[prop]).should.equal(JSON.stringify(responseBody.tags));
        } else if (prop === 'dispatchTime') {
          JSON.stringify(deserializedProduct[prop]).should.equal(JSON.stringify(responseBody.dispatchTime));
        } else if (prop === 'invoiceInfo') {
          (JSON.stringify(deserializedProduct[prop]).length - JSON.stringify(responseBody.invoiceInfo).length).should.equal(10);
        } else if (prop === 'subProducts') {
          (JSON.stringify(deserializedProduct[prop]).length - JSON.stringify(responseBody.subProducts).length).should.equal(20);
        }
      }
      done();
    });

    it('should correctly deserialize a pageable type without nextLink', function (done) {
      var client = new testClient('http://localhost:9090');
      var productListResult = new client.models['ProductListResult']();
      mapper = productListResult.mapper();
      var responseBody = {
        value: [
          {
            id: 101,
            name: 'TestProduct',
            properties: {
              provisioningState: 'Succeeded'
            }
          },
          {
            id: 104,
            name: 'TestProduct1',
            properties: {
              provisioningState: 'Failed'
            }
          }
        ]
      };
      var deserializedProduct = client.deserialize(mapper, responseBody, 'responseBody');
      (Array.isArray(deserializedProduct)).should.be.true;
      deserializedProduct.length.should.equal(2);
      for (var i = 0; i < deserializedProduct.length; i++) {
        if (i === 0) {
          deserializedProduct[i].id.should.equal(101);
          deserializedProduct[i].name.should.equal('TestProduct');
          deserializedProduct[i].provisioningState.should.equal('Succeeded');
        } else if (i === 1) {
          deserializedProduct[i].id.should.equal(104);
          deserializedProduct[i].name.should.equal('TestProduct1');
          deserializedProduct[i].provisioningState.should.equal('Failed');
        }
      }
      done();
    });

    it('should correctly deserialize a pageable type with nextLink', function (done) {
      var client = new testClient('http://localhost:9090');
      var productListResultNextLink = new client.models['ProductListResultNextLink']();
      mapper = productListResultNextLink.mapper();
      var responseBody = {
        value: [
          {
            id: 101,
            name: 'TestProduct',
            properties: {
              provisioningState: 'Succeeded'
            }
          },
          {
            id: 104,
            name: 'TestProduct1',
            properties: {
              provisioningState: 'Failed'
            }
          }
        ],
        nextLink: 'https://helloworld.com'
      };
      var deserializedProduct = client.deserialize(mapper, responseBody, 'responseBody');
      (Array.isArray(deserializedProduct)).should.be.true;
      deserializedProduct.length.should.equal(2);
      deserializedProduct.nextLink.should.equal('https://helloworld.com');
      for (var i = 0; i < deserializedProduct.length; i++) {
        if (i === 0) {
          deserializedProduct[i].id.should.equal(101);
          deserializedProduct[i].name.should.equal('TestProduct');
          deserializedProduct[i].provisioningState.should.equal('Succeeded');
        } else if (i === 1) {
          deserializedProduct[i].id.should.equal(104);
          deserializedProduct[i].name.should.equal('TestProduct1');
          deserializedProduct[i].provisioningState.should.equal('Failed');
        }
      }
      done();
    });

    it('should correctly deserialize object version of polymorphic discriminator', function (done) {
      var client = new testClient('http://localhost:9090');
      var fish = new client.models['Fish']();
      mapper = fish.mapper();
      var responseBody = {
        'fish.type': 'sawshark',
        'age': 22,
        'birthday': new Date('2012-01-05T01:00:00Z').toISOString(),
        'species': 'king',
        'length': 1.0,
        'picture': Buffer.from([255, 255, 255, 255, 254]).toString(),
        'siblings': [
          {
            'fish.type': 'shark',
            'age': 6,
            'birthday': new Date('2012-01-05T01:00:00Z'),
            'length': 20.0,
            'species': 'predator'
          },
          {
            'fish.type': 'sawshark',
            'age': 105,
            'birthday': new Date('1900-01-05T01:00:00Z').toISOString(),
            'length': 10.0,
            'picture': Buffer.from([255, 255, 255, 255, 254]).toString(),
            'species': 'dangerous'
          }
        ]
      };
      var deserializedSawshark = client.deserialize(mapper, responseBody, 'responseBody');
      deserializedSawshark.age.should.equal(22);
      deserializedSawshark.fishtype.should.equal('sawshark');
      deserializedSawshark.siblings.length.should.equal(2);
      deserializedSawshark.siblings[0].fishtype.should.equal('shark');
      deserializedSawshark.siblings[0].age.should.equal(6);
      deserializedSawshark.siblings[0].birthday.toISOString().should.equal('2012-01-05T01:00:00.000Z');
      deserializedSawshark.siblings[1].fishtype.should.equal('sawshark');
      deserializedSawshark.siblings[1].age.should.equal(105);
      deserializedSawshark.siblings[1].birthday.toISOString().should.equal('1900-01-05T01:00:00.000Z');
      done();
    });

    it('should correctly deserialize string version of polymorphic discriminator', function (done) {
      var client = new testClient('http://localhost:9090');
      var PetGalleryModel = new client.models['PetGallery']();
      mapper = PetGalleryModel.mapper();
      var petgallery = {
        'id': 1,
        'name': 'Fav pet gallery',
        'pets': [
          {
            'id': 2,
            'name': 'moti',
            'food': 'buiscuit',
            'pet.type': 'Dog',
          },
          {
            'id': 3,
            'name': 'billa',
            'color': 'red',
            'pet.type': 'Cat',
          }
        ]
      };
      var deserializedPetGallery = client.deserialize(mapper, petgallery, 'result');
      deserializedPetGallery.id.should.equal(1);
      deserializedPetGallery.name.should.equal('Fav pet gallery');
      deserializedPetGallery.pets.length.should.equal(2);
      deserializedPetGallery.pets[0]['pettype'].should.equal('Dog');
      deserializedPetGallery.pets[0].id.should.equal(2);
      deserializedPetGallery.pets[0].name.should.equal('moti');
      deserializedPetGallery.pets[0].food.should.equal('buiscuit');
      deserializedPetGallery.pets[1]['pettype'].should.equal('Cat');
      deserializedPetGallery.pets[1].id.should.equal(3);
      deserializedPetGallery.pets[1].name.should.equal('billa');
      deserializedPetGallery.pets[1].color.should.equal('red');
      done();
    });

    it('should correctly deserialize an array of array of object types', function (done) {
      mapper = {
        type: {
          name: 'Sequence',
          element: {
            type: {
              name: 'Sequence',
              element: {
                type: {
                  name: 'Object'
                }
              }
            }
          }
        }
      };
      var array = [[1], ["2"], [1, "2", {}, true, []]];
      var deserializedArray = msRest.deserialize(mapper, array, 'arrayObj');
      assert.deepEqual(array, deserializedArray);
      done();
    });

    it('should correctly deserialize without failing when encountering unrecognized discriminator', function (done) {
      var client = new testClient('http://localhost:9090');
      var fish = new client.models['Fish']();
      mapper = fish.mapper();
      var responseBody = {
        'fish.type': 'sawshark',
        'age': 22,
        'birthday': new Date('2012-01-05T01:00:00Z').toISOString(),
        'species': 'king',
        'length': 1.0,
        'picture': Buffer.from([255, 255, 255, 255, 254]).toString(),
        'siblings': [
          {
            'fish.type': 'mutatedshark',
            'age': 105,
            'birthday': new Date('1900-01-05T01:00:00Z').toISOString(),
            'length': 10.0,
            'picture': Buffer.from([255, 255, 255, 255, 254]).toString(),
            'species': 'dangerous',
            'siblings': [
              {
                'fish.type': 'mutatedshark',
                'age': 6,
                'length': 20.0,
                'species': 'predator'
              }
            ]
          }
        ]
      };
      var deserializedSawshark = client.deserialize(mapper, responseBody, 'responseBody');
      deserializedSawshark.siblings.length.should.equal(1);
      deserializedSawshark.siblings[0].fishtype.should.equal('mutatedshark');
      deserializedSawshark.siblings[0].species.should.equal('dangerous');
      deserializedSawshark.siblings[0].should.not.have.property('birthday');
      deserializedSawshark.siblings[0].should.not.have.property('age');
      deserializedSawshark.siblings[0].siblings[0].fishtype.should.equal('mutatedshark');
      deserializedSawshark.siblings[0].siblings[0].species.should.equal('predator');
      deserializedSawshark.siblings[0].siblings[0].should.not.have.property('age');
      done();
    });

    it('should correctly deserialize additionalProperties when the mapper knows that additional properties are allowed', function (done) {
      var responseBody = {
        id: 5,
        name: 'Funny',
        status: true,
        '@odata.location': 'westus',
        additionalProperties: {
          height: 5.61,
          weight: 599,
          footsize: 11.5
        },
        color: 'red',
        city: 'Seattle',
        food: 'tikka masala',
        birthdate: '2017-12-13T02:29:51Z'
      };
      var client = new testClient('http://localhost:9090');
      var petAP = new client.models['PetAP']();
      mapper = petAP.mapper();
      var result = client.deserialize(mapper, responseBody, 'responseBody');
      result.id.should.equal(5);
      result.status.should.equal(true);
      result.eyeColor.should.equal('brown');
      result.odatalocation.should.equal('westus');
      result.color.should.equal('red');
      result.city.should.equal('Seattle');
      result.food.should.equal('tikka masala');
      result.birthdate.should.equal('2017-12-13T02:29:51Z');
      result.additionalProperties1.height.should.equal(5.61);
      result.additionalProperties1.weight.should.equal(599);
      result.additionalProperties1.footsize.should.equal(11.5);
      result.name.should.equal('Funny');
      done();
    });

    it('should correctly deserialize without failing when encountering no discriminator', function (done) {
      var client = new testClient('http://localhost:9090');
      var fish = new client.models['Fish']();
      mapper = fish.mapper();
      var responseBody = {
        'age': 22,
        'birthday': new Date('2012-01-05T01:00:00Z').toISOString(),
        'species': 'king',
        'length': 1.0,
        'picture': Buffer.from([255, 255, 255, 255, 254]).toString(),
        'siblings': [
          {
            'fish.type': 'mutatedshark',
            'age': 105,
            'birthday': new Date('1900-01-05T01:00:00Z').toISOString(),
            'length': 10.0,
            'picture': Buffer.from([255, 255, 255, 255, 254]).toString(),
            'species': 'dangerous',
            'siblings': [
              {
                'fish.type': 'mutatedshark',
                'age': 6,
                'length': 20.0,
                'species': 'predator'
              }
            ]
          }
        ]
      };
      var deserializedSawshark = client.deserialize(mapper, responseBody, 'responseBody');
      deserializedSawshark.fishtype.should.equal("Fish");
      deserializedSawshark.siblings.length.should.equal(1);
      deserializedSawshark.siblings[0].fishtype.should.equal('mutatedshark');
      deserializedSawshark.siblings[0].species.should.equal('dangerous');
      deserializedSawshark.siblings[0].should.not.have.property('birthday');
      deserializedSawshark.siblings[0].should.not.have.property('age');
      deserializedSawshark.siblings[0].siblings[0].fishtype.should.equal('mutatedshark');
      deserializedSawshark.siblings[0].siblings[0].species.should.equal('predator');
      deserializedSawshark.siblings[0].siblings[0].should.not.have.property('age');
      done();
    });

    it('should correctly serialize without failing when encountering no discriminator', function (done) {
      var client = new testClient('http://localhost:9090');
      var SawsharkModel = new client.models['Sawshark']();
      mapper = SawsharkModel.mapper();
      var sawshark = {
        'age': 22,
        'birthday': new Date('2012-01-05T01:00:00Z'),
        'species': 'king',
        'length': 1.0,
        'picture': Buffer.from([255, 255, 255, 255, 254]),
        'siblings': [
          {
            'fishtype': 'shark',
            'age': 6,
            'birthday': new Date('2012-01-05T01:00:00Z'),
            'length': 20.0,
            'species': 'predator'
          },
          {
            'fishtype': 'sawshark',
            'age': 105,
            'birthday': new Date('1900-01-05T01:00:00Z'),
            'length': 10.0,
            'picture': Buffer.from([255, 255, 255, 255, 254]),
            'species': 'dangerous'
          }
        ]
      };
      var serializedSawshark = client.serialize(mapper, sawshark, 'result');
      serializedSawshark.age.should.equal(22);
      serializedSawshark['fish.type'].should.equal('sawshark');
      serializedSawshark.siblings.length.should.equal(2);
      serializedSawshark.siblings[0]['fish.type'].should.equal('shark');
      serializedSawshark.siblings[0].age.should.equal(6);
      serializedSawshark.siblings[0].birthday.should.equal(new Date('2012-01-05T01:00:00Z').toISOString());
      serializedSawshark.siblings[1]['fish.type'].should.equal('sawshark');
      serializedSawshark.siblings[1].age.should.equal(105);
      serializedSawshark.siblings[1].birthday.should.equal(new Date('1900-01-05T01:00:00Z').toISOString());
      serializedSawshark.siblings[1].picture.should.equal('//////4=');
      serializedSawshark.picture.should.equal('//////4=');
      done();
    });
  });
});

