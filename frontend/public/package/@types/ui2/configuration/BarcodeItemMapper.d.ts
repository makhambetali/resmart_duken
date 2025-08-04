import { BarcodeMappedData } from "./barcode/BarcodeInfoMapping";
import { BarcodeScannerUiItem } from "./barcode/BarcodeScannerUIResult";
/**
 * Maps a barcode's data to the data of the corresponding product.
 * */
export type BarcodeItemMapper = (BarcodeScannerUiItem: BarcodeScannerUiItem) => Promise<BarcodeMappedData>;
