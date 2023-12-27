

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.qfyJWrl9.js","_app/immutable/chunks/scheduler.1_433SNf.js","_app/immutable/chunks/index.YR9ItpMM.js","_app/immutable/chunks/index.BomQGc-Q.js"];
export const stylesheets = ["_app/immutable/assets/2._-jJIogW.css"];
export const fonts = [];
