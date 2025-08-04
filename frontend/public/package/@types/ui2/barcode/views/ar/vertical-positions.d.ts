import { CSSProperties } from "react";
import { BadgeStyle, BarcodeItemInfoPosition } from "../../../configuration";
import { Point } from "../../../../utils/dto/Point";
export default class VerticalPositions {
    badgeY: number;
    badgeStyle: CSSProperties;
    labelY: number;
    labelStyle: CSSProperties;
    static readonly AR_BADGE_SIZE = 48;
    static readonly LABEL_AND_BADGE_PADDING = 10;
    static compute(points: Point[], counterBadge: BadgeStyle, barcodeItemInfoPosition: BarcodeItemInfoPosition): VerticalPositions;
}
