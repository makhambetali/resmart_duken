import { CameraScreenConfiguration } from "../document/CameraScreenConfiguration";
import { CroppingScreenConfiguration } from "../document/CroppingScreenConfiguration";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { ReviewScreenConfiguration } from "../document/ReviewScreenConfiguration";
/**
Configuration of the document scanner sub-screens.
*/
export declare class DocumentScannerScreens extends PartiallyConstructible {
    /**
      Configuration of the screen for scanning the pages with the camera.
      @defaultValue new CameraScreenConfiguration({});
      */
    camera: CameraScreenConfiguration;
    /**
      Configuration of the screen for reviewing the scanned pages.
      @defaultValue new ReviewScreenConfiguration({});
      */
    review: ReviewScreenConfiguration;
    /**
      Configuration of the screen for cropping the scanned pages.
      @defaultValue new CroppingScreenConfiguration({});
      */
    cropping: CroppingScreenConfiguration;
    /** @param source {@displayType `DeepPartial<DocumentScannerScreens>`} */
    constructor(source?: DeepPartial<DocumentScannerScreens>);
}
