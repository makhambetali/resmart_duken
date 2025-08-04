import { BoxProps } from "@mui/material";
import React from "react";
import { PolygonStyle } from "../../configuration";
interface Props extends BoxProps {
    polygonConfig: PolygonStyle;
}
export declare function StyledBox(props: Readonly<Props>): React.JSX.Element;
export {};
