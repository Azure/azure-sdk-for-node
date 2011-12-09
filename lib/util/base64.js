/**
* Copyright 2011 Microsoft Corporation
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

// This function converts a base64 encoded key value to a value expected by the HMAC function of node.js.
var base64s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

exports.decode64 = function (encStr) {

  if (!encStr) {
    return encStr;
  }

  var bits, decOut = '', i = 0;

  for (; i < encStr.length; i += 4) {
    bits =
      (base64s.indexOf(encStr.charAt(i)) & 0xff) << 18 |
      (base64s.indexOf(encStr.charAt(i + 1)) & 0xff) << 12 |
      (base64s.indexOf(encStr.charAt(i + 2)) & 0xff) << 6 |
      base64s.indexOf(encStr.charAt(i + 3)) & 0xff;
    decOut += String.fromCharCode((bits & 0xff0000) >> 16, (bits & 0xff00) >> 8, bits & 0xff);
  }

  var undecOut;
  if (encStr.charCodeAt(i - 2) == 61) {
    undecOut = decOut.substring(0, decOut.length - 2);
  } else if (encStr.charCodeAt(i - 1) == 61) {
    undecOut = decOut.substring(0, decOut.length - 1);
  } else {
    undecOut = decOut;
  }

  return unescape(undecOut);
};

// This function converts a value to a base64 encoded string.
exports.encode64 = function (input) {
  var output = '';
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;

  while (i < input.length) {

    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 0x03) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 0x0f) << 2) | (chr3 >> 6);
    enc4 = chr3 & 0x3f;

    if (isNaN(chr2)) {
      output = output +
      base64s.charAt(enc1) +
      base64s.charAt(enc2) +
      '==';
    } else if (isNaN(chr3)) {
      output = output +
      base64s.charAt(enc1) +
      base64s.charAt(enc2) +
      base64s.charAt(enc3) +
      '=';
    } else {
      output = output +
      base64s.charAt(enc1) +
      base64s.charAt(enc2) +
      base64s.charAt(enc3) +
      base64s.charAt(enc4);
    }
  }

  return output;
};