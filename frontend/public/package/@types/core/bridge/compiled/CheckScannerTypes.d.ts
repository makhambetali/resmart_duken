import { DeepPartial, PartiallyConstructible } from "../common";
import { DocumentDetectionResult } from "./DocumentScannerTypes";
import { GenericDocument } from "./GenericDocument";
import { RawImage } from "../common";
/**
Check document detection and extraction mode.

- `DISABLED`:
   Document detection is not performed. Successful check scans will only contain the machine-readable check data without a full crop of the check.
- `DETECT_DOCUMENT`:
   Document scanner will be used to locate the complete check in the input image. The documentDetectionResult field in the result will contain the result of document detection.
- `DETECT_AND_CROP_DOCUMENT`:
   Document scanner will be used to locate the complete check in the input image. The documentDetectionResult result field will contain the result of document detection. The croppedImage result field will contain a crop of the entire check.
*/
export type CheckDocumentDetectionMode = "DISABLED" | "DETECT_DOCUMENT" | "DETECT_AND_CROP_DOCUMENT";
export declare const CheckDocumentDetectionModeValues: CheckDocumentDetectionMode[];
/**
Check Scanning Status.

- `SUCCESS`:
   Scanning successful.
- `VALIDATION_FAILED`:
   A check was recognized, but validation failed, indication a standard violation, unsupported standard, or scanner error.
- `FAIL`:
   No check was recognized.
*/
export type CheckRecognitionStatus = "SUCCESS" | "VALIDATION_FAILED" | "FAIL";
export declare const CheckRecognitionStatusValues: CheckRecognitionStatus[];
/**
The result of check scanning.
*/
export declare class CheckScanningResult extends PartiallyConstructible {
    /**
    Check recognition status.
    @defaultValue "FAIL";
    */
    readonly status: CheckRecognitionStatus;
    /**
    Generic document containing check data. Not present, if status is FAIL.
    */
    readonly check: GenericDocument | null;
    /**
    The result of document detection. Will be set only if detectDocument in the configuration is set to true. Check scanning may still succeed even if the whole document is not visible in the input image and the complete document could not be located.
    */
    readonly documentDetectionResult: DocumentDetectionResult | null;
    /**
    Crop of the check if documentDetectionMode is set to DETECT_AND_CROP_DOCUMENT. Will be non-empty, only if check recognition succeeded.
    */
    readonly croppedImage: RawImage | null;
    /** @param source {@displayType `DeepPartial<CheckScanningResult>`} */
    constructor(source?: DeepPartial<CheckScanningResult>);
}
/**
Configuration of the check scanner.
*/
export declare class CheckScannerConfiguration extends PartiallyConstructible {
    /**
    Document detection to be performed in addition to scanning the machine-readable data in the check.
    
    By default only the machine-readable data is extracted during check scanning. Optionally, the coordinates and a crop of the entire check document can be returned, in addition to the check data.
    A check scan result may still be successful even if the whole document is not visible in the input image and the complete document could not be located.
    @defaultValue "DISABLED";
    */
    readonly documentDetectionMode: CheckDocumentDetectionMode;
    /** @param source {@displayType `DeepPartial<CheckScannerConfiguration>`} */
    constructor(source?: DeepPartial<CheckScannerConfiguration>);
}
