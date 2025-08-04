import { FindAndPickScanningMode } from "../barcode/FindAndPickScanningModeUseCase";
import { MultipleScanningMode } from "../barcode/MultipleScanningModeUseCase";
import { SingleScanningMode } from "../barcode/SingleScanningModeUseCase";
/**
Configuration of the barcode scanner screen's behavior.
*/
export type BarcodeUseCase = SingleScanningMode | MultipleScanningMode | FindAndPickScanningMode;
/** @internal */
export declare namespace BarcodeUseCase {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): BarcodeUseCase;
}
