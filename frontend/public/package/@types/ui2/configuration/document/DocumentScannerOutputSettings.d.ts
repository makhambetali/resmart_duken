import { DeepPartial, PartiallyConstructible } from "../utils";
import { ParametricFilter } from "../ParametricFilters";
/**
Determines if the quality analysis for the acknowledgement mode will run on the filtered or the unfiltered image.

- `FILTERED_DOCUMENT`:
   The quality analysis will run on the filtered document image.
- `UNFILTERED_DOCUMENT`:
   The quality analysis will run on the unfiltered document image.
*/
export type DocumentAnalysisMode = "FILTERED_DOCUMENT" | "UNFILTERED_DOCUMENT";
export declare const DocumentAnalysisModeValues: DocumentAnalysisMode[];
/**
Configuration of the output settings.
*/
export declare class DocumentScannerOutputSettings extends PartiallyConstructible {
    /**
      The limit of the number of pages that can be scanned. Default is 0 (no limit).
      @defaultValue 0;
      */
    pagesScanLimit: number;
    /**
      The limit of the size of the cropped document images. If one of the dimensions of the cropped image is larger than the limit, the image is downscaled so that its longer dimension matches the limit. The default is 0 (no limit).
      @defaultValue 0;
      */
    documentImageSizeLimit: number;
    /**
      Determines if the quality analysis for the acknowledgement mode will run on the filtered or the unfiltered image.
      @defaultValue "UNFILTERED_DOCUMENT";
      */
    documentAnalysisMode: DocumentAnalysisMode;
    /**
      Determines the image filter to apply by default.
      @defaultValue null;
      */
    defaultFilter: ParametricFilter | null;
    /** @param source {@displayType `DeepPartial<DocumentScannerOutputSettings>`} */
    constructor(source?: DeepPartial<DocumentScannerOutputSettings>);
}
