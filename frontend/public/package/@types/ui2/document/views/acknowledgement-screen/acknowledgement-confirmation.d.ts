import React from "react";
import { AcknowledgementBottomBar } from "../../../configuration/document/AcknowledgementScreenConfiguration";
import { IconUserGuidanceConfiguration } from "../../../configuration/common/UserGuidanceConfiguration";
declare class Props {
    visible: boolean;
    isQualityAcceptable: boolean | null;
    base64Image: string | null;
    bottomBar: {
        backgroundColor: string;
        config: AcknowledgementBottomBar;
        onRetake: () => void;
        onAccept: () => void;
    };
    banner: {
        config: IconUserGuidanceConfiguration;
    };
}
export declare function AcknowledgementConfirmation(props: Props): React.JSX.Element;
export {};
