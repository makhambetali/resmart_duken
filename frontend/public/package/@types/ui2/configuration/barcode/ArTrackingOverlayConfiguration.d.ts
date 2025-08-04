import { BadgeStyle } from "../common/Common";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { PolygonStyle } from "../common/Common";
import { StyledText } from "../common/Common";
/**
Configuration of the overlay polygon displayed on top of a barcode in the camera preview.
*/
export declare class ArOverlayPolygonConfiguration extends PartiallyConstructible {
    /**
      Control the visibility of the overlay polygon.
      @defaultValue true;
      */
    visible: boolean;
    /**
      Appearance of the overlay polygon when a barcode is not selected.
      @defaultValue new PolygonStyle({
          "strokeColor": "?sbColorSurface",
          "fillColor": "#00000000",
          "strokeWidth": 2.0,
          "cornerRadius": 2.0
      });
      */
    deselected: PolygonStyle;
    /**
      Appearance of the overlay polygon after a barcode has been selected.
      @defaultValue new PolygonStyle({
          "strokeColor": "?sbColorPositive",
          "fillColor": "#00000000",
          "strokeWidth": 2.0,
          "cornerRadius": 2.0
      });
      */
    selected: PolygonStyle;
    /** @param source {@displayType `DeepPartial<ArOverlayPolygonConfiguration>`} */
    constructor(source?: DeepPartial<ArOverlayPolygonConfiguration>);
}
/**
Where to display the barcode info box in the camera preview.

- `DISABLED`:
   Don't display any barcode info.
- `STACKED`:
   Display the barcode info box in the center of the overlay polygon.
- `BELOW`:
   Display the barcode info box below the overlay polygon.
- `ABOVE`:
   Display the barcode info box above the overlay polygon.
*/
export type BarcodeItemInfoPosition = "DISABLED" | "STACKED" | "BELOW" | "ABOVE";
export declare const BarcodeItemInfoPositionValues: BarcodeItemInfoPosition[];
/**
Configuration of the barcode info box displayed in the camera preview.
*/
export declare class BarcodeItemConfiguration extends PartiallyConstructible {
    /**
      Control the visibility of the barcode image in the info box.
      @defaultValue true;
      */
    imageVisible: boolean;
    /**
      Configuration of the text displaying a barcode's value in the info box when the barcode has been selected.
      @defaultValue new StyledText({
          "text": "BARCODE_TITLE",
          "color": "?sbColorOnSurface"
      });
      */
    titleSelected: StyledText;
    /**
      Configuration of the text displaying a barcode's symbology in the info box when the barcode has been selected.
      @defaultValue new StyledText({
          "text": "BARCODE_SUBTITLE",
          "color": "?sbColorOnSurfaceVariant"
      });
      */
    subtitleSelected: StyledText;
    /**
      Configuration of the text displaying a barcode's value in the info box when the barcode is yet to be selected.
      @defaultValue new StyledText({
          "text": "BARCODE_TITLE",
          "color": "?sbColorOnSurface"
      });
      */
    titleDeselected: StyledText;
    /**
      Configuration of the text displaying a barcode's symbology in the info box when the barcode is yet to be selected.
      @defaultValue new StyledText({
          "text": "BARCODE_SUBTITLE",
          "color": "?sbColorOnSurfaceVariant"
      });
      */
    subtitleDeselected: StyledText;
    /**
      Appearance of the barcode info box's background when a barcode has been selected.
      @defaultValue new PolygonStyle({
          "strokeColor": "?sbColorPositive",
          "fillColor": "?sbColorPositive",
          "strokeWidth": 0.0,
          "cornerRadius": 10.0
      });
      */
    backgroundSelected: PolygonStyle;
    /**
      Appearance of the barcode info box's background when a barcode is yet to be selected.
      @defaultValue new PolygonStyle({
          "strokeColor": "?sbColorSurface",
          "fillColor": "?sbColorSurface",
          "strokeWidth": 0.0,
          "cornerRadius": 10.0
      });
      */
    backgroundDeselected: PolygonStyle;
    /** @param source {@displayType `DeepPartial<BarcodeItemConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeItemConfiguration>);
}
/**
Configuration of the AR overlay displayed on top of barcodes in the camera preview.
*/
export declare class ArOverlayGeneralConfiguration extends PartiallyConstructible {
    /**
      Control the visibility of the user guidance.
      @defaultValue false;
      */
    visible: boolean;
    /**
      Parameters of the counter badge appearance e.g. color of background its stroke and text/icon color.
      @defaultValue new BadgeStyle({
          "background": new BackgroundStyle({}),
          "foregroundColor": "?sbColorOnSurface"
      });
      */
    counterBadge: BadgeStyle;
    /**
      If enabled, the scanner will always immediately scan a barcode in the viewfinder or the camera view. The overlay will mark the scanned barcodes and stays above them.
      @defaultValue false;
      */
    automaticSelectionEnabled: boolean;
    /**
      Where to display the barcode info box in the camera preview.
      @defaultValue "BELOW";
      */
    barcodeItemInfoPosition: BarcodeItemInfoPosition;
    /**
      Configuration of the overlay polygon displayed on top of a barcode in the camera preview.
      @defaultValue new ArOverlayPolygonConfiguration({
          "visible": true,
          "deselected": new PolygonStyle({}),
          "selected": new PolygonStyle({})
      });
      */
    polygon: ArOverlayPolygonConfiguration;
    /**
      Configuration of the barcode info box displayed in the camera preview.
      @defaultValue new BarcodeItemConfiguration({
          "imageVisible": true,
          "titleSelected": new StyledText({
              "text": "BARCODE_TITLE",
              "color": "?sbColorOnSurface"
          }),
          "subtitleSelected": new StyledText({
              "text": "BARCODE_SUBTITLE",
              "color": "?sbColorOnSurfaceVariant"
          }),
          "titleDeselected": new StyledText({
              "text": "BARCODE_TITLE",
              "color": "?sbColorOnSurface"
          }),
          "subtitleDeselected": new StyledText({
              "text": "BARCODE_SUBTITLE",
              "color": "?sbColorOnSurfaceVariant"
          }),
          "backgroundSelected": new PolygonStyle({
              "strokeColor": "?sbColorPositive",
              "fillColor": "?sbColorPositive",
              "strokeWidth": 1.0,
              "cornerRadius": 5.0
          }),
          "backgroundDeselected": new PolygonStyle({
              "strokeColor": "?sbColorSurface",
              "fillColor": "?sbColorSurface",
              "strokeWidth": 1.0,
              "cornerRadius": 5.0
          })
      });
      */
    barcodeItemConfiguration: BarcodeItemConfiguration;
    /** @param source {@displayType `DeepPartial<ArOverlayGeneralConfiguration>`} */
    constructor(source?: DeepPartial<ArOverlayGeneralConfiguration>);
}
/**
Configuration of the overlay polygon displayed on top of a barcode in the camera preview.
*/
export declare class FindAndPickArOverlayPolygonConfiguration extends PartiallyConstructible {
    /**
      Control the visibility of the overlay polygon.
      @defaultValue true;
      */
    visible: boolean;
    /**
      Appearance of the overlay polygon when a barcode is partially scanned.
      @defaultValue new PolygonStyle({
          "strokeColor": "?sbColorWarning",
          "fillColor": "#00000000",
          "strokeWidth": 3.0,
          "cornerRadius": 5.0
      });
      */
    partiallyScanned: PolygonStyle;
    /**
      Appearance of the overlay polygon when a barcode is rejected.
      @defaultValue new PolygonStyle({
          "strokeColor": "?sbColorSurface",
          "fillColor": "#00000000",
          "strokeWidth": 3.0,
          "cornerRadius": 5.0
      });
      */
    rejected: PolygonStyle;
    /**
      Appearance of the overlay polygon when a barcode is completed.
      @defaultValue new PolygonStyle({
          "strokeColor": "?sbColorPositive",
          "fillColor": "#00000000",
          "strokeWidth": 3.0,
          "cornerRadius": 5.0
      });
      */
    completed: PolygonStyle;
    /** @param source {@displayType `DeepPartial<FindAndPickArOverlayPolygonConfiguration>`} */
    constructor(source?: DeepPartial<FindAndPickArOverlayPolygonConfiguration>);
}
/**
Configuration of the round badge on find and pick ar layer.
*/
export declare class FindAndPickBadgeConfiguration extends PartiallyConstructible {
    /**
      Appearance of the badge when a barcode is partially scanned.
      @defaultValue new BadgeStyle({
          "visible": true,
          "background": new BackgroundStyle({
              "strokeColor": "#FFFFFF30",
              "fillColor": "?sbColorWarning",
              "strokeWidth": 0.0
          }),
          "foregroundColor": "?sbColorOnSurface"
      });
      */
    partiallyScanned: BadgeStyle;
    /**
      Appearance of the badge when a barcode is rejected.
      @defaultValue new BadgeStyle({
          "visible": true,
          "background": new BackgroundStyle({
              "strokeColor": "#FFFFFF30",
              "fillColor": "?sbColorNegative",
              "strokeWidth": 0.0
          }),
          "foregroundColor": "?sbColorOnSurface"
      });
      */
    rejected: BadgeStyle;
    /**
      Appearance of the badge when a barcode is completed.
      @defaultValue new BadgeStyle({
          "visible": true,
          "background": new BackgroundStyle({
              "strokeColor": "#FFFFFF30",
              "fillColor": "?sbColorPositive",
              "strokeWidth": 0.0
          }),
          "foregroundColor": "?sbColorOnSurface"
      });
      */
    completed: BadgeStyle;
    /** @param source {@displayType `DeepPartial<FindAndPickBadgeConfiguration>`} */
    constructor(source?: DeepPartial<FindAndPickBadgeConfiguration>);
}
/**
Configuration of the AR overlay.
*/
export declare class ArOverlayFindAndPickConfiguration extends PartiallyConstructible {
    /**
      Control the visibility of the user guidance.
      @defaultValue false;
      */
    visible: boolean;
    /**
      If enabled, the scanner will always immediately scan a barcode in the viewfinder or the camera view. The overlay will mark the scanned barcodes and stays above them.
      @defaultValue true;
      */
    automaticSelectionEnabled: boolean;
    /**
      Configuration of the overlay polygon displayed on top of a barcode in the camera preview.
      @defaultValue new FindAndPickArOverlayPolygonConfiguration({});
      */
    polygon: FindAndPickArOverlayPolygonConfiguration;
    /**
      Configuration of the round badge on find and pick ar layer.
      @defaultValue new FindAndPickBadgeConfiguration({});
      */
    badge: FindAndPickBadgeConfiguration;
    /** @param source {@displayType `DeepPartial<ArOverlayFindAndPickConfiguration>`} */
    constructor(source?: DeepPartial<ArOverlayFindAndPickConfiguration>);
}
