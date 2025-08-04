import { BarcodeItemMapper } from "../BarcodeItemMapper";
import { ButtonConfiguration } from "../common/Common";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { StyledText } from "../common/Common";
/**
Configuration of the the mapper's error dialog.
*/
export declare class BarcodeItemErrorState extends PartiallyConstructible {
    /**
      Title displayed above the error message.
      @defaultValue new StyledText({
          "text": "Connection Error!",
          "color": "?sbColorOnSurface"
      });
      */
    title: StyledText;
    /**
      Error message.
      @defaultValue new StyledText({
          "text": "There was an issue and the data requested was not fetched. You could try again or discard this result to start a new scan.",
          "color": "?sbColorOnSurfaceVariant"
      });
      */
    subtitle: StyledText;
    /**
      Configuration of the retry button.
      @defaultValue new ButtonConfiguration({});
      */
    retryButton: ButtonConfiguration;
    /**
      Configuration of the cancel button.
      @defaultValue new ButtonConfiguration({});
      */
    cancelButton: ButtonConfiguration;
    /** @param source {@displayType `DeepPartial<BarcodeItemErrorState>`} */
    constructor(source?: DeepPartial<BarcodeItemErrorState>);
}
/**
Format of the mapped barcode data.
*/
export declare class BarcodeMappedData extends PartiallyConstructible {
    /**
      Title of the barcode.
      */
    title: string;
    /**
      Subtitle of the barcode.
      */
    subtitle: string;
    /**
      Image of the barcode.
      */
    barcodeImage: string;
    /** @param source {@displayType `DeepPartial<BarcodeMappedData>`} */
    constructor(source?: DeepPartial<BarcodeMappedData>);
}
/**
Configuration of the barcode data mapping.
*/
export declare class BarcodeInfoMapping extends PartiallyConstructible {
    /**
      Callback to map the barcode data to the data of the corresponding product.
      @defaultValue null;
      */
    barcodeItemMapper: BarcodeItemMapper | null;
    /**
      Background color of the barcode info dialog.
      @defaultValue "?sbColorSurface";
      */
    sheetColor: string;
    /**
      Color of the divider and separator lines in the barcode info dialog.
      @defaultValue "?sbColorOutline";
      */
    dividerColor: string;
    /**
      Background color of the overlay surrounding the barcode mapping error dialog.
      @defaultValue "?sbColorModalOverlay";
      */
    modalOverlayColor: string;
    /**
      Text being displayed while a barcode is being mapped.
      @defaultValue new StyledText({
          "text": "Loading message for barcode info mapping.",
          "color": "?sbColorPrimary"
      });
      */
    loadingMessage: StyledText;
    /**
      Configuration of the error state displayed when processing a barcode fails.
      @defaultValue new BarcodeItemErrorState({});
      */
    errorState: BarcodeItemErrorState;
    /** @param source {@displayType `DeepPartial<BarcodeInfoMapping>`} */
    constructor(source?: DeepPartial<BarcodeInfoMapping>);
}
