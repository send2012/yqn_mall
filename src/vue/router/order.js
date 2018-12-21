const tab_cart = () => import(/* webpackChunkName: "tabbar-cart" */ '@/views/order/tabbar-cart.vue');
const PlaceOrderEntity = () => import(/* webpackChunkName: "placerder-entity" */ '@/views/order/place-order-entity/');
const PlaceOrderVirtual = () => import(/* webpackChunkName: "placeOrder-virtual" */ '@/views/order/place-order-virtual/');
const Payment = () => import(/* webpackChunkName: "payment" */ '@/views/order/payment/');
const PaymentStatus = () => import(/* webpackChunkName: "payment-status" */ '@/views/order/payment-status/');
const MixOrder = () => import(/* webpackChunkName: "mix-order" */ '@/views/order/payment-status/mix-order');

const Tabbar = () => import(/* webpackChunkName: "Tabbar" */ '@/vue/components/Tabbar/');

export default [{
			path: "/order",
			name: "cart",
			meta: {
                level: 0,
                title: '进货单'
			},
			components: {default: tab_cart, tabbar: Tabbar }
	},{
			path: "/order/placeOrderEntity",
			name: "placeOrderEntity",
			meta: {
                level: 3,
                title: '确认订单'
			},
			component: PlaceOrderEntity
	},{
			path: "/order/placeOrderVirtual",
            name: "placeOrderVirtual",
            // 废弃
			meta: {
				level: 3
			},
			component: PlaceOrderVirtual
	},{
			path: "/order/payment/:pay_id",
            name: "payment",
            props: true,
			meta: {
                level: 5,
                title: '支付'
			},
			component: Payment
	},{
			path: "/order/payment-status/:status",
			name: "paymentStatus",
			meta: {
                level: 3,
                title: '支付状态（成功）'
			},
			component: PaymentStatus,
			props: true
	},{
        path: "/order/mix_order/:order_id",
        props: true,
        name: "mixOrder",
        meta: {
            level: 2,
            title: '订单提交成功-混单'
        },
        component: MixOrder
}]