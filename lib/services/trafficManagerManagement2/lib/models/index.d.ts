/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 * 
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
// TODO: Include PageTemplateModels here too?? Probably
 */


/**
 * @class
 * Initializes a new instance of the Endpoint class.
 * @constructor
 * Class respresenting a Traffic Manager endpoint.
 * @member {string} [id] Gets or sets the ID of the Traffic Manager endpoint.
 * 
 * @member {string} [name] Gets or sets the name of the Traffic Manager
 * endpoint.
 * 
 * @member {string} [type] Gets or sets the endpoint type of the Traffic
 * Manager endpoint.
 * 
 * @member {string} [targetResourceId] Gets or sets the Azure Resource URI of
 * the of the endpoint.  Not applicable to endpoints of type
 * 'ExternalEndpoints'.
 * 
 * @member {string} [target] Gets or sets the fully-qualified DNS name of the
 * endpoint.  Traffic Manager returns this value in DNS responses to direct
 * traffic to this endpoint.
 * 
 * @member {string} [endpointStatus] Gets or sets the status of the endpoint..
 * If the endpoint is Enabled, it is probed for endpoint health and is
 * included in the traffic routing method.  Possible values are 'Enabled' and
 * 'Disabled'.
 * 
 * @member {number} [weight] Gets or sets the weight of this endpoint when
 * using the 'Weighted' traffic routing method. Possible values are from 1 to
 * 1000.
 * 
 * @member {number} [priority] Gets or sets the priority of this endpoint when
 * using the ‘Priority’ traffic routing method. Possible values are from 1 to
 * 1000, lower values represent higher priority. This is an optional
 * parameter.  If specified, it must be specified on all endpoints, and no
 * two endpoints can share the same priority value.
 * 
 * @member {string} [endpointLocation] Specifies the location of the external
 * or nested endpoints when using the ‘Performance’ traffic routing method.
 * 
 * @member {string} [endpointMonitorStatus] Gets or sets the monitoring status
 * of the endpoint.
 * 
 * @member {number} [minChildEndpoints] Gets or sets the minimum number of
 * endpoints that must be available in the child profile in order for the
 * parent profile to be considered available. Only applicable to endpoint of
 * type 'NestedEndpoints'.
 * 
 */
export interface Endpoint {
    id?: string;
    name?: string;
    type?: string;
    targetResourceId?: string;
    target?: string;
    endpointStatus?: string;
    weight?: number;
    priority?: number;
    endpointLocation?: string;
    endpointMonitorStatus?: string;
    minChildEndpoints?: number;
}

/**
 * @class
 * Initializes a new instance of the CheckTrafficManagerRelativeDnsNameAvailabilityParameters class.
 * @constructor
 * Parameters supplied to check Traffic Manager name operation.
 * @member {string} [name] Gets or sets the name of the resource.
 * 
 * @member {string} [type] Gets or sets the type of the resource.
 * 
 */
export interface CheckTrafficManagerRelativeDnsNameAvailabilityParameters {
    name?: string;
    type?: string;
}

/**
 * @class
 * Initializes a new instance of the DnsConfig class.
 * @constructor
 * Class containing DNS settings in a Traffic Manager profile.
 * @member {string} [relativeName] Gets or sets the relative DNS name provided
 * by this Traffic Manager profile.  This value is combined with the DNS
 * domain name used by Azure Traffic Manager to form the fully-qualified
 * domain name (FQDN) of the profile.
 * 
 * @member {string} [fqdn] Gets or sets the fully-qualified domain name (FQDN)
 * of the Traffic Manager profile.  This is formed from the concatenation of
 * the RelativeName with the DNS domain used by Azure Traffic Manager.
 * 
 * @member {number} [ttl] Gets or sets the DNS Ttime-To-Live (TTL), in
 * seconds.  This informs the local DNS resolvers and DNS clients how long to
 * cache DNS responses provided by this Traffic Manager profile.
 * 
 */
export interface DnsConfig {
    relativeName?: string;
    fqdn?: string;
    ttl?: number;
}

/**
 * @class
 * Initializes a new instance of the MonitorConfig class.
 * @constructor
 * Class containing endpoint monitoring settings in a Traffic Manager profile.
 * @member {string} [profileMonitorStatus] Gets or sets the profile-level
 * monitoring status of the Traffic Manager profile.
 * 
 * @member {string} [protocol] Gets or sets the protocol (HTTP or HTTPS) used
 * to probe for endpoint health.
 * 
 * @member {number} [port] Gets or sets the TCP port used to probe for
 * endpoint health.
 * 
 * @member {string} [path] Gets or sets the path relative to the endpoint
 * domain name used to probe for endpoint health.
 * 
 */
export interface MonitorConfig {
    profileMonitorStatus?: string;
    protocol?: string;
    port?: number;
    path?: string;
}

/**
 * @class
 * Initializes a new instance of the Resource class.
 * @constructor
 * @member {string} [id] Resource Id
 * 
 * @member {string} [name] Resource name
 * 
 * @member {string} [type] Resource type
 * 
 * @member {string} [location] Resource location
 * 
 * @member {object} [tags] Resource tags
 * 
 */
export interface Resource extends BaseResource {
    id?: string;
    name?: string;
    type?: string;
    location?: string;
    tags?: { [propertyName: string]: string };
}

/**
 * @class
 * Initializes a new instance of the Profile class.
 * @constructor
 * Class representing a Traffic Manager profile.
 * @member {string} [profileStatus] Gets or sets the status of the Traffic
 * Manager profile.  Possible values are 'Enabled' and 'Disabled'.
 * 
 * @member {string} [trafficRoutingMethod] Gets or sets the traffic routing
 * method of the Traffic Manager profile.  Possible values are 'Performance',
 * 'Weighted', or 'Priority'.
 * 
 * @member {object} [dnsConfig] Gets or sets the DNS settings of the Traffic
 * Manager profile.
 * 
 * @member {string} [dnsConfig.relativeName] Gets or sets the relative DNS
 * name provided by this Traffic Manager profile.  This value is combined
 * with the DNS domain name used by Azure Traffic Manager to form the
 * fully-qualified domain name (FQDN) of the profile.
 * 
 * @member {string} [dnsConfig.fqdn] Gets or sets the fully-qualified domain
 * name (FQDN) of the Traffic Manager profile.  This is formed from the
 * concatenation of the RelativeName with the DNS domain used by Azure
 * Traffic Manager.
 * 
 * @member {number} [dnsConfig.ttl] Gets or sets the DNS Ttime-To-Live (TTL),
 * in seconds.  This informs the local DNS resolvers and DNS clients how long
 * to cache DNS responses provided by this Traffic Manager profile.
 * 
 * @member {object} [monitorConfig] Gets or sets the endpoint monitoring
 * settings of the Traffic Manager profile.
 * 
 * @member {string} [monitorConfig.profileMonitorStatus] Gets or sets the
 * profile-level monitoring status of the Traffic Manager profile.
 * 
 * @member {string} [monitorConfig.protocol] Gets or sets the protocol (HTTP
 * or HTTPS) used to probe for endpoint health.
 * 
 * @member {number} [monitorConfig.port] Gets or sets the TCP port used to
 * probe for endpoint health.
 * 
 * @member {string} [monitorConfig.path] Gets or sets the path relative to the
 * endpoint domain name used to probe for endpoint health.
 * 
 * @member {array} [endpoints] Gets or sets the list of endpoints in the
 * Traffic Manager profile.
 * 
 */
export interface Profile extends Resource {
    profileStatus?: string;
    trafficRoutingMethod?: string;
    dnsConfig?: DnsConfig;
    monitorConfig?: MonitorConfig;
    endpoints?: Endpoint[];
}

/**
 * @class
 * Initializes a new instance of the TrafficManagerNameAvailability class.
 * @constructor
 * Class representing a Traffic Manager Name Availability response.
 * @member {string} [name] The relative name.
 * 
 * @member {string} [type] Traffic Manager profile resource type.
 * 
 * @member {boolean} [nameAvailable] Describes whether the relative name is
 * available or not.
 * 
 * @member {string} [reason] The reason why the name is not available, when
 * applicable.
 * 
 * @member {string} [message] Descriptive message that explains why the name
 * is not available, when applicable.
 * 
 */
export interface TrafficManagerNameAvailability {
    name?: string;
    type?: string;
    nameAvailable?: boolean;
    reason?: string;
    message?: string;
}
