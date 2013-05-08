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

// External dependencies
var crypto = require('crypto');

function GetNameSpace(subscriptionId, prefix, location) {
    location = location.replace(" ", "-");
	var hash = crypto.createHash('sha256').update(new Buffer(subscriptionId, 'utf-8')).digest("hex");
    return prefix + Base32NoPaddingEncode(new Buffer(hash, "hex")) + "-" + location;
}

var base32StandardAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function _Base32NoPaddingEncode (data) {

	var result = "";
    for (var i = 0; i < data.length; i+=5) {

        // Process input 5 bytes at a time
        var multiplier = 256; 
        var loopValue = 0;
        for (var j = Math.min(data.length-1, i+4); j >= i ; j--) {
            loopValue += data[j] * multiplier;
            multiplier = multiplier * 256;
        }

        // Converts them into base32
        var bytes = Math.min(data.length - i, 5);
        for (var bitOffset = (bytes+1)*8 - 5; bitOffset > 3; bitOffset -= 5) {
            result += base32StandardAlphabet[LongUnsignedRor(loopValue,bitOffset) & 0x1f];
        }

	}

	return result;
}

function _LongUnsignedRor(value, count) {    
    for(var i = 0; i<count; i++) { value = value / 2; }
    return value;
}