interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const CalendarDay: $$__sveltets_2_IsomorphicComponent<{
    day: number;
    isCurrentMonth?: boolean;
    isToday?: boolean;
    isSelected?: boolean;
    hasData?: boolean;
    date: Date;
}, {
    select: CustomEvent<any>;
} & {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type CalendarDay = InstanceType<typeof CalendarDay>;
export default CalendarDay;
//# sourceMappingURL=CalendarDay.svelte.d.ts.map