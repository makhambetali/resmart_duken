import { BaseConfiguration } from "./base-configuration";
export declare class ScannerConfiguration extends BaseConfiguration {
    static DEFAULT_VIDEO_RESOLUTION_4K: {
        width: number;
        height: number;
    };
    static DEFAULT_VIDEO_RESOLUTION_HD: {
        width: number;
        height: number;
    };
    static DEFAULT_ACCEPTED_BRIGHTNESS_SCORE: number;
    static DEFAULT_ACCEPTED_ANGLE_SCORE: number;
    static DEFAULT_ACCEPTED_SIZE_SCORE: number;
    /**
     * ScanbotCameraView video constraints
     */
    videoConstraints?: any;
    mirrored?: boolean;
    /**
     * Camera id or camera label.
     * A list of available cameras can be obtained from {@link ScanbotSDK.cameras}.
     **/
    preferredCamera?: string;
    spinnerColor?: string;
    backgroundColor?: string;
    constructor(resolution: {
        width: number;
        height: number;
    });
    /** @internal */
    static mapVideoConstraints(json: any, configuration: ScannerConfiguration): void;
    /**
     * Error callback of the SDK.
     * If any error was reported, your scanner might not be scanning anymore, e.g. due to an out-of-memory error.
     * You should dispose the scanner and use {@link ScanbotSDK.destroy} and {@link ScanbotSDK.initialize} to
     * re-initialize the SDK.
     */
    onError?: (e: any) => void;
}
