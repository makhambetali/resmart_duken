import { DeepPartial, MrzScannerConfiguration, MrzScannerResult } from "../../core-types";
import { ViewFinderScannerConfiguration } from "./view-finder-scanner-configuration";
export interface MrzScannerAccumulatedFrameVerificationConfiguration {
    /** Maximum number of accumulated frames to inspect to verify a scan result */
    maximumNumberOfAccumulatedFrames?: number;
    /** Minimum number of accumulated frames that have an equal result,
     *  in order for the result to be considered verified */
    minimumNumberOfRequiredFramesWithEqualRecognitionResult?: number;
}
export declare class MrzScannerViewConfiguration extends ViewFinderScannerConfiguration {
    constructor();
    /** {@displayType `DeepPartial<MrzScannerConfiguration>`} {@link MrzScannerConfiguration}*/
    recognizerConfiguration?: DeepPartial<MrzScannerConfiguration>;
    onMrzDetected?: (e: MrzScannerResult) => void;
    _onDetectionFailed?: (e: ImageData) => void;
    static fromJson(json: any): MrzScannerViewConfiguration;
}
