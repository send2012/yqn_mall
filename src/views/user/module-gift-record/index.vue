<template>
	<div class="order_list user_prize_list">
        <nav-bar 
            title="中奖记录"
            @back="backTo"/>
        <div class="order_list_tabs">
            <van-tabs
                sticky
                :active="activeIndex"
                :swipe-threshold="5"
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
            ref="list_demo"
		  	:finished="finished"
			:immediate-check="false"
	  		:offset="0"
		  	@load="loadMore"
		>
            <van-checkbox-group v-model="result">
            
                <van-panel 
                    v-for="(el, i) in items"
                    class="order_list--panel"
                    :key="i"
                >

                    <div slot="header" class="order_list--panel_header">
                        <van-checkbox :name="el.createdate" v-if="obligations">
                            <span>{{el.createdate}}</span>
                        </van-checkbox>
                        <span v-if="!obligations">{{el.createdate}}</span>
                        <span :class="el.status === 4?'order_list--panel_header_complete':'order_list--panel_header_status'">{{getStatusText(el.status)}}</span>
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
                                class="order_list--van-card"
                                :thumb="el.picpath"
                                @click.native="toOrderDetail(i)"
                            >
                            
                                <div slot="title" class="card_title">
                                        {{el.title}}
                                </div>
                                <div slot="desc" class="card_desc">
                                    <!-- <span class="card_desc_spec text-ellipsis">{{goods.spec}}</span>
                                    <span class="card_desc_bz text-ellipsis">{{goods.bz}}</span>
                                    <span class="card_desc_spec_title text-ellipsis">{{goods.spec_title}}</span> -->
                                    <div class="card_desc_price">
                                        <span class="card_desc_price_value">{{el.ptitle}}</span>
                                        <span class="card_desc_price_num">x{{el.sumnum}}</span>
                                    </div>
                                </div>
                            </van-card>
                        </div>
                        <!-- <div v-if="el.orderItems.length > 1" class="order_list--panel_expand" @click="expandCard(i)" :ref="'expand' + i">展开</div> -->
                        
                        
                        <div class="order_list--total">
                            <span>
                                共 <span class="totel_fee">{{el.sumnum}}</span> 件奖品
                            </span>
                            <!-- <span v-if="el.status === 30">
                                <van-button size="small" @click="logistics(i)">查看物流</van-button>
                                <van-button size="small" class="order_list--total_enter" @click="receiptOrder(i)">确认收货</van-button>
                            </span> -->
                            
                        </div>
                    </div>
                    <!-- 待收货 -->
                    <component 
                        v-if="el.status === 3"
                        slot="footer" 
                        :is="'status' + el.status"
                        :reminder="el.is_can_reminder"
                        @handle="actionHandle($event, i)"
                    />
                    <!-- <component 
                        slot="footer" 
                        :is="'status3'"
                        :reminder="el.is_can_reminder"
                        @handle="actionHandle($event, i)"
                    /> -->
                    
                </van-panel>
            </van-checkbox-group>
		</van-list>
		
        <is-empty v-if="isEmptyshow">
            <div class="is-empty">
                <span class="is-empty_text">哎呀！您还没有订单</span>
                <div>
                    <span class="is-empty_btn">走，逛逛限时抢购</span>
                </div>
            </div>
        </is-empty>

        </van-pull-refresh>
        </div>

        <!-- <div v-if="obligations" class="check_all">
            <van-checkbox v-model="checked">全选</van-checkbox>
            <div>
                <span>
                    <span>总计：</span>
                    <span class="check_all_price">￥1300</span>
                </span>
                <van-button type="default" class="check_all_btn" size="small">合并支付</van-button>
            </div>
        </div> -->

	</div>
</template>

<script>
	import { PROMOTE_PRIZEUSER_LIST } from '@/api/activity';
	
	import { Tab, Tabs, Panel, Card, Checkbox, CheckboxGroup, PullRefresh  } from 'vant';
	import IsEmpty from "@/vue/components/is-empty/";
    import NavBar from "@/vue/components/NavBar/"
    import status3 from "./handle-status-30"; 
	
	import loadMore from '@/vue/mixin/list-load-more';
	import scrollFixed from '@/vue/mixin/scroll-fixed';
	
	const STATUS_TEXT = {
		1: "待出库",         
		2: "待发货",
		3: "发货中",
		4: "已完成",
		40: "已完成",
		50: "退款成功",
		60: "交易关闭",
        70: "交易关闭",
        80: "已取消"
	}
	
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
                items: [],
                isEmptyshow:false,               //是否有订单
                isLoading:false,           
				tabsItem: [{
						name: "全部",
						status: 0,
					},
					// {
					// 	name: "待付款",
					// 	status: 10,
					// },
					{
						name: "待出库",
						status: 1,
					},
					{
						name: "待发货",
						status: 2,
					},
					{
						name: "待收货",
                        status: 3
                    },
                    {
                        name: "已完成",
						status: 4
                    }
				],
			}
		},
		
		
		watch: {
			'$route': 'resetInit'
		},

		created() {
			this.resetInit();
        },
		
		methods: {
			initData() {
				const i = this.active;
				const status = this.tabsItem[i].status;
				return this.$reqGet(PROMOTE_PRIZEUSER_LIST, {
					pagesize: this.pages.perPage,
                    page: this.pages.currPage,
                    status
				}, {
					hideLoading: true
				}).then(res => {
                    const { list, hasmore } = res.data;
                    if(list.length === 0) this.isEmpty = true;
                    this.items.push(...list);
                    this.has_more = hasmore;
					return hasmore;

				})
            },
            onRefresh() {
                setTimeout(() => {
                    this.resetInit()
                    this.$toast('刷新成功');
                    this.isLoading = false;
                }, 500);
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
                this.$router.push({name: "user-order-logistics", params: {active: i}})
            },
            handleTabClick(index){
                //判断是否显示多选按钮
                // if(index === 1) {
                //     this.obligations = true;
                // }else {
                //     this.obligations = false;
                // }
                //标记已经改变过路由
                this.change_route = true;
                this.$router.replace({name: "user-gift-record", params: { active: index }});
			},
			getStatusText(status){
				return STATUS_TEXT[status] || '';
			},
			toOrderDetail(i){
				const order_id = this.items[i].goods;
				this.$router.push({name: "user-gift-record-detail", params: { order_id }})
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
            },
            beforeRouteLeave (to, from, next) {
                // ...
                this.$destroy();
                next()
            }
		},
		components: {
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Panel.name]: Panel,
            [Card.name]: Card,
            [PullRefresh.name]: PullRefresh,
            [CheckboxGroup.name]: CheckboxGroup,
            [Checkbox.name]: Checkbox ,
            [status3.name]: status3,
            [IsEmpty.name]: IsEmpty,
            [NavBar.name]: NavBar
		}
	}

</script>

<style lang="scss" scoped>

    .visible {
        overflow: visible !important;
        height: auto !important;
        // transition: height 2s;
        // -moz-transition: height 2s; /* Firefox 4 */
        // -webkit-transition: height 2s; /* Safari 和 Chrome */
        // -o-transition: height 2s; /* Opera */
    }

    .scroll_view {
        height: 100%;
        overflow-y: auto; 
    }
    .order_list--panel {
        &_header {
            display: flex;
            justify-content: space-between;
            padding: 0 8px;
            line-height: 40px;
            font-size: 12px;
            &_status {
                color: $main-color;
            }
            &_complete {
                color: $sub-title-color;
            }
        }
    }
	.order_list {
        padding-top: 90px;
        padding-bottom: 0;
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
                height: 100px;
                overflow: hidden;
                border: 1px solid #F1F1F1;
            }
            &_expand {
                margin-top: 20px;
                width: 100%;
                height: 32px;
                text-align: center;
                color: #999;
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
                font-size: $extra-size;
                line-height: 1.2rem;
                color: #333;
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
                    color: #999;
                    line-height: 14px;
                }
                &_spec_title {
                    color: green;
                }
                &_price {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    &_value {
                        color: #333;
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
            font-size: $extra-size;
            // display: flex;
            // justify-content: space-between;
            // align-items: center;
            .totel_fee {
                font-size: $product-title-size;
                color: #f60;
            }
            &_enter {
                background: linear-gradient(to right ,#fe5d28 , #fe8246)!important;
                color: #fff;
            }
		}
    }
    
    .check_all {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        height: 55px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px 0 8px;
        &_price {
            color: #f60;
            font-size: 15px;
            font-weight: 700;
        }
        &_btn {
            background: #f60;
            color: #fff;
        }
    }

    .is-empty {
        width: 100%;
        display: flex;
        flex-direction: column;
        &_text {
            color: #9B9B9B;
            font-size: 14px;
        }
        div {
            margin-top: 2px;
            padding: 15px 0;
        }
        &_btn {
            border: 1px solid #f60;
            border-radius: 3px;
            color: #ff6600;
            font-size: $product-title-size;
            padding: 5px 8px;
        }
    }

</style>

<style lang="scss">
.user_prize_list {
    .van-checkbox__icon--checked .van-icon {
        color: #fff;
        border-color: #f60 !important;
        background-color: #f60 !important;
    }
    .van-card__thumb {
        width: 3.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            margin-top: 6px;
        }
    }
    .van-pull-refresh {
        // padding-top:44px;
        height: 100%;
        overflow: auto;
    }

}
    

</style>

