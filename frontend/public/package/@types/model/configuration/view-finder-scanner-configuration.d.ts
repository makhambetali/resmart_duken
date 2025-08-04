import { ScannerConfiguration } from "./scanner-configuration";
import { ViewFinderConfiguration, UserGuidanceConfiguration } from "../../ui2/configuration";
import { DeepPartial } from "../../ui2/configuration/utils";
export declare function finderDefaultConfig(): ViewFinderConfiguration;
export declare class ViewFinderScannerConfiguration extends ScannerConfiguration {
    constructor(resolution: {
        width: number;
        height: number;
    });
    finder?: DeepPartial<ViewFinderConfiguration>;
    userGuidance?: DeepPartial<UserGuidanceConfiguration>;
    static mapFinderConfiguration(result: ViewFinderScannerConfiguration, json: any): void;
}
