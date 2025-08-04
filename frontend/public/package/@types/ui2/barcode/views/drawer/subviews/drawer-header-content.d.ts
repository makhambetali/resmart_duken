import React from "react";
import { ButtonProps } from "../../../utils/styled-button";
import type { StyledText as StyledTextConfig } from "../../../../configuration/common/Common";
export declare class DrawerHeaderContentProps {
    textReplacementArgs: string[];
    leftButton: ButtonProps;
    rightButton: ButtonProps;
    title: StyledTextConfig;
}
export declare function DrawerHeaderContent(props: DrawerHeaderContentProps): React.JSX.Element;
