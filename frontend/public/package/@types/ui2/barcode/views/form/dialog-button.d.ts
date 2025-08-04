import React from "react";
import { ButtonConfiguration } from "../../../configuration";
import { ButtonProps } from "@mui/material/Button/Button";
import { SvgIconComponent } from "@mui/icons-material";
declare class Props extends ButtonConfiguration {
    icon?: SvgIconComponent;
    onClick: () => void;
    style: React.CSSProperties;
    type?: ButtonProps['type'];
    disabled?: boolean;
    debugName?: string;
}
export declare function DialogButton(props: Props): React.JSX.Element;
export {};
