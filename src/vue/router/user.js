const tab_user = () =>
    import( /* webpackChunkName: "tabbar-user" */ '@/views/user/tabbar-user');
const UserCollect = () =>
    import( /* webpackChunkName: "user-collect" */ '@/views/user/module-collect/');
const UserTeam = () =>
    import( /* webpackChunkName: "user-team" */ '@/views/user/module-team/');
const UserInvitation = () =>
    import( /* webpackChunkName: "user-invitation" */ '@/views/user/module-invitation/');

// 设置
const UserAddress = () =>
    import( /* webpackChunkName: "user-address" */ '@/views/user/module-address/');
const UserAddressEdit = () =>
    import( /* webpackChunkName: "user-addressEdit" */ '@/views/user/module-address-edit/');
const UserAutonym = () =>
    import( /* webpackChunkName: "user-autonym" */ '@/views/user/module-autonym/');
const UserAutonymEdit = () =>
    import( /* webpackChunkName: "user-autonymEdit" */ '@/views/user/module-autonym-edit/');
const UserServer = () =>
    import( /* webpackChunkName: "user-server" */ '@/views/user/module-server/');

const UserInformation = () =>
    import( /* webpackChunkName: "user-information" */ '@/views/user/user-information-set/');
// const UserInfo_SetBg = () =>
//     import( /* webpackChunkName: "user-info-setBg" */ '@/views/user/user-information-set/set-bg/');
// const UserInfo_SetMobile = () =>
//     import( /* webpackChunkName: "user-info-setMobile" */ '@/views/user/user-information-set/set-mobile/');
// const UserInfo_SetNickname = () =>
//     import( /* webpackChunkName: "user-info-setNickname" */ '@/views/user/user-information-set/set-nickname/');
const UserInfo_SetUserInfo = () =>
    import( /* webpackChunkName: "user-info-setUserInfo" */ '@/views/user/user-information-set/set-user-info/');
const UserInfo_SetPassword = () =>
    import( /* webpackChunkName: "user-info-setPassword" */ '@/views/user/user-information-set/set-password/');
const UserInfo_AboutUs = () =>
    import( /* webpackChunkName: "user-info-aboutUs" */ '@/views/user/user-information-set/about-us/');


// 预售订单、全部订单、退款售后、优惠券、中奖记录、足迹
const UserOrderEntityList = () =>
    import( /* webpackChunkName: "order-entity-list" */ '@/views/user/order-entity-list/');
const UserOrderEleList = () =>
    import( /* webpackChunkName: "order-ele-list" */ '@/views/user/order-ele-list/');
const UserRefundList = () =>
    import( /* webpackChunkName: "user-refund-list" */ '@/views/user/refund-list/');
const UserOrderListDetail = () =>
    import( /* webpackChunkName: "user-order-detail" */ '@/views/user/order-list-detail/');
const UserOrderLogistics = () =>
    import( /* webpackChunkName: "user-order-logistics" */ '@/views/user/order-logistics/');
const UserGiftRecord = () =>
    import( /* webpackChunkName: "user-gift-record" */ '@/views/user/module-gift-record/'); 
const UserGiftRecordDetail = () =>
    import( /* webpackChunkName: "user-gift-record-detail */ '@/views/user/module-gift-record-detail/'); 
const UserHistory = () =>
    import( /* webpackChunkName: "user-history */ '@/views/user/module-history/'); 
const UserOrderPreList = () =>
    import( /* webpackChunkName: "order-pre-list" */ '@/views/user/order-pre-list/');
const UserOrderPreListDetail = () =>
    import( /* webpackChunkName: "order-pre-detail" */ '@/views/user/order-preList-detail/');



// 积分
const UserPoint = () =>
    import( /* webpackChunkName: "user-point" */ '@/views/user/module-point/');
const UserPointMall = () =>
    import( /* webpackChunkName: "user-point-mall" */ '@/views/user/module-point-mall/');
const UserPointMallProduct = () =>
    import( /* webpackChunkName: "user-point-mall-product" */ '@/views/user/module-point-mall-product/');
const UserPointMallOrder = () =>
    import( /* webpackChunkName: "user-point-mall-order" */ '@/views/user/module-point-mall-order/');
const UserPointRecord = () =>
    import( /* webpackChunkName: "user-point-record" */ '@/views/user/module-point-record/');   
const UserPointDetail = () =>
    import( /* webpackChunkName: "user-point-record-detail" */ '@/views/user/module-point-record-detail/');


//购买优惠券
const UserBuyCouponList = () =>
    import( /* webpackChunkName: "user-buy-coupon-list" */ '@/views/user/module-buy-coupon-list/');
const UserBuyCouponDetail = () =>
    import( /* webpackChunkName: "user-buy-coupon-detail" */ '@/views/user/module-buy-coupon-detail/');
const UserBuyCouponOrder = () =>
    import( /* webpackChunkName: "user-buy-coupon-order" */ '@/views/user/order-buy-coupon/');
    
//会员等级
const UserMemberLevel = () =>
    import( /* webpackChunkName: "user-member-level" */ '@/views/user/user-member-info/');


const Tabbar = () =>
    import( /* webpackChunkName: "Tabbar" */ '@/vue/components/Tabbar/');

export default [{
    path: "/user",
    name: "user",
    meta: {
        keepAlive: true,
        level: 0,
        title: '会员中心'
    },
    components: {
        default: tab_user,
        tabbar: Tabbar
    }
}, {
    path: "/user/collect",
    name: "collect",
    //废弃
    meta: {
        level: 1
    },
    component: UserCollect
}, {
    path: "/user/team",
    name: "team",
    //废弃
    meta: {
        level: 1
    },
    component: UserTeam
}, {
    path: "/user/invitation",
    name: "invitation",
    //废弃，会员奖励计划
    meta: {
        level: 1
    },
    component: UserInvitation
}, {
    path: "/user/address",
    name: "address",
    meta: {
        level: 2,
        title: '收货地址'
    },
    component: UserAddress
}, {
    path: "/user/address/edit/:addressId",
    name: "address-edit",
    props: true,
    meta: {
        level: 3,
        title: '收货地址修改'
    },
    component: UserAddressEdit
}, {
    path: "/user/autonym",
    name: "autonym",
    //废弃
    meta: {
        level: 1
    },
    component: UserAutonym
}, {
    path: "/user/autonym/edit",
    name: "autonym-edit",
    //废弃
    meta: {
        level: 2
    },
    component: UserAutonymEdit
}, {
    path: "/user/server",
    name: "user-server",
    //废弃
    meta: {
        level: 1
    },
    component: UserServer
}, {
    path: "/user/information",
    name: "user-information",
    meta: {
        login: true,
        level: 1,
        title: '系统设置'
    },
    component: UserInformation
// }, {
//     path: "/user/information/setbg",
//     name: "user-info-setbg",
//     meta: {
//         level: 2
//     },
//     component: UserInfo_SetBg
// }, {
//     path: "/user/information/setMobile",
//     name: "user-info-setMobile",
//     meta: {
//         level: 2
//     },
//     component: UserInfo_SetMobile
}, {
    path: "/user/information/setUserInfo",
    name: "user-info-setUserInfo",
    meta: {
        level: 2,
        title: '个人设置'
    },
    component: UserInfo_SetUserInfo
// }, {
//     path: "/user/information/setNickname",
//     name: "user-info-setNickname",
//     meta: {
//         level: 2
//     },
//     component: UserInfo_SetNickname
}, {
    path: "/user/information/setPassword",
    name: "user-info-setPassword",
    meta: {
        level: 2,
        title: '修改密码'
    },
    component: UserInfo_SetPassword

}, {
    path: "/user/information/aboutUs",
    name: "user-info-aboutUs",
    meta: {
        level: 2,
        title: '关于我们'
    },
    component: UserInfo_AboutUs
}, {
    path: "/user/order/list/:active",
    name: "user-order-list",
    props: true,
    meta: {
        level: 3,
        title: '我的订单（已收货，待收货。。）'
    },
    component: UserOrderEntityList
}, {
    path: "/user/orderEle/list/:status",
    name: "user-order-ele-list",
    props: true,
    meta: {
        level: 3,
        title: '优惠券（待使用，已使用。。）'
    },
    component: UserOrderEleList
}, {
    path: "/user/pre-order/list/:active",
    name: "user-order-pre-list",
    props: true,
    meta: {
        level: 3,
        title: '预售订单（待收货，已收货）'
    },
    component: UserOrderPreList
}, {
    path: "/user/refund/list/:active",
    props: true,
    name: "user-refund-list",
    meta: {
        level: 2,
        title: '退款售后'
    },
    component: UserRefundList
}, {
    path: "/user/order/list/detail/:active",
    name: "user-order-detail",
    props: true,
    meta: {
        level: 4,
        title: '订单详情'
    },
    component: UserOrderListDetail

}, {
    path: "/user/order/pre-list/detail/:active",
    name: "user-preOrder-detail",
    props: true,
    meta: {
        level: 4,
        title: '预售订单详情'
    },
    component: UserOrderPreListDetail

}, {
    path: "/user/order/list/logistics/:active",
    name: "user-order-logistics",
    props: true,
    meta: {
        level: 5,
        title: '物流跟踪'
    },
    component: UserOrderLogistics
},{
    path: "/user/point",
    name: "user-point",
    props: true,
    meta: {
        level: 1,
        title: '积分流水'
    },
    component: UserPoint
},{
    path: "/user/mall",
    name: "user-point-mall",
    props: true,
    meta: {
        level: 1,
        title: '积分商城'
    },
    component: UserPointMall
},{
    path: "/user/mall/product/:itemId",
    name: "user-point-mall-product",
    props: true,
    meta: {
        level: 2,
        title: '积分商城商品详情'
    },
    component: UserPointMallProduct
},{
    path: "/user/mall/order/:itemId",
    name: "user-point-mall-order",
    props: true,
    meta: {
        level: 3,
        title: '积分订单'
    },
    component: UserPointMallOrder
},{
    path: "/user/exchange-record/:active",
    name: "user-point-record",
    props: true,
    meta: {
        level: 1,
        title: '兑换记录'
    },
    component: UserPointRecord
},{
    path: "/user/exchange-record/detail/:order_id",
    name: "user-point-record-detail",
    props: true,
    meta: {
        level: 2,
        title: '兑换记录详情'
    },
    component: UserPointDetail
},{
    path: "/user/gift-record/:active",
    name: "user-gift-record",
    props: true,
    meta: {
        level: 1,
        title: '中奖记录'
    },
    component: UserGiftRecord
},{
    path: "/user/gift-record-detail/:order_id",
    name: "user-gift-record-detail",
    props: true,
    meta: {
        level: 2,
        title: '中奖记录详情'
    },
    component: UserGiftRecordDetail
},{
    path: "/user/history",
    name: "user-history",
    props: true,
    meta: {
        level: 1,
        title: '我的足迹'
    },
    component: UserHistory
},{
    path: "/user/member-level/:level_point",
    props: true,
    name: "member-level",
    meta: {
        level: 1,
        title: '会员成长记录'
    },
    component: UserMemberLevel
},{
    path: "/user/buy-coupon-list",
    name: "buy-coupon-list",
    meta: {
        level: 4,
        title: '购买优惠券'
    },
    component: UserBuyCouponList
},{
    path: "/user/buy-coupon-detail/:coupon_id",
    name: "buy-coupon-detail",
    props: true,
    meta: {
        level: 5,
        title: '优惠券商品详情'
    },
    component: UserBuyCouponDetail
},{
    path: "/user/buy-coupon-order/:coupon_id",
    name: "buy-coupon-order",
    props: true,
    meta: {
        level: 6,
        title: '优惠券商品订单'
    },
    component: UserBuyCouponOrder
}]
















