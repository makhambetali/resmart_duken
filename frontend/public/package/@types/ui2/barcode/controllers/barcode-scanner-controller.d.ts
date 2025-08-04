import React from 'react';
import { BarcodeScannerScreenConfiguration, BarcodeScannerUiResult } from '../../configuration';
export declare class Props {
    configuration: BarcodeScannerScreenConfiguration;
    onClose: () => void;
    onSubmit: (barcodeScannerResult: BarcodeScannerUiResult) => void;
    onError: (error: Error) => void;
}
export declare function BarcodeScannerController(props: Props): React.JSX.Element;
