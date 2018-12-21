const tab_recommend = () =>
    import ( /* webpackChunkName: "tabbar-recommend" */ '@/views/recommend/tabbar-recommend.vue');
    
const Tabbar = () =>
	import ( /* webpackChunkName: "Tabbar" */ '@/vue/components/Tabbar/');

export default [
	{
		path: "/recommend",
		name: "recommend",
		components: {
			default: tab_recommend,
			tabbar: Tabbar,
		},
		meta: {
			keepAlive: true,
            level: 0,
            title: '推荐'
		}
	}
]
