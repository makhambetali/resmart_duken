import React from "react";
import { BadgedButton } from "../../../configuration";
interface Props {
    text: string;
    onClick: () => void;
    style?: React.CSSProperties;
    buttonStyling: BadgedButton;
}
export declare const CountingButtonHeight = 60;
export declare function CountingButton(props: Props): React.JSX.Element;
export {};
