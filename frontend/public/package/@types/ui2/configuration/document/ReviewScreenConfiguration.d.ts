import { BarButtonConfiguration } from "../common/Common";
import { ButtonConfiguration } from "../common/Common";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { IconButton } from "../common/Common";
import { PopupMenuItem } from "../common/Common";
import { RoundButton } from "../common/Common";
import { ScanbotAlertDialog } from "../common/ScanbotAlertDialog";
import { StyledText } from "../common/Common";
import { UserGuidanceConfiguration } from "../common/UserGuidanceConfiguration";
/**
Configuration of the bottom bar for the review screen.
*/
export declare class ReviewBottomBarConfiguration extends PartiallyConstructible {
    /**
      Configuration of the 'add' button, located in the bottom bar.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "text": "?reviewScreenAddButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionReviewAddButton",
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
    addButton: BarButtonConfiguration;
    /**
      Configuration of the 'retake' button, located in the bottom bar.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "text": "?reviewScreenRetakeButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionReviewRetakeButton",
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
      Configuration of the 'crop' button, located in the bottom bar.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "text": "?reviewScreenCropButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionReviewCropButton",
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
    cropButton: BarButtonConfiguration;
    /**
      Configuration of the 'rotate' button, located in the bottom bar.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "text": "?reviewScreenRotateButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionReviewRotateButton",
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
      Configuration of the 'delete' button, located in the bottom bar.
      @defaultValue new BarButtonConfiguration({
          "title": new StyledText({
              "text": "?reviewScreenDeleteButtonTitle",
              "color": "?sbColorOnPrimary"
          }),
          "accessibilityDescription": "?accessibilityDescriptionReviewDeleteButton",
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
    deleteButton: BarButtonConfiguration;
    /**
      Configuration of the 'submit' button, located in the bottom bar.
      @defaultValue new ButtonConfiguration({
          "text": "?reviewScreenSubmitButtonTitle",
          "accessibilityDescription": "?accessibilityDescriptionReviewSubmitButton",
          "background": new BackgroundStyle({
              "strokeColor": "?sbColorSurface",
              "fillColor": "?sbColorSurface",
              "strokeWidth": 0.0
          }),
          "foreground": new ForegroundStyle({
              "color": "?sbColorOnSurface"
          })
      });
      */
    submitButton: ButtonConfiguration;
    /** @param source {@displayType `DeepPartial<ReviewBottomBarConfiguration>`} */
    constructor(source?: DeepPartial<ReviewBottomBarConfiguration>);
}
/**
Configuration of the 'more' popup menu for the review screen.
*/
export declare class ReviewMorePopupMenu extends PartiallyConstructible {
    /**
      The background color of the popup menu.
      @defaultValue "?sbColorSurface";
      */
    backgroundColor: string;
    /**
      Configuration of the 'delete all' button.
      @defaultValue new PopupMenuItem({
          "title": new StyledText({
              "text": "?reviewScreenDeleteAllButtonTitle",
              "color": "?sbColorNegative"
          }),
          "accessibilityDescription": "?accessibilityDescriptionReviewDeleteAllButton",
          "icon": new IconStyle({
              "color": "?sbColorNegative"
          })
      });
      */
    deleteAll: PopupMenuItem;
    /** @param source {@displayType `DeepPartial<ReviewMorePopupMenu>`} */
    constructor(source?: DeepPartial<ReviewMorePopupMenu>);
}
/**
Configuration of the zoom overlay for the review screen.
*/
export declare class ZoomOverlay extends PartiallyConstructible {
    /**
      The background color of the zoom overlay.
      @defaultValue "?sbColorModalOverlay";
      */
    overlayColor: string;
    /**
      Configuration of the 'close' button for the zoom overlay.
      @defaultValue new ButtonConfiguration({
          "text": "?zoomOverlayCancelButtonText",
          "accessibilityDescription": "?accessibilityDescriptionZoomOverlayCancelButton",
          "background": new BackgroundStyle({
              "fillColor": "#00000000",
              "strokeWidth": 0.0
          }),
          "foreground": new ForegroundStyle({
              "color": "?sbColorOnPrimary"
          })
      });
      */
    closeButton: ButtonConfiguration;
    /** @param source {@displayType `DeepPartial<ZoomOverlay>`} */
    constructor(source?: DeepPartial<ZoomOverlay>);
}
/**
Configuration of the screen for reviewing the scanned pages.
*/
export declare class ReviewScreenConfiguration extends PartiallyConstructible {
    /**
      Determines whether the review screen should be shown or not. If 'false', the review screen will be skipped and the scanned document will be returned immediately.
      @defaultValue true;
      */
    enabled: boolean;
    /**
      Configuration of the title, located in the top bar.
      @defaultValue new StyledText({
          "text": "?reviewScreenTitle",
          "color": "?sbColorOnPrimary"
      });
      */
    topBarTitle: StyledText;
    /**
      Configuration of the 'more' button, located in the top bar.
      @defaultValue new IconButton({
          "color": "?sbColorOnPrimary",
          "accessibilityDescription": "?accessibilityDescriptionReviewMoreButton"
      });
      */
    topBarMoreButton: IconButton;
    /**
      Configuration of the 'back' button, located in the top bar.
      @defaultValue new ButtonConfiguration({
          "visible": true,
          "text": "?reviewTopBarBackButtonTitle",
          "accessibilityDescription": "?accessibilityDescriptionReviewTopBarBackButton",
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
      Configuration of the 'more' popup menu for the review screen.
      @defaultValue new ReviewMorePopupMenu({});
      */
    morePopup: ReviewMorePopupMenu;
    /**
      Configuration of the 'zoom' button.
      @defaultValue new RoundButton({
          "accessibilityDescription": "?accessibilityDescriptionReviewZoomButton",
          "backgroundColor": "?sbColorSurfaceHigh",
          "foregroundColor": "?sbColorOnPrimary"
      });
      */
    zoomButton: RoundButton;
    /**
      Configuration of the zoom overlay for the review screen.
      @defaultValue new ZoomOverlay({});
      */
    zoomOverlay: ZoomOverlay;
    /**
      The background color of the review screen.
      @defaultValue "?sbColorOnSurfaceVariant";
      */
    backgroundColor: string;
    /**
      Configuration of the bottom bar for the review screen.
      @defaultValue new ReviewBottomBarConfiguration({});
      */
    bottomBar: ReviewBottomBarConfiguration;
    /**
      Configuration of the 'next page' button.
      @defaultValue new IconButton({
          "color": "?sbColorOnPrimary",
          "accessibilityDescription": "?accessibilityDescriptionReviewNextPageButton"
      });
      */
    switchNextPageButton: IconButton;
    /**
      Configuration of the 'previous page' button.
      @defaultValue new IconButton({
          "color": "?sbColorOnPrimary",
          "accessibilityDescription": "?accessibilityDescriptionReviewPreviousPageButton"
      });
      */
    switchPreviousPageButton: IconButton;
    /**
      Configuration of the page count label.
      @defaultValue new UserGuidanceConfiguration({
          "title": new StyledText({
              "text": "?reviewScreenPageCount",
              "color": "?sbColorOnPrimary"
          }),
          "background": new BackgroundStyle({
              "fillColor": "?sbColorSurfaceHigh",
              "strokeWidth": 0.0
          })
      });
      */
    pageCounter: UserGuidanceConfiguration;
    /**
      Configuration of the alert dialog displayed when trying to delete all the pages.
      @defaultValue new ScanbotAlertDialog({
          "title": new StyledText({
              "text": "?reviewDeleteAllPagesAlertTitle",
              "color": "?sbColorOnSurface"
          }),
          "subtitle": new StyledText({
              "text": "?reviewDeleteAllPagesAlertSubtitle",
              "color": "?sbColorOnSurfaceVariant"
          }),
          "okButton": new ButtonConfiguration({
              "text": "?reviewDeleteAllPagesAlertDeleteButtonTitle",
              "accessibilityDescription": "?accessibilityDescriptionReviewDeleteAllPagesAlertDeleteButton",
              "background": new BackgroundStyle({
                  "fillColor": "?sbColorPrimary",
                  "strokeWidth": 0.0
              }),
              "foreground": new ForegroundStyle({
                  "color": "?sbColorOnPrimary"
              })
          }),
          "actionButton": new ButtonConfiguration({
              "visible": false
          }),
          "cancelButton": new ButtonConfiguration({
              "text": "?reviewDeleteAllPagesAlertCancelButtonTitle",
              "accessibilityDescription": "?accessibilityDescriptionReviewDeleteAllPagesAlertCancelButton",
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
    deleteAllPagesAlertDialog: ScanbotAlertDialog;
    /**
      Configuration of the alert dialog displayed when trying to delete a single page.
      @defaultValue new ScanbotAlertDialog({
          "title": new StyledText({
              "text": "?reviewDeletePageAlertTitle",
              "color": "?sbColorOnSurface"
          }),
          "subtitle": new StyledText({
              "text": "?reviewDeletePageAlertSubTitle",
              "color": "?sbColorOnSurfaceVariant"
          }),
          "okButton": new ButtonConfiguration({
              "text": "?reviewDeletePageAlertConfirmButtonTitle",
              "accessibilityDescription": "?accessibilityDescriptionReviewDeletePageAlertConfirmButton",
              "background": new BackgroundStyle({
                  "fillColor": "?sbColorPrimary",
                  "strokeWidth": 0.0
              }),
              "foreground": new ForegroundStyle({
                  "color": "?sbColorOnPrimary"
              })
          }),
          "actionButton": new ButtonConfiguration({
              "text": "?reviewDeletePageAlertDeleteRetakeButtonTitle",
              "accessibilityDescription": "?accessibilityDescriptionReviewDeletePageAlertDeleteRetakeButton",
              "background": new BackgroundStyle({
                  "fillColor": "#00000000",
                  "strokeWidth": 0.0
              }),
              "foreground": new ForegroundStyle({
                  "color": "?sbColorPrimary"
              })
          }),
          "cancelButton": new ButtonConfiguration({
              "text": "?reviewDeletePageAlertCancelButtonTitle",
              "accessibilityDescription": "?accessibilityDescriptionReviewDeletePageAlertCancelButton",
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
    deletePageAlertDialog: ScanbotAlertDialog;
    /** @param source {@displayType `DeepPartial<ReviewScreenConfiguration>`} */
    constructor(source?: DeepPartial<ReviewScreenConfiguration>);
}
