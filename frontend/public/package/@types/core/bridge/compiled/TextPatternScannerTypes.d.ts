import { DeepPartial, PartiallyConstructible } from "../common";
import { Rectangle } from "../common";
/**
Structure containing recognized word text and bounds.
*/
export declare class WordBox extends PartiallyConstructible {
    /**
    Recognized word text
    */
    readonly text: string;
    /**
    Bounding rectangle of the recognized word
    */
    readonly boundingRect: Rectangle;
    /**
    Confidence of the recognition.
    @defaultValue 0.0;
    */
    readonly recognitionConfidence: number;
    /** @param source {@displayType `DeepPartial<WordBox>`} */
    constructor(source?: DeepPartial<WordBox>);
}
/**
Structure containing recognized symbol text and bounds.
*/
export declare class SymbolBox extends PartiallyConstructible {
    /**
    Recognized symbol text
    */
    readonly symbol: string;
    /**
    Bounding rectangle of the recognized symbol
    */
    readonly boundingRect: Rectangle;
    /**
    Confidence of the recognition
    */
    readonly recognitionConfidence: number;
    /** @param source {@displayType `DeepPartial<SymbolBox>`} */
    constructor(source?: DeepPartial<SymbolBox>);
}
/**
The result of the text line recognition.
*/
export declare class TextPatternScannerResult extends PartiallyConstructible {
    /**
    Raw recognized string
    */
    readonly rawText: string;
    /**
    Boxes for each recognized word
    */
    readonly wordBoxes: WordBox[];
    /**
    Boxes for each recognized symbol
    */
    readonly symbolBoxes: SymbolBox[];
    /**
    Confidence of the recognition.
    @defaultValue 0.0;
    */
    readonly confidence: number;
    /**
    Whether the validation was successful.
    @defaultValue false;
    */
    readonly validationSuccessful: boolean;
    /** @param source {@displayType `DeepPartial<TextPatternScannerResult>`} */
    constructor(source?: DeepPartial<TextPatternScannerResult>);
}
/**
Base class for content validators.
*/
export type ContentValidator = DefaultContentValidator | PatternContentValidator;
/** @internal */
export declare namespace ContentValidator {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): ContentValidator;
}
/**
Default content validator. Accepts only non-empty strings.
*/
export declare class DefaultContentValidator extends PartiallyConstructible {
    readonly _type: "DefaultContentValidator";
    /**
    OCR whitelist. Empty string means no restriction.
    @defaultValue "";
    */
    allowedCharacters: string;
    /** @param source {@displayType `DeepPartial<DefaultContentValidator>`} */
    constructor(source?: DeepPartial<DefaultContentValidator>);
}
/**
Pattern content validator.
*/
export declare class PatternContentValidator extends PartiallyConstructible {
    readonly _type: "PatternContentValidator";
    /**
    OCR whitelist. Empty string means no restriction.
    @defaultValue "";
    */
    allowedCharacters: string;
    /**
    Wildcard validation pattern.
      ? - any character
      # - any digit
      all other characters represent themselves
    */
    pattern: string;
    /**
    Whether the pattern should match the whole string or just a substring.
    @defaultValue false;
    */
    matchSubstring: boolean;
    /** @param source {@displayType `DeepPartial<PatternContentValidator>`} */
    constructor(source?: DeepPartial<PatternContentValidator>);
}
/**
Configuration for the text pattern scanner.
*/
export declare class TextPatternScannerConfiguration extends PartiallyConstructible {
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
    /**
    Content validator.
    @defaultValue new DefaultContentValidator({});
    */
    validator: ContentValidator;
    /** @param source {@displayType `DeepPartial<TextPatternScannerConfiguration>`} */
    constructor(source?: DeepPartial<TextPatternScannerConfiguration>);
}
