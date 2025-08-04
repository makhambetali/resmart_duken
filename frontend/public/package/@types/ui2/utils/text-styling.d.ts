export declare function styleToLimitNumberOfTextLines(numberOfLines: number): {
    readonly textOverflow: "ellipsis";
    readonly WebkitBoxOrient: "vertical";
    readonly WebkitLineClamp: `${number}`;
    readonly overflow: "hidden";
    readonly whiteSpace: "normal" | "nowrap";
    readonly display: "block" | "-webkit-box";
};
