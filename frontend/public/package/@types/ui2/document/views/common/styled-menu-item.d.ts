import React from "react";
declare class Props {
    children: React.ReactNode;
    ariaLabel: string;
    onClick: () => void;
    textColor: string;
    /** Take focus when the menu opens. Should be true for exactly one item in the menu. */
    autoFocus: boolean;
    disabled: boolean;
}
export declare function StyledMenuItem(props: Props): React.JSX.Element;
export {};
