import React from "react";
import type { CameraPermissionScreen } from "../../configuration/common/CameraPermission";
interface Props {
    onAppClose: () => void;
    config: CameraPermissionScreen;
}
export declare function CameraPermissionDenied(props: Props): React.JSX.Element;
export {};
