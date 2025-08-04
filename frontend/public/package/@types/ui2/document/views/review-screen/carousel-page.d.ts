import React, { MutableRefObject } from "react";
import { SBPage } from "../../model/sb-page";
declare class Props {
    page: SBPage;
    index: number;
    style: React.CSSProperties;
    /** When animateRotation is set to true, the page will be animated to rotate 90 degrees.
     * After the animation is done, the onAnimateRotationDone callback will be called.*/
    animateRotation: boolean;
    onAnimateRotationDone: MutableRefObject<null | (() => void)>;
}
export declare function CarouselPage(props: Props): React.JSX.Element;
export {};
