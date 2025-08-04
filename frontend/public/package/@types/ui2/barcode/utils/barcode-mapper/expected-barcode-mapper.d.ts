import { BarcodeMappedDataLoadingState, IBarcodeMapper } from "./i-barcode-mapper";
import { BarcodeItem } from "../../../configuration";
import { CountedBarcode } from "../../model/counted-barcodes";
import { ExpectedBarcode } from "../../../configuration/barcode/FindAndPickScanningModeUseCase";
export declare class ExpectedBarcodeMapper implements IBarcodeMapper {
    private barcodeItemSubtitleText;
    private foundBarcodes;
    private expectedBarcodes;
    constructor(barcodeItemSubtitleText: string, foundBarcodes: CountedBarcode[], expectedBarcodes: ExpectedBarcode[]);
    useBarcodeMappedData(barcode: BarcodeItem): BarcodeMappedDataLoadingState | null;
    addOnEvictionListener(): void;
    removeOnEvictionListener(): void;
}
