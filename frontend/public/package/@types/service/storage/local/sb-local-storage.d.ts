type Types = {
    hasSeenIntroduction: boolean;
};
export declare class SBLocalStorage {
    private constructor();
    static get<keyType extends keyof Types>(key: keyType, defaultValue: Types[keyType]): Types[keyType];
    static set<keyType extends keyof Types>(key: keyType, value: Types[keyType]): void;
    static clear(): void;
    private static getKey;
}
export {};
