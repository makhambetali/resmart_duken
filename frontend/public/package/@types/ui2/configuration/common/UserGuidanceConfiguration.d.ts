import { BackgroundStyle } from "../common/Common";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { IconStyle } from "../common/Common";
import { StyledText } from "../common/Common";
/**
Configuration of the hint guiding users through the scanning process.
*/
export declare class UserGuidanceConfiguration extends PartiallyConstructible {
    /**
      Whether the user guidance is visible.
      @defaultValue true;
      */
    visible: boolean;
    /**
      Title of the user guidance.
      @defaultValue new StyledText({
          "color": "?sbColorOnPrimary"
      });
      */
    title: StyledText;
    /**
      Background style used for the user guidance.
      @defaultValue new BackgroundStyle({
          "strokeColor": "#00000000",
          "fillColor": "?sbColorSurfaceLow"
      });
      */
    background: BackgroundStyle;
    /** @param source {@displayType `DeepPartial<UserGuidanceConfiguration>`} */
    constructor(source?: DeepPartial<UserGuidanceConfiguration>);
}
/**
Configuration of the hint guiding users through the scanning process.
*/
export declare class IconUserGuidanceConfiguration extends PartiallyConstructible {
    /**
      Whether the user guidance is visible.
      @defaultValue true;
      */
    visible: boolean;
    /**
      Icon of the user guidance.
      @defaultValue new IconStyle({
          "color": "?sbColorOnPrimary"
      });
      */
    icon: IconStyle;
    /**
      Title of the user guidance.
      @defaultValue new StyledText({
          "color": "?sbColorOnPrimary"
      });
      */
    title: StyledText;
    /**
      Background style used for the user guidance.
      @defaultValue new BackgroundStyle({
          "fillColor": "?sbColorSurfaceLow"
      });
      */
    background: BackgroundStyle;
    /** @param source {@displayType `DeepPartial<IconUserGuidanceConfiguration>`} */
    constructor(source?: DeepPartial<IconUserGuidanceConfiguration>);
}
