/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
*/

import { ServiceClientOptions, RequestOptions, ServiceCallback, HttpOperationResponse } from 'ms-rest';
import * as models from '../models';


/**
 * @class
 * MarketplaceAgreements
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the MarketplaceOrderingAgreements.
 */
export interface MarketplaceAgreements {


    /**
     * Get marketplace terms.
     *
     * @param {string} publisherId Publisher identifier string of image being
     * deployed.
     *
     * @param {string} offerId Offer identifier string of image being deployed.
     *
     * @param {string} planId Plan identifier string of image being deployed.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<AgreementTerms>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    getWithHttpOperationResponse(publisherId: string, offerId: string, planId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.AgreementTerms>>;

    /**
     * Get marketplace terms.
     *
     * @param {string} publisherId Publisher identifier string of image being
     * deployed.
     *
     * @param {string} offerId Offer identifier string of image being deployed.
     *
     * @param {string} planId Plan identifier string of image being deployed.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [optionalCallback] - The optional callback.
     *
     * @returns {ServiceCallback|Promise} If a callback was passed as the last
     * parameter then it returns the callback else returns a Promise.
     *
     * {Promise} A promise is returned.
     *
     *                      @resolve {AgreementTerms} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {AgreementTerms} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link AgreementTerms} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    get(publisherId: string, offerId: string, planId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.AgreementTerms>;
    get(publisherId: string, offerId: string, planId: string, callback: ServiceCallback<models.AgreementTerms>): void;
    get(publisherId: string, offerId: string, planId: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.AgreementTerms>): void;


    /**
     * Save marketplace terms.
     *
     * @param {string} publisherId Publisher identifier string of image being
     * deployed.
     *
     * @param {string} offerId Offer identifier string of image being deployed.
     *
     * @param {string} planId Plan identifier string of image being deployed.
     *
     * @param {object} parameters Parameters supplied to the Create Marketplace
     * Terms operation.
     *
     * @param {string} [parameters.publisher] Publisher identifier string of image
     * being deployed.
     *
     * @param {string} [parameters.product] Offer identifier string of image being
     * deployed.
     *
     * @param {string} [parameters.plan] Plan identifier string of image being
     * deployed.
     *
     * @param {string} [parameters.licenseTextLink] Link to HTML with Microsoft and
     * Publisher terms.
     *
     * @param {string} [parameters.privacyPolicyLink] Link to the privacy policy of
     * the publisher.
     *
     * @param {string} [parameters.retrieveDatetime] Date and time in UTC of when
     * the terms were accepted. This is empty if Accepted is false.
     *
     * @param {string} [parameters.signature] Terms signature.
     *
     * @param {boolean} [parameters.accepted] If any version of the terms have been
     * accepted, otherwise false.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<AgreementTerms>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    createWithHttpOperationResponse(publisherId: string, offerId: string, planId: string, parameters: models.AgreementTerms, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.AgreementTerms>>;

    /**
     * Save marketplace terms.
     *
     * @param {string} publisherId Publisher identifier string of image being
     * deployed.
     *
     * @param {string} offerId Offer identifier string of image being deployed.
     *
     * @param {string} planId Plan identifier string of image being deployed.
     *
     * @param {object} parameters Parameters supplied to the Create Marketplace
     * Terms operation.
     *
     * @param {string} [parameters.publisher] Publisher identifier string of image
     * being deployed.
     *
     * @param {string} [parameters.product] Offer identifier string of image being
     * deployed.
     *
     * @param {string} [parameters.plan] Plan identifier string of image being
     * deployed.
     *
     * @param {string} [parameters.licenseTextLink] Link to HTML with Microsoft and
     * Publisher terms.
     *
     * @param {string} [parameters.privacyPolicyLink] Link to the privacy policy of
     * the publisher.
     *
     * @param {string} [parameters.retrieveDatetime] Date and time in UTC of when
     * the terms were accepted. This is empty if Accepted is false.
     *
     * @param {string} [parameters.signature] Terms signature.
     *
     * @param {boolean} [parameters.accepted] If any version of the terms have been
     * accepted, otherwise false.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [optionalCallback] - The optional callback.
     *
     * @returns {ServiceCallback|Promise} If a callback was passed as the last
     * parameter then it returns the callback else returns a Promise.
     *
     * {Promise} A promise is returned.
     *
     *                      @resolve {AgreementTerms} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {AgreementTerms} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link AgreementTerms} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    create(publisherId: string, offerId: string, planId: string, parameters: models.AgreementTerms, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.AgreementTerms>;
    create(publisherId: string, offerId: string, planId: string, parameters: models.AgreementTerms, callback: ServiceCallback<models.AgreementTerms>): void;
    create(publisherId: string, offerId: string, planId: string, parameters: models.AgreementTerms, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.AgreementTerms>): void;


    /**
     * Sign marketplace terms.
     *
     * @param {string} publisherId Publisher identifier string of image being
     * deployed.
     *
     * @param {string} offerId Offer identifier string of image being deployed.
     *
     * @param {string} planId Plan identifier string of image being deployed.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<AgreementTerms>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    signWithHttpOperationResponse(publisherId: string, offerId: string, planId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.AgreementTerms>>;

    /**
     * Sign marketplace terms.
     *
     * @param {string} publisherId Publisher identifier string of image being
     * deployed.
     *
     * @param {string} offerId Offer identifier string of image being deployed.
     *
     * @param {string} planId Plan identifier string of image being deployed.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [optionalCallback] - The optional callback.
     *
     * @returns {ServiceCallback|Promise} If a callback was passed as the last
     * parameter then it returns the callback else returns a Promise.
     *
     * {Promise} A promise is returned.
     *
     *                      @resolve {AgreementTerms} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {AgreementTerms} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link AgreementTerms} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    sign(publisherId: string, offerId: string, planId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.AgreementTerms>;
    sign(publisherId: string, offerId: string, planId: string, callback: ServiceCallback<models.AgreementTerms>): void;
    sign(publisherId: string, offerId: string, planId: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.AgreementTerms>): void;


    /**
     * Cancel marketplace terms.
     *
     * @param {string} publisherId Publisher identifier string of image being
     * deployed.
     *
     * @param {string} offerId Offer identifier string of image being deployed.
     *
     * @param {string} planId Plan identifier string of image being deployed.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<AgreementTerms>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    cancelWithHttpOperationResponse(publisherId: string, offerId: string, planId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.AgreementTerms>>;

    /**
     * Cancel marketplace terms.
     *
     * @param {string} publisherId Publisher identifier string of image being
     * deployed.
     *
     * @param {string} offerId Offer identifier string of image being deployed.
     *
     * @param {string} planId Plan identifier string of image being deployed.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [optionalCallback] - The optional callback.
     *
     * @returns {ServiceCallback|Promise} If a callback was passed as the last
     * parameter then it returns the callback else returns a Promise.
     *
     * {Promise} A promise is returned.
     *
     *                      @resolve {AgreementTerms} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {AgreementTerms} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link AgreementTerms} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    cancel(publisherId: string, offerId: string, planId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.AgreementTerms>;
    cancel(publisherId: string, offerId: string, planId: string, callback: ServiceCallback<models.AgreementTerms>): void;
    cancel(publisherId: string, offerId: string, planId: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.AgreementTerms>): void;


    /**
     * Get marketplace agreements.
     *
     * @param {string} publisherId Publisher identifier string of image being
     * deployed.
     *
     * @param {string} offerId Offer identifier string of image being deployed.
     *
     * @param {string} planId Plan identifier string of image being deployed.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<AgreementTerms>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    getAgreementWithHttpOperationResponse(publisherId: string, offerId: string, planId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.AgreementTerms>>;

    /**
     * Get marketplace agreements.
     *
     * @param {string} publisherId Publisher identifier string of image being
     * deployed.
     *
     * @param {string} offerId Offer identifier string of image being deployed.
     *
     * @param {string} planId Plan identifier string of image being deployed.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [optionalCallback] - The optional callback.
     *
     * @returns {ServiceCallback|Promise} If a callback was passed as the last
     * parameter then it returns the callback else returns a Promise.
     *
     * {Promise} A promise is returned.
     *
     *                      @resolve {AgreementTerms} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {AgreementTerms} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link AgreementTerms} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    getAgreement(publisherId: string, offerId: string, planId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.AgreementTerms>;
    getAgreement(publisherId: string, offerId: string, planId: string, callback: ServiceCallback<models.AgreementTerms>): void;
    getAgreement(publisherId: string, offerId: string, planId: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.AgreementTerms>): void;


    /**
     * List marketplace agreements.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<Array>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listWithHttpOperationResponse(options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.AgreementTerms[]>>;

    /**
     * List marketplace agreements.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [optionalCallback] - The optional callback.
     *
     * @returns {ServiceCallback|Promise} If a callback was passed as the last
     * parameter then it returns the callback else returns a Promise.
     *
     * {Promise} A promise is returned.
     *
     *                      @resolve {Array} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {Array} [result]   - The deserialized result object if an error did not occur.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    list(options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.AgreementTerms[]>;
    list(callback: ServiceCallback<models.AgreementTerms[]>): void;
    list(options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.AgreementTerms[]>): void;
}

/**
 * @class
 * Operations
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the MarketplaceOrderingAgreements.
 */
export interface Operations {


    /**
     * Lists all of the available Microsoft.MarketplaceOrdering REST API
     * operations.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<OperationListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listWithHttpOperationResponse(options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.OperationListResult>>;

    /**
     * Lists all of the available Microsoft.MarketplaceOrdering REST API
     * operations.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [optionalCallback] - The optional callback.
     *
     * @returns {ServiceCallback|Promise} If a callback was passed as the last
     * parameter then it returns the callback else returns a Promise.
     *
     * {Promise} A promise is returned.
     *
     *                      @resolve {OperationListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {OperationListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link OperationListResult} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    list(options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.OperationListResult>;
    list(callback: ServiceCallback<models.OperationListResult>): void;
    list(options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.OperationListResult>): void;


    /**
     * Lists all of the available Microsoft.MarketplaceOrdering REST API
     * operations.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<OperationListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.OperationListResult>>;

    /**
     * Lists all of the available Microsoft.MarketplaceOrdering REST API
     * operations.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [optionalCallback] - The optional callback.
     *
     * @returns {ServiceCallback|Promise} If a callback was passed as the last
     * parameter then it returns the callback else returns a Promise.
     *
     * {Promise} A promise is returned.
     *
     *                      @resolve {OperationListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {OperationListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link OperationListResult} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.OperationListResult>;
    listNext(nextPageLink: string, callback: ServiceCallback<models.OperationListResult>): void;
    listNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.OperationListResult>): void;
}
