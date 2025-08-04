import React from "react";
import { BarButtonConfiguration } from "../../../configuration/common/Common";
import { IconButton } from "@mui/material";
declare class Props {
    config: BarButtonConfiguration;
    iconButtonComponent?: typeof IconButton.arguments.component;
    icon: (props: {
        color: string;
    }) => React.JSX.Element;
    children?: React.ReactNode;
    onClick?: () => void;
    enabled: boolean;
    debugName: string;
}
export declare const DisabledButtonOpacity = 0.5;
export declare function BarButton(props: Props): React.JSX.Element;
export {};
