export declare class LazyInitializedSingleton<ValueType> {
    private factory;
    private _value;
    constructor(factory: () => ValueType);
    get value(): ValueType;
}
