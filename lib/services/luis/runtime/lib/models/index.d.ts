/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import * as moment from "moment";

/**
 * An intent detected from the utterance.
 */
export interface IntentModel {
  /**
   * Name of the intent, as defined in LUIS.
   */
  intent?: string;
  /**
   * Associated prediction score for the intent (float).
   */
  score?: number;
}

/**
 * An entity extracted from the utterance.
 */
export interface EntityModel {
  /**
   * Name of the entity, as defined in LUIS.
   */
  entity: string;
  /**
   * Type of the entity, as defined in LUIS.
   */
  type: string;
  /**
   * The position of the first character of the matched entity within the utterance.
   */
  startIndex: number;
  /**
   * The position of the last character of the matched entity within the utterance.
   */
  endIndex: number;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
   */
  [additionalPropertyName: string]: any;
}

/**
 * Child entity in a LUIS Composite Entity.
 */
export interface CompositeChildModel {
  /**
   * Type of child entity.
   */
  type: string;
  /**
   * Value extracted by LUIS.
   */
  value: string;
}

/**
 * LUIS Composite Entity.
 */
export interface CompositeEntityModel {
  /**
   * Type/name of parent entity.
   */
  parentType: string;
  /**
   * Value for composite entity extracted by LUIS.
   */
  value: string;
  /**
   * Child entities.
   */
  children: CompositeChildModel[];
}

/**
 * Sentiment of the input utterance.
 */
export interface Sentiment {
  /**
   * The polarity of the sentiment, can be positive, neutral or negative.
   */
  label?: string;
  /**
   * Score of the sentiment, ranges from 0 (most negative) to 1 (most positive).
   */
  score?: number;
}

/**
 * Prediction, based on the input query, containing intent(s) and entities.
 */
export interface LuisResult {
  /**
   * The input utterance that was analyzed.
   */
  query?: string;
  /**
   * The corrected utterance (when spell checking was enabled).
   */
  alteredQuery?: string;
  topScoringIntent?: IntentModel;
  /**
   * All the intents (and their score) that were detected from utterance.
  */
  intents?: IntentModel[];
  /**
   * The entities extracted from the utterance.
  */
  entities?: EntityModel[];
  /**
   * The composite entities extracted from the utterance.
  */
  compositeEntities?: CompositeEntityModel[];
  sentimentAnalysis?: Sentiment;
  connectedServiceResult?: LuisResult;
}

export interface EntityWithScore extends EntityModel {
  /**
   * Associated prediction score for the intent (float).
  */
  score: number;
}

export interface EntityWithResolution extends EntityModel {
  /**
   * Resolution values for pre-built LUIS entities.
  */
  resolution: any;
}

/**
 * Error information returned by the API
*/
export interface APIError {
  /**
   * HTTP Status code
  */
  statusCode?: string;
  /**
   * Cause of the error.
  */
  message?: string;
}
