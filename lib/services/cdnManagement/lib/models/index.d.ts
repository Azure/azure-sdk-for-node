/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 * 
 * Code generated by Microsoft (R) AutoRest Code Generator 0.14.0.0
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
// TODO: Include PageTemplateModels here too?? Probably
 */


/**
 * @class
 * Initializes a new instance of the Resource class.
 * @constructor
 * @member {string} [id] Resource Id
 * 
 * @member {string} [name] Resource Name
 * 
 * @member {string} [type] Resource type
 * 
 */
export interface Resource extends BaseResource {
    id?: string;
    name?: string;
    type?: string;
}

/**
 * @class
 * Initializes a new instance of the TrackedResource class.
 * @constructor
 * ARM tracked resource
 * @member {string} location Resource location
 * 
 * @member {object} tags Resource tags
 * 
 */
export interface TrackedResource extends Resource {
    location: string;
    tags: { [propertyName: string]: string };
}

/**
 * @class
 * Initializes a new instance of the Profile class.
 * @constructor
 * CDN profile represents the top level resource and the entry point into the
 * CDN API. This allows users to set up a logical grouping of endpoints in
 * addition to creating shared configuration settings and selecting pricing
 * tiers and providers.
 * @member {object} [sku] Profile sku
 * 
 * @member {string} [sku.name] Name of the resource sku. Possible values for
 * this property include: 'Standard', 'Premium'.
 * 
 * @member {string} [resourceState] Resource status of the profile. Possible
 * values for this property include: 'Creating', 'Active', 'Deleting',
 * 'Disabled'.
 * 
 * @member {string} [provisioningState] Provisioning status of the profile.
 * Possible values for this property include: 'Creating', 'Succeeded',
 * 'Failed'.
 * 
 */
export interface Profile extends TrackedResource {
    sku?: Sku;
    resourceState?: string;
    provisioningState?: string;
}

/**
 * @class
 * Initializes a new instance of the Sku class.
 * @constructor
 * Defines a pricing tier for a profile
 * @member {string} [name] Name of the resource sku. Possible values for this
 * property include: 'Standard', 'Premium'.
 * 
 */
export interface Sku {
    name?: string;
}

/**
 * @class
 * Initializes a new instance of the ProfileCreateParameters class.
 * @constructor
 * Profile properties required for profile creation
 * @member {string} location Profile location
 * 
 * @member {object} [tags] Profile tags
 * 
 * @member {object} sku Profile sku
 * 
 * @member {string} [sku.name] Name of the resource sku. Possible values for
 * this property include: 'Standard', 'Premium'.
 * 
 */
export interface ProfileCreateParameters extends BaseResource {
    location: string;
    tags?: { [propertyName: string]: string };
    sku: Sku;
}

/**
 * @class
 * Initializes a new instance of the ProfileUpdateParameters class.
 * @constructor
 * Profile properties required for profile update
 * @member {object} tags Profile tags
 * 
 */
export interface ProfileUpdateParameters extends BaseResource {
    tags: { [propertyName: string]: string };
}

/**
 * @class
 * Initializes a new instance of the SsoUri class.
 * @constructor
 * Sso uri required to login to third party web portal
 * @member {string} [ssoUriValue] The uri used to login to third party web
 * portal
 * 
 */
export interface SsoUri {
    ssoUriValue?: string;
}

/**
 * @class
 * Initializes a new instance of the Endpoint class.
 * @constructor
 * CDN Endpoint is the entity within a CDN Profile containing configuration
 * information regarding caching behaviors and origins. The CDN Endpoint is
 * exposed using the URL format <endpointname>.azureedge.net by default, but
 * custom domains can also be created.
 * @member {string} [hostName] The host name of the endpoint
 * {endpointName}.{DNSZone}
 * 
 * @member {string} [originHostHeader] The host header CDN provider will send
 * along with content requests to origins. The default value would be the
 * host name of the origin.
 * 
 * @member {string} [originPath] The path used for origin requests
 * 
 * @member {array} [contentTypesToCompress] List of content types on which
 * compression will be applied. The value for the elements should be Internet
 * media type.
 * 
 * @member {boolean} [isCompressionEnabled] Indicates whether the compression
 * is enabled. Default value is false. If compression is enabled, the content
 * transferred from cdn endpoint to end user will be compressed. The
 * requested content must be larger than 1 byte and smaller than 1 MB.
 * 
 * @member {boolean} [isHttpAllowed] Indicates whether http traffic is allowed
 * on the endpoint. Default value is true. At least one protocol (http or
 * https) must be allowed.
 * 
 * @member {boolean} [isHttpsAllowed] Indicates whether https traffic is
 * allowed on the endpoint. Default value is true. At least one protocol
 * (http or https) must be allowed.
 * 
 * @member {string} [queryStringCachingBehavior] Defines the query string
 * caching behavior. Possible values for this property include:
 * 'IgnoreQueryString', 'BypassCaching', 'UseQueryString', 'NotSet'.
 * 
 * @member {array} [origins] The set of origins of the CDN endpoint. When
 * multiple origins exist, the first origin will be used as primary and rest
 * will be used as failover options.
 * 
 * @member {string} [resourceState] Resource status of the endpoint. Possible
 * values for this property include: 'Creating', 'Deleting', 'Running',
 * 'Starting', 'Stopped', 'Stopping'.
 * 
 * @member {string} [provisioningState] Provisioning status of the endpoint.
 * Possible values for this property include: 'Creating', 'Succeeded',
 * 'Failed'.
 * 
 */
export interface Endpoint extends TrackedResource {
    hostName?: string;
    originHostHeader?: string;
    originPath?: string;
    contentTypesToCompress?: string[];
    isCompressionEnabled?: boolean;
    isHttpAllowed?: boolean;
    isHttpsAllowed?: boolean;
    queryStringCachingBehavior?: string;
    origins?: DeepCreatedOrigin[];
    resourceState?: string;
    provisioningState?: string;
}

/**
 * @class
 * Initializes a new instance of the DeepCreatedOrigin class.
 * @constructor
 * Deep created origins within a CDN endpoint
 * @member {string} name Origin name
 * 
 * @member {string} hostName The host name of the origin
 * 
 * @member {number} [httpPort] The value of the http port, must be between 1
 * and 65535
 * 
 * @member {number} [httpsPort] The value of the https port, must be between 1
 * and 65535
 * 
 */
export interface DeepCreatedOrigin extends BaseResource {
    name: string;
    hostName: string;
    httpPort?: number;
    httpsPort?: number;
}

/**
 * @class
 * Initializes a new instance of the EndpointCreateParameters class.
 * @constructor
 * Endpoint properties required for new endpoint creation
 * @member {string} location Endpoint location
 * 
 * @member {object} [tags] Endpoint tags
 * 
 * @member {string} [originHostHeader] The host header CDN provider will send
 * along with content requests to origins. The default value would be the
 * host name of the origin.
 * 
 * @member {string} [originPath] The path used for origin requests
 * 
 * @member {array} [contentTypesToCompress] List of content types on which
 * compression will be applied. The value for the elements should be Internet
 * media type.
 * 
 * @member {boolean} [isCompressionEnabled] Indicates whether the compression
 * is enabled. Default value is false. If compression is enabled, the content
 * transferred from cdn endpoint to end user will be compressed. The
 * requested content must be larger than 1 byte and smaller than 1 MB.
 * 
 * @member {boolean} [isHttpAllowed] Indicates whether http traffic is allowed
 * on the endpoint. Default value is true. At least one protocol (http or
 * https) must be allowed.
 * 
 * @member {boolean} [isHttpsAllowed] Indicates whether https traffic is
 * allowed on the endpoint. Default value is true. At least one protocol
 * (http or https) must be allowed.
 * 
 * @member {string} [queryStringCachingBehavior] Defines the query string
 * caching behavior. Possible values for this property include:
 * 'IgnoreQueryString', 'BypassCaching', 'UseQueryString', 'NotSet'.
 * 
 * @member {array} origins  The set of origins of the CDN endpoint. When
 * multiple origins exist, the first origin will be used as primary and rest
 * will be used as failover options.
 * 
 */
export interface EndpointCreateParameters extends BaseResource {
    location: string;
    tags?: { [propertyName: string]: string };
    originHostHeader?: string;
    originPath?: string;
    contentTypesToCompress?: string[];
    isCompressionEnabled?: boolean;
    isHttpAllowed?: boolean;
    isHttpsAllowed?: boolean;
    queryStringCachingBehavior?: string;
    origins: DeepCreatedOrigin[];
}

/**
 * @class
 * Initializes a new instance of the EndpointUpdateParameters class.
 * @constructor
 * Endpoint properties required for new endpoint creation
 * @member {object} [tags] Endpoint tags
 * 
 * @member {string} [originHostHeader] The host header CDN provider will send
 * along with content requests to origins. The default value would be the
 * host name of the origin.
 * 
 * @member {string} [originPath] The path used for origin requests
 * 
 * @member {array} [contentTypesToCompress] List of content types on which
 * compression will be applied. The value for the elements should be Internet
 * media type.
 * 
 * @member {boolean} [isCompressionEnabled] Indicates whether the compression
 * is enabled. Default value is false. If compression is enabled, the content
 * transferred from cdn endpoint to end user will be compressed. The
 * requested content must be larger than 1 byte and smaller than 1 MB.
 * 
 * @member {boolean} [isHttpAllowed] Indicates whether http traffic is allowed
 * on the endpoint. Default value is true. At least one protocol (http or
 * https) must be allowed.
 * 
 * @member {boolean} [isHttpsAllowed] Indicates whether https traffic is
 * allowed on the endpoint. Default value is true. At least one protocol
 * (http or https) must be allowed.
 * 
 * @member {string} [queryStringCachingBehavior] Defines the query string
 * caching behavior. Possible values for this property include:
 * 'IgnoreQueryString', 'BypassCaching', 'UseQueryString', 'NotSet'.
 * 
 */
export interface EndpointUpdateParameters extends BaseResource {
    tags?: { [propertyName: string]: string };
    originHostHeader?: string;
    originPath?: string;
    contentTypesToCompress?: string[];
    isCompressionEnabled?: boolean;
    isHttpAllowed?: boolean;
    isHttpsAllowed?: boolean;
    queryStringCachingBehavior?: string;
}

/**
 * @class
 * Initializes a new instance of the PurgeParameters class.
 * @constructor
 * Parameters required for endpoint purge
 * @member {array} contentPaths The path to the content to be purged, can
 * describe a file path or a wild card directory.
 * 
 */
export interface PurgeParameters {
    contentPaths: string[];
}

/**
 * @class
 * Initializes a new instance of the LoadParameters class.
 * @constructor
 * Parameters required for endpoint load
 * @member {array} contentPaths The path to the content to be loaded, should
 * describe a file path.
 * 
 */
export interface LoadParameters {
    contentPaths: string[];
}

/**
 * @class
 * Initializes a new instance of the Origin class.
 * @constructor
 * CDN Origin is the source of the content being delivered via CDN. When the
 * edge nodes represented by an Endpoint do not have the requested content
 * cached, they attempt to fetch it from one or more of the configured
 * Origins.
 * @member {string} hostName The host name of the origin
 * 
 * @member {number} [httpPort] The value of the http port, must be between 1
 * and 65535
 * 
 * @member {number} [httpsPort] The value of the https port, must be between 1
 * and 65535
 * 
 * @member {string} [resourceState] Resource status of the origin. Possible
 * values for this property include: 'Creating', 'Active', 'Deleting'.
 * 
 * @member {string} [provisioningState] Provisioning status of the origin.
 * Possible values for this property include: 'Creating', 'Succeeded',
 * 'Failed'.
 * 
 */
export interface Origin extends Resource {
    hostName: string;
    httpPort?: number;
    httpsPort?: number;
    resourceState?: string;
    provisioningState?: string;
}

/**
 * @class
 * Initializes a new instance of the OriginParameters class.
 * @constructor
 * Origin properties needed for origin creation or update
 * @member {string} hostName The host name of the origin
 * 
 * @member {number} [httpPort] The value of the http port, must be between 1
 * and 65535
 * 
 * @member {number} [httpsPort] The value of the https port, must be between 1
 * and 65535
 * 
 */
export interface OriginParameters extends BaseResource {
    hostName: string;
    httpPort?: number;
    httpsPort?: number;
}

/**
 * @class
 * Initializes a new instance of the CustomDomain class.
 * @constructor
 * CDN CustomDomain represents a mapping between a user specified domain name
 * and an Endpoint. It is a common practice to use custom domain names to
 * represent the URLs for branding purposes.
 * @member {string} hostName The host name of the custom domain
 * 
 * @member {string} [resourceState] Resource status of the custom domain.
 * Possible values for this property include: 'Creating', 'Active',
 * 'Deleting'.
 * 
 * @member {string} [provisioningState] Provisioning status of the custom
 * domain. Possible values for this property include: 'Creating',
 * 'Succeeded', 'Failed'.
 * 
 */
export interface CustomDomain extends Resource {
    hostName: string;
    resourceState?: string;
    provisioningState?: string;
}

/**
 * @class
 * Initializes a new instance of the CustomDomainParameters class.
 * @constructor
 * CustomDomain properties required for custom domain creation or update
 * @member {string} hostName The host name of the custom domain
 * 
 */
export interface CustomDomainParameters extends BaseResource {
    hostName: string;
}

/**
 * @class
 * Initializes a new instance of the ValidateCustomDomainInput class.
 * @constructor
 * Input of the custom domain to be validated
 * @member {string} hostName The host name of the custom domain
 * 
 */
export interface ValidateCustomDomainInput {
    hostName: string;
}

/**
 * @class
 * Initializes a new instance of the ValidateCustomDomainOutput class.
 * @constructor
 * Output of custom domain validation
 * @member {boolean} [customDomainValidated] Indicates whether the custom
 * domain is validated or not
 * 
 * @member {string} [reason] The reason why the custom domain is not valid
 * 
 * @member {string} [message] The message on why the custom domain is not valid
 * 
 */
export interface ValidateCustomDomainOutput {
    customDomainValidated?: boolean;
    reason?: string;
    message?: string;
}

/**
 * @class
 * Initializes a new instance of the CheckNameAvailabilityInput class.
 * @constructor
 * Input of check name availability API
 * @member {string} name The resource name to validate
 * 
 * @member {string} type The type of the resource whose name is to be
 * validated. Possible values for this property include:
 * 'Microsoft.Cdn/Profiles/Endpoints'.
 * 
 */
export interface CheckNameAvailabilityInput {
    name: string;
    type: string;
}

/**
 * @class
 * Initializes a new instance of the CheckNameAvailabilityOutput class.
 * @constructor
 * Output of check name availability API
 * @member {boolean} [nameAvailable] Indicates whether the name is available
 * 
 * @member {string} [reason] The reason why the name is not available
 * 
 * @member {string} [message] The detailed error message on why the name is
 * not available
 * 
 */
export interface CheckNameAvailabilityOutput {
    nameAvailable?: boolean;
    reason?: string;
    message?: string;
}

/**
 * @class
 * Initializes a new instance of the Operation class.
 * @constructor
 * CDN REST API operation
 * @member {string} [name] Operation name: {provider}/{resource}/{operation}
 * 
 * @member {object} [display]
 * 
 * @member {string} [display.provider] Service provider: Microsoft.Cdn
 * 
 * @member {string} [display.resource] Resource on which the operation is
 * performed: profile, endpoint,.. etc
 * 
 * @member {string} [display.operation] Operation type: read, write, delete,..
 * etc
 * 
 */
export interface Operation {
    name?: string;
    display?: OperationDisplay;
}

/**
 * @class
 * Initializes a new instance of the OperationDisplay class.
 * @constructor
 * @member {string} [provider] Service provider: Microsoft.Cdn
 * 
 * @member {string} [resource] Resource on which the operation is performed:
 * profile, endpoint,.. etc
 * 
 * @member {string} [operation] Operation type: read, write, delete,.. etc
 * 
 */
export interface OperationDisplay {
    provider?: string;
    resource?: string;
    operation?: string;
}

/**
 * @class
 * Initializes a new instance of the ErrorResponse class.
 * @constructor
 * @member {string} [code] Error code
 * 
 * @member {string} [message] Error message indicating why the operation failed
 * 
 */
export interface ErrorResponse {
    code?: string;
    message?: string;
}
