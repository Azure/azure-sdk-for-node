/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import * as moment from "moment";

/**
 * An object describing face rectangle.
 */
export interface FaceRectangle {
  /**
   * X-coordinate of the top left point of the face, in pixels.
   */
  left?: number;
  /**
   * Y-coordinate of the top left point of the face, in pixels.
   */
  top?: number;
  /**
   * Width measured from the top-left point of the face, in pixels.
   */
  width?: number;
  /**
   * Height measured from the top-left point of the face, in pixels.
   */
  height?: number;
}

/**
 * An object describing possible celebrity identification.
 */
export interface CelebritiesModel {
  /**
   * Name of the celebrity.
   */
  name?: string;
  /**
   * Confidence level for the celebrity recognition as a value ranging from 0 to 1.
   */
  confidence?: number;
  /**
   * Location of the identified face in the image.
   */
  faceRectangle?: FaceRectangle;
}

/**
 * A landmark recognized in the image.
 */
export interface LandmarksModel {
  /**
   * Name of the landmark.
   */
  name?: string;
  /**
   * Confidence level for the landmark recognition as a value ranging from 0 to 1.
   */
  confidence?: number;
}

/**
 * An object describing additional category details.
 */
export interface CategoryDetail {
  /**
   * An array of celebrities if any identified.
   */
  celebrities?: CelebritiesModel[];
  /**
   * An array of landmarks if any identified.
   */
  landmarks?: LandmarksModel[];
}

/**
 * An object describing identified category.
 */
export interface Category {
  /**
   * Name of the category.
   */
  name?: string;
  /**
   * Scoring of the category.
   */
  score?: number;
  /**
   * Details of the identified category.
   */
  detail?: CategoryDetail;
}

/**
 * An object describing whether the image contains adult-oriented content and/or is racy.
 */
export interface AdultInfo {
  /**
   * A value indicating if the image contains adult-oriented content.
   */
  isAdultContent?: boolean;
  /**
   * A value indicating if the image is racy.
   */
  isRacyContent?: boolean;
  /**
   * Score from 0 to 1 that indicates how much the content is considered adult-oriented within the
   * image.
   */
  adultScore?: number;
  /**
   * Score from 0 to 1 that indicates how suggestive is the image.
   */
  racyScore?: number;
}

/**
 * An object providing additional metadata describing color attributes.
 */
export interface ColorInfo {
  /**
   * Possible dominant foreground color.
   */
  dominantColorForeground?: string;
  /**
   * Possible dominant background color.
   */
  dominantColorBackground?: string;
  /**
   * An array of possible dominant colors.
   */
  dominantColors?: string[];
  /**
   * Possible accent color.
   */
  accentColor?: string;
  /**
   * A value indicating if the image is black and white.
   */
  isBWImg?: boolean;
}

/**
 * An object providing possible image types and matching confidence levels.
 */
export interface ImageType {
  /**
   * Confidence level that the image is a clip art.
   */
  clipArtType?: number;
  /**
   * Confidence level that the image is a line drawing.
   */
  lineDrawingType?: number;
}

/**
 * An entity observation in the image, along with the confidence score.
 */
export interface ImageTag {
  /**
   * Name of the entity.
   */
  name?: string;
  /**
   * The level of confidence that the entity was observed.
   */
  confidence?: number;
  /**
   * Optional hint/details for this tag.
   */
  hint?: string;
}

/**
 * An image caption, i.e. a brief description of what the image depicts.
 */
export interface ImageCaption {
  /**
   * The text of the caption.
   */
  text?: string;
  /**
   * The level of confidence the service has in the caption.
   */
  confidence?: number;
}

/**
 * A collection of content tags, along with a list of captions sorted by confidence level, and
 * image metadata.
 */
export interface ImageDescriptionDetails {
  /**
   * A collection of image tags.
   */
  tags?: string[];
  /**
   * A list of captions, sorted by confidence level.
   */
  captions?: ImageCaption[];
}

/**
 * An object describing a face identified in the image.
 */
export interface FaceDescription {
  /**
   * Possible age of the face.
   */
  age?: number;
  /**
   * Possible gender of the face. Possible values include: 'Male', 'Female'
   */
  gender?: string;
  /**
   * Rectangle in the image containing the identified face.
   */
  faceRectangle?: FaceRectangle;
}

/**
 * A bounding box for an area inside an image.
 */
export interface BoundingRect {
  /**
   * X-coordinate of the top left point of the area, in pixels.
   */
  x?: number;
  /**
   * Y-coordinate of the top left point of the area, in pixels.
   */
  y?: number;
  /**
   * Width measured from the top-left point of the area, in pixels.
   */
  w?: number;
  /**
   * Height measured from the top-left point of the area, in pixels.
   */
  h?: number;
}

/**
 * An object detected inside an image.
 */
export interface ObjectHierarchy {
  /**
   * Label for the object.
   */
  object?: string;
  /**
   * Confidence score of having observed the object in the image, as a value ranging from 0 to 1.
   */
  confidence?: number;
  /**
   * The parent object, from a taxonomy perspective.
   * The parent object is a more generic form of this object.  For example, a 'bulldog' would have
   * a parent of 'dog'.
   */
  parent?: ObjectHierarchy;
}

/**
 * An object detected in an image.
 */
export interface DetectedObject {
  /**
   * Approximate location of the detected object.
   */
  readonly rectangle?: BoundingRect;
  /**
   * Label for the object.
   */
  object?: string;
  /**
   * Confidence score of having observed the object in the image, as a value ranging from 0 to 1.
   */
  confidence?: number;
  /**
   * The parent object, from a taxonomy perspective.
   * The parent object is a more generic form of this object.  For example, a 'bulldog' would have
   * a parent of 'dog'.
   */
  parent?: ObjectHierarchy;
}

/**
 * A brand detected in an image.
 */
export interface DetectedBrand {
  /**
   * Label for the brand.
   */
  readonly name?: string;
  /**
   * Confidence score of having observed the brand in the image, as a value ranging from 0 to 1.
   */
  readonly confidence?: number;
  /**
   * Approximate location of the detected brand.
   */
  readonly rectangle?: BoundingRect;
}

/**
 * Image metadata.
 */
export interface ImageMetadata {
  /**
   * Image width, in pixels.
   */
  width?: number;
  /**
   * Image height, in pixels.
   */
  height?: number;
  /**
   * Image format.
   */
  format?: string;
}

/**
 * Result of AnalyzeImage operation.
 */
export interface ImageAnalysis {
  /**
   * An array indicating identified categories.
   */
  categories?: Category[];
  /**
   * An object describing whether the image contains adult-oriented content and/or is racy.
   */
  adult?: AdultInfo;
  /**
   * An object providing additional metadata describing color attributes.
   */
  color?: ColorInfo;
  /**
   * An object providing possible image types and matching confidence levels.
   */
  imageType?: ImageType;
  /**
   * A list of tags with confidence level.
   */
  tags?: ImageTag[];
  /**
   * A collection of content tags, along with a list of captions sorted by confidence level, and
   * image metadata.
   */
  description?: ImageDescriptionDetails;
  /**
   * An array of possible faces within the image.
   */
  faces?: FaceDescription[];
  /**
   * Array of objects describing what was detected in the image.
   */
  objects?: DetectedObject[];
  /**
   * Array of brands detected in the image.
   */
  brands?: DetectedBrand[];
  /**
   * Id of the REST API request.
   */
  requestId?: string;
  metadata?: ImageMetadata;
}

/**
 * A collection of content tags, along with a list of captions sorted by confidence level, and
 * image metadata.
*/
export interface ImageDescription {
  /**
   * A collection of image tags.
  */
  tags?: string[];
  /**
   * A list of captions, sorted by confidence level.
  */
  captions?: ImageCaption[];
  /**
   * Id of the REST API request.
  */
  requestId?: string;
  metadata?: ImageMetadata;
}

/**
 * Result of a DetectImage call.
*/
export interface DetectResult {
  /**
   * An array of detected objects.
  */
  readonly objects?: DetectedObject[];
  /**
   * Id of the REST API request.
  */
  requestId?: string;
  metadata?: ImageMetadata;
}

/**
 * An object describing supported model by name and categories.
*/
export interface ModelDescription {
  /**
   * The name of the model.
  */
  name?: string;
  /**
   * Categories of the model.
  */
  categories?: string[];
}

/**
 * Result of the List Domain Models operation.
*/
export interface ListModelsResult {
  /**
   * An array of supported models.
  */
  readonly modelsProperty?: ModelDescription[];
}

/**
 * Result of image analysis using a specific domain model including additional metadata.
*/
export interface DomainModelResults {
  /**
   * Model-specific response.
  */
  result?: any;
  /**
   * Id of the REST API request.
  */
  requestId?: string;
  metadata?: ImageMetadata;
}

/**
 * Information on a recognized word.
*/
export interface OcrWord {
  /**
   * Bounding box of a recognized word. The four integers represent the x-coordinate of the left
   * edge, the y-coordinate of the top edge, width, and height of the bounding box, in the
   * coordinate system of the input image, after it has been rotated around its center according to
   * the detected text angle (see textAngle property), with the origin at the top-left corner, and
   * the y-axis pointing down.
  */
  boundingBox?: string;
  /**
   * String value of a recognized word.
  */
  text?: string;
}

/**
 * An object describing a single recognized line of text.
*/
export interface OcrLine {
  /**
   * Bounding box of a recognized line. The four integers represent the x-coordinate of the left
   * edge, the y-coordinate of the top edge, width, and height of the bounding box, in the
   * coordinate system of the input image, after it has been rotated around its center according to
   * the detected text angle (see textAngle property), with the origin at the top-left corner, and
   * the y-axis pointing down.
  */
  boundingBox?: string;
  /**
   * An array of objects, where each object represents a recognized word.
  */
  words?: OcrWord[];
}

/**
 * A region consists of multiple lines (e.g. a column of text in a multi-column document).
*/
export interface OcrRegion {
  /**
   * Bounding box of a recognized region. The four integers represent the x-coordinate of the left
   * edge, the y-coordinate of the top edge, width, and height of the bounding box, in the
   * coordinate system of the input image, after it has been rotated around its center according to
   * the detected text angle (see textAngle property), with the origin at the top-left corner, and
   * the y-axis pointing down.
  */
  boundingBox?: string;
  /**
   * An array of recognized lines of text.
  */
  lines?: OcrLine[];
}

export interface OcrResult {
  /**
   * The BCP-47 language code of the text in the image.
  */
  language?: string;
  /**
   * The angle, in degrees, of the detected text with respect to the closest horizontal or vertical
   * direction. After rotating the input image clockwise by this angle, the recognized text lines
   * become horizontal or vertical. In combination with the orientation property it can be used to
   * overlay recognition results correctly on the original image, by rotating either the original
   * image or recognition results by a suitable angle around the center of the original image. If
   * the angle cannot be confidently detected, this property is not present. If the image contains
   * text at different angles, only part of the text will be recognized correctly.
  */
  textAngle?: number;
  /**
   * Orientation of the text recognized in the image. The value (up, down, left, or right) refers
   * to the direction that the top of the recognized text is facing, after the image has been
   * rotated around its center according to the detected text angle (see textAngle property).
  */
  orientation?: string;
  /**
   * An array of objects, where each object represents a region of recognized text.
  */
  regions?: OcrRegion[];
}

/**
 * The results of a image tag operation, including any tags and image metadata.
*/
export interface TagResult {
  /**
   * A list of tags with confidence level.
  */
  tags?: ImageTag[];
  /**
   * Id of the REST API request.
  */
  requestId?: string;
  metadata?: ImageMetadata;
}

/**
 * Result of AreaOfInterest operation.
*/
export interface AreaOfInterestResult {
  /**
   * A bounding box for an area of interest inside an image.
  */
  readonly areaOfInterest?: BoundingRect;
  /**
   * Id of the REST API request.
  */
  requestId?: string;
  metadata?: ImageMetadata;
}

export interface ImageUrl {
  /**
   * Publicly reachable URL of an image.
  */
  url: string;
}

/**
 * Details about the API request error.
*/
export interface ComputerVisionError {
  /**
   * The error code.
  */
  code: any;
  /**
   * A message explaining the error reported by the service.
  */
  message: string;
  /**
   * A unique request identifier.
  */
  requestId?: string;
}

/**
 * Result of domain-specific classifications for the domain of landmarks.
*/
export interface LandmarkResults {
  /**
   * List of landmarks recognized in the image.
  */
  landmarks?: LandmarksModel[];
  /**
   * Id of the REST API request.
  */
  requestId?: string;
  metadata?: ImageMetadata;
}

/**
 * Result of domain-specific classifications for the domain of celebrities.
*/
export interface CelebrityResults {
  /**
   * List of celebrities recognized in the image.
  */
  celebrities?: CelebritiesModel[];
  /**
   * Id of the REST API request.
  */
  requestId?: string;
  metadata?: ImageMetadata;
}

/**
 * Json object representing a recognized word.
*/
export interface Word {
  /**
   * Bounding box of a recognized word.
  */
  boundingBox: number[];
  /**
   * The text content of the word.
  */
  text: string;
  /**
   * Qualitative confidence measure. Possible values include: 'High', 'Low'
  */
  confidence?: string;
}

/**
 * Json object representing a recognized text line.
*/
export interface Line {
  /**
   * Bounding box of a recognized line.
  */
  boundingBox?: number[];
  /**
   * The text content of the line.
  */
  text?: string;
  /**
   * List of words in the text line.
  */
  words?: Word[];
}

/**
 * Json object representing a recognized text region
*/
export interface TextRecognitionResult {
  /**
   * The 1-based page number of the recognition result.
  */
  page?: number;
  /**
   * The orientation of the image in degrees in the clockwise direction. Range between [0, 360).
  */
  clockwiseOrientation?: number;
  /**
   * The width of the image in pixels or the PDF in inches.
  */
  width?: number;
  /**
   * The height of the image in pixels or the PDF in inches.
  */
  height?: number;
  /**
   * The unit used in the Width, Height and BoundingBox. For images, the unit is "pixel". For PDF,
   * the unit is "inch". Possible values include: 'pixel', 'inch'
  */
  unit?: string;
  /**
   * A list of recognized text lines.
  */
  lines: Line[];
}

/**
 * Result of recognition text operation.
*/
export interface TextOperationResult {
  /**
   * Status of the text operation. Possible values include: 'Not Started', 'Running', 'Failed',
   * 'Succeeded'
  */
  status?: string;
  /**
   * Text recognition result of the text operation.
  */
  recognitionResult?: TextRecognitionResult;
}

/**
 * OCR result of the read operation.
*/
export interface ReadOperationResult {
  /**
   * Status of the read operation. Possible values include: 'Not Started', 'Running', 'Failed',
   * 'Succeeded'
  */
  status?: string;
  /**
   * A array of text recognition result of the read operation.
  */
  recognitionResults?: TextRecognitionResult[];
}
