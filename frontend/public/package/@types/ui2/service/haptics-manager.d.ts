import { Vibration } from "../configuration";
export default class HapticsManager {
    static readonly INSTANCE: HapticsManager;
    private readonly DURATION;
    vibrate(vibration: Vibration): void;
}
