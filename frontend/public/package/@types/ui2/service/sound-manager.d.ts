import { Sound } from "../configuration";
export default class SoundManager {
    static readonly INSTANCE: SoundManager;
    private audioFile;
    initialize(sound: Sound): Promise<void>;
    beep(sound: Sound): void;
    private play;
}
