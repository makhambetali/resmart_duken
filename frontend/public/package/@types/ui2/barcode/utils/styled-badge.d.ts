import React, { CSSProperties } from "react";
interface Props {
    foregroundColor: string;
    backgroundColor: string;
    text: string;
    children: React.ReactNode;
    badgeStyle?: CSSProperties;
    overlap?: 'rectangular' | 'circular';
}
export declare function StyledBadge(props: Props): React.JSX.Element;
export {};
