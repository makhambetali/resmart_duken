import { CroppedDetectionResult, Image } from "../../core/worker/ScanbotSDK.Core";
import { SBStoreImage } from "./indexed-db/sb-indexed-db";
import { SBDocument } from "../../ui2/document/model/sb-document";
import { SBPage } from "../../ui2/document/model/sb-page";
import { SBPageData } from "../../ui2/document/model/utils/sb-page-data";
import { SBDocumentData } from "../../ui2/document/model/utils/sb-document-data";
import { SBStorageUtils } from "./utils/sb-storage-utils";
export interface SBStoreCroppedDetectionResult extends CroppedDetectionResult {
    id: number;
}
export declare class SBStorage {
    readonly utils: SBStorageUtils;
    private db;
    /**
     * Clears all data from storage. Retains the database itself, including indexing.
     */
    clear(): Promise<void>;
    /**
     * @internal
     * Clears all data from storage. Does not retain the database, clearing indexes.
     * */
    delete(): Promise<void>;
    getCroppedDetectionResults(withImages?: boolean): Promise<SBStoreCroppedDetectionResult[]>;
    getCroppedDetectionResult(id: number): Promise<SBStoreCroppedDetectionResult>;
    private mapImages;
    getCroppedDetectionResultImages(documentIds: number[]): Promise<SBStoreImage[]>;
    getCroppedDetectionResultImage(documentId: number): Promise<SBStoreImage[]>;
    /**
     * Store a document in storage. Returns the auto-incremented ID of the stored document.
     * Please be aware that document images are stored separately,
     * image properties of 'CropperDetectionResult' are nullified and the images are stored in a separate table.
     */
    storeCroppedDetectionResult(input: CroppedDetectionResult): Promise<number>;
    getSBDocumentIds(): Promise<number[]>;
    getSBDocumentData(id: number): Promise<SBDocumentData>;
    /** @internal */
    insertSBDocument(input: SBDocument): Promise<number>;
    /** @internal */
    deleteSBDocument(document: SBDocument | number): Promise<boolean>;
    /** @internal */
    insertSBPageImage(input: Image): Promise<number>;
    getSBPageImage(id: number): Promise<Image>;
    /** @internal */
    deleteImageById(id: number): Promise<boolean>;
    /** @internal */
    deleteImages(page: SBPageData | SBPage): Promise<void>;
    destroy(): void;
}
