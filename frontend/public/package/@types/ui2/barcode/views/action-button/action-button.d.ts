import React from "react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { RoundButton } from "../../../configuration/common/Common";
export declare class Props extends RoundButton {
    text?: string;
    icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    onClick: () => void;
    active: boolean;
}
export declare const ACTION_BUTTON_HEIGHT = 48;
export declare const ACTION_BUTTON_PADDING = 16;
export default function ActionButton(props: Props): React.JSX.Element;
