<template>
	<div class="order_list">
        <nav-bar 
            title="我的订单"
            @back="backTo"/>
        <div class="order_list_tabs">
            <van-tabs
                sticky
                :active="activeIndex"
                :swipe-threshold="6"
                @click="handleTabClick"
            >
                <van-tab 
                    v-for="tab in tabsItem"
                    :title="tab.name" 
                    :key="tab.type">

                </van-tab>
            </van-tabs>
        </div>

        <div ref="scroll_view" class="scroll_view">
		
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
		<van-list
		  	v-model="loading"
		  	:finished="finished"
			:immediate-check="false"
	  		:offset="0"
		  	@load="loadMore"
		>
            <van-checkbox-group v-model="result" @change="checkedSimple">
            
                <van-panel 
                    v-for="(el, i) in items"
                    class="order_list--panel"
                    :key="i"
                >

                    <div slot="header" class="order_list--panel_header">
                        <van-checkbox :name="el.goods" v-if="obligations">
                            <span>{{el.createdate}}</span>
                        </van-checkbox>
                        <span v-if="!obligations">{{el.createdate}}</span>
                        <span class="order_list--panel_header_status" v-if="el.zt !== 0" :style="(el.zt == 4 || el.zt == 9)?'color: #666':'' ">{{getStatusText(el.zt)}}</span>
                        <span class="order_list--panel_header_status" v-if="el.zt === 0">剩余支付时间
                            <countdown v-if="el.payendtime>0" :time="el.payendtime*1000">
                                <template slot-scope="props">
                                    {{ props.days*24 + Number(props.hours) }}:{{ props.minutes }}:{{ props.seconds }}
                                </template>
                            </countdown>
                            <span v-else>00.00.00</span>
                        </span>
                    </div>
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
                                v-if="el.pros.length===1"
                                v-for="(goods, goodsI) in el.pros"
                                class="order_list--van-card"
                                :key="goodsI"
                                @click.native="toOrderDetail(i)"
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
                                    <!-- <div class="card_desc_price">
                                        <span class="card_desc_price_value">￥{{goods.pricebuy}}</span>
                                        <span class="card_desc_price_num">x{{goods.buynum}}</span>
                                    </div> -->
                                </div>
                            </van-card>
                            <div v-else class="order_list--panel_inner_more" @click="toOrderDetail(i)">
                                <img  v-for="(goods, goodsI) in el.pros" :key="goodsI"   v-lazy="goods.picpath" alt="">
                            </div>
                        </div>
                        <!-- <div v-if="el.pros.length > 1" class="order_list--panel_expand" @click="expandCard(i)" :ref="'expand' + i">展开</div> -->
                        
                        
                        <div class="order_list--total">
                            <span>共 {{el.sumnum}} 件商品</span>
                            付款金额: <span class="totel_fee">￥{{el.summoney}}</span>
                            <!-- （含运费{{el.post_fee | yuan}}） -->
                        </div>
                    </div>
                    
                    <component 
                        slot="footer" 
                        :is="'status' +el.zt"
                        :reminder="el.is_can_reminder"
                        @handle="actionHandle($event, i)"
                    />
                </van-panel>
            </van-checkbox-group>
		</van-list>
		
        <is-empty v-if="isEmpty">
            <div class="is-empty">
                <span class="is-empty_text">哎呀！您还没有订单...</span>
                <div>
                    <span  class="is-empty_btn" @click="goto">去逛逛</span>
                </div>
            </div>
        </is-empty>
        </van-pull-refresh>

        </div>
        <div v-if="items.length!=0&&active==1" class="check_all">
            <van-checkbox v-model="checked" @click.native="checkedAll">全选</van-checkbox>
            <div>
                <span>
                    <span >总计：</span>
                    <span class="check_all_price" v-if="totalprice>=0">{{totalprice}}</span>
                </span>
                <van-button type="default" @click="totalpay" class="check_all_btn" >合并支付</van-button>
            </div>
        </div>
        
	</div>
</template>

<script>
    import { ORDER_GOODS_LIST, ORDER_GOODS_CHANGESTATUS } from '@/api/order';
    import {PRO_ADD} from "@/api/cart"
	
	import { Tab, Tabs, Panel, Card, Checkbox, CheckboxGroup, PullRefresh  } from 'vant';
	import IsEmpty from "@/vue/components/is-empty/";
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
	
	import loadMore from '@/vue/mixin/list-load-more';
    import scrollFixed from '@/vue/mixin/scroll-fixed';
    
    import { STATUS_TEXT } from '@/config.js'
	
	export default {
		name: 'order-list',

		mixins: [loadMore, scrollFixed],
		
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
                obligations: false,            //是否为待付款
                result: [],             //多选框选中状态
                checked: false,           //是否全选
                shop_id,
                expand: false,              //收起展开订单
                activeIndex,
                change_tab_action: false,           //切换tab的回弹（状态用于弹出loadmore）
                items: [],
                isLoading:false,     
                totalprice:0,
				tabsItem: [{
						name: "全部",
						status: 0,
					},
					{
						name: "待付款",
						status: 1,
					},
					{
						name: "待发货",
						status: 2,
					},
					{
						name: "待收货",
						status: 3,
					},
					{
						name: "已完成",
						status: 4,
                    },
                    {
                        name: "已取消",
						status: 9,
                    }
				],
			}
		},
		
		
		watch: {
			'$route': 'resetInit'
        },
        

		created() {
            this.resetInit();
            if(this.activeIndex == 1) {
                //是否为待付款
                this.obligations = true;
            }
        },
        
        
		
		methods: {
			initData(loadMore = false) {
				const i = this.active;
                const status = this.tabsItem[i].status;
				return this.$reqGet(ORDER_GOODS_LIST, {
					pagesize: this.pages.perPage,
					page: this.pages.currPage,
					zt: status
				}, {
					hideLoading: false
				}).then(res => {
                    const { list, hasmore } = res.data;
                    if(list.length === 0) this.isEmpty = true;
                    this.items.push(...list);
                    this.has_more = hasmore;
                    console.log(this.items)
					return hasmore;
				})
            },
            onRefresh(){
                // 下拉刷新
                this.refresh()
            },
            async  refresh (){
                this.pages.currPage=1;
                const result = await this.resetInit();
                this.isLoading = false;
                this.$toast({
                    message:'刷新成功'
                })
            },
            totalpay(){
                // 合并支付
                if(this.result.length === 0){
                    this.$toast({
                        message:'请至少选择一件商品'
                    })
                    return
                }
                let str = this.result.join('_')
                this.$router.push({ name: "payment", params: { pay_id:str} })
            },
			async delOrder(i){
				const id = this.items[i].id;
				await this.$dialog.confirm({message: "确定要删除该订单吗?"});
				this.items.splice(i, 1);
				this.$toast("已删除该订单");
			},
			async cancelOrder(i){
				const goods = this.items[i].goods;
				await this.$dialog.confirm({message: "确定要取消该订单吗?"});
				if(this.activeIndex == 0){
					this.items[i].zt = 9;
				}else{
                    this.items.splice(i, 1);
                }
                this.$reqPost(ORDER_GOODS_CHANGESTATUS,{goods: goods, act: 'cancel'}).then(res=>{
                    this.$toast("已取消该订单");
                })
				
			},
			async receiptOrder(i){
				const goods = this.items[i].goods;
				await this.$dialog.confirm({message: "请确认收到货物, 确认收货后无法撤销!"});
                this.items[i].status = 4;
                this.$reqPost(ORDER_GOODS_CHANGESTATUS,{goods: goods, act: 'take'}).then(res=>{
                    this.pages.currPage=1;
                    this.pages.perPage=10;
                    this.resetInit();
                    this.$toast("已确认收货");
                })
				
            },
            logistics(i){
               
                //查看物流
                const id = this.items[i].goods;
                 console.log(id)
                this.$router.push({name: "user-order-logistics", params: { active: id}})
            },
			reminderOrder(i){
				const id = this.items[i].id;
				this.items[i].is_can_reminder = false;
				this.$toast("已提醒卖家发货, 请耐心等待哦~");
            },
            orderOneMore(i){
                //再来一单
                // const id = this.items[i].id;
                // this.$toast("成功加入购物车");
                //跳转路由到购物车

                this.$reqPost(PRO_ADD,{
                    buytype:'order',
                    goods:this.items[i].goods
                }).then(res=>{
                    if(res.code == 400) {
                        this.$toast({
                            message: res.msg
                        })
                    }else {
                        this.$toast({
                            message: '已成功加入购物车'
                        })
                        setTimeout(()=>{
                            this.$router.push({path: '/order'})
                        },1500)
                        
                    }
                    
                })
                
            },
			toPay(i){
				this.$router.push({ name: "payment", params: { pay_id:this.items[i].goods }})
			},
			handleTabClick(index){
                //切换状态回弹
                this.change_tab_action = true;
                this.items = [];

                if(index === 1) {
                    this.obligations = true;
                }else {
                    this.obligations = false;
                }
                //标记已经改变过路由
                this.change_route = true;
				this.$router.replace({name: "user-order-list", params: { active: index }})
			},
			getStatusText(status){
				return STATUS_TEXT[status] || '';
			},
			toOrderDetail(i){
                const order_id = this.items[i].goods;
				this.$router.push({name: "user-order-detail", params: { active: order_id }})
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
            checkedAll() {
                //全选回调


                if(this.checked) {
                    let arr = [];
                    this.items.map(item => {
                        arr.push(item.goods)
                    })
                    this.result = arr
                }else {
                    this.result.splice(0,this.result.length);
                }
            },
            checkedSimple() {

                let price=0
                this.items.forEach(item => {
                    this.result.forEach(goods=>{
                        if(item.goods==goods){
                            price -=item.summoney
                        }
                    })
                });
                this.totalprice = (0-price).toFixed(2)
                //多选分别选择回调
                if(this.result.length === this.items.length) {
                    this.checked = true;
                }else {
                    this.checked = false;
                }
            },
            backTo() {
                this.$router.back(-1);
            },
            goto(){
                // 去逛逛
                this.$router.push({path:'/items'})
            }
		},
		components: {
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Panel.name]: Panel,
            [Card.name]: Card,
            [PullRefresh .name]: PullRefresh ,
            [CheckboxGroup.name]: CheckboxGroup,
            [Checkbox.name]: Checkbox ,
            [IsEmpty.name]: IsEmpty,
            [NavBar.name]: NavBar,
            status0,
            status1,
			status3,
            status4,
            status9
        },
        beforeRouteLeave (to, from, next) {
            //因为将所有的组件进行了缓存，所以退出的时候要将其组件销毁
            // if(to.name === 'payment') {
            //     this.$destroy();
            // }
			// this.$destroy();
            // ...
            this.$destroy();
			next();
		}
	}

</script>

<style lang="scss" scoped>

    @import '../../../assets/scss/_var.scss';

  
    .visible {
        overflow: visible !important;
        height: auto !important;
        // transition: height 2s;
        // -moz-transition: height 2s; /* Firefox 4 */
        // -webkit-transition: height 2s; /* Safari 和 Chrome */
        // -o-transition: height 2s; /* Opera */
    }
    .order_list--panel {

        box-shadow:0 .5px #999;
        &_header {
            display: flex;
            justify-content: space-between;
            padding: 0 8px;
            line-height: 1.6rem;
            color: $main-title-color;
            
            &_status {
                color: $main-color;
                font-size: $extra-size;
            }
        }
    }
	.order_list {
        padding-top: 90px;
        padding-bottom:0; 
        .scroll_view {
            height: 100%;
            overflow-y: auto; 
        }
        .van-pull-refresh{
            height: 100%;
            overflow: auto;
            padding-bottom:2rem; 
        }
        &_tabs {
            position: fixed;
            top: 46px;
            width: 100%;
            z-index: 2000;
        }
		&--footer_btn {
			text-align: right;
		}
		&--panel{
            margin-bottom: 5px;
            &_inner_normal {
                height: 4rem;
                overflow: hidden;
            }
             &_inner_more {
                height: 4rem;
                overflow-x: scroll;
                display: flex;
                align-items: center;
                img{
                    display: inline;
                    height: 3.3rem
                }
            }

            &_expand {
                width: 100%;
                line-height: 1.14rem;
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
                // line-height: .56rem;
                // height: 1.1rem;
                color: $main-title-color;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .card_desc {
                margin-top: .26rem;
                display: flex;
                flex-direction: column;
                font-size: $extra-size;
                &_spec, &_bz {
                    color: $explain-text-color;
                    line-height: .56rem;
                }
                &_spec_title {
                    margin-top: 5px;
                    color: $spec-text-color;
                }
                &_price {
                    margin-top: 5px;
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
    }
    
    .check_all {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        height: 2.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 .6rem 0 .32rem;
        box-shadow:0 3px 8px #000;
        &_price {
            color: $main-color;
            font-size: $font-size-big;
            font-weight: 700;
        }
        &_btn {
            text-align: center;
            background: $linear-color;
            color: #fff;
            font-size: $params-title-size;
            padding: 0;
            width: 3rem;
            line-height:  1.4rem;
            height: 1.4rem;
        }
    }

    .is-empty {
        width: 100%;
        display: flex;
        flex-direction: column;
        &_text {
            color: $explain-text-color;
            font-size: $sub-title-size;
        }
        div {
            padding: .4rem 0;
        }
        &_btn {
            display: inline-block;
            border: 1px solid $main-color; 
            border-radius: 3px;
            color: $main-color;
            font-size: $product-title-size;
            width: 3.12rem;
            line-height: 1.4rem !important;
            text-align: center;
        }
    }

</style>

<style lang="scss">
.order_list {
    .van-checkbox__icon .van-icon {
        width: 18px;
        height: 18px;
    }
}

</style>



