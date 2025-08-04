import * as Config from "./configuration";
import { BarcodeScannerUiResult } from "./configuration";
import { DocumentScannerUIResult } from "./configuration/document/DocumentScannerUIResult";
import { SBDocument } from "./document/model/sb-document";
export default class ScanbotSDKUI {
    static SBDocument: typeof SBDocument;
    static createDocumentScanner(config: Config.DocumentScanningFlow, documentId?: number): Promise<DocumentScannerUIResult | null>;
    static createBarcodeScanner(config: Config.BarcodeScannerScreenConfiguration): Promise<BarcodeScannerUiResult | null>;
    private static createRoot;
    private static checkLicense;
    private static createContainer;
    static readonly Config: typeof Config;
}
