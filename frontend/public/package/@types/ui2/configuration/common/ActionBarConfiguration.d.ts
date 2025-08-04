import { DeepPartial, PartiallyConstructible } from "../utils";
import { RoundButton } from "../common/Common";
/**
Configuration of the buttons available in the action bar.
*/
export declare class ActionBarConfiguration extends PartiallyConstructible {
    /**
      Appearance of the flash button.
      @defaultValue new RoundButton({
          "visible": true,
          "backgroundColor": "?sbColorSurfaceHigh",
          "foregroundColor": "?sbColorOnPrimary",
          "activeBackgroundColor": "?sbColorWarning",
          "activeForegroundColor": "#1C1B1F"
      });
      */
    flashButton: RoundButton;
    /**
      Appearance of the zoom button.
      @defaultValue new RoundButton({
          "visible": true,
          "backgroundColor": "?sbColorSurfaceHigh",
          "foregroundColor": "?sbColorOnPrimary",
          "activeBackgroundColor": "?sbColorSurfaceHigh",
          "activeForegroundColor": "?sbColorOnPrimary"
      });
      */
    zoomButton: RoundButton;
    /**
      Appearance of the flip camera button.
      @defaultValue new RoundButton({
          "visible": true,
          "backgroundColor": "?sbColorSurfaceHigh",
          "foregroundColor": "?sbColorOnPrimary",
          "activeBackgroundColor": "?sbColorSurfaceHigh",
          "activeForegroundColor": "?sbColorOnPrimary"
      });
      */
    flipCameraButton: RoundButton;
    /** @param source {@displayType `DeepPartial<ActionBarConfiguration>`} */
    constructor(source?: DeepPartial<ActionBarConfiguration>);
}
