import { BarButtonConfiguration } from "../common/Common";
import { ButtonConfiguration } from "../common/Common";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { StyledText } from "../common/Common";
/**
Configuration of the bottom bar for the cropping screen.
*/
export declare class CroppingBottomBar extends PartiallyConstructible {
    /**
      Configuration of the 'detect document' button, located in the bottom bar.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "text": "?croppingDetectButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionCroppingDetectButton",
          "background": new BackgroundStyle({
              "strokeColor": "#00000000",
              "fillColor": "#00000000",
              "strokeWidth": 0.0
          }),
          "icon": new IconStyle({
              "color": "?sbColorOnPrimary"
          })
      });
      */
    detectButton: BarButtonConfiguration;
    /**
      Configuration of the 'rotate page' button, located in the bottom bar.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "text": "?croppingRotateButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionCroppingRotateButton",
          "background": new BackgroundStyle({
              "strokeColor": "#00000000",
              "fillColor": "#00000000",
              "strokeWidth": 0.0
          }),
          "icon": new IconStyle({
              "color": "?sbColorOnPrimary"
          })
      });
      */
    rotateButton: BarButtonConfiguration;
    /**
      Configuration of the 'reset detection' button, located in the bottom bar.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "text": "?croppingResetButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionCroppingResetButton",
          "background": new BackgroundStyle({
              "strokeColor": "#00000000",
              "fillColor": "#00000000",
              "strokeWidth": 0.0
          }),
          "icon": new IconStyle({
              "color": "?sbColorOnPrimary"
          })
      });
      */
    resetButton: BarButtonConfiguration;
    /** @param source {@displayType `DeepPartial<CroppingBottomBar>`} */
    constructor(source?: DeepPartial<CroppingBottomBar>);
}
/**
Configuration of the screen for cropping the scanned pages.
*/
export declare class CroppingScreenConfiguration extends PartiallyConstructible {
    /**
      Configuration of the 'cancel' button, located in the top bar.
      @defaultValue new ButtonConfiguration({
          "visible": true,
          "text": "?croppingTopBarCancelButtonTitle",
          "accessibilityDescription": "?accessibilityDescriptionCroppingTopBarCancelButton",
          "background": new BackgroundStyle({
              "strokeColor": "#00000000",
              "fillColor": "#00000000",
              "strokeWidth": 0.0
          }),
          "foreground": new ForegroundStyle({
              "iconVisible": true,
              "color": "?sbColorOnPrimary",
              "useShadow": false
          })
      });
      */
    topBarBackButton: ButtonConfiguration;
    /**
      Configuration of the title, located in the top bar.
      @defaultValue new StyledText({
          "text": "?croppingScreenTitle",
          "color": "?sbColorOnPrimary"
      });
      */
    topBarTitle: StyledText;
    /**
      Configuration of the 'confirm' button, located in the top bar.
      @defaultValue new ButtonConfiguration({
          "visible": true,
          "text": "?croppingTopBarConfirmButtonTitle",
          "accessibilityDescription": "?accessibilityDescriptionCroppingTopBarConfirmButton",
          "background": new BackgroundStyle({
              "strokeColor": "#00000000",
              "fillColor": "#00000000",
              "strokeWidth": 0.0
          }),
          "foreground": new ForegroundStyle({
              "iconVisible": true,
              "color": "?sbColorOnPrimary",
              "useShadow": false
          })
      });
      */
    topBarConfirmButton: ButtonConfiguration;
    /**
      The background color of the cropping screen.
      @defaultValue "?sbColorOutline";
      */
    backgroundColor: string;
    /**
      The color of the cropping handles.
      @defaultValue "?sbColorSurface";
      */
    croppingHandlerColor: string;
    /**
      The color of the cropping polygon.
      @defaultValue "?sbColorSurface";
      */
    croppingPolygonColor: string;
    /**
      The color of the magnetic lines on the cropping polygon.
      @defaultValue "?sbColorSurface";
      */
    croppingPolygonMagneticLineColor: string;
    /**
      Configuration of the bottom bar for the cropping screen.
      @defaultValue new CroppingBottomBar({});
      */
    bottomBar: CroppingBottomBar;
    /** @param source {@displayType `DeepPartial<CroppingScreenConfiguration>`} */
    constructor(source?: DeepPartial<CroppingScreenConfiguration>);
}
