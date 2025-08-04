import { DeepPartial, DocumentDataExtractionResult, DocumentDataExtractorConfiguration } from "../../core-types";
import { ViewFinderScannerConfiguration } from "./view-finder-scanner-configuration";
export declare class DocumentDataExtractorViewConfiguration extends ViewFinderScannerConfiguration {
    constructor();
    detectorParameters?: DeepPartial<DocumentDataExtractorConfiguration>;
    /** Callback is called for every analyzed frame. */
    onDocumentDetected?: (result: DocumentDataExtractionResult) => void;
    static fromJson(json: DeepPartial<DocumentDataExtractorViewConfiguration>): DocumentDataExtractorViewConfiguration;
}
