import { DeepPartial, PartiallyConstructible } from "../common";
/**
Result of document quality analysis.

- `VERY_POOR`:
   Very poor quality.
- `POOR`:
   Poor quality.
- `REASONABLE`:
   Reasonable quality.
- `GOOD`:
   Good quality.
- `EXCELLENT`:
   Excellent quality.
*/
export type DocumentQuality = "VERY_POOR" | "POOR" | "REASONABLE" | "GOOD" | "EXCELLENT";
export declare const DocumentQualityValues: DocumentQuality[];
/**
Point in the quality-number of symbols space to separate quality levels.
*/
export declare class DocumentQualityThreshold extends PartiallyConstructible {
    /**
    Symbol quality
    */
    readonly symbolQuality: number;
    /**
    Symbol ratio
    */
    readonly symbolRatio: number;
    /** @param source {@displayType `DeepPartial<DocumentQualityThreshold>`} */
    constructor(source?: DeepPartial<DocumentQualityThreshold>);
}
/**
Document Quality Analyzer configuration.
*/
export declare class DocumentQualityAnalyzerConfiguration extends PartiallyConstructible {
    /**
    Quality thresholds to separate quality levels.
    @defaultValue [new DocumentQualityThreshold({
        "symbolQuality": 0.5,
        "symbolRatio": 0.5
    }), new DocumentQualityThreshold({
        "symbolQuality": 0.7,
        "symbolRatio": 0.3
    }), new DocumentQualityThreshold({
        "symbolQuality": 0.85,
        "symbolRatio": 0.3
    }), new DocumentQualityThreshold({
        "symbolQuality": 0.9,
        "symbolRatio": 0.1
    })];
    */
    qualityThresholds: DocumentQualityThreshold[];
    /**
    quality levels.
    @defaultValue ["VERY_POOR", "POOR", "REASONABLE", "GOOD", "EXCELLENT"];
    */
    qualityIndices: DocumentQuality[];
    /**
    Enable orientation detection. Document orientation will be returned in `DocumentQualityAnalyzerResult.orientation`.
    @defaultValue false;
    */
    detectOrientation: boolean;
    /**
    Maximum image size in pixels, if image is bigger, it will be resized.
    @defaultValue 2000;
    */
    maxImageSize: number;
    /**
    if estimated number of symbols is less than this value, return that document is not found.
    @defaultValue 20;
    */
    minEstimatedNumberOfSymbolsForDocument: number;
    /**
    at least this fraction of the image will be processed, range is from 0 to 1.
    @defaultValue 0.0;
    */
    minProcessedFraction: number;
    /**
    at most this fraction of the image will be processed, range is from 0 to 1.
    @defaultValue 0.5;
    */
    maxProcessedFraction: number;
    /**
    If this number of symbols is found and minProcessedFraction of the image is processed, the processing stops.
    @defaultValue 100;
    */
    earlyStopIfNSymbolsFound: number;
    /**
    Image will be processed in tiles of this size; will be ignored if image is small.
    @defaultValue 300;
    */
    tileSize: number;
    /** @param source {@displayType `DeepPartial<DocumentQualityAnalyzerConfiguration>`} */
    constructor(source?: DeepPartial<DocumentQualityAnalyzerConfiguration>);
}
/**
Result of document quality analysis. It can be used to determine, e.g., if a document is good enough to be used for OCR processing.
*/
export declare class DocumentQualityAnalyzerResult extends PartiallyConstructible {
    /**
    True if a document was found
    */
    readonly documentFound: boolean;
    /**
    Quality of the document, if found
    */
    readonly quality: DocumentQuality | null;
    /**
    Dominant orientation of the document, if found and if orientation detection is enabled.
    The value is in degrees counter-clockwise, where 0 corresponds to the document
    being straight, and the value is in the range of [-180, 180].
    To rotate the document to be straight, rotate the image clockwise by this value.
    */
    readonly orientation: number | null;
    /**
    Cumulative histogram where every entry is equal to the number of symbols with quality equal or lower than N percent, where N is the index of the entry in the array.
    */
    readonly cumulativeQualityHistogram: number[];
    /** @param source {@displayType `DeepPartial<DocumentQualityAnalyzerResult>`} */
    constructor(source?: DeepPartial<DocumentQualityAnalyzerResult>);
}
