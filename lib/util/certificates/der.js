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


var util = require('util');
var EventEmitter = require( 'events' ).EventEmitter;

var Der = {
    Decoder: Decoder, 
    Formatter: Formatter,

    INTEGER: 'UNIVERSAL-primative-2',
    BIT_STRING: 'UNIVERSAL-primative-3',
    OCTET_STRING: 'UNIVERSAL-primative-4',
    OBJECT_IDENTIFIER: 'UNIVERSAL-primative-6',
    SEQUENCE: 'UNIVERSAL-constructed-10',
    BMPString: 'UNIVERSAL-primative-1e',
    CONTEXT_CONSTRUCTED_0: 'context-constructed-0',
    CONTEXT_PRIMATIVE_0: 'context-primative-0',
    
    dumpBuffer: dumpBuffer
};

function Decoder(options) {
    EventEmitter.call(this);
    options = options || {};
    this.formatter = options.formatter || Der.defaultFormatter;
}

util.inherits(Decoder, EventEmitter);

Decoder.prototype.parse = function(buffer) {
    var cumulative = [];
    var cursor = new Cursor(buffer);
    while (cursor) {
        var next = cursor.next();
        
        this.formatter.format(next.element);        
        this.emit('element', next.element);
        cumulative.push(next.element);
        
        cursor = next.cursor;
    }
    this.emit('end', cumulative);
    return cumulative;
};

Decoder.prototype.verify = function(message, actual, expected) {
    var passed = true;
    if (arguments.length == 2) {
        passed = actual;
    } else {
        passed = actual == expected;
    }
    if (!passed) {
        throw new Error(message);
    }
};

function Cursor(buffer) {
    this.buffer = buffer;
}

Cursor.prototype.next = function() {
    var element = {};

    var buffer = this.buffer;
    var offset = 0;
    var type = buffer[offset++];


    element.tagClass = (type >> 6) & 0x03;
    element.tagConstructed = (type >> 5) & 0x01;
    var tagNumber = (type >> 0) & 0x1f;
    if (tagNumber == 0x15) {
        tagNumber = 0;
        var tagNumberLast = buffer[offset++];
        while(tagNumberLast & 0x80) {
            tagNumber = (tagNumber << 7) + (tagNumberLast & 0x1f);
            tagNumberLast = buffer[offset++];
        }
        tagNumber = (tagNumber << 7) + tagNumberLast;
    }
    element.tagNumber = tagNumber;
    
    element.tag = 
        ['UNIVERSAL', 'APPLICATION', 'context', 'PRIVATE'][element.tagClass] +
        ['-primative-','-constructed-'][element.tagConstructed] + 
        element.tagNumber.toString(16);

    var length = buffer[offset++];
    if ((length & 0x80) == 0x80 ) {
        var lengthBytes = length & 0x7f;
        length = 0;
        while(lengthBytes--) {
            length = length * 0x100 + buffer[offset++];   
        }
    }
    element.length = length;
    
    if (length < 0) {
        throw new Error('oob');
    }
    
    element.buffer = buffer.slice(offset, offset + length);
    var slice1 = buffer.slice(offset + length);

    var result = {element: element};
    if (slice1.length) {
        result.cursor = new Cursor(slice1);
    }
    return result;
};

function Formatter() {
    EventEmitter.call(this);
}

util.inherits(Formatter, EventEmitter);


Formatter.prototype.format = function(element) {
    this.emit(element.tag, element);
};

Der.defaultFormatter = new Formatter();

Der.defaultFormatter.on(Der.INTEGER, function(element) {
    element.value = 0;
    for(var offset = 0; offset != element.buffer.length; ++offset) {
        element.value = (element.value << 8) + element.buffer[offset];
    }
});

Der.defaultFormatter.on(Der.OBJECT_IDENTIFIER, function(element) {
    var values = [0];
    var scan = element.buffer.length;
    var offset = 0;
    var cumulative = 0;
    while (scan--) {
        var octet = element.buffer[offset++];
        if (octet & 0x80) {
            cumulative = (cumulative << 7) + (octet & 0x7f);
        } else {
            values.push((cumulative << 7) + octet);
            cumulative = 0;
        }        
    }
    
    values[0] = (values[1] / 40) >> 0;
    values[1] = values[1] - values[0] * 40;
    element.values = values;
    element.value = values.join('.');
});

Der.defaultFormatter.on(Der.BIT_STRING, function(element) {
    element.value = element.buffer;
});

Der.defaultFormatter.on(Der.OCTET_STRING, function(element) {
    element.value = element.buffer;
});

Der.defaultFormatter.on(Der.BMPString, function(element) {
    var swap = new Buffer(element.buffer.length);
    for(var index = 0; index+1 < element.buffer.length; index += 2) {
        swap[index] = element.buffer[index + 1];
        swap[index+1] = element.buffer[index];
    }
    element.value = swap.toString('ucs2');
});


function dumpBuffer(buffer, oid) {
    oid = oid || {};
    var dec = new Decoder();
    var leading = '. ';
    dec.on('element', function(element) {
        var value = util.inspect((element.value === null) ? '' : element.value );
        if (value.length > 50){
            value = value.substr(0, 50);
        }
        if (element.tag == Der.OBJECT_IDENTIFIER) {
            value = value + ' ' + oid[element.value];
        }
        
        console.log('%s%s[%d] %s', leading, element.tag, element.length, value);
        var old = leading;
        leading = leading + '. ';
        if (element.tagConstructed ||
            element.tag == Der.OCTET_STRING ||
            element.tag == Der.BIT_STRING ||
            element.tag == Der.CONTEXT_0) {
            try {
                element.children = dec.parse(element.buffer);
            }
            catch(err) {
                console.log(leading + '!!' + err.toString());
            }
        }

        leading = old;
    });
    dec.parse(buffer);
}

exports = module.exports = Der;
