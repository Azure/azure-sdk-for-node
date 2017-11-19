### 2.2.7 (11/17/2017)
- Added support to set formData parameters in the request object while preparing the request.

### 2.2.6 (11/17/2017)
- Updated typings to expose response-type as `http.IncomingMessage` #2329
- Updated serializer to resolve to immediate parent when encountering unrecognized child for polymorphic discriminator. #2332

### 2.2.5 (11/06/2017)
- Add support for `ApiKeyCredentials`.

### 2.2.4 (10/25/2017)
- Skip the check for `object` type during serialization. If the type is required then we fail early saying that the type was required.

### 2.2.3 (10/11/2017)
- Restricting dependency on "moment" from "^2.18.1" to "~2.18.1" due to bugs in 2.19.0.

### 2.2.2
- Add a utility function to provide user's home directory.

### 2.2.1 (6/29/2017)
- Updated "@types/request": "^0.0.45" to resolve the error generated from request.js type definitions with 2.4.1 version of tsc.

### 2.2.0 (4/29/2017)
- Minor bug fix in `WebResource.prepare()` while processing query parameters.
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
