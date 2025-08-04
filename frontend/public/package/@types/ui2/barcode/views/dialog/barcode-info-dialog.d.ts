import React from "react";
import { BarcodeInfoProps } from "../barcode-info/barcode-info";
import { ButtonConfiguration, SingleScanningMode, StyledText as StyledTextConfig } from "../../../configuration";
interface Props extends Omit<BarcodeInfoProps, "imageSize" | "maxNumberOfSubtitleLines" | "maxNumberOfTitleLines"> {
    open: boolean;
    dividerColor: string;
    cancelButton: ButtonConfiguration;
    submitButton: ButtonConfiguration;
    handleCancel: () => void;
    handleSubmit: () => void;
    loadingMessage: StyledTextConfig;
    sheetColorLoading: string;
    sheetColorLoaded: string;
    modalOverlayColor: string;
}
export declare function barcodeInfoDialogStylingPropsFromConfig(config: SingleScanningMode): {
    sheetColorLoaded: string;
    sheetColorLoading: string;
    barcodeImageVisible: boolean;
    barcodeTitle: StyledTextConfig;
    barcodeSubtitle: StyledTextConfig;
    cancelButton: ButtonConfiguration;
    submitButton: ButtonConfiguration;
    dividerColor: string;
    loadingMessage: StyledTextConfig;
};
export declare function BarcodeInfoDialog(props: Props): React.JSX.Element;
export {};
