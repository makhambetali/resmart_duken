import React from "react";
import { TopBarConfiguration } from "../../configuration/common/TopBarConfiguration";
declare class Props extends TopBarConfiguration {
    onBackPress: () => void;
    children: React.ReactNode;
}
type NavigationBarSize = {
    height: number;
    remainingVisibleBodyHeight: string;
    minTopPaddingForContent: number;
    minTopPaddingForViewFinder: number;
};
export declare const NavigationBarSizeContext: React.Context<NavigationBarSize>;
export default function NavigationBar(props: Props): React.JSX.Element;
export {};
