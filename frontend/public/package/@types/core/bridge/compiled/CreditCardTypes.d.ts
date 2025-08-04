import { DeepPartial, PartiallyConstructible } from "../common";
import { DocumentDetectionStatus } from "./DocumentScannerTypes";
import { GenericDocument } from "./GenericDocument";
import { Point } from "../common";
import { ResultAccumulationConfiguration } from "./FrameAccumulationTypes";
/**
The status of the scanning process.

- `SUCCESS`:
   The credit card was scanned successfully.
- `ERROR_NOTHING_FOUND`:
   No credit card was detected.
- `INCOMPLETE`:
   Not all required fields were found or confirmed.
*/
export type CreditCardScanningStatus = "SUCCESS" | "ERROR_NOTHING_FOUND" | "INCOMPLETE";
export declare const CreditCardScanningStatusValues: CreditCardScanningStatus[];
/**
Contains the result of running the credit card scanner.
*/
export declare class CreditCardScanningResult extends PartiallyConstructible {
    /**
    The status of the credit card detection step
    */
    readonly detectionStatus: DocumentDetectionStatus;
    /**
    The status of the credit card scanning step
    */
    readonly scanningStatus: CreditCardScanningStatus;
    /**
    Generic document containing credit card data. Not present, if status is FAIL.
    */
    readonly creditCard: GenericDocument | null;
    /**
    Coordinates of the detected credit card in the input image (clockwise from top-left)
    */
    readonly quad: Point[];
    /**
    Coordinates of the detected credit card in the input image (clockwise from top-left), normalized to the range [0, 1].
    */
    readonly quadNormalized: Point[];
    /** @param source {@displayType `DeepPartial<CreditCardScanningResult>`} */
    constructor(source?: DeepPartial<CreditCardScanningResult>);
}
/**
The scanning mode.

- `LIVE`:
   The scanner will merge all information from multiple frames to provide the best possible result.
   Use this mode when the input is a video or camera stream.
- `SINGLE_SHOT`:
   The scanner will only use the current frame and will spend additional time to ensure the best possible result. Use this mode when scanning single images, e.g. imported from the gallery.
*/
export type CreditCardScanningMode = "LIVE" | "SINGLE_SHOT";
export declare const CreditCardScanningModeValues: CreditCardScanningMode[];
/**
Configuration for the credit card scanner.
*/
export declare class CreditCardScannerConfiguration extends PartiallyConstructible {
    /**
    If true, the document detector will be used to find where the credit card is in the input image.
    If false, the scanner will assume that the credit card has been pre-cropped and takes the entirety of the input image.
    @defaultValue true;
    */
    useDocumentDetector: boolean;
    /**
    The scanning mode.
    @defaultValue "LIVE";
    */
    scanningMode: CreditCardScanningMode;
    /**
    Whether the expiry date is required for a successful scanning.
    @defaultValue true;
    */
    requireExpiryDate: boolean;
    /**
    Whether the cardholder name is required for a successful scanning.
    @defaultValue true;
    */
    requireCardholderName: boolean;
    /**
    Configuration for how to accumulate results.
    @defaultValue new ResultAccumulationConfiguration({});
    */
    resultAccumulationConfig: ResultAccumulationConfiguration;
    /** @param source {@displayType `DeepPartial<CreditCardScannerConfiguration>`} */
    constructor(source?: DeepPartial<CreditCardScannerConfiguration>);
}
