# Changelog

## 2.5.4

- Added support for parameter names which contain dash(-) in path template in webResource.

## 2.5.3

- Do not serialize default values for model properties.
- During deserialization, set the value of an entity to it's default value if specified in the mapper.

## 2.5.2

- Initialize body to undefined instead of null because body is nullable in webResource.

## 2.5.1

- Fix bug in string properties with a RegExp pattern constraint.

## 2.5.0

- Remove post install deprecation message and move it to SDKs itself

## 2.4.0

- Add post install deprecation message

## 2.3.8 (11/20/2018)

- Deserialization now allows for case-insensitive property name lookup.

## 2.3.7 (9/26/2018)

- update min. version of request to 2.88.0. This will keep ms-rest and ms-rest-azure in sync with request dependency.

## 2.3.6 (6/25/2018)

- Removed usage of destructuring syntax for compatibility with old node.js versions.

## 2.3.5 (6/21/2018)

- Add support for x-nullable Swagger extension

## 2.3.3 (4/5/2018)

- Bump the version number to solve a problem where several NPM packages were published referencing 2.3.3 instead of 2.3.2.

## 2.3.2 (3/9/2018)

- Added support to ensure that the provided Duration is a Duration like object.

## 2.3.1 (2/22/2018)

- Added support for [de]serializing an "any" type (case when type is not present for an entity in the open api spec.). Resolves https://github.com/Azure/autorest/issues/2855
- Bumped minimum version of `moment`(dependency) to `2.20.1`
- Moved `RpRegistrationFilter` from `ms-rest-azure` to `ms-rest`. This fixes #2367.

## 2.3.0 (12/18/2017)

- Added support for processing formData parameters by setting the `"form"` property on the request object when the `'Content-Type'` header is `'application/x-www-form-urlencoded'`. This needs to be done since we depend on the [request library](https://github.com/request/request#applicationx-www-form-urlencoded-url-encoded-forms).

## 2.2.9 (12/15/2017)

- Runtime now populates polymorphic discriminator value if it is missing in both serialization and deserialization.

## 2.2.8 (12/14/2017)

- Constant values should be deserialized.
- Added support to [de]serialize `additionalProperties`, if specified in the mapper.
- Describes more properties in the TS type definition of `WebResource`.

## 2.2.7 (11/17/2017)

- Added support to set formData parameters in the request object while preparing the request.

## 2.2.6 (11/17/2017)

- Updated typings to expose response-type as `http.IncomingMessage` #2329
- Updated serializer to resolve to immediate parent when encountering unrecognized child for polymorphic discriminator. #2332

## 2.2.5 (11/06/2017)

- Add support for `ApiKeyCredentials`.

## 2.2.4 (10/25/2017)

- Skip the check for `object` type during serialization. If the type is required then we fail early saying that the type was required.

## 2.2.3 (10/11/2017)

- Restricting dependency on "moment" from "^2.18.1" to "~2.18.1" due to bugs in 2.19.0.

## 2.2.2

- Add a utility function to provide user's home directory.

## 2.2.1 (6/29/2017)

- Updated "@types/request": "^0.0.45" to resolve the error generated from request.js type definitions with 2.4.1 version of tsc.

## 2.2.0 (4/29/2017)

- Minor bug fix in `WebResource.prepare()` while processing query parameters.
- Removed native references to `Buffer.isBuffer()` and stream and replaced it with packages that are browser compatible.

## 2.1.0 (4/14/2017)

- Ensured `'use strict';` is applied correctly in all the files #2131
- Modified the handling of `Content-Type` request header in `Webresource.prepare()` #2126
- Refactored the user-agent filter to include 'Azure-SDK-For-Node' in the user-agent header #2125

## 2.0.0 (3/28/2017)

- Minimum required node.js version is 6.10
- Added Promise support and made callback as an optional last parameter to the signature of the exposed methods in the runtime.
- Moved to ES6 syntax.
- Updated type definition (.d.ts) files that are compatible with 2.2.1 version of TypeScript.
