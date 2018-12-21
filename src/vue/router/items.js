const tab_class = () => import(/* webpackChunkName: "tabbar-class" */ '@/views/items/tabbar-class.vue');
const ItemSearch = () => import(/* webpackChunkName: "item-search" */ '@/views/items/search/');
const ItemSearchResult = () => import(/* webpackChunkName: "item-search" */ '@/views/items/search-result/');
const ItemList = () => import(/* webpackChunkName: "item-list" */ '@/views/items/list/');
const ItemDetail = () => import(/* webpackChunkName: "item-detail" */ '@/views/items/detail/');

const Tabbar = () => import(/* webpackChunkName: "Tabbar" */ '@/vue/components/Tabbar/');



export default [{
			path: "/items",
			name: "class",
			meta: {
				keepAlive: true,
                level: 0,
                title: '分类'	
			},
			components: { default: tab_class, tabbar: Tabbar }
	},{
			path: "/items/search",
			name: "search",
			meta: {
				keepAlive: true,
                level: 1,
                title: '搜索'	
			},
			component: ItemSearch
	},{
			path: "/items/search/result",
			name: "search-result",
			meta: {
				keepAlive: true,
                level: 2,
                title: ''	
			},
			component: ItemSearchResult,
			props: (route) => (route.query)
	},{
			path: "/items/detail/:itemId",
			name: "detail",
			props: true,
			meta: {
                level: 2,
                title: '商品详情'
			},
			components: {
				default: ItemDetail
			} 
	},{
			path: "/items/list",
			name: "list",
			meta: {
				keepAlive: true,
                level: 1,
                title: '商品列表'
			},
			component: ItemList,
			props: (route) => ({
                itemBid: + route.query.itemBid,
                itemCid: + route.query.itemCid,
                itemPcid: + route.query.itemPcid,
                keyword: route.query.keyword,
                cou_id: route.query.cou_id,
                st: route.query.st
			})
	}]