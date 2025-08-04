import React from "react";
import { AcknowledgementBottomBar } from "../../../configuration/document/AcknowledgementScreenConfiguration";
declare class Props {
    isQualityAcceptable: boolean | null;
    backgroundColor: string;
    config: AcknowledgementBottomBar;
    onRetake: () => void;
    onAccept: () => void;
}
export declare const BarHeight = 78;
export declare function AcknowledgementScreenBottomBar(props: Props): React.JSX.Element;
export {};
