import { ArOverlayGeneralConfiguration } from "../barcode/ArTrackingOverlayConfiguration";
import { BadgedButton } from "../common/Common";
import { BarcodeInfoMapping } from "../barcode/BarcodeInfoMapping";
import { ButtonConfiguration } from "../common/Common";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { IconStyle } from "../common/Common";
import { StyledText } from "../common/Common";
/**
Configuration of the mode used for scanning multiple barcodes.

- `COUNTING`:
   Scan barcodes even if they have the same value and count the number of repeated barcodes.
- `UNIQUE`:
   Only scan barcodes with unique values. Subsequent barcodes with the same values will be ignored.
*/
export type MultipleBarcodesScanningMode = "COUNTING" | "UNIQUE";
export declare const MultipleBarcodesScanningModeValues: MultipleBarcodesScanningMode[];
/**
Configuration of the barcode result sheet's default visibility state.

- `BUTTON`:
   Result sheet is hidden and can be opened by pressing the button. The button can show the total barcode count.
- `COLLAPSED_SHEET`:
   Result sheet is visible and collapsed and can be expanded by dragging it up.
*/
export type SheetMode = "BUTTON" | "COLLAPSED_SHEET";
export declare const SheetModeValues: SheetMode[];
/**
Configuration of the barcodes result sheet's height while collapsed.

- `SMALL`:
   Result sheet is collapsed as much as possible, showing only the top part.
- `LARGE`:
   Result sheet is not completely collapsed, revealing more information.
*/
export type CollapsedVisibleHeight = "SMALL" | "LARGE";
export declare const CollapsedVisibleHeightValues: CollapsedVisibleHeight[];
/**
Configuration of the preview mode for scanning multiple barcodes.
*/
export declare class Sheet extends PartiallyConstructible {
    /**
      Mode used for the preview for scanning multiple barcodes.
      @defaultValue "COLLAPSED_SHEET";
      */
    mode: SheetMode;
    /**
      Height of the collapsed result sheet.
      @defaultValue "SMALL";
      */
    collapsedVisibleHeight: CollapsedVisibleHeight;
    /**
      Configuration of the list button.
      @defaultValue new BadgedButton({});
      */
    listButton: BadgedButton;
    /** @param source {@displayType `DeepPartial<Sheet>`} */
    constructor(source?: DeepPartial<Sheet>);
}
/**
Configuration of the swipe-to-delete button.
*/
export declare class SwipeToDelete extends PartiallyConstructible {
    /**
      Whether swipe to delete is enabled or not.
      @defaultValue true;
      */
    enabled: boolean;
    /**
      Color of the swipe-to-delete button.
      @defaultValue "?sbColorNegative";
      */
    backgroundColor: string;
    /**
      Color of the icon on the swipe-to-delete button.
      @defaultValue "?sbColorOnPrimary";
      */
    iconColor: string;
    /** @param source {@displayType `DeepPartial<SwipeToDelete>`} */
    constructor(source?: DeepPartial<SwipeToDelete>);
}
/**
Configuration of the dialog to manually edit the barcode count.
*/
export declare class ManualCountEditDialog extends PartiallyConstructible {
    /**
      Color of the edit dialog's background.
      @defaultValue "?sbColorSurface";
      */
    sheetColor: string;
    /**
      Color of the divider and separator lines in the edit dialog.
      @defaultValue "?sbColorOutline";
      */
    dividerColor: string;
    /**
      Background color of the overlay surrounding the edit dialog.
      @defaultValue "?sbColorModalOverlay";
      */
    modalOverlayColor: string;
    /**
      Configuration of the edit dialog's title.
      @defaultValue new StyledText({
          "text": "Update count",
          "color": "?sbColorOnSurface"
      });
      */
    title: StyledText;
    /**
      Configuration of the edit dialog's info text.
      @defaultValue new StyledText({
          "text": "Adjust the number of items you scanned.",
          "color": "?sbColorOnSurfaceVariant"
      });
      */
    info: StyledText;
    /**
      Configuration of the edit dialog's confirm button. Hiding both the update and cancel buttons simultaneously is an undefined behavior.
      @defaultValue new ButtonConfiguration({
          "visible": true,
          "text": "Update",
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
      });
      */
    updateButton: ButtonConfiguration;
    /**
      Configuration of the edit dialog's cancel button. Hiding both the update and cancel buttons simultaneously is an undefined behavior.
      @defaultValue new ButtonConfiguration({
          "visible": true,
          "text": "Cancel",
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
      });
      */
    cancelButton: ButtonConfiguration;
    /**
      Configuration of the edit dialog's button to clear the entered count number.
      @defaultValue new IconStyle({
          "visible": true,
          "color": "?sbColorOnSurfaceVariant"
      });
      */
    clearTextButton: IconStyle;
    /** @param source {@displayType `DeepPartial<ManualCountEditDialog>`} */
    constructor(source?: DeepPartial<ManualCountEditDialog>);
}
/**
Configuration of the list containing the barcodes that have already been scanned.
*/
export declare class SheetContent extends PartiallyConstructible {
    /**
      Color of the list's background.
      @defaultValue "?sbColorSurface";
      */
    sheetColor: string;
    /**
      The color of the dividers in the list sheet.
      @defaultValue "?sbColorOutline";
      */
    dividerColor: string;
    /**
      Enables the user to change the number of scanned items by pressing +,-, or changing the number using a keyboard.
      @defaultValue true;
      */
    manualCountChangeEnabled: boolean;
    /**
      The color of the outline of the manual counting buttons in the list sheet.
      @defaultValue "?sbColorOutline";
      */
    manualCountOutlineColor: string;
    /**
      Color of the buttons for manually changing the barcode count.
      @defaultValue "?sbColorPrimary";
      */
    manualCountChangeColor: string;
    /**
      Configuration of the barcode list's title. By default displays the total number of scanned barcodes.
      @defaultValue new StyledText({
          "text": "%d items",
          "color": "?sbColorOnSurface"
      });
      */
    title: StyledText;
    /**
      Configuration of the button for clearing the barcode list.
      @defaultValue new ButtonConfiguration({
          "visible": true,
          "text": "Clear all",
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
      });
      */
    clearAllButton: ButtonConfiguration;
    /**
      Configuration of the title of a barcode list entry (displaying the barcode's value).
      @defaultValue new StyledText({
          "visible": true,
          "text": "BARCODE_TITLE",
          "color": "?sbColorOnSurface",
          "useShadow": false
      });
      */
    barcodeItemTitle: StyledText;
    /**
      Configuration of the subtitle of a barcode list entry (displaying the barcode's symbology).
      @defaultValue new StyledText({
          "text": "BARCODE_SUBTITLE",
          "color": "?sbColorOnSurfaceVariant"
      });
      */
    barcodeItemSubtitle: StyledText;
    /**
      Visibility of the barcode image in a barcode list entry.
      @defaultValue true;
      */
    barcodeItemImageVisible: boolean;
    /**
      Configuration of the barcode list's submit button.
      @defaultValue new ButtonConfiguration({
          "visible": true,
          "text": "Submit",
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
      });
      */
    submitButton: ButtonConfiguration;
    /**
      Configuration of the button to start scanning displayed in an empty barcode list.
      @defaultValue new ButtonConfiguration({
          "visible": true,
          "text": "Start scanning",
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
      });
      */
    startScanningButton: ButtonConfiguration;
    /**
      Configuration of the title displayed in an empty barcode list.
      @defaultValue new StyledText({
          "text": "No barcodes here!",
          "color": "?sbColorOnSurface"
      });
      */
    placeholderTitle: StyledText;
    /**
      Configuration of the subtitle displayed in an empty barcode list.
      @defaultValue new StyledText({
          "text": "The barcode list is currently empty. Close this sheet and scan your items to add them.",
          "color": "?sbColorOnSurfaceVariant"
      });
      */
    placeholderSubtitle: StyledText;
    /**
      Background color of the icon displayed in an empty barcode list.
      @defaultValue "?sbColorOutline";
      */
    placeholderIconBackground: string;
    /**
      Configuration of the icon displayed in an empty barcode list.
      @defaultValue new IconStyle({
          "visible": true,
          "color": "?sbColorOnSurface"
      });
      */
    placeholderIcon: IconStyle;
    /**
      The style of the swipe-to-delete button.
      @defaultValue new SwipeToDelete({
          "enabled": true,
          "backgroundColor": "?sbColorNegative",
          "iconColor": "?sbColorOnPrimary"
      });
      */
    swipeToDelete: SwipeToDelete;
    /** @param source {@displayType `DeepPartial<SheetContent>`} */
    constructor(source?: DeepPartial<SheetContent>);
}
/**
Configuration of the mode for scanning multiple barcodes.
*/
export declare class MultipleScanningMode extends PartiallyConstructible {
    readonly _type: "MultipleScanningMode";
    /**
      Time interval in milliseconds before a barcode is counted again. 0 = no delay. The default value is 1000.
      @defaultValue 1000;
      */
    countingRepeatDelay: number;
    /**
      Whether the user can submit an empty barcode list.
      @defaultValue false;
      */
    allowEmptySubmission: boolean;
    /**
      Mode used for scanning multiple barcodes.
      @defaultValue "COUNTING";
      */
    mode: MultipleBarcodesScanningMode;
    /**
      Configuration of the preview mode for scanning multiple barcodes.
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
      Configuration of the list containing the barcodes that have already been scanned.
      @defaultValue new SheetContent({
          "sheetColor": "?sbColorSurface",
          "dividerColor": "?sbColorOutline",
          "manualCountChangeEnabled": true,
          "manualCountOutlineColor": "?sbColorOutline",
          "manualCountChangeColor": "?sbColorPrimary",
          "title": new StyledText({
              "text": "?multipleModeSheetTitle",
              "color": "?sbColorOnSurface"
          }),
          "clearAllButton": new ButtonConfiguration({
              "visible": true,
              "text": "?sheetClearAllButton",
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
              "visible": true,
              "text": "BARCODE_TITLE",
              "color": "?sbColorOnSurface",
              "useShadow": false
          }),
          "barcodeItemSubtitle": new StyledText({
              "visible": true,
              "text": "BARCODE_SUBTITLE",
              "color": "?sbColorOnSurfaceVariant",
              "useShadow": false
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
              "visible": true,
              "text": "?sheetPlaceholderTitle",
              "color": "?sbColorOnSurface",
              "useShadow": false
          }),
          "placeholderSubtitle": new StyledText({
              "visible": true,
              "text": "?sheetPlaceholderSubtitle",
              "color": "?sbColorOnSurfaceVariant",
              "useShadow": false
          }),
          "placeholderIconBackground": "?sbColorOutline",
          "placeholderIcon": new IconStyle({
              "visible": true,
              "color": "?sbColorOnSurface"
          }),
          "swipeToDelete": new SwipeToDelete({
              "enabled": true,
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
                      "color": "?sbColorOnPrimary",
                      "useShadow": false
                  })
              }),
              "cancelButton": new ButtonConfiguration({
                  "visible": true,
                  "text": "?barcodeInfoMappingErrorStateCancelButton",
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
                  "strokeColor": "#FF000000",
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
                  "visible": true,
                  "text": "BARCODE_SUBTITLE",
                  "color": "?sbColorOnSurfaceVariant",
                  "useShadow": false
              }),
              "titleDeselected": new StyledText({
                  "visible": true,
                  "text": "BARCODE_TITLE",
                  "color": "?sbColorOnSurface",
                  "useShadow": false
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
          })
      });
      */
    arOverlay: ArOverlayGeneralConfiguration;
    /** @param source {@displayType `DeepPartial<MultipleScanningMode>`} */
    constructor(source?: DeepPartial<MultipleScanningMode>);
}
