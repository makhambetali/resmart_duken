import { Point } from "./dto/Point";
export declare class MathUtils {
    /**
     * Adapted (stolen) from java implementation here:
     * https://stackoverflow.com/questions/471962/how-do-i-efficiently-determine-if-a-polygon-is-convex-non-convex-or-complex
     * Specifically this algorithm because it's simpler: the returned polygon will always be simple (non self-intersecting)
     */
    static isConvex(_vertices: Point[]): boolean;
    static distanceBetweenPoints(point1: Point, point2: Point): number;
    static intersection(lineA: [Point, Point], lineB: [Point, Point]): Point | undefined;
}
