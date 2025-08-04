import { AspectRatio } from "../Geometry";
import { DeepPartial, PartiallyConstructible } from "../utils";
/**
Configuration of the scanning interface's viewfinder, serving as guidance to the user.
*/
export declare class ViewFinderConfiguration extends PartiallyConstructible {
    /**
      Whether the viewfinder is visible.
      @defaultValue true;
      */
    visible: boolean;
    /**
      Visual appearance of the viewfinder.
      @defaultValue new FinderCorneredStyle({
          "strokeColor": "?sbColorSurface",
          "strokeWidth": 2.0,
          "cornerRadius": 10.0
      });
      */
    style: FinderStyle;
    /**
      Color of the viewfinder overlay.
      @defaultValue "?sbColorSurfaceLow";
      */
    overlayColor: string;
    /**
      The viewfinder's aspect ratio.
      @defaultValue new AspectRatio({
          "width": 1.0,
          "height": 1.0
      });
      */
    aspectRatio: AspectRatio;
    /** @param source {@displayType `DeepPartial<ViewFinderConfiguration>`} */
    constructor(source?: DeepPartial<ViewFinderConfiguration>);
}
/**
Visual appearance of the viewfinder.
*/
export type FinderStyle = FinderCorneredStyle | FinderStrokedStyle;
/** @internal */
export declare namespace FinderStyle {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): FinderStyle;
}
/**
Variant of the viewfinder displaying only the four corners of the scanning area as user guidance.
*/
export declare class FinderCorneredStyle extends PartiallyConstructible {
    readonly _type: "FinderCorneredStyle";
    /**
      Color of the viewfinder corner's outlines.
      @defaultValue "#FFFFFFFF";
      */
    strokeColor: string;
    /**
      Width of the viewfinder corner's outlines.
      @defaultValue 3.0;
      */
    strokeWidth: number;
    /**
      Radius of the viewfinder's corners.
      @defaultValue 10.0;
      */
    cornerRadius: number;
    /** @param source {@displayType `DeepPartial<FinderCorneredStyle>`} */
    constructor(source?: DeepPartial<FinderCorneredStyle>);
}
/**
Variant of the viewfinder displaying a full outline of the scanning area as user guidance.
*/
export declare class FinderStrokedStyle extends PartiallyConstructible {
    readonly _type: "FinderStrokedStyle";
    /**
      Color of the viewfinder's outline.
      @defaultValue "#FFFFFFFF";
      */
    strokeColor: string;
    /**
      Width of the viewfinder's outline.
      @defaultValue 3.0;
      */
    strokeWidth: number;
    /**
      The viewfinder's corner radius.
      @defaultValue 10.0;
      */
    cornerRadius: number;
    /** @param source {@displayType `DeepPartial<FinderStrokedStyle>`} */
    constructor(source?: DeepPartial<FinderStrokedStyle>);
}
