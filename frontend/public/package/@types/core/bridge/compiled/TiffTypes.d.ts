import { DeepPartial, PartiallyConstructible } from "../common";
import { ParametricFilter } from "./ParametricFilters";
/**
TIFF compression type.

- `NONE`:
   dump mode.
- `CCITTRLE`:
   CCITT modified Huffman RLE. For binarized images only.
- `CCITT_T4`:
   CCITT T.4 (CCITTFAX3, CCITT Group 3 fax encoding, TIFF 6 name). For binarized images only.
- `CCITT_T6`:
   CCITT T.6 (CCITTFAX4, CCITT Group 4 fax encoding, TIFF 6 name). For binarized images only.
- `LZW`:
   Lempel-Ziv and Welch.
- `JPEG`:
   %JPEG DCT compression.
- `CCITTRLEW`:
   #1 w/ word alignment. For binarized images only.
- `PACKBITS`:
   Macintosh RLE.
- `DEFLATE`:
   Deflate compression. Legacy Deflate codec identifier.
- `ADOBE_DEFLATE`:
   Deflate compression, as recognized by Adobe. More widely supported.
*/
export type CompressionMode = "NONE" | "CCITTRLE" | "CCITT_T4" | "CCITT_T6" | "LZW" | "JPEG" | "CCITTRLEW" | "PACKBITS" | "DEFLATE" | "ADOBE_DEFLATE";
export declare const CompressionModeValues: CompressionMode[];
/**
Binarization behavior to apply when adding pages to a TIFF.

- `DISABLED`:
   Do not binarize the image. Image will be stored as a grayscale or color TIFF.
- `ENABLED`:
   Binarize the image. Image will be stored as a 1-bit TIFF. If the input image is not black-and-white, a simple thresholding is applied.
- `ENABLED_IF_BINARIZATION_FILTER_SET`:
   Same behavior as ENABLED if a binarization filter (TIFFGeneratorParameters.binarizationFilter) is set,
   otherwise same behavior as DISABLED. This is the default.
*/
export type Binarization = "DISABLED" | "ENABLED" | "ENABLED_IF_BINARIZATION_FILTER_SET";
export declare const BinarizationValues: Binarization[];
/**
User-defined TIFF field value.
*/
export type UserFieldValue = UserFieldDoubleValue | UserFieldStringValue | UserFieldIntValue;
/** @internal */
export declare namespace UserFieldValue {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): UserFieldValue;
}
/**
Double value (TIFF_DOUBLE).
*/
export declare class UserFieldDoubleValue extends PartiallyConstructible {
    readonly _type: "UserFieldDoubleValue";
    /**
    Value
    */
    value: number;
    /** @param source {@displayType `DeepPartial<UserFieldDoubleValue>`} */
    constructor(source?: DeepPartial<UserFieldDoubleValue>);
}
/**
ASCII string value (TIFF_ASCII).
*/
export declare class UserFieldStringValue extends PartiallyConstructible {
    readonly _type: "UserFieldStringValue";
    /**
    Value
    */
    value: string;
    /** @param source {@displayType `DeepPartial<UserFieldStringValue>`} */
    constructor(source?: DeepPartial<UserFieldStringValue>);
}
/**
32-bit int value (TIFF_LONG).
*/
export declare class UserFieldIntValue extends PartiallyConstructible {
    readonly _type: "UserFieldIntValue";
    /**
    Value
    */
    value: number;
    /** @param source {@displayType `DeepPartial<UserFieldIntValue>`} */
    constructor(source?: DeepPartial<UserFieldIntValue>);
}
/**
User-defined TIFF field.
*/
export declare class UserField extends PartiallyConstructible {
    /**
    Numeric tag
    */
    tag: number;
    /**
    Field name
    */
    name: string;
    /**
    Value
    */
    value: UserFieldValue;
    /** @param source {@displayType `DeepPartial<UserField>`} */
    constructor(source?: DeepPartial<UserField>);
}
/**
TIFF generator parameters.
*/
export declare class TiffGeneratorParameters extends PartiallyConstructible {
    /**
    Compression.
    @defaultValue "LZW";
    */
    compression: CompressionMode;
    /**
    JPEG quality (TIFFTAG_JPEGQUALITY). Values range from 0 to 100.
    @defaultValue 80;
    */
    jpegQuality: number;
    /**
    ZIP/Deflate compression level (TIFFTAG_ZIPQUALITY). Values range from 1 to 9.
    @defaultValue 6;
    */
    zipCompressionLevel: number;
    /**
    DPI value.
    @defaultValue 72;
    */
    dpi: number;
    /**
    User-defined fields.
    @defaultValue [];
    */
    userFields: UserField[];
    /**
    Filter to apply to the input image when adding pages with binarization.
    If set, the filter is applied to the input image and the resulting image is stored as a 1-bit TIFF.
    When storing documents it's typically best to use the BINARY_DOCUMENT_OPTIMIZED_COMPRESSION compression mode (CCITTFAX4)
    instead of the default, as it tends to produce the smallest file sizes.
    If not set, simple thresholding is applied to the image, instead.
    @defaultValue null;
    */
    binarizationFilter: ParametricFilter | null;
    /** @param source {@displayType `DeepPartial<TiffGeneratorParameters>`} */
    constructor(source?: DeepPartial<TiffGeneratorParameters>);
}
export declare namespace TiffGeneratorParameters {
    /**
    Default compression.
    @defaultValue "LZW";
    */
    const defaultCompression: CompressionMode;
    /**
    Compression mode typically producing the smallest file sizes for binary (1-bit) document images.
    @defaultValue "CCITT_T6";
    */
    const binaryDocumentOptimizedCompression: CompressionMode;
}
