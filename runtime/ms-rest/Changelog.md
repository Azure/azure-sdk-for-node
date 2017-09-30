### 2.2.2
- Add a utility function to provide user's home directory.

### 2.2.1 (6/29/2017)
- Updated "@types/request": "^0.0.45" to resolve the error generated from request.js type definitions with 2.4.1 version of tsc. 

### 2.2.0 (4/29/2017)
- Minor bug fix in `WebResource.prepare()` while processing query parameters
- Removed native references to `Buffer.isBuffer()` and stream and replaced it with packages that are browser compatible.
### 2.1.0 (4/14/2017)
- Ensured `'use strict';` is applied correctly in all the files #2131
- Modified the handling of `Content-Type` request header in `Webresource.prepare()` #2126
- Refactored the user-agent filter to include 'Azure-SDK-For-Node' in the user-agent header #2125

### 2.0.0 (3/28/2017)
- Minimum required node.js version is 6.10
- Added Promise support and made callback as an optional last parameter to the signature of the exposed methods in the runtime.
- Moved to ES6 syntax.
- Updated type definition (.d.ts) files that are compatible with 2.2.1 version of TypeScript.
