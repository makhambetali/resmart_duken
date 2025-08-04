import React from "react";
import { ScanbotAlertDialog } from "../../../configuration";
declare class Props {
    open: boolean;
    onDismiss: () => void;
    onSubmit: () => void;
    style: ScanbotAlertDialog;
}
export declare function FindAndPickSubmitDialog(props: Props): React.JSX.Element;
export {};
