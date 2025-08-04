export declare class BaseConfiguration {
    /**
     * The container HTML element of Scanbot Web SDK camera.
     * Required when 'containerId' property is left undefined when calling any ScanbotSDK createScanner function.
     * If both are provided, 'container' property takes precedence.
     */
    container?: HTMLElement;
    /**
     * The container HTML element id of Scanbot Web SDK camera.
     * Required when 'container' property is left undefined when calling any ScanbotSDK createScanner function
     * If both are provided, 'container' property takes precedence.
     */
    containerId?: string;
    static mapValues(source: any, destination: {
        [key: string]: any;
    }, ignore?: string[]): void;
    static mapValuesDeep(source: any, destination: {
        [key: string]: any;
    }): void;
    /**
     * Populate a base configuration object
     * and merge any of its values with the values provided in the partialConfigurationObject.
     */
    protected static _fromJson<BaseConfiguration>(result: BaseConfiguration, partialConfigurationObject: any): BaseConfiguration;
}
