import { ArOverlayGeneralConfiguration } from "../barcode/ArTrackingOverlayConfiguration";
import { BarcodeInfoMapping } from "../barcode/BarcodeInfoMapping";
import { ButtonConfiguration } from "../common/Common";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { StyledText } from "../common/Common";
/**
Configuration of the single barcode scanning mode.
*/
export declare class SingleScanningMode extends PartiallyConstructible {
    readonly _type: "SingleScanningMode";
    /**
      If enabled, the confirmation sheet will be shown after the barcode has been scanned.
      @defaultValue false;
      */
    confirmationSheetEnabled: boolean;
    /**
      If enabled, the barcode image will be shown on the confirmation sheet.
      @defaultValue true;
      */
    barcodeImageVisible: boolean;
    /**
      Color of the confirmation sheet's background.
      @defaultValue "?sbColorSurface";
      */
    sheetColor: string;
    /**
      Color of the divider and separator lines in the confirmation sheet.
      @defaultValue "?sbColorOutline";
      */
    dividerColor: string;
    /**
      Background color of the overlay surrounding the confirmation sheet.
      @defaultValue "?sbColorModalOverlay";
      */
    modalOverlayColor: string;
    /**
      Appearance of the barcode title (the barcode's value) on the confirmation sheet.
      @defaultValue new StyledText({
          "text": "BARCODE_TITLE",
          "color": "?sbColorOnSurface"
      });
      */
    barcodeTitle: StyledText;
    /**
      Appearance of the barcode subtitle (the barcode's symbology) on the confirmation sheet.
      @defaultValue new StyledText({
          "text": "BARCODE_SUBTITLE",
          "color": "?sbColorOnSurfaceVariant"
      });
      */
    barcodeSubtitle: StyledText;
    /**
      Appearance of the confirm button on the confirmation sheet.
      @defaultValue new ButtonConfiguration({
          "visible": true,
          "text": "?sheetSubmitButton",
          "background": new BackgroundStyle({
              "strokeColor": "?sbColorPrimary",
              "fillColor": "?sbColorPrimary",
              "strokeWidth": 1.0
          }),
          "foreground": new ForegroundStyle({
              "iconVisible": true,
              "color": "?sbColorOnPrimary"
          })
      });
      */
    submitButton: ButtonConfiguration;
    /**
      Appearance of the cancel button on the confirmation sheet.
      @defaultValue new ButtonConfiguration({
          "visible": true,
          "text": "?singleModeConfirmationCancelButton",
          "background": new BackgroundStyle({
              "strokeColor": "#00000000",
              "fillColor": "#00000000",
              "strokeWidth": 1.0
          }),
          "foreground": new ForegroundStyle({
              "iconVisible": false,
              "color": "?sbColorPrimary"
          })
      });
      */
    cancelButton: ButtonConfiguration;
    /**
      Appearance of the barcode info mapping.
      @defaultValue new BarcodeInfoMapping({
          "sheetColor": "?sbColorSurface",
          "dividerColor": "?sbColorOutline",
          "modalOverlayColor": "?sbColorModalOverlay",
          "loadingMessage": new StyledText({
              "text": "?barcodeInfoMappingLoadingMessage",
              "color": "?sbColorPrimary"
          }),
          "errorState": new BarcodeItemErrorState({
              "title": new StyledText({
                  "text": "?barcodeInfoMappingErrorStateTitle",
                  "color": "?sbColorOnSurface"
              }),
              "subtitle": new StyledText({
                  "text": "?barcodeInfoMappingErrorStateSubtitle",
                  "color": "?sbColorOnSurfaceVariant"
              }),
              "retryButton": new ButtonConfiguration({
                  "visible": true,
                  "text": "?barcodeInfoMappingErrorStateRetryButton",
                  "background": new BackgroundStyle({
                      "strokeColor": "?sbColorPrimary",
                      "fillColor": "?sbColorPrimary",
                      "strokeWidth": 1.0
                  }),
                  "foreground": new ForegroundStyle({
                      "iconVisible": true,
                      "color": "?sbColorOnPrimary"
                  })
              }),
              "cancelButton": new ButtonConfiguration({
                  "text": "?barcodeInfoMappingErrorStateCancelButton",
                  "background": new BackgroundStyle({
                      "strokeColor": "#00000000",
                      "fillColor": "#00000000",
                      "strokeWidth": 1.0
                  }),
                  "foreground": new ForegroundStyle({
                      "iconVisible": false,
                      "color": "?sbColorPrimary"
                  })
              })
          })
      });
      */
    barcodeInfoMapping: BarcodeInfoMapping;
    /**
      Configuration of the AR overlay.
      @defaultValue new ArOverlayGeneralConfiguration({
          "visible": false,
          "counterBadge": new BadgeStyle({
              "visible": true,
              "background": new BackgroundStyle({
                  "strokeColor": "#000000FF",
                  "fillColor": "?sbColorPositive",
                  "strokeWidth": 0.0
              }),
              "foregroundColor": "?sbColorOnSurface"
          }),
          "automaticSelectionEnabled": false,
          "barcodeItemInfoPosition": "BELOW",
          "polygon": new ArOverlayPolygonConfiguration({
              "visible": true,
              "deselected": new PolygonStyle({
                  "strokeColor": "?sbColorSurface",
                  "fillColor": "#00000000",
                  "strokeWidth": 3.0,
                  "cornerRadius": 5.0
              }),
              "selected": new PolygonStyle({
                  "strokeColor": "?sbColorPositive",
                  "fillColor": "#00000000",
                  "strokeWidth": 3.0,
                  "cornerRadius": 5.0
              })
          }),
          "barcodeItemConfiguration": new BarcodeItemConfiguration({
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
                  "visible": true,
                  "text": "BARCODE_SUBTITLE",
                  "color": "?sbColorOnSurfaceVariant",
                  "useShadow": false
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
          })
      });
      */
    arOverlay: ArOverlayGeneralConfiguration;
    /** @param source {@displayType `DeepPartial<SingleScanningMode>`} */
    constructor(source?: DeepPartial<SingleScanningMode>);
}
