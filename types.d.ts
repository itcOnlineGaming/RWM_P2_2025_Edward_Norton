export interface Stressor {
    id: string;
    name: string;
    level: 1 | 2 | 3 | 4 | 5;
    notes?: string;
    date: string;
    createdAt: number;
}
export interface StressData {
    [date: string]: Stressor[];
}
export interface BubblePosition {
    x: number;
    y: number;
    radius: number;
}
//# sourceMappingURL=types.d.ts.map