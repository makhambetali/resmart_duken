import { AustraliaPostCustomerFormat } from "../BarcodeConfigurationTypes";
import { BarcodeDocumentFormat } from "../BarcodeDocumentTypes";
import { BarcodeFormat } from "../BarcodeTypes";
import { BarcodeScannerEngineMode } from "../BarcodeScannerTypes";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { Gs1Handling } from "../BarcodeTypes";
import { MsiPlesseyChecksumAlgorithm } from "../BarcodeConfigurationTypes";
/**
Filter for extended EAN and UPC barcodes.

- `NO_FILTER`:
   EAN and UPC codes are not filtered. Both are returned regardless if they have an extension or not.
- `ONLY_WITH_EXTENSIONS`:
   Only EAN and UPC codes with extensions are returned.
- `ONLY_WITHOUT_EXTENSIONS`:
   Only EAN and UPC codes without extensions are returned.
*/
export type BarcodesExtensionFilter = "NO_FILTER" | "ONLY_WITH_EXTENSIONS" | "ONLY_WITHOUT_EXTENSIONS";
export declare const BarcodesExtensionFilterValues: BarcodesExtensionFilter[];
/**
Configuration of the scanning behavior.
*/
export declare class BarcodeScannerConfiguration extends PartiallyConstructible {
    /**
      List of document formats to be extracted.
      
      Defaults to all document formats.
      @defaultValue ["AAMVA", "BOARDING_PASS", "DE_MEDICAL_PLAN", "MEDICAL_CERTIFICATE", "ID_CARD_PDF_417", "SEPA", "SWISS_QR", "VCARD", "GS1", "HIBC"];
      */
    extractedDocumentFormats: BarcodeDocumentFormat[];
    /**
      Filter for extended EAN and UPC barcodes.
      @defaultValue "NO_FILTER";
      */
    barcodesExtensionFilter: BarcodesExtensionFilter;
    /**
      Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off). This option overrides `barcodesExtensionFilter` option.
      @defaultValue "";
      */
    barcodesRegexFilter: string;
    /**
      Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1). Barcodes with a sizeScore less than this value will not be scanned. When set to 0, barcodes are returned no matter what their size is.
      @defaultValue 0.0;
      */
    minimumSizeScore: number;
    /**
      Optional minimum required text length of the detected barcode. The default is 0 (setting is turned off). NOTE - This feature works on ITF barcodes only.
      @defaultValue 0;
      */
    minimumTextLength: number;
    /**
      Optional maximum text length of the detected barcode. The default is 0 (setting is turned off). NOTE - This feature works on ITF barcodes only.
      @defaultValue 0;
      */
    maximumTextLength: number;
    /**
      Optional minimum required quiet zone on the barcode. Measured in modules (the smallest bar size on a barcode). The default is 10. NOTE - This feature works on ITF barcodes only.
      @defaultValue 10;
      */
    minimum1DBarcodesQuietZone: number;
    /**
      If `true`, check digits for UPC, EAN and MSI Plessey codes are removed from the result. Has no effect if both single and double digit MSI Plessey checksums are enabled. The default is `false`.
      @defaultValue false;
      */
    stripCheckDigits: boolean;
    /**
      If `true`, the optional check digit for IATA_2_OF_5 codes is used in validation. The default is `true`.
      @defaultValue true;
      */
    useIATA2OF5Checksum: boolean;
    /**
      If `true`, the optional check digit for CODE_11 codes is used in validation. The default is `true`.
      @defaultValue true;
      */
    useCode11Checksum: boolean;
    /**
      List of accepted barcode symbologies.
      
      Defaults to common types.
      @defaultValue ["AZTEC", "CODABAR", "CODE_39", "CODE_93", "CODE_128", "DATA_MATRIX", "DATABAR", "DATABAR_EXPANDED", "DATABAR_LIMITED", "EAN_13", "EAN_8", "ITF", "MICRO_QR_CODE", "PDF_417", "QR_CODE", "UPC_A", "UPC_E"];
      */
    barcodeFormats: BarcodeFormat[];
    /**
      Checksum algorithm used for MSI Plessey barcodes. The default value is MOD_10.
      @defaultValue "MOD_10";
      */
    msiPlesseyChecksumAlgorithm: MsiPlesseyChecksumAlgorithm;
    /**
      The customer format used in AUSTRALIA_POST codes. The default value is ALPHA_NUMERIC.
      @defaultValue "ALPHA_NUMERIC";
      */
    australiaPostCustomerFormat: AustraliaPostCustomerFormat;
    /**
      The expected way of handling GS1_COMPOSITE barcodes.
      @defaultValue "PARSE";
      */
    gs1Handling: Gs1Handling;
    /**
      The engine mode to use for barcode scanning.
      @defaultValue "NEXT_GEN_LOW_POWER";
      */
    engineMode: BarcodeScannerEngineMode;
    /**
      Maximum resolution of the image processed by the barcode recognizer. Smaller values mean faster processing but lower recognition quality. The value is limited by the resolution of the preview.
      @defaultValue 600;
      */
    maximumRecognizerResolution: number;
    /** @param source {@displayType `DeepPartial<BarcodeScannerConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeScannerConfiguration>);
}
