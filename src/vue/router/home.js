const tab_home = () =>
	import ( /* webpackChunkName: "tabbar-home" */ '@/views/home/tabbar-home.vue');
const Tabbar = () =>
	import ( /* webpackChunkName: "Tabbar" */ '@/vue/components/Tabbar/');
const Search = () => 
	import ( /* webpackChunkName: "Search" */ '@/vue/components/Search/');
//品牌特卖
const brands = () => import(/* webpackChunkName: "brands" */ '@/views/home/icon-btn/brands/');
//控区控货
const goods = () => import(/* webpackChunkName: "goods" */ '@/views/home/icon-btn/goods/');
//清仓特卖
const clearance = () => import(/* webpackChunkName: "clearance" */ '@/views/home/icon-btn/clearance/');
//今日上新
const news = () => import(/* webpackChunkName: "news" */ '@/views/home/icon-btn/news/');
//积分兑换
const points = () => import(/* webpackChunkName: "points" */ '@/views/home/icon-btn/points/');

//每日必抢(限时抢购，秒杀)
const grab = () => import(/* webpackChunkName: "grab" */ '@/views/home/grab/');
//限时抢购专题页
const limittime = () => import(/* webpackChunkName: "limittime" */ '@/views/home/limittime/');

//预售商品列表
const PreList = () => import(/* webpackChunkName: "pre_list" */ '@/views/home/presale/');
//预售商品详情
const PreDetail = () => import(/* webpackChunkName: "pre_detail" */ '@/views/home/presale/detail.vue');
//预售商品订单
const PreOrder = () => import(/* webpackChunkName: "pre_order" */ '@/views/home/presale/order.vue');


//促销专区带分类
const prom_info = () => import(/* webpackChunkName: "prom_info" */ '@/views/home/prom_info/');

//促销专区不带分类
const prom_area_list = () => import(/* webpackChunkName: "prom_area_list" */ '@/views/home/prom_area_list/');

//红包雨前置页面
const red_packet = () => import(/* webpackChunkName: "red_packet" */ '@/views/home/prize/red_packet.vue');
//红包雨开始页面
const red_packet_start = () => import(/* webpackChunkName: "red_packet_start" */ '@/views/home/prize/red_packet_start.vue');

//九宫格
const speed_dial = () => import(/* webpackChunkName: "speed_dial" */ '@/views/home/prize/speed_dial.vue');



export default [
	{
		path: "/",
		name: "home",
		components: {
			default: tab_home,
			tabbar: Tabbar,
		},
		meta: {
			keepAlive: true,
            level: 0,
            title: '首页'
		}
	},
	{
		path: "/home/brands",
		name: "brands",
		components: {
			default: brands
		},
		meta: {
			keepAlive: true,
            level: 1,
            title: ''
		}
	},
	{
		path: "/home/goods",
		name: "goods",
		components: {
			default: goods
		},
		meta: {
			keepAlive: true,
            level: 1,
            title: ''
		}
	},
	{
		path: "/home/clearance",
		name: "clearance",
		components: {
			default: clearance
		},
		meta: {
			keepAlive: true,
            level: 1,
            title: ''
		}
	},
	{
		path: "/home/news",
		name: "news",
		components: {
			default: news
		},
		meta: {
			keepAlive: true,
            level: 1,
            title: ''
		}
	},
	{
		path: "/home/points",
		name: "points",
		components: {
			default: points
		},
		meta: {
			keepAlive: true,
            level: 1,
            title: ''
		}
	},
	{
		path: "/home/search",
		name: "search",
		components: {
			default: Search
		},
		meta: {
            level: 6,
            title: '搜索'
		}
	}, 
	{
		path: "/home/grab/:itemClass",
        name: "grab",
        props: true,
		components: {
			default: grab
		},
		meta: {
            level: 1,
            title: '秒杀'
		}
    }, 
    {
        path: "/limittime/:itemClass",
        name: "limittime",
        props: true,
		components: {
			default: limittime
		},
		meta: {
            level: 1,
            title: '限时抢购专题页'
		}
    },
    {
		path: "/home/prom_info/:itemClass",
        name: "prom_info",
        props: true,
		components: {
			default: prom_info
		},
		meta: {
            level: 1,
            title: '带分类二级页'
		}
    },
    {
        path: "/home/prom_area_list/:itemClass",
        name: "prom_area_list",
        props: true,
		components: {
			default: prom_area_list
		},
		meta: {
            level: 1,
            title: '不带分类二级页'
		}
    },
    {
        path: "/home/red_packet",
		name: "red_packet",
		components: {
			default: red_packet
		},
		meta: {
            level: 1,
            title: '红包雨'
		}
    },
    {
        path: "/home/red_packet_start",
		name: "red_packet_start",
		components: {
			default: red_packet_start
		},
		meta: {
            level: 2,
            title: '红包雨开始'
		}
    },
    {
        path: "/home/speed_dial",
		name: "speed_dial",
		components: {
			default: speed_dial
		},
		meta: {
            level: 1,
            title: '九宫格'
		}
    },
    {
        path: "/home/pre-sale",
		name: "pre_sale_list",
		components: {
			default: PreList
		},
		meta: {
            level: 1,
            title: '预售商品列表'
		}
    },
    {
        path: "/home/pre-sale-detail/:itemId",
        name: "pre_sale_detail",
        props: true,
		components: {
			default: PreDetail
		},
		meta: {
            level: 2,
            title: '预售商品详情'
		}
    },
    {
        path: "/home/pre-sale-order/:item_id",
        name: "pre_sale_order",
        props: true,
		components: {
			default: PreOrder
		},
		meta: {
            level: 3,
            title: '预售商品订单'
		}
    },
	{
		path: '*',
		redirect: {
			name: 'home'
		}
	}
]
