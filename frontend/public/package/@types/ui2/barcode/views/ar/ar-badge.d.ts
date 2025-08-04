import React, { ReactNode } from "react";
import VerticalPositions from "./vertical-positions";
import { BadgeStyle } from "../../../configuration";
import { Point } from "../../../../utils/dto/Point";
declare class Props {
    onClick: () => void;
    style: BadgeStyle;
    positionBadge: Point;
    content: string | ReactNode;
    verticalPositions: VerticalPositions;
    transition: {
        duration: number;
        easing: string;
    };
    animateToPoints: Point[];
}
export default function ARBadge(props: Props): React.JSX.Element;
export {};
