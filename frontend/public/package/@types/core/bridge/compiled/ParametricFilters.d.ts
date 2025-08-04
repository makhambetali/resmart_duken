import { DeepPartial, PartiallyConstructible } from "../common";
/**
Output mode of binarization filter.

- `BINARY`:
   BINARY - Black and white image, suitable for 1-bit compression.
- `ANTIALIASED`:
   ANTIALIASED - When the source image is a document photo, this mode
   will produce nice, smooth, antialiased text in grayscale, which is typically more readable
   than the text in BINARY mode. Antialiasing requires extra processing,
   which makes this mode slower than BINARY mode.
*/
export type OutputMode = "BINARY" | "ANTIALIASED";
export declare const OutputModeValues: OutputMode[];
/**
Preset of parameters for custom binarization filter.

- `PRESET_1`:
   Very fast, performs well if there are no shadows.
- `PRESET_2`:
   Performs well even if there are shadows. Binarized barcodes typically remain readable.
- `PRESET_3`:
   Performs well even if there are shadows.
- `PRESET_4`:
   Performs well even if there are shadows. Recommended for most use cases involving text documents.
- `PRESET_5`:
   Performs well even if there are shadows.
   The preset is an upgrade to PRESET_4 that adds special treatment for high contrast objects such as barcodes.
   Binarized barcodes typically remain readable.
*/
export type BinarizationFilterPreset = "PRESET_1" | "PRESET_2" | "PRESET_3" | "PRESET_4" | "PRESET_5";
export declare const BinarizationFilterPresetValues: BinarizationFilterPreset[];
/**
Base class for all parametric filters.
*/
export type ParametricFilter = ScanbotBinarizationFilter | CustomBinarizationFilter | ColorDocumentFilter | BrightnessFilter | ContrastFilter | GrayscaleFilter | LegacyFilter | WhiteBlackPointFilter;
/** @internal */
export declare namespace ParametricFilter {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): ParametricFilter;
}
/**
Automatic binarization filter. This filter is a good starting point for most use cases.
*/
export declare class ScanbotBinarizationFilter extends PartiallyConstructible {
    readonly _type: "ScanbotBinarizationFilter";
    /**
    Output mode of the filter. BINARY will return a black and white image, GRAYSCALE will return an antialiased grayscale image.
    @defaultValue "BINARY";
    */
    outputMode: OutputMode;
    /** @param source {@displayType `DeepPartial<ScanbotBinarizationFilter>`} */
    constructor(source?: DeepPartial<ScanbotBinarizationFilter>);
}
/**
Automatic binarization filter. This filter is a good starting point for most use cases.
*/
export declare class CustomBinarizationFilter extends PartiallyConstructible {
    readonly _type: "CustomBinarizationFilter";
    /**
    Output mode of the filter. BINARY will return a black and white image, GRAYSCALE will return an antialiased grayscale image.
    @defaultValue "BINARY";
    */
    outputMode: OutputMode;
    /**
    Value controlling the amount of noise removal. Value between 0 and 1.
    Too little noise removal may result in a very noisy image, worsening readability.
    Too much noise removal may result in the degradation of text, again, worsening readability.
    @defaultValue 0.5;
    */
    denoise: number;
    /**
    Filter radius. The bigger the radius, the slower the filter and generally the less noise in the result.
    The radius is used for both shadows removal and the calculation of local statistics in the main body of the filter.
    Higher radius usually allows to cope better with regions of light text on dark background.
    All the values larger than 127 are clamped to 127.
    @defaultValue 32;
    */
    radius: number;
    /**
    Preset of binarization filter parameters that are found to perform well on different types of documents.
    @defaultValue "PRESET_4";
    */
    preset: BinarizationFilterPreset;
    /** @param source {@displayType `DeepPartial<CustomBinarizationFilter>`} */
    constructor(source?: DeepPartial<CustomBinarizationFilter>);
}
/**
Color document filter. This filter is a good starting point for most use cases.
*/
export declare class ColorDocumentFilter extends PartiallyConstructible {
    readonly _type: "ColorDocumentFilter";
    /** @param source {@displayType `DeepPartial<ColorDocumentFilter>`} */
    constructor(source?: DeepPartial<ColorDocumentFilter>);
}
/**
Brightness adjustment filter.
*/
export declare class BrightnessFilter extends PartiallyConstructible {
    readonly _type: "BrightnessFilter";
    /**
    Brightness adjustment value in the range from -1 to 1. Negative values will make the image darker, positive values will make it brighter.
    @defaultValue 0.0;
    */
    brightness: number;
    /** @param source {@displayType `DeepPartial<BrightnessFilter>`} */
    constructor(source?: DeepPartial<BrightnessFilter>);
}
/**
Contrast adjustment filter.
*/
export declare class ContrastFilter extends PartiallyConstructible {
    readonly _type: "ContrastFilter";
    /**
    Contrast adjustment value in the range from -1 to 254 (inclusively). Negative values will decrease the contrast, positive values will increase it.
    @defaultValue 0.0;
    */
    contrast: number;
    /** @param source {@displayType `DeepPartial<ContrastFilter>`} */
    constructor(source?: DeepPartial<ContrastFilter>);
}
/**
Converts color images to grayscale and applies autocontrast.
*/
export declare class GrayscaleFilter extends PartiallyConstructible {
    readonly _type: "GrayscaleFilter";
    /**
    Ignore this fraction of pixels at the edge of the image when calculating statistics.
    Pixels at the edge of the image typically have poor statistics. Ignoring them
    and using only the inner pixels when calculating certain statistics can
    substantially improve the quality of the result.
    The value must be less than 0.5 but usually good values are between 0 and 0.15.
    @defaultValue 0.06;
    */
    borderWidthFraction: number;
    /**
    Clip this fraction of the darkest pixels in operations such as autocontrast.
    Increasing the range of middle gray levels at the expense of the brightest and darkest levels
    may improve the overall contrast and quality of the result.
    Sum of blackOutliersFraction and whiteOutliersFraction must be less than 1 but usually
    good values for the parameters do not exceed 0.05;.
    @defaultValue 0.0;
    */
    blackOutliersFraction: number;
    /**
    Clip this fraction of the brightest pixels in operations such as autocontrast.
    Increasing the range of middle gray levels at the expense of the brightest and darkest levels
    may improve the overall contrast and quality of the result.
    Sum of blackOutliersFraction and whiteOutliersFraction must be less than 1 but usually
    good values for the parameters do not exceed 0.05;.
    @defaultValue 0.02;
    */
    whiteOutliersFraction: number;
    /** @param source {@displayType `DeepPartial<GrayscaleFilter>`} */
    constructor(source?: DeepPartial<GrayscaleFilter>);
}
/**
Deprecated image filters.
*/
export declare class LegacyFilter extends PartiallyConstructible {
    readonly _type: "LegacyFilter";
    /**
    Id of filter to be applied.
    @defaultValue 0;
    */
    filterType: number;
    /** @param source {@displayType `DeepPartial<LegacyFilter>`} */
    constructor(source?: DeepPartial<LegacyFilter>);
}
/**
Maps image value channel so that all the pixels darker than the black point are set to 0,
all the pixels brighter than the white point are set to 255, and the pixels in between
are linearly scaled.
*/
export declare class WhiteBlackPointFilter extends PartiallyConstructible {
    readonly _type: "WhiteBlackPointFilter";
    /**
    Fraction of the value channel range that is set to 0. The value should be in the range from 0 to 1.
    @defaultValue 0.0;
    */
    blackPoint: number;
    /**
    Fraction of the value channel range that is not set to 255. The value should be in the range from 0 to 1.
    @defaultValue 1.0;
    */
    whitePoint: number;
    /** @param source {@displayType `DeepPartial<WhiteBlackPointFilter>`} */
    constructor(source?: DeepPartial<WhiteBlackPointFilter>);
}
