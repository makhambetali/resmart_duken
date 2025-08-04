import React from "react";
import { StyledText as StyledTextConfig } from "../../../configuration/common/Common";
declare class Props {
    backgroundColor: string;
    leftContent: React.ReactNode;
    centerTitle: StyledTextConfig;
    centerTitleReplacementArgs?: string[];
    rightContent: React.ReactNode;
}
export declare const Height = 50;
export declare function CommonTopBar(props: Props): React.JSX.Element;
export {};
