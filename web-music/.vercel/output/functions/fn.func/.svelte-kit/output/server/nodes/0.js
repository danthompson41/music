

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.0sG8wE-q.js","_app/immutable/chunks/scheduler.k-kUyWhY.js","_app/immutable/chunks/index.8oxJKiNT.js"];
export const stylesheets = [];
export const fonts = [];