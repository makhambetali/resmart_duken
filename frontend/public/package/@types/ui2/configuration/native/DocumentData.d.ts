import { DeepPartial, PartiallyConstructible } from "../utils";
import { PageData } from "../native/PageData";
/**
Document Data.
*/
export declare class DocumentData extends PartiallyConstructible {
    /**
      The creation timestamp of the document
      */
    readonly creationTimestamp: number;
    /**
      The list of pages
      */
    readonly pages: PageData[];
    /**
      The maximum size of the document image.
      @defaultValue 0;
      */
    readonly documentImageSizeLimit: number;
    /**
      The unique identifier of the document.
      @defaultValue null;
      */
    readonly id: number | null;
    /**
      The unique identifier of the PDF rendering.
      @defaultValue null;
      */
    readonly pdfId: number | null;
    /**
      The unique identifier of the TIFF rendering.
      @defaultValue null;
      */
    readonly tiffId: number | null;
    /** @param source {@displayType `DeepPartial<DocumentData>`} */
    constructor(source?: DeepPartial<DocumentData>);
}
