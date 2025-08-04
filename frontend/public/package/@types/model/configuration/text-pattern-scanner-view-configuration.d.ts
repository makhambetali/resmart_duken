import { ViewFinderScannerConfiguration } from "./view-finder-scanner-configuration";
import { DeepPartial, TextPatternScannerResult, TextPatternScannerConfiguration } from "../../core-types";
export type TextDetectionCallback = (e: TextPatternScannerResult) => void;
export declare class TextPatternScannerViewConfiguration extends ViewFinderScannerConfiguration {
    constructor();
    ocrConfiguration?: DeepPartial<TextPatternScannerConfiguration>;
    onTextDetected?: TextDetectionCallback;
    static fromJson(json: any): TextPatternScannerViewConfiguration;
}
