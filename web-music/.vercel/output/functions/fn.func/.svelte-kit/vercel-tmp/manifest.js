export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.5VHjhI_f.js","app":"_app/immutable/entry/app.meP9OWzh.js","imports":["_app/immutable/entry/start.5VHjhI_f.js","_app/immutable/chunks/scheduler.k-kUyWhY.js","_app/immutable/chunks/singletons.qh5wRJgf.js","_app/immutable/entry/app.meP9OWzh.js","_app/immutable/chunks/scheduler.k-kUyWhY.js","_app/immutable/chunks/index.8oxJKiNT.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
