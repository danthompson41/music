

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.2NCoN2gH.js","_app/immutable/chunks/scheduler.k-kUyWhY.js","_app/immutable/chunks/index.8oxJKiNT.js","_app/immutable/chunks/singletons.qh5wRJgf.js"];
export const stylesheets = [];
export const fonts = [];
