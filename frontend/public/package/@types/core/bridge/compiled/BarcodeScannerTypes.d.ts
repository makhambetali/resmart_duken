import { BarcodeDocumentFormat } from "./BarcodeDocumentTypes";
import { BarcodeFormatConfigurationBase } from "./BarcodeConfigurationTypes";
import { BarcodeFormat } from "./BarcodeTypes";
import { DeepPartial, PartiallyConstructible } from "../common";
import { GenericDocument } from "./GenericDocument";
import { Point } from "../common";
import { RawImage } from "../common";
/**
A single barcode found in the input image. Barcodes with the same content but different locations in the image are considered separate barcodes.
*/
export declare class BarcodeItem extends PartiallyConstructible {
    /**
    Text contained in the barcode. Binary data is returned in the rawBytes field only.
    */
    readonly text: string;
    /**
    Barcode format.
    @defaultValue "NONE";
    */
    readonly format: BarcodeFormat;
    /**
    The four corners of the barcode in the input image, in clockwise order starting from the top left, in image coordinates.
    */
    readonly quad: Point[];
    /**
    The four corners of the barcode in the input image, in clockwise order starting from the top left, normalized to the range [0, 1].
    */
    readonly quadNormalized: Point[];
    /**
    True if this is a 1D barcode that is printed upside-down, that is, the barcode was scanned right-to-left.
    @defaultValue false;
    */
    readonly isUpsideDown: boolean;
    /**
    A crop from the input image containing the barcode.
    @defaultValue null;
    */
    readonly sourceImage: RawImage | null;
    /**
    Raw bytes of barcode contents. Some formats can contain binary data, which is returned in this field.
    */
    readonly rawBytes: Uint8Array;
    /**
    If this is a UPC/EAN barcode that has an EAN-2 or EAN-5 extension, this field contains the extension value. Requires the UPC_EAN_EXTENSION format to be enabled in the decoding options.
    */
    readonly upcEanExtension: string;
    /**
    True if the barcode contains a GS1 message. Requires GS1 handling to be enabled in the decoding option.
    @defaultValue false;
    */
    readonly isGS1Message: boolean;
    /**
    True if this result is the 2D part of a GS1 Composite barcode.
    Can only happen if GS1_COMPOSITE scanning is disabled and a part of the composite (1D) or (2D) is scanned separately.
    When GS1_COMPOSITE scanning is enabled, parts of the composite barcode are never returned separately, even if their respective
    format is enabled in the decoding options.
    @defaultValue false;
    */
    readonly isGS1CompositePart: boolean;
    /**
    The number of 1D stacks in the barcode. Applies only to DATABAR and DATABAR_EXPANDED barcodes.
    @defaultValue 1;
    */
    readonly dataBarStackSize: number;
    /**
    The size score is a floating point value between 0 and 1 that represents the relative size of the barcode in the input image.
    Barcodes taking up a small portion of the input image will have a score close to 0, while barcodes that take a large portion will have a score close to 1.
    @defaultValue 0.0;
    */
    readonly sizeScore: number;
    /**
    The parsed known document format (if parsed successfully).
    */
    readonly extractedDocument: GenericDocument | null;
    /** @param source {@displayType `DeepPartial<BarcodeItem>`} */
    constructor(source?: DeepPartial<BarcodeItem>);
}
/**
The engine mode for barcode scanning.

- `LEGACY`:
   Legacy mode. Very fast, significantly less accurate. Doesn't support all barcode types.
- `NEXT_GEN_LOW_POWER`:
   A faster version of the main engine mode, for use with low-power devices.
- `NEXT_GEN`:
   Main engine mode for high-power devices. Supports all barcodes types.
- `NEXT_GEN_LOW_POWER_AR`:
   Similar to NEXT_GEN_LOW_POWER, but optimized for AR.
- `NEXT_GEN_AR`:
   Similar to NEXT_GEN, but optimized for AR.
*/
export type BarcodeScannerEngineMode = "LEGACY" | "NEXT_GEN_LOW_POWER" | "NEXT_GEN" | "NEXT_GEN_LOW_POWER_AR" | "NEXT_GEN_AR";
export declare const BarcodeScannerEngineModeValues: BarcodeScannerEngineMode[];
/**
Configuration for the barcode scanner.
*/
export declare class BarcodeScannerConfiguration extends PartiallyConstructible {
    /**
    Options for barcode decoding.
    @defaultValue [new BarcodeFormatCommonConfiguration({})];
    */
    barcodeFormatConfigurations: BarcodeFormatConfigurationBase[];
    /**
    List of document formats to be extracted.
    Barcodes that decode to one of the extracted document formats will have extractedDocument field in BarcodeItem populated with the parsed document.
    By default all supported barcode document formats are accepted.
    If empty, no barcodes will be parsed into documents.
    @defaultValue ["AAMVA", "BOARDING_PASS", "DE_MEDICAL_PLAN", "MEDICAL_CERTIFICATE", "ID_CARD_PDF_417", "SEPA", "SWISS_QR", "VCARD", "GS1", "HIBC"];
    */
    extractedDocumentFormats: BarcodeDocumentFormat[];
    /**
    If true and acceptedDocumentFormats is not empty, then barcodes that don't decode to one of the accepted document formats will be ignored.
    @defaultValue false;
    */
    onlyAcceptDocuments: boolean;
    /**
    If true, the barcode image will be returned in the BarcodeItem.
    @defaultValue true;
    */
    returnBarcodeImage: boolean;
    /**
    The engine mode for barcode scanning.
    @defaultValue "NEXT_GEN_LOW_POWER";
    */
    engineMode: BarcodeScannerEngineMode;
    /**
    If true, the barcode scanning will be performed in live mode.
    @defaultValue true;
    */
    live: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeScannerConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeScannerConfiguration>);
}
/**
The result of barcode scanning.
*/
export declare class BarcodeScannerResult extends PartiallyConstructible {
    /**
    List of found barcodes
    */
    readonly barcodes: BarcodeItem[];
    /**
    True if any barcodes were found
    */
    readonly success: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeScannerResult>`} */
    constructor(source?: DeepPartial<BarcodeScannerResult>);
}
