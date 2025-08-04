import { DeepPartial, PartiallyConstructible } from "../common";
import { RawImage } from "../common";
/**
Type of the scanner internally to scan the license plate.

- `CLASSIC`:
   Classic scanning strategy.
- `ML`:
   ML-based scanning strategy.
*/
export type LicensePlateScannerStrategy = "CLASSIC" | "ML";
export declare const LicensePlateScannerStrategyValues: LicensePlateScannerStrategy[];
/**
Configuration for the license plate scanner.
*/
export declare class LicensePlateScannerConfiguration extends PartiallyConstructible {
    /**
    Maximum number of accumulated frames to inspect before actual result is returned.
    @defaultValue 3;
    */
    maximumNumberOfAccumulatedFrames: number;
    /**
    Minimum number of accumulated frames that have equal result.
    @defaultValue 2;
    */
    minimumNumberOfRequiredFramesWithEqualScanningResult: number;
    /**
    Strategy to use for scanning.
    @defaultValue "ML";
    */
    scannerStrategy: LicensePlateScannerStrategy;
    /** @param source {@displayType `DeepPartial<LicensePlateScannerConfiguration>`} */
    constructor(source?: DeepPartial<LicensePlateScannerConfiguration>);
}
/**
The result of the license plate scanning.
*/
export declare class LicensePlateScannerResult extends PartiallyConstructible {
    /**
    Country code
    */
    readonly countryCode: string;
    /**
    License plate
    */
    readonly licensePlate: string;
    /**
    Raw recognized string
    */
    readonly rawText: string;
    /**
    Recognition confidence.
    @defaultValue 0.0;
    */
    readonly confidence: number;
    /**
    Text validation result.
    @defaultValue false;
    */
    readonly validationSuccessful: boolean;
    /**
    The part of the image on which the plate was detected.
    @defaultValue null;
    */
    readonly croppedImage: RawImage | null;
    /** @param source {@displayType `DeepPartial<LicensePlateScannerResult>`} */
    constructor(source?: DeepPartial<LicensePlateScannerResult>);
}
