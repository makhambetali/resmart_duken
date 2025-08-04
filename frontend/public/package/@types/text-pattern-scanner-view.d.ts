import React from "react";
import { ScanbotCameraProps, ScanbotCameraState, ScannerView } from "./scanner-view";
import { ITextPatternScannerHandle } from "./interfaces/i-text-pattern-scanner-handle";
import ViewFinder from "./view/view-finder";
import TextPatternScanner from "./service/text-pattern-scanner";
import { ViewFinderScannerConfiguration } from "./model/configuration/view-finder-scanner-configuration";
import VinScanner from "./service/vin-scanner";
export declare class TextPatternScannerProps<Scanner extends TextPatternScanner | VinScanner> {
    scanner: Scanner;
    onDetected: (result: Awaited<ReturnType<Scanner['recognize']>>) => void;
}
export declare class TextPatternScannerState extends ScanbotCameraState {
    isFinderVisible?: boolean;
}
export default class TextPatternScannerView<Scanner extends TextPatternScanner | VinScanner> extends ScannerView<TextPatternScannerProps<Scanner> & ScanbotCameraProps, TextPatternScannerState> implements ITextPatternScannerHandle {
    static FRAME_RESOLUTION: number;
    finder?: ViewFinder;
    shouldComputeSize: boolean;
    private paused;
    constructor(props: TextPatternScannerProps<Scanner> & ScanbotCameraProps);
    get configuration(): ViewFinderScannerConfiguration;
    get enabled(): boolean;
    /**
     * Public API functions
     */
    static create<Scanner extends TextPatternScanner | VinScanner>(configuration: ViewFinderScannerConfiguration, props: TextPatternScannerProps<Scanner>): Promise<TextPatternScannerView<Scanner>>;
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
    render(): React.JSX.Element;
}
