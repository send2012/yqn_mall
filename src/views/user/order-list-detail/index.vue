<template>
	<div class="order_list">
        <nav-bar 
            title="订单详情"
            @back="backTo"/>

        <div ref="scroll_view" class="scroll_view">

        <div class="order_list_detial_header">
            <van-icon :name="getStatusIcon(item.zt)" class="order_list_detial_header_icon"/>
            <span class="order_list_detial_header_status">{{getStatusText(item.zt)}}</span>
            <span class="order_list_detial_header_time" v-if="item.payendtime && item.payendtime > 0">
                ( 剩余支付时间
                    <countdown :time="item.payendtime*1000">
                        <template slot-scope="props">
                            {{ props.days*24 + Number(props.hours) }}:{{ props.minutes }}:{{ props.seconds }}
                        </template>
                    </countdown>)
            </span>
        </div>

        <div class="order_list_detail_info" v-if="item.address">
            <van-icon name="yqn_location" class="order_list_detail_info_icon"/>
            <div class="order_list_detail_info_line1">
                收货人：
                <span class="order_list_detail_info_line1_name">{{item.address.truename}}</span>
                <span class="order_list_detail_info_line1_mobile">{{item.address.mobile}}</span>
            </div>
            <div class="order_list_detail_info_line2">
                收货地址：
                {{ item.address.province + ' ' + item.address.city + ' ' + item.address.county + ' ' + item.address.address }}  
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
                        v-for="(goods, goodsI) in item.pros"
                        class="order_list--van-card"
                        :key="goodsI"
                        @click.native="toOrderDetail(goods.pro_pid)"
                    >
                        <div slot="thumb">
                            <img v-lazy="goods.picpath" alt="">
                        </div>
                        <div slot="title" class="card_title">
                            {{goods.ptitle}}
                        </div>
                        <div slot="desc" class="card_desc">
                            <span class="card_desc_spec text-ellipsis">{{goods.spec}}</span>
                            <!-- <span class="card_desc_bz text-ellipsis">{{goods.bz}}</span> -->
                            <span class="card_desc_spec_title text-ellipsis">{{goods.spec_title}}</span>
                            <div class="card_desc_price">
                                <span class="card_desc_price_value">￥{{goods.pricebuy}}</span>
                                <span class="card_desc_price_num">x{{goods.buynum}}</span>
                            </div>
                        </div>
                    </van-card>
                </div>
                <div v-if="item.pros && item.pros.length > 3" class="order_list--panel_expand" @click="expandCard(i)" :ref="'expand' + i">展开</div>
                
                
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
                        <span class="van-cell-text">订单编号：{{item.goods}}</span>
                        <span class="van-cell-text">下单时间：{{item.createdate}}</span>
                    </template>
                </van-cell>
                <van-cell>
                    <template slot="title">
                        <span class="van-cell-text">支付方式：{{getPayType(item.paytype)}}</span>
                    </template>
                </van-cell>
                <van-cell>
                    <template slot="title">
                        <span class="van-cell-text">配送方式：{{getShipType(item.shiptype)}}</span>
                    </template>
                </van-cell>
            </van-cell-group>
        </div>

        <div class="order-detail-btn">
            
            <a href="javascript:;" :class="item.refund !== 1?'grey':''" @click="gorRefund(item.refund)">
                <!-- <img src="/src/m/view/themes/images/order_icon_Aftermarket_3.png" alt=""> -->
                <van-icon name="yqn_orderService" :class="item.refund !== 1?'grey':''"/>
                {{getRefundText(item.refund)}}
            </a>
            <span class="order-detail-btn-line"></span>
            <a href="tel:13592401183">
                <!-- <img src="/src/m/view/themes/images/order_icon_service.png" alt=""> -->
                <van-icon name="yqn_service" />
                联系客服
            </a>
            
        </div>

        <div class="order-detail-count">
            <van-cell-group>
                <van-cell>
                    <div slot="title" class="order-detail-count_sum">
                        <span class="van-cell-text">
                            商品总价
                            <span>￥{{item.promoney}}</span>
                        </span>
                        <span class="van-cell-text">
                            运费（快递）
                            <span>￥{{item.shipmoney}}</span>
                        </span>
                        <span class="van-cell-text">
                            优惠券减免
                            <span class="van-cell-text_red">-￥{{item.coupon}}</span>
                        </span>
                        <span class="van-cell-text">
                            活动减免
                            <span class="van-cell-text_red">-￥{{item.mjian}}</span>
                        </span>
                    </div>
                </van-cell>
                <van-cell>
                    <template slot="title">
                        <span class="van-cell-text_right">
                            实付款：
                            <span class="van-cell-text_right_red">￥{{item.summoney}}</span>
                        </span>
                    </template>
                </van-cell>
                <van-cell>
                    <template slot="title">
                        <span class="van-cell-text_right">
                                <component 
                                    slot="footer" 
                                    :is="'status' + item.zt"
                                    @handle="actionHandle($event, i)"
                                />
                        </span>
                    </template>
                </van-cell>
            </van-cell-group>
        </div>
		

        </div>
		
		

	</div>
</template>

<script>
    import { ORDER_GOODS_INFO, ORDER_GOODS_CHANGESTATUS } from '@/api/order';
	
	import { Panel, Card } from 'vant';
	import status0 from "./handle-status-10";
	import status1 from "./handle-status-20";
	import status25 from "./handle-status-25";
	import status3 from "./handle-status-30";
	import status40 from "./handle-status-40";
	import status50 from "./handle-status-50";
	import status60 from "./handle-status-60";
    import status70 from "./handle-status-70";
    import status4 from "./handle-status-80";
    import status9 from "./handle-status-80";
    import NavBar from "@/vue/components/NavBar/"
	
    import scrollFixed from '@/vue/mixin/scroll-fixed';
    
    import { STATUS_TEXT, PAY_TYPE, SHIP_TYPE, REFUND_TEXT, STATUS_ICON } from '@/config.js'
	
	
	export default {
		name: 'order-detail',

		mixins: [scrollFixed],
		
		props: {
			active: {
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
				item: {}
			}
		},
		
		
		watch: {
			// '$route': 'resetInit'
		},

		created() {
			this.initData();
		},
		
		methods: {
			initData() {
                const i = this.$route.params.active;
                this.$reqGet(ORDER_GOODS_INFO,{goods: i}).then(res => {
                    this.item = Object.assign({},res.data);
                })
				// const status = this.tabsItem[i].status;
				// return this.$reqGet(ORDER_GOODS_INFO, {
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
			},
			async delOrder(i){
				const id = this.item.id;
				await this.$dialog.confirm({message: "确定要删除该订单吗?"});
				this.items.splice(i, 1);
				this.$toast("已删除该订单");
			},
			async cancelOrder(i){
                const id = this.item.id;
                this.$dialog.confirm({message: "确定要取消该订单吗?"})
                    .then(() => {
                        //确认
                        this.$reqPost(ORDER_GOODS_CHANGESTATUS,{
                            goods: this.item.goods,
                            act: 'cancel'
                        }).then(res => {
                            this.$toast("已取消该订单");
                            this.$router.back(-1);
                        })
                    })
				
			},
			async receiptOrder(i){
				const goods = this.item.goods;
				await this.$dialog.confirm({message: "请确认收到货物, 确认收货后无法撤销!"});
				this.item.status = 4;
                this.$reqPost(ORDER_GOODS_CHANGESTATUS,{goods: goods, act: 'take'}).then(res=>{
                    this.$toast("已确认收货");
                })
            },
            logistics(i){
               
                //查看物流
                const id = this.item.goods;
                 console.log(id)
                this.$router.push({name: "user-order-logistics", params: { active: id}})
            },
			reminderOrder(i){
				const id = this.item.id;
				this.items[i].is_can_reminder = false;
				this.$toast("已提醒卖家发货, 请耐心等待哦~");
            },
            orderOneMore(i){
                //再来一单
                // const id = this.items[i].id;
                // this.$toast("成功加入购物车");
                //跳转路由到购物车
                this.$router.push({path: '/order'})
            },
			toPay(i){
				this.$router.push({ name: "payment", params: { pay_id: this.item.goods } })
			},
			handleTabClick(index){
				this.$router.replace({name: "user-order-list", params: { active: index }})
			},
			getStatusText(status){
                //筛选订单状态
				return STATUS_TEXT[status] || '';
            },
            getStatusIcon(status){
                //筛选订单状态图标
                return STATUS_ICON[status] || '';
            },
            getPayType(type){
                //筛选支付方式
                return PAY_TYPE[type] || '';
            },
            getShipType(type){
                //筛选配送方式
                return SHIP_TYPE[type] || '';
            },
            getRefundText(type) {
                //筛选售后方式
                return REFUND_TEXT[type] || '';
            },
            gorRefund(flag){
                if(flag === 1){
                    this.$router.push({name:'user-refund-list'})
                }
            },
			toOrderDetail(i){
				// const order_id = this.items[i].id;
				this.$router.push({name: "detail", params: { itemId: i }})
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
			[Panel.name]: Panel,
            [Card.name]: Card,
            [NavBar.name]: NavBar,
            status0,
            status1,
			status3,
			status4,
            status9
        },
        beforeRouteLeave (to, from, next) {
			//因为将所有的组件进行了缓存，所以退出的时候要将其组件销毁
			this.$destroy();
			// ...
			next();
		}
	}

</script>

<style lang="scss" scoped>
    @import '../../../assets/scss/_var.scss';
    .van-icon {
        font-size: $main-title-size !important;
    }
    .scroll_view {
        height: 100%;
        overflow-y: auto; 
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
    .grey {
        color: #999 !important;
    }
	.order_list {
        padding-top: 46px;
        padding-bottom: 0;
        &_detial_header {
            // width: 100%;
            height: 2.8rem;
            padding: .6rem 1rem 0;
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
                left: 15px;
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
                height: 1.14rem;
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
                // font-size: $extra-size;
                font-size: $params-title-size;
                line-height: .7rem;
                color: $main-title-color;
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
                    margin-top: 5px;
                    color: $explain-text-color;
                    line-height: .56rem;
                }
                &_spec_title {
                    margin-top: 5px;
                    color: $spec-text-color;
                }
                &_price {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    &_value {
                        color: $main-title-color;
                        font-size: $product-title-size;
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
                display: inline-block;
                width: 100%;
                font-size: $params-title-size;
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
                i {
                    color: #6CD9E6;
                }
            }
            &-line {
                position: absolute;
                height: .8rem;
                width: 1px;
                background: $explain-text-color;
                top: 25%;
            }
        }
        .order-detail-count {
            margin-top: 6px;
            &_sum {
                font-size: $extra-size;
                display: flex;
                flex-direction: column;
                display: flex;
                .van-cell-text {
                    display: flex;
                    justify-content: space-between;
                    span {
                        font-size: $product-title-size;
                    }
                    &_red {
                        color: $price-color;
                    }
                }
            }
            .van-cell-text_right {
                display: inline-block;
                width: 100%;
                text-align: right;
                &_red {
                    color: $price-color;
                    font-size: $main-title-size;
                }
            }
        }
	}

</style>
