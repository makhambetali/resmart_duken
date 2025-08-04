import { IconButton } from "../../../configuration/common/Common";
import React from "react";
declare class Props {
    config: IconButton;
    onClick: () => void;
    icon: React.ComponentType;
    active: boolean;
    debugName: string;
}
export declare function ScrollerNavigationButton(props: Props): React.JSX.Element;
export {};
