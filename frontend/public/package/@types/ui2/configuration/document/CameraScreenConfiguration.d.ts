import { AcknowledgementScreenConfiguration } from "../document/AcknowledgementScreenConfiguration";
import { BadgeStyle } from "../common/Common";
import { BarButtonConfiguration } from "../common/Common";
import { ButtonConfiguration } from "../common/Common";
import { CameraPermissionScreen } from "../common/CameraPermission";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { DocumentScannerCameraConfiguration } from "../document/DocumentScannerCameraConfiguration";
import { DocumentScannerUserGuidance } from "../document/DocumentScannerUserGuidance";
import { IconButton } from "../common/Common";
import { IntroductionScreenConfiguration } from "../document/IntroductionScreenConfiguration";
import { PolygonStyle } from "../common/Common";
import { PopupMenuItem } from "../common/Common";
import { ScanbotAlertDialog } from "../common/ScanbotAlertDialog";
import { StyledText } from "../common/Common";
import { Timeouts } from "../common/Common";
import { UserGuidanceConfiguration } from "../common/UserGuidanceConfiguration";
import { UserGuidanceVisibility } from "../document/DocumentScannerGuidanceVisibility";
import { Vibration } from "../common/Common";
import { ViewFinderConfiguration } from "../common/ViewFinderConfiguration";
/**
Configuration of the 'shutter' button.
*/
export declare class ShutterButton extends PartiallyConstructible {
    /**
      Determines if the 'shutter' button can be tapped to manually snap a document when 'auto snapping mode' is active.
      @defaultValue true;
      */
    enabledInAutoSnappingMode: boolean;
    /**
      The text to be read when the 'shutter' button is selected via the accessibility mode.
      @defaultValue "?accessibilityDescriptionCameraShutterButton";
      */
    accessibilityDescription: string;
    /**
      The outer color of the 'shutter' button.
      @defaultValue "?sbColorOnPrimary";
      */
    outerColor: string;
    /**
      The inner color of the 'shutter' button.
      @defaultValue "?sbColorOnPrimary";
      */
    innerColor: string;
    /** @param source {@displayType `DeepPartial<ShutterButton>`} */
    constructor(source?: DeepPartial<ShutterButton>);
}
/**
Configuration of the 'preview' button.
*/
export type PreviewButton = PagePreviewMode | TextButtonMode | NoButtonMode;
/** @internal */
export declare namespace PreviewButton {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): PreviewButton;
}
/**
Configuration of the scan assistance overlay.
*/
export declare class ScanAssistanceOverlay extends PartiallyConstructible {
    /**
      Determines whether the scan assistance overlay is visible or not. If the viewfinder is enabled, this flag is ignored and the scan assistance overlay is not displayed.
      @defaultValue true;
      */
    visible: boolean;
    /**
      The background color of the scan assistance overlay.
      @defaultValue "?sbColorModalOverlay";
      */
    backgroundColor: string;
    /**
      The foreground color of the scan assistance overlay image.
      @defaultValue "?sbColorSurface";
      */
    foregroundColor: string;
    /** @param source {@displayType `DeepPartial<ScanAssistanceOverlay>`} */
    constructor(source?: DeepPartial<ScanAssistanceOverlay>);
}
/**
Configuration of the 'preview' button in 'page preview mode'.
*/
export declare class PagePreviewMode extends PartiallyConstructible {
    readonly _type: "PagePreviewMode";
    /**
      The text to be read when the 'preview' button is selected via the accessibility mode.
      @defaultValue "?accessibilityDescriptionCameraPreviewButton";
      */
    accessibilityDescription: string;
    /**
      The color of the image placeholder.
      @defaultValue "?sbColorOnSurfaceVariant";
      */
    imagePlaceholderColor: string;
    /**
      Configuration of the page counter icon.
      @defaultValue new BadgeStyle({
          "visible": true,
          "background": new BackgroundStyle({
              "strokeColor": "?sbColorSurface",
              "fillColor": "?sbColorSurface"
          }),
          "foregroundColor": "?sbColorPrimary"
      });
      */
    pageCounter: BadgeStyle;
    /** @param source {@displayType `DeepPartial<PagePreviewMode>`} */
    constructor(source?: DeepPartial<PagePreviewMode>);
}
/**
Configuration of the 'preview' button in 'text button mode'.
*/
export declare class TextButtonMode extends PartiallyConstructible {
    readonly _type: "TextButtonMode";
    /**
      The text to be read when the 'preview' button is selected via the accessibility mode.
      @defaultValue "?accessibilityDescriptionCameraPreviewButton";
      */
    accessibilityDescription: string;
    /**
      Configuration of the text style for the 'preview' button.
      @defaultValue new StyledText({
          "text": "?cameraPreviewButtonTitle",
          "color": "?sbColorOnPrimary"
      });
      */
    style: StyledText;
    /** @param source {@displayType `DeepPartial<TextButtonMode>`} */
    constructor(source?: DeepPartial<TextButtonMode>);
}
/**
Configuration of the 'preview' button in 'no button mode'.
*/
export declare class NoButtonMode extends PartiallyConstructible {
    readonly _type: "NoButtonMode";
    /**
      Whether the button is visible.
      @defaultValue false;
      */
    readonly visible: boolean;
    /** @param source {@displayType `DeepPartial<NoButtonMode>`} */
    constructor(source?: DeepPartial<NoButtonMode>);
}
/**
Configuration of the bottom bar for the camera screen.
*/
export declare class CameraBottomBar extends PartiallyConstructible {
    /**
      Configuration of the 'import' button.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "visible": false,
              "text": "?cameraImportButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionCameraImportButton",
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
    importButton: BarButtonConfiguration;
    /**
      Configuration of the 'auto snapping mode' button.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "visible": false,
              "text": "?cameraAutoSnapButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionCameraAutoSnapButton",
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
    autoSnappingModeButton: BarButtonConfiguration;
    /**
      Configuration of the 'manual snapping mode' button.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "visible": false,
              "text": "?cameraManualSnapButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionCameraManualSnapButton",
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
    manualSnappingModeButton: BarButtonConfiguration;
    /**
      Configuration of the 'shutter' button.
      @defaultValue new ShutterButton({
          "accessibilityDescription": "?accessibilityDescriptionCameraShutterButton"
      });
      */
    shutterButton: ShutterButton;
    /**
      Configuration of the 'flashlight' button when in the 'on' state.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "visible": false,
              "text": "?cameraTorchOnButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionCameraTorchOnButton",
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
    torchOnButton: BarButtonConfiguration;
    /**
      Configuration of the 'flashlight' button when in the 'off' state.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "visible": false,
              "text": "?cameraTorchOffButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionCameraTorchOffButton",
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
    torchOffButton: BarButtonConfiguration;
    /**
      Configuration of the 'preview' button.
      @defaultValue new PagePreviewMode({});
      */
    previewButton: PreviewButton;
    /** @param source {@displayType `DeepPartial<CameraBottomBar>`} */
    constructor(source?: DeepPartial<CameraBottomBar>);
}
/**
The type of animation to display after snapping a page.
*/
export type PageSnapFeedbackMode = PageSnapFunnelAnimation | PageSnapCheckMarkAnimation | PageSnapFeedbackNone;
/** @internal */
export declare namespace PageSnapFeedbackMode {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): PageSnapFeedbackMode;
}
/**
Configuration of the funnel animation.
*/
export declare class PageSnapFunnelAnimation extends PartiallyConstructible {
    readonly _type: "PageSnapFunnelAnimation";
    /**
      The overlay color for the funnel animation.
      @defaultValue "?sbColorModalOverlay";
      */
    overlayColor: string;
    /** @param source {@displayType `DeepPartial<PageSnapFunnelAnimation>`} */
    constructor(source?: DeepPartial<PageSnapFunnelAnimation>);
}
/**
Configuration of the check mark animation.
*/
export declare class PageSnapCheckMarkAnimation extends PartiallyConstructible {
    readonly _type: "PageSnapCheckMarkAnimation";
    /**
      The overlay color for the check mark animation.
      @defaultValue "?sbColorModalOverlay";
      */
    overlayColor: string;
    /**
      The background color for the check mark animation.
      @defaultValue "?sbColorOutline";
      */
    checkMarkBackgroundColor: string;
    /**
      The check mark color for the check mark animation.
      @defaultValue "#00000000";
      */
    checkMarkColor: string;
    /** @param source {@displayType `DeepPartial<PageSnapCheckMarkAnimation>`} */
    constructor(source?: DeepPartial<PageSnapCheckMarkAnimation>);
}
/**
To not use a snap animation.
*/
export declare class PageSnapFeedbackNone extends PartiallyConstructible {
    readonly _type: "PageSnapFeedbackNone";
    /** @param source {@displayType `DeepPartial<PageSnapFeedbackNone>`} */
    constructor(source?: DeepPartial<PageSnapFeedbackNone>);
}
/**
Configuration of the feedback shown after snapping a page.
*/
export declare class CaptureFeedback extends PartiallyConstructible {
    /**
      Whether the camera preview should blink or not after snapping a page.
      @defaultValue true;
      */
    cameraBlinkEnabled: boolean;
    /**
      The type of animation to display after snapping a page.
      @defaultValue new PageSnapFunnelAnimation({});
      */
    snapFeedbackMode: PageSnapFeedbackMode;
    /** @param source {@displayType `DeepPartial<CaptureFeedback>`} */
    constructor(source?: DeepPartial<CaptureFeedback>);
}
/**
Configuration of the document contour detection polygon.
*/
export declare class DocumentPolygonConfiguration extends PartiallyConstructible {
    /**
      Determines the visibility mode for the polygon.
      @defaultValue "ENABLED";
      */
    visibility: UserGuidanceVisibility;
    /**
      Configuration of the polygon when the detected document status is 'OK'.
      @defaultValue new PolygonStyle({
          "strokeColor": "?sbColorPositive",
          "fillColor": "#00000000",
          "strokeWidth": 2.0
      });
      */
    documentOk: PolygonStyle;
    /**
      Configuration of the polygon when the detected document status is 'not OK'.
      @defaultValue new PolygonStyle({
          "strokeColor": "?sbColorNegative",
          "fillColor": "#00000000",
          "strokeWidth": 2.0
      });
      */
    documentNotOk: PolygonStyle;
    /**
      Configuration of the animated polygon when the document is being scanned for capturing in 'auto snapping mode'.
      @defaultValue new PolygonStyle({
          "strokeColor": "#40A9FF",
          "fillColor": "#00000000",
          "strokeWidth": 2.0
      });
      */
    autoSnapProgress: PolygonStyle;
    /** @param source {@displayType `DeepPartial<DocumentPolygonConfiguration>`} */
    constructor(source?: DeepPartial<DocumentPolygonConfiguration>);
}
/**
Configuration of the 'select camera' menu.
*/
export declare class SelectCameraMenu extends PartiallyConstructible {
    /**
      Configuration of the icon that toggles the 'select camera' menu.
      @defaultValue new IconButton({
          "color": "?sbColorOnPrimary",
          "accessibilityDescription": "?accessibilityDescriptionCameraSelectButton"
      });
      */
    button: IconButton;
    /**
      The background color of the 'select camera' menu.
      @defaultValue "?sbColorSurface";
      */
    backgroundColor: string;
    /**
      Configuration of the title of the 'select camera' menu.
      @defaultValue new StyledText({
          "text": "?cameraSelectCameraMenuTitle",
          "color": "?sbColorOnSurfaceVariant"
      });
      */
    title: StyledText;
    /**
      The color of the divider that separates the 'select camera' title from the menu items.
      @defaultValue "?sbColorOutline";
      */
    dividerColor: string;
    /**
      Configuration of the menu items in the 'select camera' menu.
      @defaultValue new PopupMenuItem({
          "title": new StyledText({
              "color": "?sbColorOnSurface"
          }),
          "accessibilityDescription": "?accessibilityDescriptionCameraSelectMenuItem",
          "icon": new IconStyle({
              "color": "?sbColorOnSurface"
          })
      });
      */
    menuEntry: PopupMenuItem;
    /**
      Configuration of the active menu items in the 'select camera' menu.
      @defaultValue new PopupMenuItem({
          "title": new StyledText({
              "color": "?sbColorPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionCameraSelectMenuItem",
          "icon": new IconStyle({
              "color": "?sbColorPrimary"
          })
      });
      */
    menuEntryActive: PopupMenuItem;
    /** @param source {@displayType `DeepPartial<SelectCameraMenu>`} */
    constructor(source?: DeepPartial<SelectCameraMenu>);
}
/**
Configuration of the screen for scanning the pages with the camera.
*/
export declare class CameraScreenConfiguration extends PartiallyConstructible {
    /**
      Configuration of the acknowledgement screen.
      @defaultValue new AcknowledgementScreenConfiguration({});
      */
    acknowledgement: AcknowledgementScreenConfiguration;
    /**
      Configuration of the introduction screen.
      @defaultValue new IntroductionScreenConfiguration({});
      */
    introduction: IntroductionScreenConfiguration;
    /**
      Configuration of the scan assistance overlay.
      @defaultValue new ScanAssistanceOverlay({});
      */
    scanAssistanceOverlay: ScanAssistanceOverlay;
    /**
      Configuration of the camera permission screen.
      @defaultValue new CameraPermissionScreen({
          "background": "?sbColorSurface",
          "iconBackground": "?sbColorOutline",
          "icon": new IconStyle({
              "visible": true,
              "color": "?sbColorOnSurface"
          }),
          "closeButton": new ButtonConfiguration({
              "visible": true,
              "text": "?cameraPermissionCloseButton",
              "accessibilityDescription": "?accessibilityDescriptionCameraPermissionCloseButton",
              "background": new BackgroundStyle({
                  "strokeColor": "?sbColorPrimary",
                  "fillColor": "?sbColorPrimary",
                  "strokeWidth": 0.0
              }),
              "foreground": new ForegroundStyle({
                  "iconVisible": true,
                  "color": "?sbColorOnPrimary",
                  "useShadow": false
              })
          }),
          "enableCameraTitle": new StyledText({
              "text": "?cameraPermissionEnableCameraTitle",
              "color": "?sbColorOnSurface"
          }),
          "enableCameraExplanation": new StyledText({
              "text": "?cameraPermissionEnableCameraExplanation",
              "color": "?sbColorOnSurfaceVariant"
          })
      });
      */
    cameraPermission: CameraPermissionScreen;
    /**
      Configuration of the title, located in the top bar.
      @defaultValue new StyledText({
          "text": "?cameraTopBarTitle",
          "color": "?sbColorOnPrimary"
      });
      */
    topBarTitle: StyledText;
    /**
      Configuration of the 'introduction' button, located in the top bar.
      @defaultValue new IconButton({
          "color": "?sbColorOnPrimary",
          "accessibilityDescription": "?accessibilityDescriptionCameraTopBarIntroButton"
      });
      */
    topBarIntroButton: IconButton;
    /**
      Configuration of the 'cancel' button, located in the top bar.
      @defaultValue new ButtonConfiguration({
          "visible": true,
          "text": "?cameraTopBarCancelButtonTitle",
          "accessibilityDescription": "?accessibilityDescriptionCameraTopBarCancelButton",
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
      Configuration of the 'select camera' button, located in the top bar.
      @defaultValue new SelectCameraMenu({});
      */
    topBarCameraSelect: SelectCameraMenu;
    /**
      Configuration of the static user guidance, located just below the top bar.
      @defaultValue new UserGuidanceConfiguration({
          "title": new StyledText({
              "text": "?cameraTopGuidance",
              "color": "?sbColorOnPrimary"
          })
      });
      */
    topUserGuidance: UserGuidanceConfiguration;
    /**
      Configuration of the hints guiding users through the scanning process.
      @defaultValue new DocumentScannerUserGuidance({});
      */
    userGuidance: DocumentScannerUserGuidance;
    /**
      The background color of the camera screen.
      @defaultValue "#000000FF";
      */
    backgroundColor: string;
    /**
      Configuration of the camera behavior.
      @defaultValue new DocumentScannerCameraConfiguration({});
      */
    cameraConfiguration: DocumentScannerCameraConfiguration;
    /**
      Configuration of the document contour detection polygon.
      @defaultValue new DocumentPolygonConfiguration({});
      */
    polygon: DocumentPolygonConfiguration;
    /**
      Configuration of the bottom bar for the camera screen.
      @defaultValue new CameraBottomBar({});
      */
    bottomBar: CameraBottomBar;
    /**
      Configuration of the viewfinder.
      @defaultValue new ViewFinderConfiguration({
          "visible": false,
          "aspectRatio": new AspectRatio({
              "width": 21.0,
              "height": 29.0
          })
      });
      */
    viewFinder: ViewFinderConfiguration;
    /**
      Configuration of the feedback shown after snapping a page.
      @defaultValue new CaptureFeedback({});
      */
    captureFeedback: CaptureFeedback;
    /**
      Configuration of the scan confirmation vibration.
      @defaultValue new Vibration({
          "enabled": true
      });
      */
    vibration: Vibration;
    /**
      Configuration of timeouts.
      @defaultValue new Timeouts({
          "autoCancelTimeout": 0,
          "initialScanDelay": 0
      });
      */
    timeouts: Timeouts;
    /**
      Configuration of the alert dialog displayed when the scan limit is reached.
      @defaultValue new ScanbotAlertDialog({
          "title": new StyledText({
              "text": "?cameraLimitReachedAlertTitle",
              "color": "?sbColorOnSurface"
          }),
          "subtitle": new StyledText({
              "text": "?cameraLimitReachedAlertSubtitle",
              "color": "?sbColorOnSurfaceVariant"
          }),
          "okButton": new ButtonConfiguration({
              "text": "?cameraLimitReachedOkButtonTitle",
              "accessibilityDescription": "?accessibilityDescriptionCameraLimitReachedOkButton",
              "background": new BackgroundStyle({
                  "fillColor": "?sbColorPrimary",
                  "strokeWidth": 0.0
              }),
              "foreground": new ForegroundStyle({
                  "color": "?sbColorOnPrimary"
              })
          }),
          "cancelButton": new ButtonConfiguration({
              "visible": false
          })
      });
      */
    limitReachedAlertDialog: ScanbotAlertDialog;
    /**
      Configuration of the alert dialog displayed when the 'cancel' button is pressed.
      @defaultValue new ScanbotAlertDialog({
          "title": new StyledText({
              "text": "?cameraCancelAlertTitle",
              "color": "?sbColorOnSurface"
          }),
          "subtitle": new StyledText({
              "text": "?cameraCancelAlertSubtitle",
              "color": "?sbColorOnSurfaceVariant"
          }),
          "okButton": new ButtonConfiguration({
              "text": "?cameraCancelYesButtonTitle",
              "accessibilityDescription": "?accessibilityDescriptionCameraCancelYesButton",
              "background": new BackgroundStyle({
                  "fillColor": "?sbColorPrimary",
                  "strokeWidth": 0.0
              }),
              "foreground": new ForegroundStyle({
                  "color": "?sbColorOnPrimary"
              })
          }),
          "cancelButton": new ButtonConfiguration({
              "text": "?cameraCancelNoButtonTitle",
              "accessibilityDescription": "?accessibilityDescriptionCameraCancelNoButton",
              "background": new BackgroundStyle({
                  "fillColor": "#00000000",
                  "strokeWidth": 0.0
              }),
              "foreground": new ForegroundStyle({
                  "color": "?sbColorPrimary"
              })
          })
      });
      */
    cancelAlertDialog: ScanbotAlertDialog;
    /** @param source {@displayType `DeepPartial<CameraScreenConfiguration>`} */
    constructor(source?: DeepPartial<CameraScreenConfiguration>);
}
