import { DocumentData } from "../../../configuration/native/DocumentData";
import { SBPageData } from "./sb-page-data";
import { ParametricFilter } from "../../../../core/bridge/compiled/ParametricFilters";
/**
 * Wrapper for the DocumentData object, overriding 'pages' property to extend properties.
 */
export declare class SBDocumentData extends DocumentData {
    pages: SBPageData[];
    filters?: ParametricFilter[];
}
