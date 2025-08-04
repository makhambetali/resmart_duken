import React, { Ref } from "react";
import { StyledText as StyledTextConfig } from "../../configuration";
export declare class Props {
    style?: React.CSSProperties;
    config: StyledTextConfig;
    innerRef?: Ref<HTMLSpanElement>;
    replacementArgs?: string[];
}
export declare function styledTextStyle(config: {
    color: string;
    useShadow: boolean;
}): {
    color: string;
    textShadow: string;
};
export declare function StyledText(props: Props): React.JSX.Element;
