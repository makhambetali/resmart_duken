import React from "react";
import { PreviewButton as PreviewButtonConfig } from "../../../configuration/document/CameraScreenConfiguration";
declare class Props {
    count: number;
    previewImageUrl: string | null;
    config: PreviewButtonConfig;
    enabled: boolean;
    onClick: () => void;
}
export declare function PreviewButton(props: Props): React.JSX.Element;
export {};
