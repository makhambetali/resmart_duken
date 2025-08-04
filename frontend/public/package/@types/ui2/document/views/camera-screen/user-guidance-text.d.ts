import { HintTextConfiguration } from "../../../../model/configuration/document-scanner-view-configuration";
import { DocumentScanningFlow } from "../../../configuration/document/DocumentScanningFlow";
import React from "react";
import { SnappingMode } from "../../controller/camera-screen-controller";
export type UserGuidanceTextKey = keyof HintTextConfiguration | "START";
export declare function UserGuidanceText(props: {
    text: UserGuidanceTextKey;
    config: DocumentScanningFlow;
    snappingMode: SnappingMode;
}): React.JSX.Element;
