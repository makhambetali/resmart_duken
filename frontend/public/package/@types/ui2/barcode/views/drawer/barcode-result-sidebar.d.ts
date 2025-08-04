import React from 'react';
import { DrawerHeaderContentProps } from "./subviews/drawer-header-content";
import { SheetContent } from "../../../configuration/barcode/MultipleScanningModeUseCase";
export declare class Props {
    headerProps: DrawerHeaderContentProps;
    sheetContent: SheetContent;
    isEmptyStateVisible: boolean;
    barcodeList: React.JSX.Element;
}
export default function BarcodeResultSidebar(props: Props): React.JSX.Element;
