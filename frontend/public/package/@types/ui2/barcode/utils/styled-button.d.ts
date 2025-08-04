import React from "react";
import { ButtonConfiguration } from "../../configuration";
export interface ButtonProps extends Omit<ButtonConfiguration, "accessibilityDescription"> {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    icon?: React.ReactNode;
    debugName?: string;
    disabled?: boolean;
    id?: string;
    ariaLabel?: string;
    iconPosition?: 'left' | 'right';
    styleOverrides?: React.CSSProperties;
    buttonWidth?: number;
}
export declare function StyledButton(props: ButtonProps): React.JSX.Element;
