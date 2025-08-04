import React from "react";
import { ScanbotCameraProps, ScanbotCameraState, ScannerView } from "./scanner-view";
import { IMrzScannerHandle } from "./interfaces/i-mrz-scanner-handle";
import ViewFinder from "./view/view-finder";
import SimpleMrzRecognizer from "./service/simple-mrz-recognizer";
import { MrzScannerViewConfiguration } from "./model/configuration/mrz-scanner-view-configuration";
export declare class MrzScannerProps extends ScanbotCameraProps {
    mrzRecognizer: SimpleMrzRecognizer;
}
export declare class MrzScannerState extends ScanbotCameraState {
    isFinderVisible?: boolean;
}
export default class MrzScannerView extends ScannerView<MrzScannerProps, MrzScannerState> implements IMrzScannerHandle {
    static FRAME_RESOLUTION: number;
    finder?: ViewFinder;
    shouldComputeSize: boolean;
    private paused;
    private _configuration?;
    constructor(props: MrzScannerProps);
    get configuration(): MrzScannerViewConfiguration;
    get enabled(): boolean;
    /**
     * Public API functions
     */
    static create(configuration: MrzScannerViewConfiguration, mrzRecognizer: SimpleMrzRecognizer): Promise<MrzScannerView>;
    isDetectionPaused(): boolean;
    resumeDetection(): Promise<void>;
    pauseDetection(): void;
    private readonly updateDimensionsCallback;
    /**
     * React Overrides
     */
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    updateDimensions(): Promise<void>;
    resume(): Promise<void>;
    pause(): void;
    detect(): Promise<void>;
    saveExtractedImageData(): void;
    setFinderVisible(isVisible: boolean): void;
    render(): React.JSX.Element;
}
