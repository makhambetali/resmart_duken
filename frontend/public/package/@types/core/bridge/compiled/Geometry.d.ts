import { DeepPartial, PartiallyConstructible } from "../common";
import { Point } from "../common";
/**
Represents a line segment in 2D space.
*/
export declare class LineSegmentInt extends PartiallyConstructible {
    /**
    Start point of the segment
    */
    readonly start: Point;
    /**
    End point of the segment
    */
    readonly end: Point;
    /** @param source {@displayType `DeepPartial<LineSegmentInt>`} */
    constructor(source?: DeepPartial<LineSegmentInt>);
}
/**
Represents a line segment in 2D space.
*/
export declare class LineSegmentFloat extends PartiallyConstructible {
    /**
    Start point of the segment
    */
    readonly start: Point;
    /**
    End point of the segment
    */
    readonly end: Point;
    /** @param source {@displayType `DeepPartial<LineSegmentFloat>`} */
    constructor(source?: DeepPartial<LineSegmentFloat>);
}
/**
Aspect ratio is the ratio of the width to the height of an image or screen.
*/
export declare class AspectRatio extends PartiallyConstructible {
    /**
    Width component of the aspect ratio.
    @defaultValue 1.0;
    */
    readonly width: number;
    /**
    Height component of the aspect ratio.
    @defaultValue 1.0;
    */
    readonly height: number;
    /** @param source {@displayType `DeepPartial<AspectRatio>`} */
    constructor(source?: DeepPartial<AspectRatio>);
}
