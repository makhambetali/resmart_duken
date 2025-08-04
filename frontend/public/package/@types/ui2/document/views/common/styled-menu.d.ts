import React from "react";
declare class Props {
    /** If anchor is null, the menu is closed. */
    anchor: HTMLElement | null;
    onClose: () => void;
    /** The id of the element that opens the menu. */
    ariaLabelledBy: string;
    backgroundColor: string;
    /**
     * It is important that items is an array of <MenuItem> JSX elements.
     * Otherwise, the keyboard navigation of the menu will not work correctly.
     */
    children: React.ReactNode[];
    minWidth: string;
}
export declare function StyledMenu(props: Props): React.JSX.Element;
export {};
