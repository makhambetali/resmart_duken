import { Polygon } from "../dto/Polygon";
import { VideoSize } from "../dto/VideoSize";
export declare class PolygonMovementPredicate {
    private static DEFAULT_SENSITIVITY;
    private lastPolygon;
    private maxDistance;
    private sensitivity;
    constructor(videoSize: VideoSize, sensitivity?: number);
    check(polygon: Polygon): boolean;
    reset(): void;
    update(polygon: Polygon): void;
    private isPointMoved;
    private calculateMaxDistance;
}
