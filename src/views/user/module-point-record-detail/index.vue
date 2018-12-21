<template>
	<div class="order_list">
        <nav-bar 
            title="订单详情"
            @back="backTo"/>
        
        <div ref="scroll_view" class="scroll_view">

        <div :class="'order_list_detial_header ' + (order_detail.province?'':'coupon_status')">
            <van-icon :name="getStatusIcon(order_detail.zt)" class="order_list_detial_header_icon"/>
            <span class="order_list_detial_header_status">{{order_detail.zt_tag}}</span>
            <!-- <span class="order_list_detial_header_time">（剩余支付时间{{items[0].status}}）</span> -->
        </div>

        <div class="order_list_detail_info" v-if="order_detail.province">
            <van-icon name="yqn_location" class="order_list_detail_info_icon"/>
            <div class="order_list_detail_info_line1">
                <span class="order_list_detail_info_line1_name">{{order_detail.truename}}</span>
                <span class="order_list_detail_info_line1_mobile">{{order_detail.mobile}}</span>
            </div>
            <div class="order_list_detail_info_line2">
                {{order_detail.province + ' ' + order_detail.city + ' ' + order_detail.county + ' ' + order_detail.address}}            
            </div>
        </div>
		
        <van-panel 
            class="order_list--panel"
            title="商品信息"
        >
            <div>
                <!-- <van-card
                    v-for="(goods, goodsI) in el.orderItems"
                    class="order_list--van-card"
                    :key="goodsI"
                    :title="goods.item_name"
                    :desc="goods.sku_props_str"
                    :num="goods.quantity"
                    :price="(goods.price / 100).toFixed(2)"
                    :thumb="goods.pic_url"
                    @click.native="toOrderDetail(i)"
                /> -->
                <div class="order_list--panel_inner_normal" :ref="'cardList' + i">
                    <van-card
                        class="order_list--van-card"
                        @click.native="toOrderDetail(order_detail.pid)"
                    >
                        <div slot="thumb">
                            <img v-lazy="order_detail.picpath" alt="">
                        </div>
                        <div slot="title" class="card_title">
                            {{order_detail.ptitle}}
                        </div>
                        <div slot="desc" class="card_desc">
                            <span class="card_desc_spec text-ellipsis">规格：{{order_detail.spec}}</span>
                            <span class="card_desc_bz text-ellipsis">{{order_detail.bz}}</span>
                            <span class="card_desc_spec_title text-ellipsis">{{order_detail.spec_title}}</span>
                            <div class="card_desc_price">
                                <span class="card_desc_price_value">{{order_detail.buynum}}</span>件
                                <!-- <span class="card_desc_price_num">x{{order_detail.quantity}}</span> -->
                            </div>
                        </div>
                    </van-card>
                </div>
                <!-- <div v-if="el.orderItems.length > 3" class="order_list--panel_expand" @click="expandCard(i)" :ref="'expand' + i">展开</div> -->
                
                
                <!-- <div class="order_list--total">
                    <span>共{{el.post_fee}}件商品</span>
                    付款金额: <span class="totel_fee">{{el.total_fee | yuan}}</span>
                    （含运费{{el.post_fee | yuan}}）
                </div> -->
            </div>
            <!-- <component 
                slot="footer" 
                :is="'status' + el.status"
                :reminder="el.is_can_reminder"
                @handle="actionHandle($event, i)"
            /> -->
        </van-panel>

        <div class="order-detail-info">
            <van-cell-group>
                <van-cell>
                    <template slot="title">
                        <span class="van-cell-text">订单编号：{{order_detail.goods}}</span>
                        <span class="van-cell-text">下单时间：{{order_detail.createdate}}</span>
                    </template>
                </van-cell>
                <!-- <van-cell>
                    <template slot="title">
                        <span class="van-cell-text">支付方式：在线支付</span>
                    </template>
                </van-cell> -->
                <!-- <van-cell >
                    <template slot="title">
                        <span class="van-cell-text">物流：</span>
                    </template>
                </van-cell> -->
            </van-cell-group>
        </div>

        <!-- <div class="order-detail-btn">
            
            <a href="javascript:;">
                <img src="/src/m/view/themes/images/order_icon_Aftermarket_3.png" alt="">
                暂无售后
            </a>
            <span class="order-detail-btn-line"></span>
            <a href="tel:13592401183">
                <img src="/src/m/view/themes/images/order_icon_service.png" alt="">
                联系客服
            </a>
            
        </div> -->

        <div class="order-detail-count">
            <van-cell-group>
                <!-- <van-cell value="￥1290.00">
                    <template slot="title">
                        <span class="van-cell-text">商品总价</span>
                    </template>
                </van-cell> -->
                <van-cell>
                    <template slot="title">
                        <span class="van-cell-text_right">
                            合计：
                            <span class="van-cell-text_right_red">{{order_detail.pointbuy}}</span>
                            积分
                        </span>
                    </template>
                </van-cell>
                <van-cell v-if="order_detail.zt === 10">
                    <template slot="title">
                        <span class="van-cell-text_right">
                            <van-button size="small" @click="logistics(0)">物流跟踪</van-button>
                            <van-button size="small" class="van-cell-text_right_enter" @click="receiptOrder(0)">确认收货</van-button>
                        </span>
                    </template>
                </van-cell>
            </van-cell-group>
        </div>
		
		
        </div>

	</div>
</template>

<script>
    import { POINT_GOODS_INFO } from '@/api/point';
    import { STATUS_ICON } from '@/config.js'
 	
	import { Tab, Tabs, Panel, Card } from 'vant';
    import NavBar from "@/vue/components/NavBar/"
	
	import loadMore from '@/vue/mixin/list-load-more';
	import scrollFixed from '@/vue/mixin/scroll-fixed';
	
	const STATUS_TEXT = {
		10: "待付款",         
		20: "待发货",
		25: "部分发货",
		30: "待收货",
		40: "已完成",
		50: "退款成功",
		60: "交易关闭",
        70: "交易关闭",
        80: "已取消"
	}
	
	export default {
		name: 'order-detail',

		mixins: [loadMore, scrollFixed],
		
		props: {
			order_id: {
				type: [String, Number],
				default: 0
			}
		},

		data() {
			const activeIndex = this.active;
			const shop_id = this.$util.getLocationParam("shop_id")
			return {
                shop_id,
                expand: false,              //收起展开订单
				activeIndex,
                items: [],
                order_detail: {},               //订单详情
				tabsItem: [{
						name: "全部",
						status: 0,
					},
					{
						name: "待付款",
						status: 10,
					},
					{
						name: "待发货",
						status: 20,
					},
					{
						name: "待收货",
						status: 30,
					},
					{
						name: "已完成",
						status: 40,
                    },
                    {
                        name: "已取消",
						status: 80,
                    }
				],
			}
		},
		
		
		watch: {
			'$route': 'resetInit'
		},

		created() {
            // this.resetInit();
            this.initData();
		},
		
		methods: {
			initData() {
				// const i = this.active;
				// const status = this.tabsItem[i].status;
				// return this.$reqGet(ORDER_LIST, {
				// 	'per-page': this.pages.perPage,
				// 	page: this.pages.currPage,
				// 	shop_id: this.shop_id,
				// 	status
				// }, {
				// 	hideLoading: true
				// }).then(res => {
				// 	const { items, page } = res.data.data;
				// 	this.items.push(...items);
				// 	return page;
                // })
                this.$reqGet(POINT_GOODS_INFO,{goods: this.order_id}).then(res => {
                    this.order_detail = Object.assign({},res.data);
                })
			},
			async receiptOrder(i){
				const id = this.items[i].id;
				await this.$dialog.confirm({
                    title: "确认提示",
                    message: "你确认要完成该订单吗？"});
				this.items[i].status = 40;
				this.$toast("已确认收货");
            },
            logistics(i){
                console.log(i)
                //查看物流
                // const id = this.item[i].id;
                this.$router.push({name: "user-order-logistics", params: { active: i}})
            },
			getStatusText(status){
				return STATUS_TEXT[status] || '';
            },
            getStatusIcon(status){
                return STATUS_ICON[status] || '';
            },
			toOrderDetail(i){
				// const order_id = this.items[i].id;
                // this.$router.push({name: "user-order-detail", params: { order_id }})
                this.$router.push({name: 'user-point-mall-product', params: {itemId: i}})
			},
			actionHandle(handle, i){
				this[handle] && this[handle](i);
            },
            expandCard(i) {
                //展开、收起订单
                let className = this.$refs['cardList'+i][0].className;
                if(className.indexOf('visible') === -1){
                    this.$refs['cardList'+i][0].className = "order_list--panel_inner_normal visible";
                    this.$refs['expand'+i];
                    this.$refs['expand'+i][0].innerHTML = "收起";
                }else {
                    this.$refs['cardList'+i][0].className = "order_list--panel_inner_normal";
                    this.$refs['expand'+i][0].innerHTML = "展开";
                }
            },
            backTo() {
                this.$router.back(-1);
            }
		},
		components: {
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Panel.name]: Panel,
            [Card.name]: Card,
            [NavBar.name]: NavBar
		}
	}

</script>

<style lang="scss" scoped>

    .scroll_view {
        height: 100%;
        overflow-y: auto; 
    }

    .coupon_status {
        display: flex;
        align-items: center;
        padding-top: 0 !important;
        height: 3rem !important;
    }

    .visible {
        overflow: visible !important;
        height: auto !important;
        max-height: none !important;
        // transition: height 2s;
        // -moz-transition: height 2s; /* Firefox 4 */
        // -webkit-transition: height 2s; /* Safari 和 Chrome */
        // -o-transition: height 2s; /* Opera */
    }
	.order_list {
        padding-top: 46px;
        padding-bottom: 0;
        &_detial_header {
            // width: 100%;
            height: 2.4rem;
            padding: 15px 25px 0;
            color: #fff;
            background: linear-gradient(to right ,#fe5d28 , #fe8246)!important;
            &_icon {
                font-size: 20px;
            }
            &_status {
                margin-left: .64rem;
                font-size: $sub-title-size;
            }
            &_time {
                font-size: $product-title-size;
            }
        }
        &_detail_info {
            background: #fff;
            margin: -1.32rem 8px 9px;
            border-radius: 5px;
            padding: .4rem .64rem;
            color: $main-title-color;
            padding-left: 1.64rem;
            position: relative;
            &_icon {
                font-size: 16px;
                position: absolute;
                left: .6rem;
                top: 45%;
            }
            &_line1 {
                line-height: .8rem;
                &_name {
                    font-size: $product-title-size;
                }
                &_mobile {
                    margin-left: 1.2rem;
                }
            }
            &_line2 {
                margin-top: 5px;
                font-size: $extra-size;
            }
        }
		&--footer_btn {
			text-align: right;
		}
		&--panel{
            // margin-bottom: 10px;
            &_inner_normal {
                max-height: 13rem;
                overflow: hidden;
            }
            &_expand {
                margin-top: .8rem;
                width: 100%;
                height: 1.28rem;
                text-align: center;
                color: $explain-text-color;
                font-size: $extra-size;
            }
		}
		
		&--van-card{
            .text-ellipsis {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .card_title {
                font-size: $product-title-size;
                line-height: .56rem;
                height: 1.2rem;
                color: $main-title-color;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .card_desc {
                display: flex;
                flex-direction: column;
                font-size: $extra-size;
                &_spec, &_bz {
                    color: $sub-title-color;
                    line-height: .56rem;
                }
                &_spec_title {
                    color: $spec-text-color;
                }
                &_price {
                    margin-top: 10px;
                    width: 100%;
                    &_value {
                        color: $price-color;
                        font-size: $main-title-size;
                    }
                    &_num {
                        color: $sub-title-color;
                    }
                }
            }
		}
		
		&--total{
			text-align: right;
            padding: 10px;
            .totel_fee {
                font-size: $product-title-size;
                color: $main-color;
            }
        }
        
        .order-detail-info {
            margin-top: 6px;
            .van-cell-text {
                font-size: $product-title-size;
                display: inline-block;
                width: 100%;
            }
        }
        .order-detail-btn {
            margin-top: 6px;
            position: relative;
            width: 100%;
            background: #fff;
            text-align: center;
            display: flex;
            justify-content: space-around;
            a {
                display: inline-block;
                width: 50%;
                line-height: 1.6rem;
                font-size: $product-title-size;
            }
            &-line {
                position: absolute;
                height: .8rem;
                width: 1px;
                background: #ccc;
                top: 25%;
            }
        }
        .order-detail-count {
            margin-top: 6px;
            .van-cell-text_right {
                display: inline-block;
                width: 100%;
                text-align: right;
                font-size: $product-title-size;
                &_red {
                    color: $price-color;
                    font-size: $main-title-size;
                }
                &_enter {
                    background: linear-gradient(to right ,#fe5d28 , #fe8246)!important;
                    color: #fff;
                }
            }
        }
	}

</style>
