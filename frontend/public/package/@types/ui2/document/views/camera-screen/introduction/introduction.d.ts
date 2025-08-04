import { IntroductionScreenConfiguration } from "../../../../configuration/document/IntroductionScreenConfiguration";
import React from "react";
type Props = {
    config: IntroductionScreenConfiguration;
    isOpen: boolean;
    onClose: () => void;
};
export declare function Introduction(props: Props): React.JSX.Element;
export {};
