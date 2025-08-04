import { DeepPartial, PartiallyConstructible } from "../common";
import { Point } from "../common";
/**
Base class for units of text, e.g. glyphs, words, lines, blocks, pages.
*/
export type OcrElement = Glyph | Word | Line | Block | Page;
/** @internal */
export declare namespace OcrElement {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): OcrElement;
}
/**
Represents a single glyph, i.e. a character.
*/
export declare class Glyph extends PartiallyConstructible {
    readonly _type: "Glyph";
    /**
    The recognized text.
    */
    readonly text: string;
    /**
    Text confidence. Range is [0-1].
    */
    readonly confidence: number;
    /**
    Quad where the text was found in image coordinates. The order of the points is clockwise starting from the top left.
    */
    readonly roi: Point[];
    /** @param source {@displayType `DeepPartial<Glyph>`} */
    constructor(source?: DeepPartial<Glyph>);
}
/**
Represents a single word. A word is made up of glyphs.
*/
export declare class Word extends PartiallyConstructible {
    readonly _type: "Word";
    /**
    The recognized text.
    */
    readonly text: string;
    /**
    Text confidence. Range is [0-1].
    */
    readonly confidence: number;
    /**
    Quad where the text was found in image coordinates. The order of the points is clockwise starting from the top left.
    */
    readonly roi: Point[];
    /**
    List of glyphs.
    */
    readonly glyphs: Glyph[];
    /** @param source {@displayType `DeepPartial<Word>`} */
    constructor(source?: DeepPartial<Word>);
}
/**
Represents a single line. A line is made up of words.
*/
export declare class Line extends PartiallyConstructible {
    readonly _type: "Line";
    /**
    The recognized text.
    */
    readonly text: string;
    /**
    Text confidence. Range is [0-1].
    */
    readonly confidence: number;
    /**
    Quad where the text was found in image coordinates. The order of the points is clockwise starting from the top left.
    */
    readonly roi: Point[];
    /**
    List of words.
    */
    readonly words: Word[];
    /** @param source {@displayType `DeepPartial<Line>`} */
    constructor(source?: DeepPartial<Line>);
}
/**
Represents a single block, e.g. a paragraph. A block is made up of lines.
*/
export declare class Block extends PartiallyConstructible {
    readonly _type: "Block";
    /**
    The recognized text.
    */
    readonly text: string;
    /**
    Text confidence. Range is [0-1].
    */
    readonly confidence: number;
    /**
    Quad where the text was found in image coordinates. The order of the points is clockwise starting from the top left.
    */
    readonly roi: Point[];
    /**
    List of lines.
    */
    readonly lines: Line[];
    /** @param source {@displayType `DeepPartial<Block>`} */
    constructor(source?: DeepPartial<Block>);
}
/**
Represents result of performing OCR on an image. A page is made up of blocks.
*/
export declare class Page extends PartiallyConstructible {
    readonly _type: "Page";
    /**
    The recognized text.
    */
    readonly text: string;
    /**
    Text confidence. Range is [0-1].
    */
    readonly confidence: number;
    /**
    Quad where the text was found in image coordinates. The order of the points is clockwise starting from the top left.
    */
    readonly roi: Point[];
    /**
    List of blocks.
    */
    readonly blocks: Block[];
    /** @param source {@displayType `DeepPartial<Page>`} */
    constructor(source?: DeepPartial<Page>);
}
