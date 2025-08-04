import { ScanbotAlertDialog } from "../../../configuration/common/ScanbotAlertDialog";
import React from "react";
declare class Props {
    config: ScanbotAlertDialog;
    open: boolean;
    onCancelClick: () => void;
    onOkClick: () => void;
    onActionClick?: () => void;
}
export declare function AlertDialog(props: Props): React.JSX.Element;
export {};
