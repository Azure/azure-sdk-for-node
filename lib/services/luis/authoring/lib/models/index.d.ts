/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import * as moment from "moment";

/**
 * Defines the entity type and position of the extracted entity within the example.
 */
export interface EntityLabelObject {
  /**
   * The entity type.
   */
  entityName: string;
  /**
   * The index within the utterance where the extracted entity starts.
   */
  startCharIndex: number;
  /**
   * The index within the utterance where the extracted entity ends.
   */
  endCharIndex: number;
}

/**
 * Properties for creating a new LUIS Application
 */
export interface ApplicationCreateObject {
  /**
   * The culture for the new application. It is the language that your app understands and speaks.
   * E.g.: "en-us". Note: the culture cannot be changed after the app is created.
   */
  culture: string;
  /**
   * The domain for the new application. Optional. E.g.: Comics.
   */
  domain?: string;
  /**
   * Description of the new application. Optional.
   */
  description?: string;
  /**
   * The initial version ID. Optional. Default value is: "0.1"
   */
  initialVersionId?: string;
  /**
   * Defines the scenario for the new application. Optional. E.g.: IoT.
   */
  usageScenario?: string;
  /**
   * The name for the new application.
   */
  name: string;
}

/**
 * A model object containing the name of the custom prebuilt entity and the name of the domain to
 * which this model belongs.
 */
export interface PrebuiltDomainCreateBaseObject {
  /**
   * The domain name.
   */
  domainName?: string;
}

/**
 * A prebuilt domain create object containing the name and culture of the domain.
 */
export interface PrebuiltDomainCreateObject {
  /**
   * The domain name.
   */
  domainName?: string;
  /**
   * The culture of the new domain.
   */
  culture?: string;
}

/**
 * A model object containing the name of the custom prebuilt intent or entity and the name of the
 * domain to which this model belongs.
 */
export interface PrebuiltDomainModelCreateObject {
  /**
   * The domain name.
   */
  domainName?: string;
  /**
   * The intent name or entity name.
   */
  modelName?: string;
}

/**
 * A hierarchical entity extractor.
 */
export interface HierarchicalEntityModel {
  /**
   * Child entities.
   */
  children?: string[];
  /**
   * Entity name.
   */
  name?: string;
}

/**
 * A composite entity extractor.
 */
export interface CompositeEntityModel {
  /**
   * Child entities.
   */
  children?: string[];
  /**
   * Entity name.
   */
  name?: string;
}

/**
 * Exported Model - Extracted Entity from utterance.
 */
export interface JSONEntity {
  /**
   * The index within the utterance where the extracted entity starts.
   */
  startPos: number;
  /**
   * The index within the utterance where the extracted entity ends.
   */
  endPos: number;
  /**
   * The entity name.
   */
  entity: string;
}

/**
 * Object model for updating an application's settings.
 */
export interface ApplicationSettingUpdateObject {
  /**
   * Setting your application as public allows other people to use your application's endpoint
   * using their own keys.
   */
  isPublic?: boolean;
}

/**
 * Object model for updating an application's publish settings.
 */
export interface PublishSettingUpdateObject {
  /**
   * Setting sentiment analysis as true returns the Sentiment of the input utterance along with the
   * response
   */
  sentimentAnalysis?: boolean;
  /**
   * Setting speech as public enables speech priming in your app
   */
  speech?: boolean;
  /**
   * Setting spell checker as public enables spell checking the input utterance.
   */
  spellChecker?: boolean;
}

/**
 * A labeled example utterance.
 */
export interface ExampleLabelObject {
  /**
   * The example utterance.
   */
  text?: string;
  /**
   * The identified entities within the example utterance.
   */
  entityLabels?: EntityLabelObject[];
  /**
   * The identified intent representing the example utterance.
   */
  intentName?: string;
}

/**
 * Object model for creating a phraselist model.
 */
export interface PhraselistCreateObject {
  /**
   * List of comma-separated phrases that represent the Phraselist.
   */
  phrases?: string;
  /**
   * The Phraselist name.
   */
  name?: string;
  /**
   * An interchangeable phrase list feature serves as a list of synonyms for training. A
   * non-exchangeable phrase list serves as separate features for training. So, if your
   * non-interchangeable phrase list contains 5 phrases, they will be mapped to 5 separate
   * features. You can think of the non-interchangeable phrase list as an additional bag of words
   * to add to LUIS existing vocabulary features. It is used as a lexicon lookup feature where its
   * value is 1 if the lexicon contains a given word or 0 if it doesn’t.  Default value is true.
   */
  isExchangeable?: boolean;
}

/**
 * Sublist of items for a list entity.
 */
export interface SubClosedList {
  /**
   * The standard form that the list represents.
   */
  canonicalForm?: string;
  /**
   * List of synonym words.
   */
  list?: string[];
}

/**
 * Sublist of items for a list entity.
 */
export interface SubClosedListResponse extends SubClosedList {
  /**
   * The sublist ID
   */
  id?: number;
}

/**
 * Object model for updating the name or description of an application.
 */
export interface ApplicationUpdateObject {
  /**
   * The application's new name.
   */
  name?: string;
  /**
   * The application's new description.
   */
  description?: string;
}

/**
 * Exported Model - A Pattern feature.
 */
export interface JSONRegexFeature {
  /**
   * The Regular Expression to match.
   */
  pattern?: string;
  /**
   * Indicates if the Pattern feature is enabled.
   */
  activated?: boolean;
  /**
   * Name of the feature.
   */
  name?: string;
}

/**
 * Object model for updating an existing Pattern feature.
 */
export interface PatternUpdateObject {
  /**
   * The Regular Expression to match.
   */
  pattern?: string;
  /**
   * Name of the feature.
   */
  name?: string;
  /**
   * Indicates if the Pattern feature is enabled.
   */
  isActive?: boolean;
}

/**
 * Exported Model - A list entity.
 */
export interface ClosedList {
  /**
   * Name of the list entity.
   */
  name?: string;
  /**
   * Sublists for the list entity.
   */
  subLists?: SubClosedList[];
  roles?: string[];
}

/**
 * Sublist of items for a list entity.
*/
export interface WordListObject {
  /**
   * The standard form that the list represents.
  */
  canonicalForm?: string;
  /**
   * List of synonym words.
  */
  list?: string[];
}

/**
 * Object model for adding a batch of sublists to an existing list entity.
*/
export interface ClosedListModelPatchObject {
  /**
   * Sublists to add.
  */
  subLists?: WordListObject[];
}

/**
 * Exported Model - Phraselist Model Feature.
*/
export interface JSONModelFeature {
  /**
   * Indicates if the feature is enabled.
  */
  activated?: boolean;
  /**
   * The Phraselist name.
  */
  name?: string;
  /**
   * List of comma-separated phrases that represent the Phraselist.
  */
  words?: string;
  /**
   * An interchangeable phrase list feature serves as a list of synonyms for training. A
   * non-exchangeable phrase list serves as separate features for training. So, if your
   * non-interchangeable phrase list contains 5 phrases, they will be mapped to 5 separate
   * features. You can think of the non-interchangeable phrase list as an additional bag of words
   * to add to LUIS existing vocabulary features. It is used as a lexicon lookup feature where its
   * value is 1 if the lexicon contains a given word or 0 if it doesn’t.  Default value is true.
  */
  mode?: boolean;
}

/**
 * Object model for creating a new entity extractor.
*/
export interface ModelCreateObject {
  /**
   * Name of the new entity extractor.
  */
  name?: string;
}

/**
 * Object model for creating a Pattern feature.
*/
export interface PatternCreateObject {
  /**
   * The Regular Expression to match.
  */
  pattern?: string;
  /**
   * Name of the feature.
  */
  name?: string;
}

/**
 * Object model for updating one of the list entity's sublists.
*/
export interface WordListBaseUpdateObject {
  /**
   * The standard form that the list represents.
  */
  canonicalForm?: string;
  /**
   * List of synonym words.
  */
  list?: string[];
}

/**
 * Exported Model - Utterance that was used to train the model.
*/
export interface JSONUtterance {
  /**
   * The utterance.
  */
  text?: string;
  /**
   * The matched intent.
  */
  intent?: string;
  /**
   * The matched entities.
  */
  entities?: JSONEntity[];
}

/**
 * Object model for updating an intent classifier.
*/
export interface ModelUpdateObject {
  /**
   * The entity's new name.
  */
  name?: string;
}

/**
 * Object model for updating a list entity.
*/
export interface ClosedListModelUpdateObject {
  /**
   * The new sublists for the feature.
  */
  subLists?: WordListObject[];
  /**
   * The new name of the list entity.
  */
  name?: string;
}

/**
 * Object model for creating a list entity.
*/
export interface ClosedListModelCreateObject {
  /**
   * Sublists for the feature.
  */
  subLists?: WordListObject[];
  /**
   * Name of the list entity.
  */
  name?: string;
}

/**
 * Object model of an application version.
*/
export interface VersionInfo {
  /**
   * The version ID. E.g.: "0.1"
  */
  version: string;
  /**
   * The version's creation timestamp.
  */
  createdDateTime?: Date;
  /**
   * Timestamp of the last update.
  */
  lastModifiedDateTime?: Date;
  /**
   * Timestamp of the last time the model was trained.
  */
  lastTrainedDateTime?: Date;
  /**
   * Timestamp when was last published.
  */
  lastPublishedDateTime?: Date;
  /**
   * The Runtime endpoint URL for this model version.
  */
  endpointUrl?: string;
  /**
   * The endpoint key.
  */
  assignedEndpointKey?: { [propertyName: string]: string };
  /**
   * External keys.
  */
  externalApiKeys?: any;
  /**
   * Number of intents in this model.
  */
  intentsCount?: number;
  /**
   * Number of entities in this model.
  */
  entitiesCount?: number;
  /**
   * Number of calls made to this endpoint.
  */
  endpointHitsCount?: number;
  /**
   * The current training status. Possible values include: 'NeedsTraining', 'InProgress', 'Trained'
  */
  trainingStatus: string;
}

/**
 * Object model for cloning an application's version.
*/
export interface TaskUpdateObject {
  /**
   * The new version for the cloned model.
  */
  version?: string;
}

/**
 * Object model for updating a Phraselist.
*/
export interface PhraselistUpdateObject {
  /**
   * List of comma-separated phrases that represent the Phraselist.
  */
  phrases?: string;
  /**
   * The Phraselist name.
  */
  name?: string;
  /**
   * Indicates if the Phraselist is enabled.
  */
  isActive?: boolean;
  /**
   * An exchangeable phrase list feature are serves as single feature to the LUIS underlying
   * training algorithm. It is used as a lexicon lookup feature where its value is 1 if the lexicon
   * contains a given word or 0 if it doesn’t. Think of an exchangeable as a synonyms list. A
   * non-exchangeable phrase list feature has all the phrases in the list serve as separate
   * features to the underlying training algorithm. So, if you your phrase list feature contains 5
   * phrases, they will be mapped to 5 separate features. You can think of the non-exchangeable
   * phrase list feature as an additional bag of words that you are willing to add to LUIS existing
   * vocabulary features. Think of a non-exchangeable as set of different words. Default value is
   * true.
  */
  isExchangeable?: boolean;
}

export interface PrebuiltDomainObject {
  domainName?: string;
  modelName?: string;
}

export interface HierarchicalModel {
  name?: string;
  children?: string[];
  inherits?: PrebuiltDomainObject;
  roles?: string[];
}

/**
 * Object model for publishing a specific application version.
*/
export interface ApplicationPublishObject {
  /**
   * The version ID to publish.
  */
  versionId?: string;
  /**
   * Indicates if the staging slot should be used, instead of the Production one.
  */
  isStaging?: boolean;
}

/**
 * Pattern.Any Entity Extractor.
*/
export interface PatternAny {
  name?: string;
  explicitList?: string[];
  roles?: string[];
}

/**
 * Regular Expression Entity Extractor.
*/
export interface RegexEntity {
  name?: string;
  regexPattern?: string;
  roles?: string[];
}

/**
 * Prebuilt Entity Extractor.
*/
export interface PrebuiltEntity {
  name?: string;
  roles?: string[];
}

/**
 * Pattern
*/
export interface PatternRule {
  /**
   * The pattern text.
  */
  pattern?: string;
  /**
   * The intent's name where the pattern belongs to.
  */
  intent?: string;
}

/**
 * Exported Model - An exported LUIS Application.
*/
export interface LuisApp {
  /**
   * The name of the application.
  */
  name?: string;
  /**
   * The version ID of the application that was exported.
  */
  versionId?: string;
  /**
   * The description of the application.
  */
  desc?: string;
  /**
   * The culture of the application. E.g.: en-us.
  */
  culture?: string;
  /**
   * List of intents.
  */
  intents?: HierarchicalModel[];
  /**
   * List of entities.
  */
  entities?: HierarchicalModel[];
  /**
   * List of list entities.
  */
  closedLists?: ClosedList[];
  /**
   * List of composite entities.
  */
  composites?: HierarchicalModel[];
  /**
   * List of Pattern.Any entities.
  */
  patternAnyEntities?: PatternAny[];
  /**
   * List of regular expression entities.
  */
  regexEntities?: RegexEntity[];
  /**
   * List of prebuilt entities.
  */
  prebuiltEntities?: PrebuiltEntity[];
  /**
   * List of pattern features.
  */
  regexFeatures?: JSONRegexFeature[];
  /**
   * List of model features.
  */
  modelFeatures?: JSONModelFeature[];
  /**
   * List of patterns.
  */
  patterns?: PatternRule[];
  /**
   * List of example utterances.
  */
  utterances?: JSONUtterance[];
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Defines the entity type and position of the extracted entity within the example.
*/
export interface EntityLabel {
  /**
   * The entity type.
  */
  entityName: string;
  /**
   * The index within the utterance where the extracted entity starts.
  */
  startTokenIndex: number;
  /**
   * The index within the utterance where the extracted entity ends.
  */
  endTokenIndex: number;
}

/**
 * A suggested intent.
*/
export interface IntentPrediction {
  /**
   * The intent's name
  */
  name?: string;
  /**
   * The intent's score, based on the prediction model.
  */
  score?: number;
}

/**
 * A suggested entity.
*/
export interface EntityPrediction {
  /**
   * The entity's name
  */
  entityName: string;
  /**
   * The index within the utterance where the extracted entity starts.
  */
  startTokenIndex: number;
  /**
   * The index within the utterance where the extracted entity ends.
  */
  endTokenIndex: number;
  /**
   * The actual token(s) that comprise the entity.
  */
  phrase: string;
}

/**
 * A prediction and label pair of an example.
*/
export interface LabeledUtterance {
  /**
   * ID of Labeled Utterance.
  */
  id?: number;
  /**
   * The utterance. For example, "What's the weather like in seattle?"
  */
  text?: string;
  /**
   * The utterance tokenized.
  */
  tokenizedText?: string[];
  /**
   * The intent matching the example.
  */
  intentLabel?: string;
  /**
   * The entities matching the example.
  */
  entityLabels?: EntityLabel[];
  /**
   * List of suggested intents.
  */
  intentPredictions?: IntentPrediction[];
  /**
   * List of suggested entities.
  */
  entityPredictions?: EntityPrediction[];
}

/**
 * Predicted/suggested intent.
*/
export interface IntentsSuggestionExample {
  /**
   * The utterance. For example, "What's the weather like in seattle?"
  */
  text?: string;
  /**
   * The tokenized utterance.
  */
  tokenizedText?: string[];
  /**
   * Predicted/suggested intents.
  */
  intentPredictions?: IntentPrediction[];
  /**
   * Predicted/suggested entities.
  */
  entityPredictions?: EntityPrediction[];
}

/**
 * Predicted/suggested entity.
*/
export interface EntitiesSuggestionExample {
  /**
   * The utterance. For example, "What's the weather like in seattle?"
  */
  text?: string;
  /**
   * The utterance tokenized.
  */
  tokenizedText?: string[];
  /**
   * Predicted/suggested intents.
  */
  intentPredictions?: IntentPrediction[];
  /**
   * Predicted/suggested entities.
  */
  entityPredictions?: EntityPrediction[];
}

/**
 * Response containing user's endpoint keys and the endpoint URLs of the prebuilt Cortana
 * applications.
*/
export interface PersonalAssistantsResponse {
  endpointKeys?: string[];
  endpointUrls?: { [propertyName: string]: string };
}

/**
 * Base type used in entity types.
*/
export interface ModelInfo {
  /**
   * The ID of the Entity Model.
  */
  id: string;
  /**
   * Name of the Entity Model.
  */
  name?: string;
  /**
   * The type ID of the Entity Model.
  */
  typeId?: number;
  /**
   * Possible values include: 'Entity Extractor', 'Hierarchical Entity Extractor', 'Hierarchical
   * Child Entity Extractor', 'Composite Entity Extractor', 'List Entity Extractor', 'Prebuilt
   * Entity Extractor', 'Intent Classifier', 'Pattern.Any Entity Extractor', 'Regular Expression
   * Entity Extractor'
  */
  readableType: string;
}

/**
 * Entity extractor role
*/
export interface EntityRole {
  /**
   * The entity role ID.
  */
  id?: string;
  /**
   * The entity role name.
  */
  name?: string;
}

/**
 * The base child entity type.
*/
export interface ChildEntity {
  /**
   * The ID (GUID) belonging to a child entity.
  */
  id: string;
  /**
   * The name of a child entity.
  */
  name?: string;
}

/**
 * Explicit (exception) list item
*/
export interface ExplicitListItem {
  /**
   * The explicit list item ID.
  */
  id?: number;
  /**
   * The explicit list item value.
  */
  explicitListItem?: string;
}

/**
 * An application model info.
*/
export interface ModelInfoResponse {
  /**
   * The ID of the Entity Model.
  */
  id: string;
  /**
   * Name of the Entity Model.
  */
  name?: string;
  /**
   * The type ID of the Entity Model.
  */
  typeId?: number;
  /**
   * Possible values include: 'Entity Extractor', 'Hierarchical Entity Extractor', 'Hierarchical
   * Child Entity Extractor', 'Composite Entity Extractor', 'List Entity Extractor', 'Prebuilt
   * Entity Extractor', 'Intent Classifier', 'Pattern.Any Entity Extractor', 'Regular Expression
   * Entity Extractor'
  */
  readableType: string;
  roles?: EntityRole[];
  /**
   * List of child entities.
  */
  children?: ChildEntity[];
  /**
   * List of sublists.
  */
  subLists?: SubClosedListResponse[];
  /**
   * The domain name.
  */
  customPrebuiltDomainName?: string;
  /**
   * The intent name or entity name.
  */
  customPrebuiltModelName?: string;
  /**
   * The Regular Expression entity pattern.
  */
  regexPattern?: string;
  explicitList?: ExplicitListItem[];
}

/**
 * An Entity Extractor model info.
*/
export interface EntityModelInfo extends ModelInfo {
  roles?: EntityRole[];
}

/**
 * Hierarchical Entity Extractor.
*/
export interface HierarchicalEntityExtractor {
  /**
   * The ID of the Entity Model.
  */
  id: string;
  /**
   * Name of the Entity Model.
  */
  name?: string;
  /**
   * The type ID of the Entity Model.
  */
  typeId?: number;
  /**
   * Possible values include: 'Entity Extractor', 'Hierarchical Entity Extractor', 'Hierarchical
   * Child Entity Extractor', 'Composite Entity Extractor', 'List Entity Extractor', 'Prebuilt
   * Entity Extractor', 'Intent Classifier', 'Pattern.Any Entity Extractor', 'Regular Expression
   * Entity Extractor'
  */
  readableType: string;
  roles?: EntityRole[];
  /**
   * List of child entities.
  */
  children?: ChildEntity[];
}

/**
 * A Composite Entity Extractor.
*/
export interface CompositeEntityExtractor {
  /**
   * The ID of the Entity Model.
  */
  id: string;
  /**
   * Name of the Entity Model.
  */
  name?: string;
  /**
   * The type ID of the Entity Model.
  */
  typeId?: number;
  /**
   * Possible values include: 'Entity Extractor', 'Hierarchical Entity Extractor', 'Hierarchical
   * Child Entity Extractor', 'Composite Entity Extractor', 'List Entity Extractor', 'Prebuilt
   * Entity Extractor', 'Intent Classifier', 'Pattern.Any Entity Extractor', 'Regular Expression
   * Entity Extractor'
  */
  readableType: string;
  roles?: EntityRole[];
  /**
   * List of child entities.
  */
  children?: ChildEntity[];
}

/**
 * List Entity Extractor.
*/
export interface ClosedListEntityExtractor {
  /**
   * The ID of the Entity Model.
  */
  id: string;
  /**
   * Name of the Entity Model.
  */
  name?: string;
  /**
   * The type ID of the Entity Model.
  */
  typeId?: number;
  /**
   * Possible values include: 'Entity Extractor', 'Hierarchical Entity Extractor', 'Hierarchical
   * Child Entity Extractor', 'Composite Entity Extractor', 'List Entity Extractor', 'Prebuilt
   * Entity Extractor', 'Intent Classifier', 'Pattern.Any Entity Extractor', 'Regular Expression
   * Entity Extractor'
  */
  readableType: string;
  roles?: EntityRole[];
  /**
   * List of sublists.
  */
  subLists?: SubClosedListResponse[];
}

/**
 * Prebuilt Entity Extractor.
*/
export interface PrebuiltEntityExtractor {
  /**
   * The ID of the Entity Model.
  */
  id: string;
  /**
   * Name of the Entity Model.
  */
  name?: string;
  /**
   * The type ID of the Entity Model.
  */
  typeId?: number;
  /**
   * Possible values include: 'Entity Extractor', 'Hierarchical Entity Extractor', 'Hierarchical
   * Child Entity Extractor', 'Composite Entity Extractor', 'List Entity Extractor', 'Prebuilt
   * Entity Extractor', 'Intent Classifier', 'Pattern.Any Entity Extractor', 'Regular Expression
   * Entity Extractor'
  */
  readableType: string;
  roles?: EntityRole[];
}

/**
 * A Hierarchical Child Entity.
*/
export interface HierarchicalChildEntity extends ChildEntity {
  /**
   * The type ID of the Entity Model.
  */
  typeId?: number;
  /**
   * Possible values include: 'Entity Extractor', 'Hierarchical Entity Extractor', 'Hierarchical
   * Child Entity Extractor', 'Composite Entity Extractor', 'List Entity Extractor', 'Prebuilt
   * Entity Extractor', 'Intent Classifier', 'Pattern.Any Entity Extractor', 'Regular Expression
   * Entity Extractor'
  */
  readableType?: string;
}

/**
 * A Custom Prebuilt model.
*/
export interface CustomPrebuiltModel {
  /**
   * The ID of the Entity Model.
  */
  id: string;
  /**
   * Name of the Entity Model.
  */
  name?: string;
  /**
   * The type ID of the Entity Model.
  */
  typeId?: number;
  /**
   * Possible values include: 'Entity Extractor', 'Hierarchical Entity Extractor', 'Hierarchical
   * Child Entity Extractor', 'Composite Entity Extractor', 'List Entity Extractor', 'Prebuilt
   * Entity Extractor', 'Intent Classifier', 'Pattern.Any Entity Extractor', 'Regular Expression
   * Entity Extractor'
  */
  readableType: string;
  /**
   * The domain name.
  */
  customPrebuiltDomainName?: string;
  /**
   * The intent name or entity name.
  */
  customPrebuiltModelName?: string;
  roles?: EntityRole[];
}

/**
 * Intent Classifier.
*/
export interface IntentClassifier extends ModelInfo {
  /**
   * The domain name.
  */
  customPrebuiltDomainName?: string;
  /**
   * The intent name or entity name.
  */
  customPrebuiltModelName?: string;
}

/**
 * Entity Extractor.
*/
export interface EntityExtractor {
  /**
   * The ID of the Entity Model.
  */
  id: string;
  /**
   * Name of the Entity Model.
  */
  name?: string;
  /**
   * The type ID of the Entity Model.
  */
  typeId?: number;
  /**
   * Possible values include: 'Entity Extractor', 'Hierarchical Entity Extractor', 'Hierarchical
   * Child Entity Extractor', 'Composite Entity Extractor', 'List Entity Extractor', 'Prebuilt
   * Entity Extractor', 'Intent Classifier', 'Pattern.Any Entity Extractor', 'Regular Expression
   * Entity Extractor'
  */
  readableType: string;
  roles?: EntityRole[];
  /**
   * The domain name.
  */
  customPrebuiltDomainName?: string;
  /**
   * The intent name or entity name.
  */
  customPrebuiltModelName?: string;
}

/**
 * The base class Features-related response objects inherit from.
*/
export interface FeatureInfoObject {
  /**
   * A six-digit ID used for Features.
  */
  id?: number;
  /**
   * The name of the Feature.
  */
  name?: string;
  /**
   * Indicates if the feature is enabled.
  */
  isActive?: boolean;
}

/**
 * Phraselist Feature.
*/
export interface PhraseListFeatureInfo extends FeatureInfoObject {
  /**
   * A list of comma-separated values.
  */
  phrases?: string;
  /**
   * An exchangeable phrase list feature are serves as single feature to the LUIS underlying
   * training algorithm. It is used as a lexicon lookup feature where its value is 1 if the lexicon
   * contains a given word or 0 if it doesn’t. Think of an exchangeable as a synonyms list. A
   * non-exchangeable phrase list feature has all the phrases in the list serve as separate
   * features to the underlying training algorithm. So, if you your phrase list feature contains 5
   * phrases, they will be mapped to 5 separate features. You can think of the non-exchangeable
   * phrase list feature as an additional bag of words that you are willing to add to LUIS existing
   * vocabulary features. Think of a non-exchangeable as set of different words. Default value is
   * true.
  */
  isExchangeable?: boolean;
}

/**
 * Pattern feature.
*/
export interface PatternFeatureInfo extends FeatureInfoObject {
  /**
   * The Regular Expression to match.
  */
  pattern?: string;
}

/**
 * Model Features, including Patterns and Phraselists.
*/
export interface FeaturesResponseObject {
  phraselistFeatures?: PhraseListFeatureInfo[];
  patternFeatures?: PatternFeatureInfo[];
}

/**
 * Response when adding a labeled example utterance.
*/
export interface LabelExampleResponse {
  /**
   * The example utterance.
  */
  utteranceText?: string;
  /**
   * The newly created sample ID.
  */
  exampleId?: number;
}

/**
 * Response of an Operation status.
*/
export interface OperationStatus {
  /**
   * Status Code. Possible values include: 'Failed', 'FAILED', 'Success'
  */
  code?: string;
  /**
   * Status details.
  */
  message?: string;
}

/**
 * Response when adding a batch of labeled example utterances.
*/
export interface BatchLabelExample {
  value?: LabelExampleResponse;
  hasError?: boolean;
  error?: OperationStatus;
}

/**
 * Response containing the Application Info.
*/
export interface ApplicationInfoResponse {
  /**
   * The ID (GUID) of the application.
  */
  id?: string;
  /**
   * The name of the application.
  */
  name?: string;
  /**
   * The description of the application.
  */
  description?: string;
  /**
   * The culture of the application. For example, "en-us".
  */
  culture?: string;
  /**
   * Defines the scenario for the new application. Optional. For example, IoT.
  */
  usageScenario?: string;
  /**
   * The domain for the new application. Optional. For example, Comics.
  */
  domain?: string;
  /**
   * Amount of model versions within the application.
  */
  versionsCount?: number;
  /**
   * The version's creation timestamp.
  */
  createdDateTime?: string;
  /**
   * The Runtime endpoint URL for this model version.
  */
  endpoints?: any;
  /**
   * Number of calls made to this endpoint.
  */
  endpointHitsCount?: number;
  /**
   * The version ID currently marked as active.
  */
  activeVersion?: string;
}

/**
 * The base class "ProductionOrStagingEndpointInfo" inherits from.
*/
export interface EndpointInfo {
  /**
   * The version ID to publish.
  */
  versionId?: string;
  /**
   * Indicates if the staging slot should be used, instead of the Production one.
  */
  isStaging?: boolean;
  /**
   * The Runtime endpoint URL for this model version.
  */
  endpointUrl?: string;
  /**
   * The target region that the application is published to.
  */
  region?: string;
  /**
   * The endpoint key.
  */
  assignedEndpointKey?: string;
  /**
   * The endpoint's region.
  */
  endpointRegion?: string;
  /**
   * Regions where publishing failed.
  */
  failedRegions?: string;
  /**
   * Timestamp when was last published.
  */
  publishedDateTime?: string;
}

export interface ProductionOrStagingEndpointInfo extends EndpointInfo {
}

/**
 * Available culture for using in a new application.
*/
export interface AvailableCulture {
  /**
   * The language name.
  */
  name?: string;
  /**
   * The ISO value for the language.
  */
  code?: string;
}

/**
 * The application settings.
*/
export interface ApplicationSettings {
  /**
   * The application ID.
  */
  id: string;
  /**
   * Setting your application as public allows other people to use your application's endpoint
   * using their own keys for billing purposes.
  */
  isPublic: boolean;
}

/**
 * The application publish settings.
*/
export interface PublishSettings {
  /**
   * The application ID.
  */
  id: string;
  /**
   * Setting sentiment analysis as true returns the sentiment of the input utterance along with the
   * response
  */
  isSentimentAnalysisEnabled: boolean;
  /**
   * Enables speech priming in your app
  */
  isSpeechEnabled: boolean;
  /**
   * Enables spell checking of the utterance.
  */
  isSpellCheckerEnabled: boolean;
}

/**
 * Available Prebuilt entity model for using in an application.
*/
export interface AvailablePrebuiltEntityModel {
  /**
   * The entity name.
  */
  name?: string;
  /**
   * The entity description and usage information.
  */
  description?: string;
  /**
   * Usage examples.
  */
  examples?: string;
}

/**
 * Response model when requesting to train the model.
*/
export interface EnqueueTrainingResponse {
  /**
   * The train request status ID.
  */
  statusId?: number;
  /**
   * Possible values include: 'Queued', 'InProgress', 'UpToDate', 'Fail', 'Success'
  */
  status?: string;
}

/**
 * Model Training Details.
*/
export interface ModelTrainingDetails {
  /**
   * The train request status ID.
  */
  statusId?: number;
  /**
   * Possible values include: 'Queued', 'InProgress', 'UpToDate', 'Fail', 'Success'
  */
  status?: string;
  /**
   * The count of examples used to train the model.
  */
  exampleCount?: number;
  /**
   * When the model was trained.
  */
  trainingDateTime?: Date;
  /**
   * Reason for the training failure.
  */
  failureReason?: string;
}

/**
 * Model Training Info.
*/
export interface ModelTrainingInfo {
  /**
   * The ID (GUID) of the model.
  */
  modelId?: string;
  details?: ModelTrainingDetails;
}

/**
 * List of user permissions.
*/
export interface UserAccessList {
  /**
   * The email address of owner of the application.
  */
  owner?: string;
  emails?: string[];
}

export interface UserCollaborator {
  /**
   * The email address of the user.
  */
  email?: string;
}

export interface CollaboratorsArray {
  /**
   * The email address of the users.
  */
  emails?: string[];
}

/**
 * Error response when invoking an operation on the API.
*/
export interface ErrorResponse {
  errorType?: string;
  /**
   * Describes unknown properties. The value of an unknown property can be of "any" type.
  */
  [additionalPropertyName: string]: any;
}

/**
 * Operation error details when invoking an operation on the API.
*/
export interface OperationError {
  code?: string;
  message?: string;
}

export interface PrebuiltDomainItem {
  name?: string;
  description?: string;
  examples?: string;
}

/**
 * Prebuilt Domain.
*/
export interface PrebuiltDomain {
  name?: string;
  culture?: string;
  description?: string;
  examples?: string;
  intents?: PrebuiltDomainItem[];
  entities?: PrebuiltDomainItem[];
}

/**
 * Object model for creating an entity role.
*/
export interface EntityRoleCreateObject {
  /**
   * The entity role name.
  */
  name?: string;
}

/**
 * Model object for creating a regular expression entity model.
*/
export interface RegexModelCreateObject {
  /**
   * The regular expression entity pattern.
  */
  regexPattern?: string;
  /**
   * The model name.
  */
  name?: string;
}

/**
 * Model object for creating a Pattern.Any entity model.
*/
export interface PatternAnyModelCreateObject {
  /**
   * The model name.
  */
  name?: string;
  /**
   * The Pattern.Any explicit list.
  */
  explicitList?: string[];
}

/**
 * Object model for creating an explicit (exception) list item.
*/
export interface ExplicitListItemCreateObject {
  /**
   * The explicit list item.
  */
  explicitListItem?: string;
}

/**
 * Model object for updating a regular expression entity model.
*/
export interface RegexModelUpdateObject {
  /**
   * The regular expression entity pattern.
  */
  regexPattern?: string;
  /**
   * The model name.
  */
  name?: string;
}

/**
 * Model object for updating a Pattern.Any entity model.
*/
export interface PatternAnyModelUpdateObject {
  /**
   * The model name.
  */
  name?: string;
  /**
   * The Pattern.Any explicit list.
  */
  explicitList?: string[];
}

/**
 * Object model for updating an entity role.
*/
export interface EntityRoleUpdateObject {
  /**
   * The entity role name.
  */
  name?: string;
}

/**
 * Model object for updating an explicit (exception) list item.
*/
export interface ExplicitListItemUpdateObject {
  /**
   * The explicit list item.
  */
  explicitListItem?: string;
}

/**
 * Object model for creating a pattern
*/
export interface PatternRuleCreateObject {
  /**
   * The pattern text.
  */
  pattern?: string;
  /**
   * The intent's name which the pattern belongs to.
  */
  intent?: string;
}

/**
 * Object model for updating a pattern.
*/
export interface PatternRuleUpdateObject {
  /**
   * The pattern ID.
  */
  id?: string;
  /**
   * The pattern text.
  */
  pattern?: string;
  /**
   * The intent's name which the pattern belongs to.
  */
  intent?: string;
}

/**
 * Regular Expression Entity Extractor.
*/
export interface RegexEntityExtractor {
  /**
   * The ID of the Entity Model.
  */
  id: string;
  /**
   * Name of the Entity Model.
  */
  name?: string;
  /**
   * The type ID of the Entity Model.
  */
  typeId?: number;
  /**
   * Possible values include: 'Entity Extractor', 'Hierarchical Entity Extractor', 'Hierarchical
   * Child Entity Extractor', 'Composite Entity Extractor', 'List Entity Extractor', 'Prebuilt
   * Entity Extractor', 'Intent Classifier', 'Pattern.Any Entity Extractor', 'Regular Expression
   * Entity Extractor'
  */
  readableType: string;
  roles?: EntityRole[];
  /**
   * The Regular Expression entity pattern.
  */
  regexPattern?: string;
}

/**
 * Pattern.Any Entity Extractor.
*/
export interface PatternAnyEntityExtractor {
  /**
   * The ID of the Entity Model.
  */
  id: string;
  /**
   * Name of the Entity Model.
  */
  name?: string;
  /**
   * The type ID of the Entity Model.
  */
  typeId?: number;
  /**
   * Possible values include: 'Entity Extractor', 'Hierarchical Entity Extractor', 'Hierarchical
   * Child Entity Extractor', 'Composite Entity Extractor', 'List Entity Extractor', 'Prebuilt
   * Entity Extractor', 'Intent Classifier', 'Pattern.Any Entity Extractor', 'Regular Expression
   * Entity Extractor'
  */
  readableType: string;
  roles?: EntityRole[];
  explicitList?: ExplicitListItem[];
}

/**
 * Pattern rule
*/
export interface PatternRuleInfo {
  /**
   * The pattern ID.
  */
  id?: string;
  /**
   * The pattern text.
  */
  pattern?: string;
  /**
   * The intent's name where the pattern belongs to.
  */
  intent?: string;
}

/**
 * An object containing the example utterance's text.
*/
export interface LabelTextObject {
  /**
   * The ID of the Label.
  */
  id?: number;
  /**
   * The text of the label.
  */
  text?: string;
}

/**
 * Object model of an application version setting.
*/
export interface AppVersionSettingObject {
  /**
   * The application version setting name.
  */
  name?: string;
  /**
   * The application version setting value.
  */
  value?: string;
}

/**
 * Defines the Azure account information object.
*/
export interface AzureAccountInfoObject {
  /**
   * The id for the Azure subscription.
  */
  azureSubscriptionId: string;
  /**
   * The Azure resource group name.
  */
  resourceGroup: string;
  /**
   * The Azure account name.
  */
  accountName: string;
}

export interface HierarchicalChildModelUpdateObject {
  name?: string;
}

export interface HierarchicalChildModelCreateObject {
  name?: string;
}

export interface CompositeChildModelCreateObject {
  name?: string;
}
