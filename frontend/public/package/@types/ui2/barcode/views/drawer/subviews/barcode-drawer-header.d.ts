import React, { Ref } from "react";
import { DragProps } from "../hooks/use-drag-listener";
import { DrawerHeaderContentProps } from "./drawer-header-content";
export declare class Props {
    innerRef: Ref<HTMLDivElement>;
    dragProps?: DragProps;
    drawerHeaderContentProps: DrawerHeaderContentProps;
}
export declare function BarcodeDrawerHeader(props: Props): React.JSX.Element;
