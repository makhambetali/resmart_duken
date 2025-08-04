import React from "react";
interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    inputRef: React.RefObject<HTMLInputElement>;
}
export declare function StyledInput({ inputRef, ...props }: Props): React.JSX.Element;
export {};
