import { DeepPartial, PartiallyConstructible } from "../common";
import { DocumentDataExtractorConfigurationElement } from "./DocumentDataExtractorConfigurationTypes";
import { DocumentDetectionResult } from "./DocumentScannerTypes";
import { GenericDocument } from "./GenericDocument";
import { RawImage } from "../common";
import { ResultAccumulationConfiguration } from "./FrameAccumulationTypes";
/**
The status of the extraction process.

- `SUCCESS`:
   The document was extracted successfully.
- `ERROR_NOTHING_FOUND`:
   No document was detected.
- `ERROR_BAD_CROP`:
   A document was detected, but it was at an angle/distance that was too large.
- `ERROR_UNKNOWN_DOCUMENT`:
   A document was detected, but it was not extracted as a supported document.
- `ERROR_UNACCEPTABLE_DOCUMENT`:
   A document was detected as a supported document, but it was not part of the accepted documents.
- `INCOMPLETE_VALIDATION`:
   All fields were extracted, but some of them failed validation.
*/
export type DocumentDataExtractionStatus = "SUCCESS" | "ERROR_NOTHING_FOUND" | "ERROR_BAD_CROP" | "ERROR_UNKNOWN_DOCUMENT" | "ERROR_UNACCEPTABLE_DOCUMENT" | "INCOMPLETE_VALIDATION";
export declare const DocumentDataExtractionStatusValues: DocumentDataExtractionStatus[];
/**
Contains the result of running the generic document extractor.
*/
export declare class DocumentDataExtractionResult extends PartiallyConstructible {
    /**
    The status of the extraction process
    */
    readonly status: DocumentDataExtractionStatus;
    /**
    The extracted document
    */
    readonly document: GenericDocument | null;
    /**
    Result of the document detection in the input image.
    */
    readonly documentDetectionResult: DocumentDetectionResult;
    /**
    Crop of the document if it was detected.
    */
    readonly croppedImage: RawImage | null;
    /** @param source {@displayType `DeepPartial<DocumentDataExtractionResult>`} */
    constructor(source?: DeepPartial<DocumentDataExtractionResult>);
}
/**
The extraction mode.

- `LIVE`:
   The extractor will attempt to accumulate results over multiple frames.
- `SINGLE_SHOT`:
   The extractor will only use the current frame and will spend additional time to ensure the best possible result.
*/
export type DocumentDataExtractionMode = "LIVE" | "SINGLE_SHOT";
export declare const DocumentDataExtractionModeValues: DocumentDataExtractionMode[];
/**
Parameters for the extraction process.
*/
export declare class DocumentDataFrameExtractionParameters extends PartiallyConstructible {
    /**
    The extraction.
    @defaultValue "LIVE";
    */
    mode: DocumentDataExtractionMode;
    /** @param source {@displayType `DeepPartial<DocumentDataFrameExtractionParameters>`} */
    constructor(source?: DeepPartial<DocumentDataFrameExtractionParameters>);
}
/**
Configuration for the document data extractor.
*/
export declare class DocumentDataExtractorConfiguration extends PartiallyConstructible {
    /**
    Configuration for how to accumulate results.
    @defaultValue new ResultAccumulationConfiguration({});
    */
    resultAccumulationConfig: ResultAccumulationConfiguration;
    /**
    Normalized names of the fields to exclude from the result.
    @defaultValue [];
    */
    fieldExcludeList: string[];
    /**
    List of configuration elements for the document data extractor
    */
    configurations: DocumentDataExtractorConfigurationElement[];
    /** @param source {@displayType `DeepPartial<DocumentDataExtractorConfiguration>`} */
    constructor(source?: DeepPartial<DocumentDataExtractorConfiguration>);
}
