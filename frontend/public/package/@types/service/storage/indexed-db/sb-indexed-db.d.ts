import { CroppedDetectionResult, Image } from "../../../core/worker/ScanbotSDK.Core";
import { SBDocumentData } from "../../../ui2/document/model/utils/sb-document-data";
export type SBStoreImageType = "original" | "cropped";
export declare class SBStoreImage {
    documentId: number;
    data: Image;
    type: SBStoreImageType;
}
export interface SBStorePageImage {
    image: Image;
}
export type SBStorageQuery = {
    type: "clear";
} | {
    type: "delete";
} | {
    type: "storeCroppedDetectionResult";
    data: CroppedDetectionResult;
} | {
    type: "getCroppedDetectionResults";
} | {
    type: "getCroppedDetectionResult";
    data: number;
} | {
    type: "storeImages";
    data: SBStoreImage[];
} | {
    type: "getImages";
    data: number[];
} | 
/** Document RTUUI storage queries */
{
    type: "getSBDocumentIds";
} | {
    type: "insertSBDocument";
    data: SBDocumentData;
} | {
    type: "getSBDocument";
    data: number;
} | {
    type: "deleteSBDocument";
    data: number;
} | {
    type: "insertSBPageImage";
    data: SBStorePageImage;
} | {
    type: "getSBPageImage";
    data: number;
} | {
    type: "deleteSBPageImages";
    data: number[];
};
export default class SBIndexedDB {
    private readonly worker;
    constructor();
    tokenCounter: number;
    generateUniqueToken(): string;
    taskMap: Map<any, any>;
    query<T>(query: SBStorageQuery): Promise<T>;
    destroy(): void;
}
