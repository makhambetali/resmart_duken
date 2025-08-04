export declare function secondaryButtonStyling(color: string): {
    "&:focus-visible": {
        outlineColor: string;
        outlineWidth: string;
        outlineStyle: string;
    };
    color: string;
    "&:hover": {
        textDecoration: string;
        backgroundColor: string;
    };
};
export declare function defaultButtonStylingFocus(color: string): {
    "&:focus-visible": {
        outlineColor: string;
        outlineWidth: string;
        outlineStyle: string;
    };
};
export declare function secondaryButtonStylingHover(color: string): {
    color: string;
    "&:hover": {
        textDecoration: string;
        backgroundColor: string;
    };
};
export declare function primaryButtonStylingHover(): {
    "& span": {
        transition: string;
    };
    "&:hover span": {
        transform: string;
    };
    "& > div, &": {
        transition: string;
    };
    "&:hover > div, &:hover": {
        borderRadius: string;
    };
};
