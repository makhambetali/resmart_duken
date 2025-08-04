import { MagneticLine } from "./dto/MagneticLine";
import { Size } from "./dto/Size";
import { Point } from "./dto/Point";
import { ScannerConfiguration } from "../model/configuration/scanner-configuration";
export declare class ViewUtils {
    static convertLinesToViewportLines(elementSize: Size, lines: MagneticLine[]): MagneticLine[];
    static convertToViewportPointsFromParentSize(elementSize: Size, points: any[]): Point[] | undefined;
    private static calculateScale;
    static findScale(element: Size, video: Size): {
        x: number;
        y: number;
        scale: number;
    };
    private static preventDefaultCallback;
    static disableScreenMovement(): void;
    static enableScreenMovement(): void;
    static findContainerOrThrow(configuration: ScannerConfiguration): HTMLElement;
}
