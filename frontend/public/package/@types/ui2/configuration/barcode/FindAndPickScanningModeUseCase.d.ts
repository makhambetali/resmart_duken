import { ArOverlayFindAndPickConfiguration } from "../barcode/ArTrackingOverlayConfiguration";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { ManualCountEditDialog } from "../barcode/MultipleScanningModeUseCase";
import { ScanbotAlertDialog } from "../common/ScanbotAlertDialog";
import { SheetContent } from "../barcode/MultipleScanningModeUseCase";
import { Sheet } from "../barcode/MultipleScanningModeUseCase";
/**
Configuration of the barcode to find and scan.
*/
export declare class ExpectedBarcode extends PartiallyConstructible {
    /**
      Value of the barcode to find. If not set, any barcode value will be accepted.
      */
    barcodeValue: string;
    /**
      Title of the barcode to find.
      @defaultValue null;
      */
    title: string | null;
    /**
      Image of the barcode to find.
      @defaultValue null;
      */
    image: string | null;
    /**
      Number of barcodes with given symbology/value required to scan.
      @defaultValue 1;
      */
    count: number;
    /** @param source {@displayType `DeepPartial<ExpectedBarcode>`} */
    constructor(source?: DeepPartial<ExpectedBarcode>);
}
/**
Configuration of the Find and Pick barcode scanning mode.
*/
export declare class FindAndPickScanningMode extends PartiallyConstructible {
    readonly _type: "FindAndPickScanningMode";
    /**
      Color of the selected barcode.
      @defaultValue "?sbColorPositive";
      */
    scanningCompletedColor: string;
    /**
      Color of the partially scanned barcode.
      @defaultValue "?sbColorWarning";
      */
    scanningPartiallyColor: string;
    /**
      Color of the not scanned barcode .
      @defaultValue "?sbColorOutline";
      */
    scanningNotScannedColor: string;
    /**
      If the user is allowed to finish the scanning process without scanning all the expected barcodes.
      @defaultValue false;
      */
    allowPartialScan: boolean;
    /**
      List of barcodes that the user has to find and scan.
      @defaultValue [];
      */
    expectedBarcodes: ExpectedBarcode[];
    /**
      Time interval in milliseconds before a barcode is counted again. 0 = no delay. The default value is 1000.
      @defaultValue 1000;
      */
    countingRepeatDelay: number;
    /**
      Configuration of the preview mode for the barcodes required to be found and scanned.
      @defaultValue new Sheet({
          "mode": "COLLAPSED_SHEET",
          "collapsedVisibleHeight": "SMALL",
          "listButton": new BadgedButton({
              "badgeBackgroundColor": "?sbColorSurface",
              "badgeForegroundColor": "?sbColorPrimary",
              "visible": true,
              "backgroundColor": "?sbColorSurfaceHigh",
              "foregroundColor": "?sbColorOnPrimary",
              "activeBackgroundColor": "?sbColorSurfaceHigh",
              "activeForegroundColor": "?sbColorOnPrimary"
          })
      });
      */
    sheet: Sheet;
    /**
      Configuration of the list of barcodes required to be found and scanned.
      @defaultValue new SheetContent({
          "sheetColor": "?sbColorSurface",
          "dividerColor": "?sbColorOutline",
          "manualCountChangeEnabled": true,
          "manualCountOutlineColor": "?sbColorOutline",
          "manualCountChangeColor": "?sbColorPrimary",
          "title": new StyledText({
              "visible": true,
              "text": "?findAndPickSheetTitle",
              "color": "?sbColorOnSurface",
              "useShadow": false
          }),
          "clearAllButton": new ButtonConfiguration({
              "visible": true,
              "text": "?sheetResetButton",
              "background": new BackgroundStyle({
                  "strokeColor": "#00000000",
                  "fillColor": "#00000000",
                  "strokeWidth": 1.0
              }),
              "foreground": new ForegroundStyle({
                  "iconVisible": false,
                  "color": "?sbColorOnSurface",
                  "useShadow": false
              })
          }),
          "barcodeItemTitle": new StyledText({
              "text": "BARCODE_TITLE",
              "color": "?sbColorOnSurface"
          }),
          "barcodeItemSubtitle": new StyledText({
              "text": "?findAndPickSheetBarcodeItemSubtitle",
              "color": "?sbColorOnSurfaceVariant"
          }),
          "barcodeItemImageVisible": true,
          "submitButton": new ButtonConfiguration({
              "visible": true,
              "text": "?sheetSubmitButton",
              "background": new BackgroundStyle({
                  "strokeColor": "#00000000",
                  "fillColor": "#00000000",
                  "strokeWidth": 1.0
              }),
              "foreground": new ForegroundStyle({
                  "iconVisible": false,
                  "color": "?sbColorOnSurface",
                  "useShadow": false
              })
          }),
          "startScanningButton": new ButtonConfiguration({
              "visible": true,
              "text": "?sheetStartScanningButton",
              "background": new BackgroundStyle({
                  "strokeColor": "?sbColorPrimary",
                  "fillColor": "?sbColorPrimary",
                  "strokeWidth": 1.0
              }),
              "foreground": new ForegroundStyle({
                  "iconVisible": false,
                  "color": "?sbColorOnPrimary",
                  "useShadow": false
              })
          }),
          "placeholderTitle": new StyledText({
              "text": "?sheetPlaceholderTitle",
              "color": "?sbColorOnSurface"
          }),
          "placeholderSubtitle": new StyledText({
              "text": "?sheetPlaceholderSubtitle",
              "color": "?sbColorOnSurfaceVariant"
          }),
          "placeholderIconBackground": "?sbColorOutline",
          "placeholderIcon": new IconStyle({
              "visible": true,
              "color": "?sbColorOnSurface"
          }),
          "swipeToDelete": new SwipeToDelete({
              "enabled": false,
              "backgroundColor": "?sbColorNegative",
              "iconColor": "?sbColorOnPrimary"
          })
      });
      */
    sheetContent: SheetContent;
    /**
      Configuration of the dialog to manually edit the barcode count.
      @defaultValue new ManualCountEditDialog({
          "sheetColor": "?sbColorSurface",
          "dividerColor": "?sbColorOutline",
          "modalOverlayColor": "?sbColorModalOverlay",
          "title": new StyledText({
              "text": "?manualCountEditDialogTitle",
              "color": "?sbColorOnSurface"
          }),
          "info": new StyledText({
              "text": "?manualCountEditDialogInfo",
              "color": "?sbColorOnSurfaceVariant"
          }),
          "updateButton": new ButtonConfiguration({
              "visible": true,
              "text": "?manualCountEditDialogUpdateButton",
              "background": new BackgroundStyle({
                  "strokeColor": "?sbColorPrimary",
                  "fillColor": "?sbColorPrimary",
                  "strokeWidth": 1.0
              }),
              "foreground": new ForegroundStyle({
                  "iconVisible": false,
                  "color": "?sbColorOnPrimary",
                  "useShadow": false
              })
          }),
          "cancelButton": new ButtonConfiguration({
              "visible": true,
              "text": "?manualCountEditDialogCancelButton",
              "background": new BackgroundStyle({
                  "strokeColor": "#00000000",
                  "fillColor": "#00000000",
                  "strokeWidth": 1.0
              }),
              "foreground": new ForegroundStyle({
                  "iconVisible": false,
                  "color": "?sbColorPrimary",
                  "useShadow": false
              })
          }),
          "clearTextButton": new IconStyle({
              "visible": true,
              "color": "?sbColorOnSurfaceVariant"
          })
      });
      */
    manualCountEditDialog: ManualCountEditDialog;
    /**
      Configuration of the AR overlay.
      @defaultValue new ArOverlayFindAndPickConfiguration({
          "visible": true,
          "automaticSelectionEnabled": true,
          "polygon": new FindAndPickArOverlayPolygonConfiguration({
              "partiallyScanned": new PolygonStyle({
                  "strokeColor": "?sbColorWarning",
                  "fillColor": "#00000000",
                  "strokeWidth": 3.0,
                  "cornerRadius": 5.0
              }),
              "rejected": new PolygonStyle({
                  "strokeColor": "?sbColorSurface",
                  "fillColor": "#00000000",
                  "strokeWidth": 3.0,
                  "cornerRadius": 5.0
              }),
              "completed": new PolygonStyle({
                  "strokeColor": "?sbColorPositive",
                  "fillColor": "#00000000",
                  "strokeWidth": 3.0,
                  "cornerRadius": 5.0
              })
          }),
          "badge": new FindAndPickBadgeConfiguration({
              "partiallyScanned": new BadgeStyle({
                  "visible": true,
                  "background": new BackgroundStyle({
                      "strokeColor": "#000000FF",
                      "fillColor": "?sbColorWarning",
                      "strokeWidth": 0.0
                  }),
                  "foregroundColor": "?sbColorOnSurface"
              }),
              "rejected": new BadgeStyle({
                  "visible": true,
                  "background": new BackgroundStyle({
                      "strokeColor": "#000000FF",
                      "fillColor": "?sbColorSurface",
                      "strokeWidth": 0.0
                  }),
                  "foregroundColor": "?sbColorOnSurface"
              }),
              "completed": new BadgeStyle({
                  "visible": true,
                  "background": new BackgroundStyle({
                      "strokeColor": "#000000FF",
                      "fillColor": "?sbColorPositive",
                      "strokeWidth": 0.0
                  }),
                  "foregroundColor": "?sbColorOnSurface"
              })
          })
      });
      */
    arOverlay: ArOverlayFindAndPickConfiguration;
    /**
      If the partial scanned alert dialog is enabled.
      @defaultValue true;
      */
    partialScannedAlertDialogEnabled: boolean;
    /**
      Configuration of the partial scanned alert dialog.
      @defaultValue new ScanbotAlertDialog({
          "title": new StyledText({
              "text": "?findAndPickPartialAlertTitle",
              "color": "?sbColorOnSurface"
          }),
          "subtitle": new StyledText({
              "text": "?findAndPickPartialAlertSubtitle",
              "color": "?sbColorOnSurfaceVariant"
          }),
          "sheetColor": "?sbColorSurface",
          "modalOverlayColor": "?sbColorModalOverlay",
          "dividerColor": "?sbColorOutline",
          "okButton": new ButtonConfiguration({
              "visible": true,
              "text": "?findAndPickPartialAlertSubmitButton",
              "background": new BackgroundStyle({
                  "strokeColor": "?sbColorPrimary",
                  "fillColor": "?sbColorPrimary",
                  "strokeWidth": 1.0
              }),
              "foreground": new ForegroundStyle({
                  "iconVisible": true,
                  "color": "?sbColorOnPrimary",
                  "useShadow": false
              })
          }),
          "cancelButton": new ButtonConfiguration({
              "visible": true,
              "text": "?findAndPickPartialAlertCancelButton",
              "background": new BackgroundStyle({
                  "strokeColor": "#00000000",
                  "fillColor": "#00000000",
                  "strokeWidth": 1.0
              }),
              "foreground": new ForegroundStyle({
                  "iconVisible": false,
                  "color": "?sbColorPrimary",
                  "useShadow": false
              })
          })
      });
      */
    partialScannedAlertDialog: ScanbotAlertDialog;
    /**
      If the confirmation alert dialog is enabled.
      @defaultValue false;
      */
    confirmationAlertDialogEnabled: boolean;
    /**
      Configuration of the confirmation alert dialog.
      @defaultValue new ScanbotAlertDialog({
          "title": new StyledText({
              "text": "?findAndPickCompleteAlertTitle",
              "color": "?sbColorOnSurface"
          }),
          "subtitle": new StyledText({
              "text": "?findAndPickCompleteAlertSubtitle",
              "color": "?sbColorOnSurfaceVariant"
          }),
          "sheetColor": "?sbColorSurface",
          "modalOverlayColor": "?sbColorModalOverlay",
          "dividerColor": "?sbColorOutline",
          "okButton": new ButtonConfiguration({
              "visible": true,
              "text": "?findAndPickCompleteAlertSubmitButton",
              "background": new BackgroundStyle({
                  "strokeColor": "?sbColorPrimary",
                  "fillColor": "?sbColorPrimary",
                  "strokeWidth": 1.0
              }),
              "foreground": new ForegroundStyle({
                  "iconVisible": true,
                  "color": "?sbColorOnPrimary",
                  "useShadow": false
              })
          }),
          "cancelButton": new ButtonConfiguration({
              "visible": true,
              "text": "?findAndPickCompleteAlertCancelButton",
              "background": new BackgroundStyle({
                  "strokeColor": "#00000000",
                  "fillColor": "#00000000",
                  "strokeWidth": 1.0
              }),
              "foreground": new ForegroundStyle({
                  "iconVisible": false,
                  "color": "?sbColorPrimary",
                  "useShadow": false
              })
          })
      });
      */
    confirmationAlertDialog: ScanbotAlertDialog;
    /** @param source {@displayType `DeepPartial<FindAndPickScanningMode>`} */
    constructor(source?: DeepPartial<FindAndPickScanningMode>);
}
