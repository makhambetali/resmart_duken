export default class ExpectedBarcodeCounter {
    expectedCount: number;
    foundCount: number;
    constructor(expectedCount?: number, foundCount?: number);
    isFulFilled(): boolean;
    toString(): string;
}
