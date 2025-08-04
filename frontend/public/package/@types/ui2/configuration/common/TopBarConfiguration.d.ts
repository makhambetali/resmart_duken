import { ButtonConfiguration } from "../common/Common";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { StyledText } from "../common/Common";
/**
Configuration of the top screen bar's appearance.
*/
export declare class TopBarConfiguration extends PartiallyConstructible {
    /**
      Appearance of the top bar's title.
      @defaultValue new StyledText({
          "visible": false,
          "text": "Scan Item",
          "color": "?sbColorOnPrimary"
      });
      */
    title: StyledText;
    /**
      Visual mode used for the top bar.
      @defaultValue "SOLID";
      */
    mode: TopBarMode;
    /**
      Background color of the top bar to be used when the visual mode is specified as SOLID. Otherwise ignored.
      @defaultValue "?sbColorPrimary";
      */
    backgroundColor: string;
    /**
      Configuration of the cancel button's appearance.
      @defaultValue new ButtonConfiguration({
          "text": "Cancel",
          "background": new BackgroundStyle({
              "strokeColor": "#00000000",
              "fillColor": "#00000000",
              "strokeWidth": 0.0
          }),
          "foreground": new ForegroundStyle({
              "color": "?sbColorOnPrimary"
          })
      });
      */
    cancelButton: ButtonConfiguration;
    /** @param source {@displayType `DeepPartial<TopBarConfiguration>`} */
    constructor(source?: DeepPartial<TopBarConfiguration>);
}
/**
Visual mode used for the top bar.

- `SOLID`:
   Display the top bar with a background color or with transparency.
- `GRADIENT`:
   Display the top bar with a gradient background color or a transparent gradient. The buttons will still be visible.
- `HIDDEN`:
   Hide the top bar completely.
*/
export type TopBarMode = "SOLID" | "GRADIENT" | "HIDDEN";
export declare const TopBarModeValues: TopBarMode[];
