import { AspectRatio } from "./Geometry";
import { DeepPartial, PartiallyConstructible } from "../common";
import { LineSegmentFloat } from "./Geometry";
import { LineSegmentInt } from "./Geometry";
import { Point } from "../common";
/**
Engines for document scanning.

- `ML`:
   Use the ML document scanner.
- `LEGACY`:
   Use the legacy edge-based document scanner.
*/
export type DocumentScannerEngineMode = "ML" | "LEGACY";
export declare const DocumentScannerEngineModeValues: DocumentScannerEngineMode[];
/**
Parameters for the document scanner.
*/
export declare class DocumentScannerParameters extends PartiallyConstructible {
    /**
    If true, the document scanner will return only the best document contour.
    If false, the document scanner will additionally return alternative document contours suitable for the cropping screen.
    @defaultValue false;
    */
    isLive: boolean;
    /**
    The minimum score in percent (0 - 100) of the perspective distortion to accept a detected document.
    Set lower values to accept more perspective distortion.
    
    Warning: Lower values result in more blurred document images.
    @defaultValue 75.0;
    */
    acceptedAngleScore: number;
    /**
    The minimum size in percent (0 - 100) of the screen size to accept a detected document.
    It is sufficient that height or width match the score.
    
    Warning: Lower values result in low resolution document images.
    @defaultValue 80.0;
    */
    acceptedSizeScore: number;
    /**
    The minimum brightness value (0-255) to accept a detected document.
    @defaultValue 0;
    */
    acceptedBrightnessThreshold: number;
    /**
    The minimum score in percent (0 - 100) that the aspect ratio of the document
    must match one of the required aspect ratios (if any) to accept a detected document.
    If acceptedAspectRatioScore is more than 0, then the document is only accepted if the aspect ratio
    matches one of the given aspect ratios (if any), otherwise OK_BUT_BAD_ASPECT_RATIO is returned.
    @defaultValue 85.0;
    */
    acceptedAspectRatioScore: number;
    /**
    The possible desired aspect ratios for the detected document.
    A document matches if its aspect ratio matches any of the given aspect ratios.
    If acceptedAspectRatioScore is more than 0, then the document is only accepted if the aspect ratio
    matches one of the given aspect ratios, otherwise OK_BUT_BAD_ASPECT_RATIO is returned.
    If empty, no aspect ratio is preferred.
    @defaultValue [];
    */
    aspectRatios: AspectRatio[];
    /**
    If false, the document scanner will return OK_BUT_ORIENTATION_MISMATCH if the
    detected document orientation does not match the input image orientation,
    e.g. if the document is detected as landscape but the input image is portrait.
    If true, the document scanner will ignore orientation mismatches.
    @defaultValue false;
    */
    ignoreOrientationMismatch: boolean;
    /** @param source {@displayType `DeepPartial<DocumentScannerParameters>`} */
    constructor(source?: DeepPartial<DocumentScannerParameters>);
}
/**
Configuration for the document scanner.
*/
export declare class DocumentScannerConfiguration extends PartiallyConstructible {
    /**
    The engine to use for document scanning.
    @defaultValue "ML";
    */
    engineMode: DocumentScannerEngineMode;
    /**
    Initial parameters for the document scanner.
    @defaultValue new DocumentScannerParameters({});
    */
    parameters: DocumentScannerParameters;
    /** @param source {@displayType `DeepPartial<DocumentScannerConfiguration>`} */
    constructor(source?: DeepPartial<DocumentScannerConfiguration>);
}
/**
Status of the document detection.

- `NOT_ACQUIRED`:
   Detection has not yet happened.
- `OK`:
   An acceptable document was detected.
- `OK_BUT_TOO_SMALL`:
   A document was detected, but it is too small.
- `OK_BUT_BAD_ANGLES`:
   A polygon was detected, but it has too much perspective distortion.
- `OK_BUT_BAD_ASPECT_RATIO`:
   A document was detected, but its aspect ratio is not acceptable.
- `OK_BUT_ORIENTATION_MISMATCH`:
   A document was detected, but its orientation does not match the input image orientation.
- `OK_BUT_OFF_CENTER`:
   A document was detected, but its center is too far away from the input image center.
- `OK_BUT_TOO_DARK`:
   A document was detected, but it is too dark.
- `ERROR_NOTHING_DETECTED`:
   No document was detected.
- `ERROR_TOO_DARK`:
   No document was detected, likely because the input image is too dark.
- `ERROR_TOO_NOISY`:
   No document was detected, likely because the input image is too noisy or has a complex background.
*/
export type DocumentDetectionStatus = "NOT_ACQUIRED" | "OK" | "OK_BUT_TOO_SMALL" | "OK_BUT_BAD_ANGLES" | "OK_BUT_BAD_ASPECT_RATIO" | "OK_BUT_ORIENTATION_MISMATCH" | "OK_BUT_OFF_CENTER" | "OK_BUT_TOO_DARK" | "ERROR_NOTHING_DETECTED" | "ERROR_TOO_DARK" | "ERROR_TOO_NOISY";
export declare const DocumentDetectionStatusValues: DocumentDetectionStatus[];
/**
The total and partial scores for the detected document contour.
*/
export declare class DocumentDetectionScores extends PartiallyConstructible {
    /**
    Weighted sum of all partial scores
    */
    readonly totalScore: number;
    /**
    100 points, if the center of the contour is exactly in the image center
    */
    readonly distanceScore: number;
    /**
    100 points, if all angles are 90 degrees
    */
    readonly angleScore: number;
    /**
    100 points if the contour occupies at least 50% of the area of the image
    */
    readonly sizeScore: number;
    /**
    100 points, if the aspect ratio matches exactly one of the given aspect ratios
    */
    readonly aspectRatioScore: number;
    /**
    Percentage of the document contour that the edge detector was able to find (in LEGACY engine mode only)
    */
    readonly lineCoverageScore: number;
    /**
    Percentage of the image width taken by the detected document
    */
    readonly widthScore: number;
    /**
    Percentage of the image height taken by the detected document
    */
    readonly heightScore: number;
    /** @param source {@displayType `DeepPartial<DocumentDetectionScores>`} */
    constructor(source?: DeepPartial<DocumentDetectionScores>);
}
/**
Result of the document contour detection.
*/
export declare class DocumentDetectionResult extends PartiallyConstructible {
    /**
    Detection status.
    @defaultValue "NOT_ACQUIRED";
    */
    readonly status: DocumentDetectionStatus;
    /**
    The total and partial scores for the detected quad
    */
    readonly detectionScores: DocumentDetectionScores;
    /**
    Absolute coordinates of the detected document contour in image space
    sorted in clockwise order, starting from the top left corner
    */
    readonly points: Point[];
    /**
    All detected horizontal lines in image space
    */
    readonly horizontalLines: LineSegmentInt[];
    /**
    All detected vertical lines in image space
    */
    readonly verticalLines: LineSegmentInt[];
    /**
    Normalized coordinates of the detected document contour in image space
    sorted in clockwise order, starting from the top left corner
    */
    readonly pointsNormalized: Point[];
    /**
    Normalized horizontal lines in image space
    */
    readonly horizontalLinesNormalized: LineSegmentFloat[];
    /**
    Normalized vertical lines in image space
    */
    readonly verticalLinesNormalized: LineSegmentFloat[];
    /**
    Aspect ratio of the detected document contour
    */
    readonly aspectRatio: number;
    /**
    Average brightness, calculated as the average
    of the Value channel in the HSV color space of:
    - the whole image, if no document was detected
    - the document crop, if a document was detected
    Ranges from 0 to 255.
    @defaultValue 0;
    */
    readonly averageBrightness: number;
    /** @param source {@displayType `DeepPartial<DocumentDetectionResult>`} */
    constructor(source?: DeepPartial<DocumentDetectionResult>);
}
