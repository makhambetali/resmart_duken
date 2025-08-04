import { ViewFinderScannerConfiguration } from "./view-finder-scanner-configuration";
import { DeepPartial, VinScannerConfiguration, VinScannerResult } from "../../core-types";
export type VinDetectionCallback = (e: VinScannerResult) => void;
export declare class VinScannerViewConfiguration extends ViewFinderScannerConfiguration {
    constructor();
    detectionConfiguration?: DeepPartial<VinScannerConfiguration>;
    onVinDetected?: VinDetectionCallback;
    static fromJson(json: any): VinScannerViewConfiguration;
}
