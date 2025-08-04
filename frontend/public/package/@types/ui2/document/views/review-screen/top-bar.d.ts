import React from 'react';
import { DocumentScanningFlow } from "../../../configuration/document/DocumentScanningFlow";
declare class Props {
    config: DocumentScanningFlow;
    numPages: number;
    onCloseButtonClick: () => void;
    onDeleteButtonClick: () => void;
    buttonsEnabled: boolean;
}
export declare function TopBar(props: Props): React.JSX.Element;
export {};
