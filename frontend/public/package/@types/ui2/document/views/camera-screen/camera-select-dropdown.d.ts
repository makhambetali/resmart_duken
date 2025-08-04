import React from "react";
import { CameraInfo } from "../../../../model/camera-info";
import { DocumentScanningFlow } from "../../../configuration/document/DocumentScanningFlow";
export declare class CameraSelectConfig {
    availableCameras: CameraInfo[];
    activeCamera: CameraInfo;
    onSelect: (camera: CameraInfo) => Promise<void>;
}
declare class Props {
    config: DocumentScanningFlow;
    cameraSelectConfig: CameraSelectConfig;
}
export declare function CameraSelectDropdown(props: Props): React.JSX.Element;
export {};
