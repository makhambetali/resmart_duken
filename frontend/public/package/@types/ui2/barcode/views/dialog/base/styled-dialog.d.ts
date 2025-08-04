import { DialogProps } from "@mui/material";
import React from "react";
interface Props extends Omit<DialogProps, "componentsProps"> {
    modalOverlayColor: string;
    width?: string | number;
}
export declare function StyledDialog({ modalOverlayColor, ...props }: Props): React.JSX.Element;
export {};
