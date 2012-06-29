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

var   azure = require('azure')
    , path = require('path')
    , util = require('./util.js')
    , fs = require('fs');

var RoleEnvironment = azure.RoleEnvironment;

var LogFileKey = "DiagnosticLog";
var DefaultLogFileName = "DiagnosticLog.txt";

exports = module.exports = Logger;

/**
* Construct a logger that writes to the diagnostics store.
*
* @param {string} logFile:  The name of the log file to write to.
*/
function Logger() {
	this.setUp = false;
}

/**
* Write a message to the log.
*
* @param {string} message: The message to write.
*/
Logger.prototype.write = function(message) {
	this._setupLog(function(error) {
        this.outStream.write(message);
    });
}

/**
* End the log file stream.
*/
Logger.prototype.end = function() {
	this.outStream.end();
}

/**
* Get a readable stream of the log file contents.
*
* @return {ReadableStream}: The log file contents.
*/
Logger.prototype.getReadableStream = function() {
	return fs.createReadStream(this.logFilePath);
}

/**
* Set up log file streaming based on configuration stored in the service definition.
*
* @param {function(error)} callback: The completion callback.
*/
Logger.prototype._setupLog = function(callback) {
	if (!this.setUp) {
	    util.getConfigurationSetting(LogFileKey, function(error, logFileName) {
    	    if (!logFileName || logFileName.length < 1) {
    		     logFileName = DefaultLogFileName;
    	    }
    	    this.logFileName = logFileName;
    	    util.getDiagnosticPath(function( error, logPath) {
    		    this.setUp = true;
		        if (error) {
			        this.logFilePath = "console";
			        console.log("Error getting diagnostic store, using stdout instead: " + error + "\r\n");
			        this.outStream = process.stdout;
			        callback(error);
		        } else {
			        this.logFilePath = path.join(logPath, this.logFileName);
			        this.outStream = fs.createWriteStream(this.logFilePath);
			        callback(null);
		        }
	        });
        });
    }
}
