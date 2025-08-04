import React from 'react';
import { UserGuidanceConfiguration, ViewFinderConfiguration } from '../ui2/configuration';
import { Frame } from '../utils/dto/Frame';
/** Describes the minimum padding (in px) around (view finder + guidance text). */
export declare class ViewFinderPadding {
    minTopPadding?: number;
    minBottomPadding?: number;
}
export declare class Props {
    padding?: ViewFinderPadding;
    configuration: ViewFinderConfiguration;
    guidanceConfiguration: UserGuidanceConfiguration;
}
export default class ViewFinder extends React.Component<Props, {
    shouldUpdateCanvas: boolean;
}> {
    private holeCanvas;
    private crosshairCanvas;
    /**
     * Finder configuration does not have any information about the specific size or position of the window (hole),
     * it just gives users the option to specify aspect ratio, which is just proportion-based, e.g. 1:1, 1:2.
     *
     * Left and right padding seems to be based on whatever, but top padding is based on the total height of the page,
     * substracted by BottomSheet height, ActionBar height, and some other paddings as well User Guidance text
     *
     * Consulted @Serhii Chaban March 06th, 2024, #rtu-ui-v2-web Slack channel
     */
    private holePosition;
    private resizeObserver;
    get style(): import("../ui2/configuration").FinderStyle;
    get holeRect(): Frame;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate: (prevProps: Props) => void;
    componentWillUnmount(): void;
    updateWindowSize: () => void;
    getVideoSize: () => DOMRect;
    scaleForRetinaDisplay: (canvas: HTMLCanvasElement) => void;
    updateCanvas: () => void;
    drawBackground: (context: CanvasRenderingContext2D) => void;
    drawHole: () => void;
    /**
     * TODO: Crosshair exists in the design, but was never implemented on any platform
     */
    drawCrosshair: () => void;
    drawHoleCorners: () => void;
    drawHoleOutline: () => void;
    guidanceText?: HTMLSpanElement;
    guidanceTextTopPadding: number;
    bottomOfGuidanceText(): number;
    get guidance(): UserGuidanceConfiguration;
    private cornerRadius;
    render: () => React.JSX.Element;
}
