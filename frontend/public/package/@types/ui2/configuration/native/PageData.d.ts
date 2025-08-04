import { DeepPartial, PartiallyConstructible } from "../utils";
import { DocumentDetectionStatus } from "../DocumentScannerTypes";
import { DocumentQuality } from "../DocumentQualityAnalyzerTypes";
import { PageImageSource } from "../native/PageImageSource";
import { ParametricFilter } from "../ParametricFilters";
import { Point } from "../utils";
/**
The result of the health insurance card recognition.
*/
export declare class PageData extends PartiallyConstructible {
    /**
      The list of filters applied to the page.
      @defaultValue null;
      */
    readonly filters: ParametricFilter[] | null;
    /**
      The polygon of the page.
      @defaultValue [];
      */
    readonly polygon: Point[];
    /**
      The detection status of the page.
      @defaultValue null;
      */
    readonly documentDetectionStatus: DocumentDetectionStatus | null;
    /**
      The quality score of the page.
      @defaultValue null;
      */
    readonly documentQuality: DocumentQuality | null;
    /**
      The source of the page image.
      @defaultValue null;
      */
    readonly source: PageImageSource | null;
    /**
      The unique identifier of the document.
      @defaultValue null;
      */
    readonly id: number | null;
    /**
      The database identifier of the original image.
      @defaultValue null;
      */
    readonly originalImageId: number | null;
    /**
      The unique identifier of the document image.
      @defaultValue null;
      */
    readonly documentImageId: number | null;
    /** @param source {@displayType `DeepPartial<PageData>`} */
    constructor(source?: DeepPartial<PageData>);
}
