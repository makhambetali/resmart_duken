declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: true;
        sm: false;
        md: false;
        lg: false;
        xl: false;
    }
}
type LayoutType = 'mobile' | 'tablet' | 'desktop';
export declare const createSBTheme: () => import("@mui/material").Theme;
export declare function useIsLayout(layout: LayoutType): boolean;
export declare function useIsLayoutEqualOrAbove(layout: LayoutType): boolean;
export {};
