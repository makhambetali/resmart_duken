import { DeepPartial, PartiallyConstructible } from "../utils";
/**
Value palette describing the colors of the scanner screens.
*/
export declare class Palette extends PartiallyConstructible {
    /**
      Primary color used for enabled elements.
      @defaultValue "#C8193C";
      */
    sbColorPrimary: string;
    /**
      Primary color used for disabled elements.
      @defaultValue "#F5F5F5";
      */
    sbColorPrimaryDisabled: string;
    /**
      Color used to convey a negative meaning.
      @defaultValue "#FF3737";
      */
    sbColorNegative: string;
    /**
      Color used to convey a positive meaning.
      @defaultValue "#4EFFB4";
      */
    sbColorPositive: string;
    /**
      Color used to convey warnings.
      @defaultValue "#FFCE5C";
      */
    sbColorWarning: string;
    /**
      Secondary color used for enabled elements.
      @defaultValue "#FFEDEE";
      */
    sbColorSecondary: string;
    /**
      Secondary color used for disabled elements.
      @defaultValue "#F5F5F5";
      */
    sbColorSecondaryDisabled: string;
    /**
      Color used for displaying elements on top of the primary color.
      @defaultValue "#FFFFFF";
      */
    sbColorOnPrimary: string;
    /**
      Color used for displaying elements on top of the secondary color.
      @defaultValue "#C8193C";
      */
    sbColorOnSecondary: string;
    /**
      Color used for surfaces.
      @defaultValue "#FFFFFF";
      */
    sbColorSurface: string;
    /**
      Color used for outlines.
      @defaultValue "#EFEFEF";
      */
    sbColorOutline: string;
    /**
      Alternative color used on top of surfaces.
      @defaultValue "#707070";
      */
    sbColorOnSurfaceVariant: string;
    /**
      Color used on top of surfaces.
      @defaultValue "#000000";
      */
    sbColorOnSurface: string;
    /**
      Transparent color with a low alpha value used for certain surfaces.
      @defaultValue "#00000026";
      */
    sbColorSurfaceLow: string;
    /**
      Transparent color with a high alpha value used for certain surfaces.
      @defaultValue "#0000007A";
      */
    sbColorSurfaceHigh: string;
    /**
      Transparent color with a very high alpha value used to fill certain overlays.
      @defaultValue "#000000A3";
      */
    sbColorModalOverlay: string;
    /** @param source {@displayType `DeepPartial<Palette>`} */
    constructor(source?: DeepPartial<Palette>);
}
/**
Configuration of the text field appearance.
*/
export declare class StyledText extends PartiallyConstructible {
    /**
      Whether the text field is visible.
      @defaultValue true;
      */
    visible: boolean;
    /**
      Value of the text field.
      @defaultValue "";
      */
    text: string;
    /**
      Text color.
      @defaultValue "#FFFFFF";
      */
    color: string;
    /**
      Whether to enable drop shadows for the text.
      @defaultValue false;
      */
    useShadow: boolean;
    /** @param source {@displayType `DeepPartial<StyledText>`} */
    constructor(source?: DeepPartial<StyledText>);
}
/**
Configuration of the icon appearance.
*/
export declare class IconStyle extends PartiallyConstructible {
    /**
      Whether the icon is visible on the button.
      @defaultValue true;
      */
    visible: boolean;
    /**
      Icon color.
      @defaultValue "#FFFFFF";
      */
    color: string;
    /** @param source {@displayType `DeepPartial<IconStyle>`} */
    constructor(source?: DeepPartial<IconStyle>);
}
/**
Configuration of the icon appearance.
*/
export declare class IconButton extends PartiallyConstructible {
    /**
      Whether the icon is visible on the button.
      @defaultValue true;
      */
    visible: boolean;
    /**
      Icon color.
      @defaultValue "#FFFFFF";
      */
    color: string;
    /**
      The text to be read when button is selected through accessibility mode.
      @defaultValue "";
      */
    accessibilityDescription: string;
    /** @param source {@displayType `DeepPartial<IconButton>`} */
    constructor(source?: DeepPartial<IconButton>);
}
/**
Configuration of the polygon appearance.
*/
export declare class PolygonStyle extends PartiallyConstructible {
    /**
      Color of the polygon outline.
      @defaultValue "#FFFFFFFF";
      */
    strokeColor: string;
    /**
      Polygon color.
      @defaultValue "#FFFFFF30";
      */
    fillColor: string;
    /**
      Width of the polygon outline in dp.
      @defaultValue 2.0;
      */
    strokeWidth: number;
    /**
      Polygon corner radius in dp.
      @defaultValue 0.0;
      */
    cornerRadius: number;
    /** @param source {@displayType `DeepPartial<PolygonStyle>`} */
    constructor(source?: DeepPartial<PolygonStyle>);
}
/**
Appearance of the polygon used for buttons and hint backgrounds.
*/
export declare class BackgroundStyle extends PartiallyConstructible {
    /**
      Color of the polygon outline.
      @defaultValue "#FFFFFFFF";
      */
    strokeColor: string;
    /**
      Polygon color.
      @defaultValue "#FFFFFF30";
      */
    fillColor: string;
    /**
      Width of the polygon outline in dp.
      @defaultValue 2.0;
      */
    strokeWidth: number;
    /** @param source {@displayType `DeepPartial<BackgroundStyle>`} */
    constructor(source?: DeepPartial<BackgroundStyle>);
}
/**
Configuration of the appearance of foreground elements (e.g. text and/or icons on buttons, etc).
*/
export declare class ForegroundStyle extends PartiallyConstructible {
    /**
      Whether the icon is visible.
      @defaultValue true;
      */
    iconVisible: boolean;
    /**
      Color used for foreground elements.
      @defaultValue "#FFFFFF";
      */
    color: string;
    /**
      Whether to use drop shadows for foreground elements.
      @defaultValue false;
      */
    useShadow: boolean;
    /** @param source {@displayType `DeepPartial<ForegroundStyle>`} */
    constructor(source?: DeepPartial<ForegroundStyle>);
}
/**
Configuration of the round button.
*/
export declare class BadgeStyle extends PartiallyConstructible {
    /**
      Control the visibility of the badge.
      @defaultValue true;
      */
    visible: boolean;
    /**
      The style of the button's background.
      @defaultValue new BackgroundStyle({});
      */
    background: BackgroundStyle;
    /**
      Color of the button foreground (icon, text).
      @defaultValue "?sbColorOnSurface";
      */
    foregroundColor: string;
    /** @param source {@displayType `DeepPartial<BadgeStyle>`} */
    constructor(source?: DeepPartial<BadgeStyle>);
}
/**
Configuration of the round button.
*/
export declare class RoundButton extends PartiallyConstructible {
    /**
      Whether to display the button.
      @defaultValue true;
      */
    visible: boolean;
    /**
      The text to be read when button is selected through accessibility mode.
      @defaultValue "";
      */
    accessibilityDescription: string;
    /**
      Color of the button background shape.
      @defaultValue "#0000007A";
      */
    backgroundColor: string;
    /**
      Color of the button foreground (icon, text).
      @defaultValue "#FFFFFF";
      */
    foregroundColor: string;
    /**
      Color of the button background shape when the button is active (selected, toggled).
      @defaultValue "#FFCE5C";
      */
    activeBackgroundColor: string;
    /**
      Color of the button foreground (icon, text) when the button is active (selected, toggled).
      @defaultValue "#1C1B1F";
      */
    activeForegroundColor: string;
    /** @param source {@displayType `DeepPartial<RoundButton>`} */
    constructor(source?: DeepPartial<RoundButton>);
}
/**
Configuration of the round button with badge.
*/
export declare class BadgedButton extends PartiallyConstructible {
    /**
      Color of the badge's background shape.
      @defaultValue "#FFFFFF";
      */
    badgeBackgroundColor: string;
    /**
      Color of the badge foreground (icon, text).
      @defaultValue "#C8193C";
      */
    badgeForegroundColor: string;
    /**
      Whether the button is visible.
      @defaultValue true;
      */
    visible: boolean;
    /**
      Color of the button background shape.
      @defaultValue "#0000007A";
      */
    backgroundColor: string;
    /**
      Color of the button foreground (icon, text).
      @defaultValue "#FFFFFF";
      */
    foregroundColor: string;
    /**
      Color of the button background shape when the button is active (selected, toggled).
      @defaultValue "#FFCE5C";
      */
    activeBackgroundColor: string;
    /**
      Color of the button foreground (icon, text) when the button is active (selected, toggled).
      @defaultValue "#1C1B1F";
      */
    activeForegroundColor: string;
    /** @param source {@displayType `DeepPartial<BadgedButton>`} */
    constructor(source?: DeepPartial<BadgedButton>);
}
/**
Button configuration.
*/
export declare class ButtonConfiguration extends PartiallyConstructible {
    /**
      Whether the button is visible or not.
      @defaultValue true;
      */
    visible: boolean;
    /**
      The text to be displayed on the button.
      @defaultValue "";
      */
    text: string;
    /**
      The text to be read when button is selected through accessibility mode.
      @defaultValue "";
      */
    accessibilityDescription: string;
    /**
      The style of the button's background.
      @defaultValue new BackgroundStyle({});
      */
    background: BackgroundStyle;
    /**
      The style of the button's foreground (icon, text).
      @defaultValue new ForegroundStyle({});
      */
    foreground: ForegroundStyle;
    /** @param source {@displayType `DeepPartial<ButtonConfiguration>`} */
    constructor(source?: DeepPartial<ButtonConfiguration>);
}
/**
Button configuration.
*/
export declare class PopupMenuItem extends PartiallyConstructible {
    /**
      The text to be displayed on the button.
      @defaultValue new StyledText({});
      */
    title: StyledText;
    /**
      The text to be read when button is selected through accessibility mode.
      @defaultValue "";
      */
    accessibilityDescription: string;
    /**
      The style of the button's icon (icon, text).
      @defaultValue new IconStyle({});
      */
    icon: IconStyle;
    /** @param source {@displayType `DeepPartial<PopupMenuItem>`} */
    constructor(source?: DeepPartial<PopupMenuItem>);
}
/**
Button configuration.
*/
export declare class BarButtonConfiguration extends PartiallyConstructible {
    /**
      Whether the button is visible or not.
      @defaultValue true;
      */
    visible: boolean;
    /**
      The text to be displayed on the button.
      @defaultValue new StyledText({});
      */
    title: StyledText;
    /**
      The text to be read when button is selected through accessibility mode.
      @defaultValue "";
      */
    accessibilityDescription: string;
    /**
      The style of the button's background.
      @defaultValue new BackgroundStyle({});
      */
    background: BackgroundStyle;
    /**
      The style of the button's icon (icon, text).
      @defaultValue new IconStyle({});
      */
    icon: IconStyle;
    /** @param source {@displayType `DeepPartial<BarButtonConfiguration>`} */
    constructor(source?: DeepPartial<BarButtonConfiguration>);
}
/**
The sound selection type.

- `MODERN_BEEP`:
   To choose a modern beep sound.
- `CLASSIC_BEEP`:
   To choose the old classic beep sound.
*/
export type SoundType = "MODERN_BEEP" | "CLASSIC_BEEP";
export declare const SoundTypeValues: SoundType[];
/**
Sound configuration.
*/
export declare class Sound extends PartiallyConstructible {
    /**
      Enable or disable the beep sound when a barcode is detected.
      @defaultValue true;
      */
    successBeepEnabled: boolean;
    /**
      The beep type.
      @defaultValue "MODERN_BEEP";
      */
    soundType: SoundType;
    /** @param source {@displayType `DeepPartial<Sound>`} */
    constructor(source?: DeepPartial<Sound>);
}
/**
Vibration configuration.
*/
export declare class Vibration extends PartiallyConstructible {
    /**
      Enable or disable vibration when a barcode is detected.
      @defaultValue false;
      */
    enabled: boolean;
    /** @param source {@displayType `DeepPartial<Vibration>`} */
    constructor(source?: DeepPartial<Vibration>);
}
/**
Configuration of timeouts.
*/
export declare class Timeouts extends PartiallyConstructible {
    /**
      Sets the auto close timer in ms. Default is 0 (disabled).
      @defaultValue 0;
      */
    autoCancelTimeout: number;
    /**
      Sets the time in ms the first scan is delayed by. Default is 0 (disabled).
      @defaultValue 0;
      */
    initialScanDelay: number;
    /** @param source {@displayType `DeepPartial<Timeouts>`} */
    constructor(source?: DeepPartial<Timeouts>);
}
