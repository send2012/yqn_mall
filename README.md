# 移动商城

> 使用有赞移动端 Vue 组件库 — [Vant](https://www.youzanyun.com/zanui/vant#/zh-CN/component/intro)

## 线上地址（手机扫码查看）


## 预览Gif图(gif加载较慢，请稍后。。。)


## Vue相关库与插件

- Vue + Vue-router + Vant + Sass
- axios
- vuelidation( 表单验证 )
- fastclick
- babel-polyfill
- @xkeshi/vue-countdown ( 各种倒计时 )

> 未使用Vuex, 因为各个页面有较高的独立性. 可以省下Vuex, 少部分组件通信使用 event bus 即可.


> 店铺信息: sessionStorage
> 
> 用户信息及token:  localStorage

## mock数据


``` bash
#先全局安装 json-server, 如果已经装过可忽略这步
npm install -g json-server

npm run mock
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


## 文件目录结构
```
|-- src
    |   |-- App.vue                         整个程序的壳子
    |   |-- config.js                       配置项文件
    |   |-- main.js                         主文件                  
    |   |-- api                             所有的接口文档
    |   |   |-- activity.js                     活动接口
    |   |   |-- cart.js                         购物车接口
    |   |   |-- coupon.js                       优惠券接口
    |   |   |-- goods.js                        商品接口（废弃）
    |   |   |-- home.js                         主页接口
    |   |   |-- order.js                        订单接口
    |   |   |-- point.js                        积分接口
    |   |   |-- product.js                      商品接口
    |   |   |-- promotion.js                    （废弃）
    |   |   |-- shop.js                         （废弃）
    |   |   |-- system.js                       其他接口
    |   |   |-- user.js                         个人中心接口
    |   |-- assets                          静态文件目录
    |   |   |-- images                          图片       
    |   |   |   |-- activity                        活动图片
    |   |   |   |   |-- lottery                         九宫格
    |   |   |   |   |-- red_pocket_rain                 红包雨
    |   |   |   |-- cart                            购物车
    |   |   |   |-- category                        分类
    |   |   |   |-- index                           主页
    |   |   |   |-- recommend                       推荐
    |   |   |   |-- user                            用户
    |   |   |-- js                              js文件
    |   |   |   |-- regexp.js                       正则
    |   |   |   |-- scroll.js                       获取元素高度之类的
    |   |   |   |-- util.js                         全局工具函数
    |   |   |-- scss                            样式文件
    |   |       |-- common.scss                     公共样式
    |   |       |-- global.scss                     全局样式
    |   |       |-- _mixin.scss                     全局混合样式引入
    |   |       |-- _vant-theme.scss                更改全局vant样式
    |   |       |-- _var.scss                       全局函数变量
    |   |       |-- iconfont                        字体文件
    |   |       |   |-- iconfont.css
    |   |       |   |-- iconfont.ttf
    |   |       |-- mixin                        全局混合样式   
    |   |           |-- _one-border.scss                移动端一像素样式
    |   |-- views
    |   |   |-- home                            主页
    |   |   |   |-- tabbar-home-class-icon.vue      主页菜单栏（5个小icon）
    |   |   |   |-- tabbar-home-shop-info.vue       店家信息（暂弃）
    |   |   |   |-- tabbar-home-sign-board.vue      店家详情模板（暂弃）
    |   |   |   |-- tabbar-home.vue                 主页框子
    |   |   |   |-- areas                           二级页（暂弃）
    |   |   |   |-- areas-img                       二级页（暂弃）
    |   |   |   |-- grab                            秒杀
    |   |   |   |-- grab-img                        秒杀（暂弃）
    |   |   |   |-- icon-btn                        菜单栏点击icon
    |   |   |   |   |-- brands                          品牌特卖
    |   |   |   |   |-- clearance                       清仓特卖
    |   |   |   |   |-- goods                           （弃用）
    |   |   |   |   |-- news                            （弃用）
    |   |   |   |   |-- points                          积分兑换
    |   |   |   |-- presale                         预售
    |   |   |   |-- prize                           活动页
    |   |   |   |   |-- red_packet.vue                  红包雨
    |   |   |   |   |-- red_packet_start.vue            红包雨开始页
    |   |   |   |   |-- speed_dial.vue                  九宫格
    |   |   |   |   |-- text.css                        九宫格样式
    |   |   |   |-- prom_area_list                  不带分类的二级页
    |   |   |   |-- prom_info                       带分类的二级页
    |   |   |   |-- unknown                         未知模块（弃用）
    |   |   |   |-- unknown-img                     未知模块（弃用）
    |   |   |-- items                       分类
    |   |   |   |-- tabbar-class-tree.vue       分类品牌树
    |   |   |   |-- tabbar-class.vue            分类主页
    |   |   |   |-- detail                      商品详情
    |   |   |   |   |-- index.vue                   商品详情主页
    |   |   |   |   |-- mix.js                      其他混合方法
    |   |   |   |   |-- sku.js                      规格栏（。。。好像弃用了）
    |   |   |   |   |-- ActivityPopup               活动
    |   |   |   |   |-- EntityGroup                 （废弃）
    |   |   |   |   |-- VirtualGroup                （废弃）
    |   |   |   |-- list                        商品列表
    |   |   |   |-- search                      （原搜索，废弃）
    |   |   |   |   |-- index.vue
    |   |   |   |   |-- search-tag.vue
    |   |   |   |-- search-result               搜索结果
    |   |   |-- login                     登录
    |   |   |   |-- login-footer.vue            登录底部
    |   |   |   |-- login-header.vue            登陆头部
    |   |   |   |-- login-request.vue           登录请求（输入框）
    |   |   |   |-- login.vue                   登录框子
    |   |   |   |-- forget                      忘记密码（废弃）
    |   |   |   |-- forget-reset                忘记密码重置（废弃）
    |   |   |   |-- forget-status               忘记密码状态（废弃）
    |   |   |   |-- register-getCode            注册获取验证码
    |   |   |   |-- register-status             注册状态
    |   |   |   |-- register-submit             注册提交
    |   |   |   |-- registered                  注册框子
    |   |   |-- order                   购物车
    |   |   |   |-- compute.js              用于购物车计算的js
    |   |   |   |-- tabbar-cart.vue         购物车框子
    |   |   |   |-- payment                 支付
    |   |   |   |-- payment-status          支付状态
    |   |   |   |   |-- index.vue
    |   |   |   |   |-- mix-order.vue
    |   |   |   |-- place-order-entity      订单确认
    |   |   |   |   |-- bottom-goods-info.vue   订单确认底部
    |   |   |   |   |-- coupon-list.vue         选取优惠券列表
    |   |   |   |   |-- index.vue               订单确认框子
    |   |   |   |   |-- top-user-info.vue       订单确认用户信息
    |   |   |   |-- place-order-virtual     订单确认（废弃）
    |   |   |   |-- tab-cart_activity       购物车每个活动头（满赠，满减。。。）
    |   |   |-- recommend              推荐
    |   |   |   |-- tabbar-recommend.vue    推荐页
    |   |   |-- user                    会员中心
    |   |       |-- tabbar-user-ecoupon.vue     优惠券（废弃）
    |   |       |-- tabbar-user-header.vue      会员中心头
    |   |       |-- tabbar-user-model.vue       会员中心（总计消费，积分）
    |   |       |-- tabbar-user-module.vue      （废弃）
    |   |       |-- tabbar-user-order.vue       会员中心主题内容（我的服务，我的订单。。。）
    |   |       |-- tabbar-user.vue             会员中心框子
    |   |       |-- module-address              收货地址列表
    |   |       |-- module-address-edit         编辑收货地址
    |   |       |-- module-autonym              身份证自动认证（废弃）
    |   |       |-- module-autonym-edit         身份证自动认证修改
    |   |       |   |-- id-card-upload.vue      
    |   |       |   |-- index.vue
    |   |       |-- module-collect              我的收藏（废弃）
    |   |       |-- module-gift-record          中奖记录
    |   |       |-- module-gift-record-detail   中奖记录详情
    |   |       |   |-- handle-status-10.vue
    |   |       |   |-- handle-status-20.vue
    |   |       |   |-- handle-status-25.vue
    |   |       |   |-- handle-status-30.vue
    |   |       |   |-- handle-status-40.vue
    |   |       |   |-- handle-status-50.vue
    |   |       |   |-- handle-status-60.vue
    |   |       |   |-- handle-status-70.vue
    |   |       |   |-- handle-status-80.vue
    |   |       |   |-- index.vue
    |   |       |-- module-history              我的足迹
    |   |       |-- module-invitation           会员奖励计划（f）
    |   |       |-- module-point                积分流水
    |   |       |-- module-point-mall           积分商城，积分兑换
    |   |       |-- module-point-mall-order     填写兑换订单（积分）
    |   |       |-- module-point-mall-product   积分商品详情
    |   |       |-- module-point-record         兑换记录
    |   |       |-- module-point-record-detail  兑换记录，订单详情
    |   |       |-- module-server               客服（废弃）
    |   |       |-- module-team                 团队（废弃）
    |   |       |-- order-ele-list              优惠券列表
    |   |       |   |-- handle-status-10.vue
    |   |       |   |-- handle-status-100.vue
    |   |       |   |-- handle-status-110.vue
    |   |       |   |-- handle-status-120.vue
    |   |       |   |-- handle-status-40.vue
    |   |       |   |-- handle-status-60.vue
    |   |       |   |-- handle-status-70.vue
    |   |       |   |-- index.vue
    |   |       |-- order-entity-list           订单列表
    |   |       |   |-- handle-status-10.vue
    |   |       |   |-- handle-status-20.vue
    |   |       |   |-- handle-status-25.vue
    |   |       |   |-- handle-status-30.vue
    |   |       |   |-- handle-status-40.vue
    |   |       |   |-- handle-status-50.vue
    |   |       |   |-- handle-status-60.vue
    |   |       |   |-- handle-status-70.vue
    |   |       |   |-- handle-status-80.vue
    |   |       |   |-- index.vue
    |   |       |-- order-list-detail           订单详情
    |   |       |   |-- handle-status-10.vue
    |   |       |   |-- handle-status-20.vue
    |   |       |   |-- handle-status-25.vue
    |   |       |   |-- handle-status-30.vue
    |   |       |   |-- handle-status-40.vue
    |   |       |   |-- handle-status-50.vue
    |   |       |   |-- handle-status-60.vue
    |   |       |   |-- handle-status-70.vue
    |   |       |   |-- handle-status-80.vue
    |   |       |   |-- index.vue
    |   |       |-- order-logistics             物流追踪，物流详情
    |   |       |-- order-pre-list              预售订单列表
    |   |       |   |-- handle-status-10.vue
    |   |       |   |-- handle-status-20.vue
    |   |       |   |-- handle-status-25.vue
    |   |       |   |-- handle-status-30.vue
    |   |       |   |-- handle-status-40.vue
    |   |       |   |-- handle-status-50.vue
    |   |       |   |-- handle-status-60.vue
    |   |       |   |-- handle-status-70.vue
    |   |       |   |-- handle-status-80.vue
    |   |       |   |-- index.vue
    |   |       |-- order-preList-detail        预售订单详情
    |   |       |   |-- handle-status-10.vue
    |   |       |   |-- handle-status-20.vue
    |   |       |   |-- handle-status-25.vue
    |   |       |   |-- handle-status-30.vue
    |   |       |   |-- handle-status-40.vue
    |   |       |   |-- handle-status-50.vue
    |   |       |   |-- handle-status-60.vue
    |   |       |   |-- handle-status-70.vue
    |   |       |   |-- handle-status-80.vue
    |   |       |   |-- index.vue
    |   |       |-- refund-list                 退款售后列表
    |   |       |   |-- handle-status-0.vue
    |   |       |   |-- handle-status-10.vue
    |   |       |   |-- handle-status-50.vue
    |   |       |   |-- handle-status-60.vue
    |   |       |   |-- handle-status-70.vue
    |   |       |   |-- handle-status-80.vue
    |   |       |   |-- index.vue
    |   |       |-- user-information-set        个人信息
    |   |       |   |-- index.vue                   主体框子
    |   |       |   |-- about-us                    关于我们
    |   |       |   |   |-- index.vue
    |   |       |   |-- set-bg                      设置背景（废弃）
    |   |       |   |   |-- index.vue
    |   |       |   |-- set-mobile                  设置手机号（废弃）
    |   |       |   |   |-- index.vue
    |   |       |   |-- set-nickname                设置昵称（废弃）
    |   |       |   |   |-- index.vue
    |   |       |   |-- set-password                设置修改密码
    |   |       |   |   |-- index.vue
    |   |       |   |-- set-user-info               设置用户信息
    |   |       |       |-- index.vue
    |   |       |-- user-member-info            会员中心升级计划
    |   |           |-- index.vue
    |   |-- vue                 其他
    |       |-- components          组件库
    |       |   |-- coupon              优惠券
    |       |   |   |-- cart_coupon.vue     购物车优惠券
    |       |   |   |-- index.vue           默认优惠券
    |       |   |   |-- item_detail_coupon.vue  商品详情优惠券
    |       |   |-- field               表单元素
    |       |   |   |-- index.vue           默认表单元素
    |       |   |   |-- logistics_index.vue 退款售后表单元素
    |       |   |   |-- res_index.vue       注册表单元素
    |       |   |-- field-group         表单组（所有元素的框子）
    |       |   |-- home-title          模块的title（猜你喜欢，品牌特卖。。。）
    |       |   |-- is-empty            空数据模板（订单。。。）
    |       |   |-- item-ads-group      主页广告模块
    |       |   |-- item-card-doub      商品列表双列
    |       |   |   |-- grab_index.vue      秒杀
    |       |   |   |-- index.vue           默认
    |       |   |-- item-card-hori      商品列表单列
    |       |   |   |-- grab_index.vue      秒杀
    |       |   |   |-- index.vue           默认
    |       |   |-- item-card-vert      商品列表多列
    |       |   |-- item-group          商品列表组（外面的壳子）
    |       |   |-- md-kefu             客服（废弃）
    |       |   |-- NavBar              所有页面顶部头
    |       |   |   |-- class_index.vue     分类
    |       |   |   |-- home_search.vue     主页
    |       |   |   |-- index.vue           默认
    |       |   |   |-- search.vue          搜索
    |       |   |-- Search              搜索模块
    |       |   |   |-- index.vue           默认
    |       |   |   |-- search-tag.vue      历史记录，热门搜索。。。tag
    |       |   |-- swipe               轮播图
    |       |   |-- Tabbar              所有页面底部五个小图标
    |       |   |-- _directive          （废弃）
    |       |       |-- scrollMore.js
    |       |-- event-bus       全局事件传输
    |       |-- filter          全局过滤器
    |       |-- mixin           全局混合函数
    |       |   |-- get-shop-info.js    获取店家信息（废弃）
    |       |   |-- item-card.js        商品卡片（废弃）
    |       |   |-- list-load-more.js   列表下拉加载更多
    |       |   |-- load-more.js        其他下拉加载更多
    |       |   |-- scroll-fixed.js     记忆并恢复滚动条位置
    |       |   |-- valid.js            （废弃 ）
    |       |-- plugins         插件
    |       |   |-- axios.js            api请求插件
    |       |   |-- vue-countdown.js    倒计时插件
    |       |   |-- vuelidation.js      表单验证插件
    |       |   |-- axios-cancel        （不要动，头复杂时再启用）
    |       |       |-- axiosCancel.js
    |       |       |-- index.js
    |       |-- router          路由
    |           |-- home.js             主页
    |           |-- index.js            所有的路由集合
    |           |-- items.js            分类
    |           |-- login.js            登录
    |           |-- order.js            订单
    |           |-- recommend.js        推荐
    |           |-- user.js             会员中心

```