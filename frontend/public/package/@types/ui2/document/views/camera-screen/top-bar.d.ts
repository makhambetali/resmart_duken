import React from "react";
import { DocumentScanningFlow } from "../../../configuration/document/DocumentScanningFlow";
import { CameraSelectConfig } from "./camera-select-dropdown";
declare class Props {
    config: DocumentScanningFlow;
    onCloseButtonClick: () => void;
    onShowIntroButtonClick: () => void;
    cameraSelectConfig: CameraSelectConfig;
}
export declare function TopBar(props: Props): React.JSX.Element;
export {};
