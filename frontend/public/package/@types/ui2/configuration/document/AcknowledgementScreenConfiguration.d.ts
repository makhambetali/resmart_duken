import { BarButtonConfiguration } from "../common/Common";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { DocumentQuality } from "../DocumentQualityAnalyzerTypes";
import { IconUserGuidanceConfiguration } from "../common/UserGuidanceConfiguration";
import { StyledText } from "../common/Common";
/**
Determines, after each page is snapped, whether the acknowledgment screen should be displayed or not.

- `BAD_QUALITY`:
   The acknowledgement screen will only be shown when the quality of a scanned page is unacceptable. The quality threshold is determined by the `minimumQuality` parameter.
- `ALWAYS`:
   The acknowledgement screen will always be shown after each snap, regardless of the scanned page's quality.
- `NONE`:
   The acknowledgement screen will be disabled, in effect never shown.
*/
export type AcknowledgementMode = "BAD_QUALITY" | "ALWAYS" | "NONE";
export declare const AcknowledgementModeValues: AcknowledgementMode[];
/**
Configuration of the bottom bar for the acknowledgement screen.
*/
export declare class AcknowledgementBottomBar extends PartiallyConstructible {
    /**
      Configuration of the 'retake' button.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "text": "?acknowledgementRetakeButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionAcknowledgementRetakeButton",
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
    retakeButton: BarButtonConfiguration;
    /**
      Configuration of the 'accept' button, when the quality of the scanned page is acceptable.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "text": "?acknowledgementAcceptButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionAcknowledgementAcceptButton",
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
    acceptWhenOkButton: BarButtonConfiguration;
    /**
      Configuration of the 'accept' button, when the quality of the scanned page is unacceptable.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "text": "?acknowledgementAcceptButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionAcknowledgementAcceptButton",
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
    acceptWhenNotOkButton: BarButtonConfiguration;
    /** @param source {@displayType `DeepPartial<AcknowledgementBottomBar>`} */
    constructor(source?: DeepPartial<AcknowledgementBottomBar>);
}
/**
Configuration of the acknowledgement screen.
*/
export declare class AcknowledgementScreenConfiguration extends PartiallyConstructible {
    /**
      Configuration of the title, located in the top bar.
      @defaultValue new StyledText({
          "visible": false,
          "text": "?acknowledgementTitle",
          "color": "?sbColorOnPrimary"
      });
      */
    topBarTitle: StyledText;
    /**
      The minimum quality of a scanned page to be deemed acceptable. Used in conjunction with the acknowledgement mode.
      @defaultValue "POOR";
      */
    minimumQuality: DocumentQuality;
    /**
      Determines, after each page is snapped, whether the acknowledgment screen should be displayed or not.
      @defaultValue "ALWAYS";
      */
    acknowledgementMode: AcknowledgementMode;
    /**
      Configuration of the hint that explains that the quality of the scanned page is unacceptable.
      @defaultValue new IconUserGuidanceConfiguration({
          "visible": true,
          "icon": new IconStyle({
              "color": "?sbColorOnPrimary"
          }),
          "title": new StyledText({
              "text": "?acknowledgementScreenBadDocumentHint",
              "color": "?sbColorOnPrimary"
          }),
          "background": new BackgroundStyle({
              "strokeColor": "?sbColorNegative",
              "fillColor": "?sbColorNegative",
              "strokeWidth": 0.0
          })
      });
      */
    badImageHint: IconUserGuidanceConfiguration;
    /**
      The background color of the acknowledgement screen.
      @defaultValue "?sbColorOutline";
      */
    backgroundColor: string;
    /**
      Configuration of the bottom bar for the acknowledgement screen.
      @defaultValue new AcknowledgementBottomBar({});
      */
    bottomBar: AcknowledgementBottomBar;
    /** @param source {@displayType `DeepPartial<AcknowledgementScreenConfiguration>`} */
    constructor(source?: DeepPartial<AcknowledgementScreenConfiguration>);
}
