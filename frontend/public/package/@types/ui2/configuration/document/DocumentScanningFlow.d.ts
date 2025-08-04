import { DeepPartial, PartiallyConstructible } from "../utils";
import { DocumentScannerOutputSettings } from "../document/DocumentScannerOutputSettings";
import { DocumentScannerScreens } from "../document/DocumentScannerScreens";
import { DocumentScannerTextLocalization } from "../document/DocumentScannerTextLocalization";
import { Palette } from "../common/Common";
/**
Configuration of the general appearance.
*/
export declare class DocumentFlowAppearanceConfiguration extends PartiallyConstructible {
    /**
      The background color of the top bar. Only applicable when the visual mode is specified as 'SOLID', otherwise ignored.
      @defaultValue "?sbColorPrimary";
      */
    topBarBackgroundColor: string;
    /**
      The background color of the bottom bar.
      @defaultValue "?sbColorPrimary";
      */
    bottomBarBackgroundColor: string;
    /** @param source {@displayType `DeepPartial<DocumentFlowAppearanceConfiguration>`} */
    constructor(source?: DeepPartial<DocumentFlowAppearanceConfiguration>);
}
/**
Configuration of the document scanner screen.
*/
export declare class DocumentScanningFlow extends PartiallyConstructible {
    /**
      Version number of the configuration object.
      @defaultValue "1.0";
      */
    version: string;
    /**
      The configuration object should be applied for this screen.
      @defaultValue "DocumentScanner";
      */
    screen: string;
    /**
      Define the screen's base color values from which other colors are derived.
      @defaultValue new Palette({
          "sbColorPrimary": "#C8193C",
          "sbColorPrimaryDisabled": "#F5F5F5",
          "sbColorNegative": "#FF3737",
          "sbColorPositive": "#4EFFB4",
          "sbColorWarning": "#FFCE5C",
          "sbColorSecondary": "#FFEDEE",
          "sbColorSecondaryDisabled": "#F5F5F5",
          "sbColorOnPrimary": "#FFFFFF",
          "sbColorOnSecondary": "#C8193C",
          "sbColorSurface": "#FFFFFF",
          "sbColorOutline": "#EFEFEF",
          "sbColorOnSurfaceVariant": "#707070",
          "sbColorOnSurface": "#000000",
          "sbColorSurfaceLow": "#00000026",
          "sbColorSurfaceHigh": "#0000007A",
          "sbColorModalOverlay": "#000000A3"
      });
      */
    palette: Palette;
    /**
      Configuration of all the strings for the document scanner screen.
      @defaultValue new DocumentScannerTextLocalization({});
      */
    localization: DocumentScannerTextLocalization;
    /**
      Configuration of the general appearance.
      @defaultValue new DocumentFlowAppearanceConfiguration({});
      */
    appearance: DocumentFlowAppearanceConfiguration;
    /**
      Configuration of the output settings.
      @defaultValue new DocumentScannerOutputSettings({});
      */
    outputSettings: DocumentScannerOutputSettings;
    /**
      Configuration of the document scanner sub-screens.
      @defaultValue new DocumentScannerScreens({});
      */
    screens: DocumentScannerScreens;
    /**
      The UUID of the existing document to be edited.
      @defaultValue null;
      */
    documentUuid: string | null;
    /**
      Clean the existing pages from the scanning session.
      @defaultValue true;
      */
    cleanScanningSession: boolean;
    /** @param source {@displayType `DeepPartial<DocumentScanningFlow>`} */
    constructor(source?: DeepPartial<DocumentScanningFlow>);
}
