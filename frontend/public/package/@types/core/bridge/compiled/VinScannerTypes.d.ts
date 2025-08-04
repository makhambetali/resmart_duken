import { DeepPartial, PartiallyConstructible } from "../common";
import { Point } from "../common";
import { TextPatternScannerResult } from "./TextPatternScannerTypes";
/**
Status of the barcode extraction.

- `SUCCESS`:
   Barcode containing a VIN was successfully extracted.
- `BARCODE_WITHOUT_VIN`:
   Barcode was found but it does not contain a VIN.
- `NO_BARCODE_FOUND`:
   No barcode was found in the image.
- `BARCODE_EXTRACTION_DISABLED`:
   Barcode extraction is disabled in the configuration.
*/
export type VinBarcodeExtractionStatus = "SUCCESS" | "BARCODE_WITHOUT_VIN" | "NO_BARCODE_FOUND" | "BARCODE_EXTRACTION_DISABLED";
export declare const VinBarcodeExtractionStatusValues: VinBarcodeExtractionStatus[];
/**
Result of the barcode scanner.
*/
export declare class VinBarcodeResult extends PartiallyConstructible {
    /**
    Text result of the barcode scanner
    */
    readonly extractedVIN: string;
    /**
    Rectangle of the barcode in the image
    */
    readonly rectangle: Point[];
    /**
    Status of the barcode extraction
    */
    readonly status: VinBarcodeExtractionStatus;
    /** @param source {@displayType `DeepPartial<VinBarcodeResult>`} */
    constructor(source?: DeepPartial<VinBarcodeResult>);
}
/**
Result of the VIN scanner.
*/
export declare class VinScannerResult extends PartiallyConstructible {
    /**
    Text result of the VIN scanner
    */
    readonly textResult: TextPatternScannerResult;
    /**
    Barcode result of the VIN scanner
    */
    readonly barcodeResult: VinBarcodeResult;
    /** @param source {@displayType `DeepPartial<VinScannerResult>`} */
    constructor(source?: DeepPartial<VinScannerResult>);
}
/**
Configuration for the VIN scanner.
*/
export declare class VinScannerConfiguration extends PartiallyConstructible {
    /**
    If true, the VIN scanner will also extract VINs from barcodes.
    Requires a license that allows barcode scanning in addition to VIN scanning.
    @defaultValue false;
    */
    extractVINFromBarcode: boolean;
    /**
    Maximum image side (height or width) for OCR process. 0 - do not rescale.
    @defaultValue 0;
    */
    ocrResolutionLimit: number;
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
    /** @param source {@displayType `DeepPartial<VinScannerConfiguration>`} */
    constructor(source?: DeepPartial<VinScannerConfiguration>);
}
