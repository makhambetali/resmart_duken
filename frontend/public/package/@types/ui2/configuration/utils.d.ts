export type { Point, RawImage } from '../../core-types';
import { Point, Rectangle, Image } from '../../core-types';
type TypesThatAreOpaqueToDeepPartial = Function | Image | Point | Rectangle;
export type DeepPartial<T> = T extends TypesThatAreOpaqueToDeepPartial ? T : T extends Array<infer I> ? DeepPartial<I>[] : T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
export declare abstract class PartiallyConstructible {
}
