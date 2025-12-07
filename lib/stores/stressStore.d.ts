import type { StressData } from '../../types.ts';
export declare const stressData: import("svelte/store").Writable<StressData>;
export declare const currentDate: import("svelte/store").Writable<string>;
export declare const currentStressors: import("svelte/store").Readable<import("../../types.ts").Stressor[]>;
export declare const stressActions: {
    loadData: (data: StressData) => void;
    addStressor: (date: string, stressor: any) => void;
    updateStressor: (date: string, stressorId: string, updates: Partial<any>) => void;
    deleteStressor: (date: string, stressorId: string) => void;
    setDate: (date: string) => void;
};
//# sourceMappingURL=stressStore.d.ts.map