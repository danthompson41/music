

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.Uz98KJCR.js","_app/immutable/chunks/scheduler.k-kUyWhY.js","_app/immutable/chunks/index.8oxJKiNT.js"];
export const stylesheets = ["_app/immutable/assets/2.UauIfX32.css"];
export const fonts = [];
