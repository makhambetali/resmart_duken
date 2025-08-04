import React from "react";
import { DocumentScanningFlow } from "../../configuration/document/DocumentScanningFlow";
import ScanbotSDK from "../../../scanbot-sdk";
import { DocumentQuality } from "../../../core/bridge/compiled/DocumentQualityAnalyzerTypes";
import { DocumentDetectionUIResult, RtuDocumentDetectionResultPromise } from "../model/document-detection-ui-result";
declare class Props {
    croppedDetectionResult: RtuDocumentDetectionResultPromise;
    visible: boolean;
    configuration: DocumentScanningFlow;
    sdk: ScanbotSDK;
    onAccept: (detectionResult: DocumentDetectionUIResult, quality: DocumentQuality | null) => void;
    onReject: () => void;
    onError: (error: Error) => void;
}
export declare function AcknowledgmentScreenController(props: Props): React.JSX.Element;
export {};
