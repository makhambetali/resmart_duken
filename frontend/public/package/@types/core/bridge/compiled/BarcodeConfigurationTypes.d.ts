import { BarcodeFormat } from "./BarcodeTypes";
import { DeepPartial, PartiallyConstructible } from "../common";
import { Gs1Handling } from "./BarcodeTypes";
import { UpcEanExtensionBehavior } from "./BarcodeTypes";
/**
Base class for all barcode configurations.
*/
export type BarcodeFormatConfigurationBase = BarcodeFormatCodabarConfiguration | BarcodeFormatCode11Configuration | BarcodeFormatCode39Configuration | BarcodeFormatCode93Configuration | BarcodeFormatCode128Configuration | BarcodeFormatCode2Of5Configuration | BarcodeFormatDataBarConfiguration | BarcodeFormatDataBarExpandedConfiguration | BarcodeFormatDataBarLimitedConfiguration | BarcodeFormatItfConfiguration | BarcodeFormatMsiPlesseyConfiguration | BarcodeFormatUpcEanConfiguration | BarcodeFormatPharmaCodeConfiguration | BarcodeFormatAztecConfiguration | BarcodeFormatQrCodeConfiguration | BarcodeFormatPdf417Configuration | BarcodeFormatMicroPdf417Configuration | BarcodeFormatDataMatrixConfiguration | BarcodeFormatMaxiCodeConfiguration | BarcodeFormatAustraliaPostConfiguration | BarcodeFormatJapanPostConfiguration | BarcodeFormatRoyalMailConfiguration | BarcodeFormatRoyalTntPostConfiguration | BarcodeFormatUspsIntelligentMailConfiguration | BarcodeFormatPharmaCodeTwoTrackConfiguration | BarcodeFormatGs1CompositeConfiguration | BarcodeFormatCommonOneDConfiguration | BarcodeFormatCommonTwoDConfiguration | BarcodeFormatCommonFourStateConfiguration | BarcodeFormatCommonConfiguration;
/** @internal */
export declare namespace BarcodeFormatConfigurationBase {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): BarcodeFormatConfigurationBase;
}
/**
Base class for all linear (1D) barcode configurations.
*/
export type BarcodeFormatOneDConfigurationBase = BarcodeFormatCodabarConfiguration | BarcodeFormatCode11Configuration | BarcodeFormatCode39Configuration | BarcodeFormatCode93Configuration | BarcodeFormatCode128Configuration | BarcodeFormatCode2Of5Configuration | BarcodeFormatDataBarConfiguration | BarcodeFormatDataBarExpandedConfiguration | BarcodeFormatDataBarLimitedConfiguration | BarcodeFormatItfConfiguration | BarcodeFormatMsiPlesseyConfiguration | BarcodeFormatUpcEanConfiguration | BarcodeFormatPharmaCodeConfiguration;
/** @internal */
export declare namespace BarcodeFormatOneDConfigurationBase {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): BarcodeFormatOneDConfigurationBase;
}
/**
Codabar barcode configuration. Add to scanner configuration to scan Codabar barcodes.
*/
export declare class BarcodeFormatCodabarConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatCodabarConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    Minimum text length. Applied only to linear barcode formats that allow variable length.
    @defaultValue 1;
    */
    minimumTextLength: number;
    /**
    Maximum text length. 0 implies no maximum. Applied only to linear barcode formats that allow variable length.
    @defaultValue 0;
    */
    maximumTextLength: number;
    /**
    If true, return the start and end characters.
    @defaultValue false;
    */
    returnStartEnd: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatCodabarConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatCodabarConfiguration>);
}
/**
Code 11 barcode configuration. Add to scanner configuration to scan Code11 barcodes.
*/
export declare class BarcodeFormatCode11Configuration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatCode11Configuration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    If true, the check digits are stripped from the result.
    @defaultValue false;
    */
    stripCheckDigits: boolean;
    /**
    Minimum text length. Applied only to linear barcode formats that allow variable length.
    @defaultValue 1;
    */
    minimumTextLength: number;
    /**
    Maximum text length. 0 implies no maximum. Applied only to linear barcode formats that allow variable length.
    @defaultValue 0;
    */
    maximumTextLength: number;
    /**
    If true, return CODE_11 barcodes only if they have a valid checksum.
    @defaultValue true;
    */
    checksum: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatCode11Configuration>`} */
    constructor(source?: DeepPartial<BarcodeFormatCode11Configuration>);
}
/**
Code 39 barcode and derivatives configuration. Add to scanner configuration to scan Code 39, Code 32 (Italian Pharmacode), PZN7 and PZN8 (Pharmazentralnummer) barcodes.
*/
export declare class BarcodeFormatCode39Configuration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatCode39Configuration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    If true, the check digits are stripped from the result.
    @defaultValue false;
    */
    stripCheckDigits: boolean;
    /**
    Minimum text length. Applied only to linear barcode formats that allow variable length.
    @defaultValue 1;
    */
    minimumTextLength: number;
    /**
    Maximum text length. 0 implies no maximum. Applied only to linear barcode formats that allow variable length.
    @defaultValue 0;
    */
    maximumTextLength: number;
    /**
    If true, scan and return valid CODE_32 (Italian Pharmacode) barcodes. If false, CODE_32 barcodes are not decoded and are returned as CODE_39 instead.
    @defaultValue false;
    */
    code32: boolean;
    /**
    If true, scan CODE_39 barcodes.
    @defaultValue true;
    */
    code39: boolean;
    /**
    If true, scan PZN7 (legacy Pharmazentralnummer) barcodes. If false, PZN7 barcodes are not decoded and are returned as CODE_39 instead.
    @defaultValue true;
    */
    pzn7: boolean;
    /**
    If true, scan PZN8 (Pharmazentralnummer) barcodes. If false, PZN8 barcodes are not decoded and are returned as CODE_39 instead.
    @defaultValue true;
    */
    pzn8: boolean;
    /**
    If true, try to scan CODE_39 in extended mode.
    @defaultValue false;
    */
    tryCode39ExtendedMode: boolean;
    /**
    If true, return CODE_39 barcodes only if they have a valid check digit.
    @defaultValue false;
    */
    useCode39CheckDigit: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatCode39Configuration>`} */
    constructor(source?: DeepPartial<BarcodeFormatCode39Configuration>);
}
/**
Code 93 barcode configuration. Add to scanner configuration to scan Code 93 barcodes.
*/
export declare class BarcodeFormatCode93Configuration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatCode93Configuration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    Minimum text length. Applied only to linear barcode formats that allow variable length.
    @defaultValue 1;
    */
    minimumTextLength: number;
    /**
    Maximum text length. 0 implies no maximum. Applied only to linear barcode formats that allow variable length.
    @defaultValue 0;
    */
    maximumTextLength: number;
    /** @param source {@displayType `DeepPartial<BarcodeFormatCode93Configuration>`} */
    constructor(source?: DeepPartial<BarcodeFormatCode93Configuration>);
}
/**
Code 128 barcode configuration. Add to scanner configuration to scan Code 128 barcodes.
*/
export declare class BarcodeFormatCode128Configuration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatCode128Configuration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /**
    Minimum text length. Applied only to linear barcode formats that allow variable length.
    @defaultValue 1;
    */
    minimumTextLength: number;
    /**
    Maximum text length. 0 implies no maximum. Applied only to linear barcode formats that allow variable length.
    @defaultValue 0;
    */
    maximumTextLength: number;
    /** @param source {@displayType `DeepPartial<BarcodeFormatCode128Configuration>`} */
    constructor(source?: DeepPartial<BarcodeFormatCode128Configuration>);
}
/**
Configuration for all 2-of-5 barcode types (except Interleaved 2-of-5, which is handled by ItfConfig).
Add to scanner configuration to scan Code 25, IATA 2-of-5 and Industrial 2-of-5 barcodes.

Industrial 2-of-5 barcodes are a subset of Code 25 barcodes.
Any valid Industrial 2-of-5 barcode is also a valid Code 25 barcode.
*/
export declare class BarcodeFormatCode2Of5Configuration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatCode2Of5Configuration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    If true, the check digits are stripped from the result.
    @defaultValue false;
    */
    stripCheckDigits: boolean;
    /**
    Minimum text length. Applied only to linear barcode formats that allow variable length.
    @defaultValue 1;
    */
    minimumTextLength: number;
    /**
    Maximum text length. 0 implies no maximum. Applied only to linear barcode formats that allow variable length.
    @defaultValue 0;
    */
    maximumTextLength: number;
    /**
    If true, scan IATA 2-of-5 barcodes. If useIATA2OF5Checksum is true, only barcodes with a valid checksum are returned.
    @defaultValue true;
    */
    iata2of5: boolean;
    /**
    If true, scan and return Code 25 (Code 2-of-5) barcodes. If industrial2of5 is also true, then valid Industrial 2-of-5 barcodes will preferentially be returned as such, instead of Code 25.
    @defaultValue false;
    */
    code25: boolean;
    /**
    If true, scan and return valid Industrial 2-of-5 barcodes. If false, but code25 is true, Industrial 2-of-5 barcodes will be returned as Code 25 barcodes.
    @defaultValue true;
    */
    industrial2of5: boolean;
    /**
    If true, return IATA_2_OF_5 barcodes only if they have a valid check digit.
    @defaultValue true;
    */
    useIATA2OF5Checksum: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatCode2Of5Configuration>`} */
    constructor(source?: DeepPartial<BarcodeFormatCode2Of5Configuration>);
}
/**
GS1 DataBar barcode configuration. Add to scanner configuration to scan GS1 DataBar-14, GS1 DataBar-14 Truncated, GS1 DataBar-14 Stacked and GS1 DataBar-14 Stacked Omnidirectional barcodes.
*/
export declare class BarcodeFormatDataBarConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatDataBarConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /** @param source {@displayType `DeepPartial<BarcodeFormatDataBarConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatDataBarConfiguration>);
}
/**
GS1 DataBar Expanded barcode configuration. Add to scanner configuration to scan GS1 DataBar Expanded and GS1 DataBar Expanded Stacked barcodes.
*/
export declare class BarcodeFormatDataBarExpandedConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatDataBarExpandedConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /** @param source {@displayType `DeepPartial<BarcodeFormatDataBarExpandedConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatDataBarExpandedConfiguration>);
}
/**
GS1 DataBar Limited barcode configuration. Add to scanner configuration to scan GS1 DataBar Limited barcodes.
*/
export declare class BarcodeFormatDataBarLimitedConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatDataBarLimitedConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /** @param source {@displayType `DeepPartial<BarcodeFormatDataBarLimitedConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatDataBarLimitedConfiguration>);
}
/**
ITF (Interleaved 2-of-5) barcode configuration. Add to scanner configuration to scan Interleaved 2-of-5 (ITF) barcodes.
*/
export declare class BarcodeFormatItfConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatITFConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    Minimum text length. Applied only to linear barcode formats that allow variable length.
    @defaultValue 1;
    */
    minimumTextLength: number;
    /**
    Maximum text length. 0 implies no maximum. Applied only to linear barcode formats that allow variable length.
    @defaultValue 0;
    */
    maximumTextLength: number;
    /** @param source {@displayType `DeepPartial<BarcodeFormatItfConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatItfConfiguration>);
}
/**
Checksum algorithm for MSI_PLESSEY.

- `MOD_10`:
   Modulo 10.
- `MOD_11_IBM`:
   Modulo 11 IBM.
- `MOD_11_NCR`:
   Modulo 11 NCR.
- `MOD_10_10`:
   Modulo 1010.
- `MOD_11_10_IBM`:
   Modulo 1110 IBM.
- `MOD_11_10_NCR`:
   Modulo 1110 NCR.
*/
export type MsiPlesseyChecksumAlgorithm = "MOD_10" | "MOD_11_IBM" | "MOD_11_NCR" | "MOD_10_10" | "MOD_11_10_IBM" | "MOD_11_10_NCR";
export declare const MsiPlesseyChecksumAlgorithmValues: MsiPlesseyChecksumAlgorithm[];
/**
MSI Plessey barcode configuration. Add to scanner configuration to scan MSI Plessey barcodes.
*/
export declare class BarcodeFormatMsiPlesseyConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatMSIPlesseyConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    If true, the check digits are stripped from the result.
    @defaultValue false;
    */
    stripCheckDigits: boolean;
    /**
    Minimum text length. Applied only to linear barcode formats that allow variable length.
    @defaultValue 1;
    */
    minimumTextLength: number;
    /**
    Maximum text length. 0 implies no maximum. Applied only to linear barcode formats that allow variable length.
    @defaultValue 0;
    */
    maximumTextLength: number;
    /**
    List of MSI Plessey checksum algorithms to apply during scanning.
    A barcode is considered valid if it passes any of the checksum algorithms in the list.
    If the list is empty, no checksum validation is performed.
    @defaultValue ["MOD_10"];
    */
    checksumAlgorithms: MsiPlesseyChecksumAlgorithm[];
    /** @param source {@displayType `DeepPartial<BarcodeFormatMsiPlesseyConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatMsiPlesseyConfiguration>);
}
/**
UPC/EAN barcode configuration. Add to scanner configuration to scan EAN-8, EAN-13, UPC-E and UPC-A barcodes.
*/
export declare class BarcodeFormatUpcEanConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatUpcEanConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    If true, the check digits are stripped from the result.
    @defaultValue false;
    */
    stripCheckDigits: boolean;
    /**
    If true, scan and return valid EAN-8 barcodes.
    @defaultValue true;
    */
    ean8: boolean;
    /**
    If true, scan and return valid EAN-13 barcodes.
    @defaultValue true;
    */
    ean13: boolean;
    /**
    If true, scan and return valid UPC-A barcodes. If false, but ean13 is true, then UPC-A barcodes will be returned as EAN-13 barcodes.
    @defaultValue true;
    */
    upca: boolean;
    /**
    If true, scan and return valid UPC-E barcodes.
    @defaultValue true;
    */
    upce: boolean;
    /**
    Behavior when scanning UPC/EAN barcodes with EAN-2 or EAN-5 extensions.
    @defaultValue "ALLOW_ANY";
    */
    extensions: UpcEanExtensionBehavior;
    /** @param source {@displayType `DeepPartial<BarcodeFormatUpcEanConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatUpcEanConfiguration>);
}
/**
PharmaCode barcode configuration. Add to scanner configuration to scan linear (1D) Laetus Pharmacode barcodes. Two-track PharmaCode scanning is configured separately through the PharmaCodeTwoTrackConfig class.
*/
export declare class BarcodeFormatPharmaCodeConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatPharmaCodeConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    Minimum value for PharmaCode. Very low values are likely to produce more false positives.
    @defaultValue 16;
    */
    minimumValue: number;
    /**
    If true, a result consisting of only narrow bars is accepted as valid. The specification does not recommend such barcodes. Default is false.
    @defaultValue false;
    */
    allowNarrowBarsOnly: boolean;
    /**
    If true, a result consisting of only wide bars is accepted as valid. The specification does not recommend such barcodes. Default is false.
    @defaultValue false;
    */
    allowWideBarsOnly: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatPharmaCodeConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatPharmaCodeConfiguration>);
}
/**
Base class for all 2D barcode configurations.
*/
export type BarcodeFormatTwoDConfigurationBase = BarcodeFormatAztecConfiguration | BarcodeFormatQrCodeConfiguration | BarcodeFormatPdf417Configuration | BarcodeFormatMicroPdf417Configuration | BarcodeFormatDataMatrixConfiguration | BarcodeFormatMaxiCodeConfiguration;
/** @internal */
export declare namespace BarcodeFormatTwoDConfigurationBase {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): BarcodeFormatTwoDConfigurationBase;
}
/**
Aztec configuration. Add to scanner configuration to scan Aztec codes.
*/
export declare class BarcodeFormatAztecConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatAztecConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /** @param source {@displayType `DeepPartial<BarcodeFormatAztecConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatAztecConfiguration>);
}
/**
QR Code configuration. Add to scanner configuration to scan QR codes, Micro QR codes and rectangular Micro QR (rMQR) codes.
*/
export declare class BarcodeFormatQrCodeConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatQRCodeConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /**
    If true, the barcode scanner will only return barcodes that pass the strict validation checks according to standards to avoid false positives.
    @defaultValue true;
    */
    strictMode: boolean;
    /**
    If true, scan and return QR codes.
    @defaultValue true;
    */
    qr: boolean;
    /**
    If true, scan and return Micro QR codes.
    @defaultValue false;
    */
    microQr: boolean;
    /**
    If true, scan and return rectangular Micro QR (rMQR) codes.
    @defaultValue false;
    */
    rmqr: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatQrCodeConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatQrCodeConfiguration>);
}
/**
PDF417 configuration. Add to scanner configuration to scan PDF417 codes.
*/
export declare class BarcodeFormatPdf417Configuration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatPDF417Configuration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /**
    If true, the barcode scanner will only return barcodes that pass the strict validation checks according to standards to avoid false positives.
    @defaultValue true;
    */
    strictMode: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatPdf417Configuration>`} */
    constructor(source?: DeepPartial<BarcodeFormatPdf417Configuration>);
}
/**
MicroPDF417 configuration. Add to scanner configuration to scan MicroPDF417 codes.
*/
export declare class BarcodeFormatMicroPdf417Configuration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatMicroPDF417Configuration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /**
    If true, the barcode scanner will only return barcodes that pass the strict validation checks according to standards to avoid false positives.
    @defaultValue true;
    */
    strictMode: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatMicroPdf417Configuration>`} */
    constructor(source?: DeepPartial<BarcodeFormatMicroPdf417Configuration>);
}
/**
DataMatrix configuration. Add to scanner configuration to scan DataMatrix and DataMatrix rectangular extensions (DMRE) codes.
*/
export declare class BarcodeFormatDataMatrixConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatDataMatrixConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /** @param source {@displayType `DeepPartial<BarcodeFormatDataMatrixConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatDataMatrixConfiguration>);
}
/**
MaxiCode configuration. Add to scanner configuration to scan MaxiCode codes.
*/
export declare class BarcodeFormatMaxiCodeConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatMaxiCodeConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatMaxiCodeConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatMaxiCodeConfiguration>);
}
/**
Base class for all four-state barcode configurations.
*/
export type BarcodeFormatFourStateConfigurationBase = BarcodeFormatAustraliaPostConfiguration | BarcodeFormatJapanPostConfiguration | BarcodeFormatRoyalMailConfiguration | BarcodeFormatRoyalTntPostConfiguration | BarcodeFormatUspsIntelligentMailConfiguration | BarcodeFormatPharmaCodeTwoTrackConfiguration;
/** @internal */
export declare namespace BarcodeFormatFourStateConfigurationBase {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): BarcodeFormatFourStateConfigurationBase;
}
/**
can be either numeric or alphanumeric and is only relevant for Format Codes 59 and 62.

- `NUMERIC`:
   Numeric.
- `ALPHA_NUMERIC`:
   AlphaNumeric.
*/
export type AustraliaPostCustomerFormat = "NUMERIC" | "ALPHA_NUMERIC";
export declare const AustraliaPostCustomerFormatValues: AustraliaPostCustomerFormat[];
/**
Australia Post barcode configuration. Add to scanner configuration to scan Australia Post barcodes.
*/
export declare class BarcodeFormatAustraliaPostConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatAustraliaPostConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Can be either numeric or alpha-numeric and is only relevant for Format Codes 59 and 62.
    @defaultValue "ALPHA_NUMERIC";
    */
    australiaPostCustomerFormat: AustraliaPostCustomerFormat;
    /** @param source {@displayType `DeepPartial<BarcodeFormatAustraliaPostConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatAustraliaPostConfiguration>);
}
/**
Japan Post barcode configuration. Add to scanner configuration to scan Japan Post barcodes.
*/
export declare class BarcodeFormatJapanPostConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatJapanPostConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatJapanPostConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatJapanPostConfiguration>);
}
/**
Royal Mail barcode configuration. Add to scanner configuration to scan Royal Mail (a.k.a. RM4SCC, CBC, BPO 4-State) barcodes.
*/
export declare class BarcodeFormatRoyalMailConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatRoyalMailConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    If true, the check digits are stripped from the result.
    @defaultValue false;
    */
    stripCheckDigits: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatRoyalMailConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatRoyalMailConfiguration>);
}
/**
Royal TNT Post barcode configuration. Add to scanner configuration to scan Royal TNT Post (a.k.a. KIX, Klant IndeX) barcodes.
*/
export declare class BarcodeFormatRoyalTntPostConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatRoyalTNTPostConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatRoyalTntPostConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatRoyalTntPostConfiguration>);
}
/**
USPS Intelligent Mail barcode configuration. Add to scanner configuration to scan USPS Intelligent Mail (a.k.a. USPS OneCode, USPS-STD-11) barcodes.
*/
export declare class BarcodeFormatUspsIntelligentMailConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatUSPSIntelligentMailConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatUspsIntelligentMailConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatUspsIntelligentMailConfiguration>);
}
/**
PHARMA_CODE_TWO_TRACK barcode configuration. Add to scanner configuration to scan Laetus two-track PharmaCode barcodes. Linear (i.e. one-track) PharmaCode scanning is configured separately through the PharmaCodeConfig class.
*/
export declare class BarcodeFormatPharmaCodeTwoTrackConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatPharmaCodeTwoTrackConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum value for PHARMA_CODE_TWO_TRACK. Very low values are likely to produce more false positives.
    @defaultValue 364;
    */
    minimumValue: number;
    /** @param source {@displayType `DeepPartial<BarcodeFormatPharmaCodeTwoTrackConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatPharmaCodeTwoTrackConfiguration>);
}
/**
GS1 Composite configuration. Add to scanner configuration to scan GS1 Composite barcodes.

When not enabled, the individual parts of GS1 Composite barcodes will be returned as separate items,
if the respective formats are enabled (UPC-A, Code 128, MicroPDF417, PDF417).
Those barcode items will have their isGS1CompositePart field set to true.
If GS1 Composite scanning is enabled, the individual parts are never returned, even if their respective formats
are enabled, except when the linear component is a UPC or EAN barcode. In that case the linear component might still
occasionally be returned as a separate result. If this situation needs to be avoided, remove the UPC and EAN formats from
the enabled formats.

If GS1 Composite scanning is disabled, but GS1 message validation is enabled, then the parts of the composite barcode may
fail validation and be rejected.
*/
export declare class BarcodeFormatGs1CompositeConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatGS1CompositeConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /**
    If true, the barcode scanner will only return barcodes that pass the strict validation checks according to standards to avoid false positives.
    @defaultValue true;
    */
    strictMode: boolean;
    /** @param source {@displayType `DeepPartial<BarcodeFormatGs1CompositeConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatGs1CompositeConfiguration>);
}
/**
Convenience configuration for enabling the scanning of multiple linear (1D) barcode formats with a common configuration.
Add to scanner configuration to enable and configure the scanning of multiple linear (1D) barcode formats.

The given configuration will be applied to all enabled barcode formats, if they support it.
You can override the common configuration for individual barcode formats by additionally adding
their specific configuration to the scanner's configuration.
*/
export declare class BarcodeFormatCommonOneDConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatCommonOneDConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    If true, the check digits are stripped from the result.
    @defaultValue false;
    */
    stripCheckDigits: boolean;
    /**
    Minimum text length. Applied only to linear barcode formats that allow variable length.
    @defaultValue 1;
    */
    minimumTextLength: number;
    /**
    Maximum text length. 0 implies no maximum. Applied only to linear barcode formats that allow variable length.
    @defaultValue 0;
    */
    maximumTextLength: number;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /**
    If true, the barcode scanner will only return barcodes that pass the strict validation checks according to standards to avoid false positives.
    @defaultValue true;
    */
    strictMode: boolean;
    /**
    List of linear (1D) barcode formats to scan.
    @defaultValue ["CODABAR", "CODE_11", "CODE_25", "CODE_32", "CODE_39", "CODE_93", "CODE_128", "DATABAR", "DATABAR_EXPANDED", "DATABAR_LIMITED", "EAN_8", "EAN_13", "IATA_2_OF_5", "INDUSTRIAL_2_OF_5", "ITF", "MSI_PLESSEY", "PHARMA_CODE", "PZN_7", "PZN_8", "UPC_A", "UPC_E"];
    */
    formats: BarcodeFormat[];
    /** @param source {@displayType `DeepPartial<BarcodeFormatCommonOneDConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatCommonOneDConfiguration>);
}
/**
Convenience configuration for enabling the scanning of multiple 2D codes with a common configuration.
Add to scanner configuration to enable and configure the scanning of multiple 2D codes.

The given configuration will be applied to all enabled barcode formats, if they support it.
You can override the common configuration for individual barcode formats by additionally adding
their specific configuration to the scanner's configuration.
*/
export declare class BarcodeFormatCommonTwoDConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatCommonTwoDConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /**
    If true, the barcode scanner will only return barcodes that pass the strict validation checks according to standards to avoid false positives.
    @defaultValue true;
    */
    strictMode: boolean;
    /**
    List of 2D codes to scan.
    @defaultValue ["AZTEC", "DATA_MATRIX", "MAXI_CODE", "MICRO_QR_CODE", "MICRO_PDF_417", "PDF_417", "QR_CODE", "RMQR_CODE"];
    */
    formats: BarcodeFormat[];
    /** @param source {@displayType `DeepPartial<BarcodeFormatCommonTwoDConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatCommonTwoDConfiguration>);
}
/**
Convenience configuration for enabling the scanning of multiple four-state barcode formats with a common configuration.
Add to scanner configuration to enable and configure the scanning of multiple four-state codes.

The given configuration will be applied to all enabled barcode formats, if they support it.
You can override the common configuration for individual barcode formats by additionally adding
their specific configuration to the scanner's configuration.
*/
export declare class BarcodeFormatCommonFourStateConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatCommonFourStateConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    List of four-state barcode formats to scan.
    @defaultValue ["AUSTRALIA_POST", "JAPAN_POST", "ROYAL_MAIL", "ROYAL_TNT_POST", "USPS_INTELLIGENT_MAIL"];
    */
    formats: BarcodeFormat[];
    /** @param source {@displayType `DeepPartial<BarcodeFormatCommonFourStateConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatCommonFourStateConfiguration>);
}
/**
Convenience configuration for enabling the scanning of multiple barcode formats with a common configuration.
Add to scanner configuration to enable and configure the scanning of multiple barcodes.

The given configuration will be applied to all enabled barcode formats, if they support it.
You can override the common configuration for individual barcode formats by additionally adding
their specific configuration to the scanner's configuration.
*/
export declare class BarcodeFormatCommonConfiguration extends PartiallyConstructible {
    readonly _type: "BarcodeFormatCommonConfiguration";
    /**
    Regular expression filter for barcode text. If the barcode text does not match the regular expression, it will not be scanned. The default is an empty string (setting is turned off).
    @defaultValue "";
    */
    regexFilter: string;
    /**
    Minimum acceptable value of a result BarcodeItem's sizeScore (between 0 and 1).
    Barcodes with a sizeScore less than this value will not be scanned.
    When set to 0, barcodes are returned no matter what their size is.
    @defaultValue 0.0;
    */
    minimumSizeScore: number;
    /**
    If true, we process the barcode scanning with an artificial quiet zone that we add to the input image.
    This flag should be used to scan sharp crops of a barcode.
    @defaultValue false;
    */
    addAdditionalQuietZone: boolean;
    /**
    Minimum quiet zone size on the left and right sides of a 1D barcode, measured in number of modules.
    @defaultValue 6;
    */
    minimum1DQuietZoneSize: number;
    /**
    If true, the check digits are stripped from the result.
    @defaultValue false;
    */
    stripCheckDigits: boolean;
    /**
    Minimum text length. Applied only to linear barcode formats that allow variable length.
    @defaultValue 1;
    */
    minimumTextLength: number;
    /**
    Maximum text length. 0 implies no maximum. Applied only to linear barcode formats that allow variable length.
    @defaultValue 0;
    */
    maximumTextLength: number;
    /**
    GS1 message handling options.
    @defaultValue "PARSE";
    */
    gs1Handling: Gs1Handling;
    /**
    If true, the barcode scanner will only return barcodes that pass the strict validation checks according to standards to avoid false positives.
    @defaultValue true;
    */
    strictMode: boolean;
    /**
    List of barcode formats to scan. By default, the most commonly used formats are enabled.
    @defaultValue ["AZTEC", "CODABAR", "CODE_39", "CODE_93", "CODE_128", "DATA_MATRIX", "DATABAR", "DATABAR_EXPANDED", "DATABAR_LIMITED", "EAN_13", "EAN_8", "ITF", "MICRO_QR_CODE", "PDF_417", "QR_CODE", "UPC_A", "UPC_E"];
    */
    formats: BarcodeFormat[];
    /** @param source {@displayType `DeepPartial<BarcodeFormatCommonConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeFormatCommonConfiguration>);
}
