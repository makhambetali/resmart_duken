import { DeepPartial, PartiallyConstructible } from "../utils";
/**
Configuration of the all strings for barcode scanner.
*/
export declare class BarcodeTextLocalization extends PartiallyConstructible {
    /**
      Title for the camera permission dialog.
      @defaultValue "Camera permission denied!";
      */
    cameraPermissionEnableCameraTitle: string;
    /**
      Explanation for the camera permission dialog.
      @defaultValue "Please allow the usage of the camera to start the scanning process.";
      */
    cameraPermissionEnableCameraExplanation: string;
    /**
      Close button text for the camera permission dialog.
      @defaultValue "Close";
      */
    cameraPermissionCloseButton: string;
    /**
      Cancel button text for the top bar.
      @defaultValue "Cancel";
      */
    topBarCancelButton: string;
    /**
      Title for the top bar.
      @defaultValue "Scan Item";
      */
    topBarTitle: string;
    /**
      User guidance text.
      @defaultValue "Move the finder over a barcode";
      */
    userGuidance: string;
    /**
      Loading message for barcode info mapping.
      @defaultValue "Loading details...";
      */
    barcodeInfoMappingLoadingMessage: string;
    /**
      Title for the barcode info mapping error state.
      @defaultValue "Connection Error!";
      */
    barcodeInfoMappingErrorStateTitle: string;
    /**
      Subtitle for the barcode info mapping error state.
      @defaultValue "There was an issue and the data requested was not fetched. You could try again or discard this result to start a new scan.";
      */
    barcodeInfoMappingErrorStateSubtitle: string;
    /**
      Retry button text for the barcode info mapping error state.
      @defaultValue "Retry";
      */
    barcodeInfoMappingErrorStateRetryButton: string;
    /**
      Cancel button text for the barcode info mapping error state.
      @defaultValue "Cancel";
      */
    barcodeInfoMappingErrorStateCancelButton: string;
    /**
      Title for the manual count edit dialog.
      @defaultValue "Update count";
      */
    manualCountEditDialogTitle: string;
    /**
      Info for the manual count edit dialog.
      @defaultValue "Adjust the number of items you scanned.";
      */
    manualCountEditDialogInfo: string;
    /**
      Update button text for the manual count edit dialog.
      @defaultValue "Update";
      */
    manualCountEditDialogUpdateButton: string;
    /**
      Cancel button text for the manual count edit dialog.
      @defaultValue "Cancel";
      */
    manualCountEditDialogCancelButton: string;
    /**
      Reset button text for the barcode sheet.
      @defaultValue "Reset";
      */
    sheetResetButton: string;
    /**
      Clear all button text for the barcode sheet.
      @defaultValue "Clear all";
      */
    sheetClearAllButton: string;
    /**
      Submit button text for the barcode sheet.
      @defaultValue "Submit";
      */
    sheetSubmitButton: string;
    /**
      Start scanning button text for the barcode sheet.
      @defaultValue "Start scanning";
      */
    sheetStartScanningButton: string;
    /**
      Title for the barcode sheet placeholder.
      @defaultValue "No barcodes here!";
      */
    sheetPlaceholderTitle: string;
    /**
      Subtitle for the barcode sheet placeholder.
      @defaultValue "The barcode list is currently empty. Close this sheet and scan your items to add them.";
      */
    sheetPlaceholderSubtitle: string;
    /**
      Cancel button text for the single mode confirmation dialog.
      @defaultValue "Close";
      */
    singleModeConfirmationCancelButton: string;
    /**
      Title for the multiple mode barcode sheet.
      @defaultValue "%d items";
      */
    multipleModeSheetTitle: string;
    /**
      Title for the find and pick barcode sheet.
      @defaultValue "%d/%d scanned";
      */
    findAndPickSheetTitle: string;
    /**
      Subtitle for the find and pick barcode sheet.
      @defaultValue "%d/%d added";
      */
    findAndPickSheetBarcodeItemSubtitle: string;
    /**
      Title for the find and pick partial alert.
      @defaultValue "Incomplete scan!";
      */
    findAndPickPartialAlertTitle: string;
    /**
      Subtitle for the find and pick partial alert.
      @defaultValue "Some codes are yet to be scanned. Proceed with submission anyway?";
      */
    findAndPickPartialAlertSubtitle: string;
    /**
      Cancel button text for the find and pick partial alert.
      @defaultValue "Cancel";
      */
    findAndPickPartialAlertCancelButton: string;
    /**
      Submit button text for the find and pick partial alert.
      @defaultValue "Yes, Submit";
      */
    findAndPickPartialAlertSubmitButton: string;
    /**
      Title for the find and pick complete alert.
      @defaultValue "All codes found!";
      */
    findAndPickCompleteAlertTitle: string;
    /**
      Subtitle for the find and pick complete alert.
      @defaultValue "You have successfully scanned all codes. Proceed with submission?";
      */
    findAndPickCompleteAlertSubtitle: string;
    /**
      Cancel button text for the find and pick complete alert.
      @defaultValue "Dismiss";
      */
    findAndPickCompleteAlertCancelButton: string;
    /**
      Submit button text for the find and pick complete alert.
      @defaultValue "Submit";
      */
    findAndPickCompleteAlertSubmitButton: string;
    /** @param source {@displayType `DeepPartial<BarcodeTextLocalization>`} */
    constructor(source?: DeepPartial<BarcodeTextLocalization>);
}
