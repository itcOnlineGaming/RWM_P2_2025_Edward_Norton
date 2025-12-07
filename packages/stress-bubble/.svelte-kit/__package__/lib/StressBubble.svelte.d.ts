import type { Stressor } from '../types.ts';
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
declare const StressBubble: $$__sveltets_2_IsomorphicComponent<{
    stressor: Stressor;
}, {
    click: CustomEvent<any>;
    removeCell: CustomEvent<any>;
} & {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type StressBubble = InstanceType<typeof StressBubble>;
export default StressBubble;
//# sourceMappingURL=StressBubble.svelte.d.ts.map