import React from "react";
import { SvgIconComponent } from "@mui/icons-material";
import { ButtonConfiguration, StyledText as StyledTextConfig } from "../../../../configuration";
export declare class ConfirmationDialogButtonProps {
    onClick: () => void;
    style: ButtonConfiguration;
    icon?: SvgIconComponent;
}
declare class Props {
    open: boolean;
    dividerColor: string;
    modalOverlayColor: string;
    sheetColor: string;
    title: StyledTextConfig;
    subtitle: StyledTextConfig;
    cancelButton: ConfirmationDialogButtonProps;
    okButton: ConfirmationDialogButtonProps;
}
export declare function ConfirmationDialog(props: Props): React.JSX.Element;
export {};
