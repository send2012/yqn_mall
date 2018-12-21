<template>
	<div class="order_list">
        <nav-bar 
            title="兑换记录"
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
		  	:finished="finished"
			:immediate-check="false"
	  		:offset="100"
		  	@load="loadMore"
		>
            <van-checkbox-group v-model="result">
            
                <van-panel 
                    v-for="(el, i) in items"
                    class="order_list--panel"
                    :key="i"
                >

                    <div slot="header" class="order_list--panel_header">
                        <!-- <van-checkbox :name="el.goods" v-if="obligations">
                            <span>{{el.goods}}</span>
                        </van-checkbox> -->
                        <span>{{el.goods}}</span>
                        <span :class="'order_list--panel_header_status ' + (el.zt !== 4 && el.zt !== 9?'':'complete_text')">{{el.zt_tag}}</span>
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
                                        {{el.ptitle}}
                                </div>
                                <div slot="desc" class="card_desc">
                                    <span class="card_desc_spec text-ellipsis">规格：{{el.spec}}</span>
                                    <!-- <span class="card_desc_bz text-ellipsis">{{el.bz}}</span> -->
                                    <!-- <span class="card_desc_spec_title text-ellipsis">{{el.spec_title}}</span> -->
                                    <div class="card_desc_price">
                                        
                                        <span class="card_desc_price_value">实付积分：<span>{{(el.pointbuy)}}</span></span>
                                        <!-- <span class="card_desc_price_num">x{{el.quantity}}</span> -->
                                    </div>
                                </div>
                            </van-card>
                        </div>
                        <!-- <div v-if="el.orderItems.length > 1" class="order_list--panel_expand" @click="expandCard(i)" :ref="'expand' + i">展开</div> -->
                        
                        
                        <div class="order_list--total">
                            <span>
                                <!-- 实付积分： <span class="totel_fee">{{el.pointbuy}}</span> -->
                            </span>
                            <span v-if="el.zt === 3">
                                <van-button size="small" @click="logistics(i)">物流跟踪</van-button>
                                <van-button size="small" class="order_list--total_enter" @click="receiptOrder(i)">确认收货</van-button>
                            </span>
                            
                        </div>
                    </div>
                    <!-- <component 
                        slot="footer" 
                        :is="'status' + el.status"
                        :reminder="el.is_can_reminder"
                        @handle="actionHandle($event, i)"
                    /> -->
                </van-panel>
            </van-checkbox-group>
		</van-list>
		
        <is-empty v-if="isEmpty">
            <div class="is-empty">
                <span class="is-empty_text">哎呀！您还没有订单...</span>
            </div>
        </is-empty>
        </van-pull-refresh>
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

	</div>
</template>

<script>
    import { POINT_GOODS_LIST, POINT_POINT_CHANGESTATUS } from '@/api/point';
	
	import { Tab, Tabs, Panel, Card, Checkbox, CheckboxGroup, PullRefresh } from 'vant';
    import IsEmpty from "@/vue/components/is-empty/";
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
                change_tab_action: false,           //切换tab的回弹（状态用于弹出loadmore）
                activeIndex,
                isLoading:false,
                items: [],
                order_zt: 0,                //订单状态
                isEmpty: false,     
				tabsItem: [{
						name: "全部",
						status: 0,
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
		},
		
		methods: {
			initData() {
				const i = this.active;
				const status = this.tabsItem[i].status;
				return this.$reqGet(POINT_GOODS_LIST, {
					pagesize: this.pages.perPage,
                    page: this.pages.currPage,
                    zt: status
				}, {
					hideLoading: true
				}).then(res => {
					const { list, hasmore } = res.data;
                    this.items.push(...list);
                    if(list.length === 0) this.isEmpty = true;
                    this.has_more = hasmore;
					return hasmore;
				})
            },
            onRefresh() {
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
			async receiptOrder(i){
				const id = this.items[i].goods;
				this.$dialog.confirm({
                    title: "确认提示",
                    message: "你确认要完成该订单吗？"
                }).then(() => {
                    // on confirm
                    this.$reqPost(POINT_POINT_CHANGESTATUS,{goods: id, act: 'take'}).then(res => {
                        this.items[i].zt = 4;
                        this.$toast("已确认收货");
                    }) 
                }).catch(() => {
                // on cancel

                });

                 
				
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
			toOrderDetail(i){
				const order_id = this.items[i].goods;
				this.$router.push({name: "user-point-record-detail", params: { order_id }})
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
            handleTabClick(index){
                //切换状态回弹
                this.change_tab_action = true;

                // if(index === 1) {
                //     this.obligations = true;
                // }else {
                //     this.obligations = false;
                // }
                //标记已经改变过路由
                this.change_route = true;
				this.$router.replace({name: "user-point-record", params: { active: index }})
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
            [PullRefresh.name]: PullRefresh,
            [CheckboxGroup.name]: CheckboxGroup,
            [Checkbox.name]: Checkbox ,
            [IsEmpty.name]: IsEmpty,
            [NavBar.name]: NavBar
		}
	}

</script>

<style lang="scss" scoped>

    .complete_text {
        color: $sub-title-color !important;
    }

    .scroll_view {
        height: 100%;
        overflow-y: auto; 
    }

    .visible {
        overflow: visible !important;
        height: auto !important;
        // transition: height 2s;
        // -moz-transition: height 2s; /* Firefox 4 */
        // -webkit-transition: height 2s; /* Safari 和 Chrome */
        // -o-transition: height 2s; /* Opera */
    }
    .order_list--panel {
        &_header {
            display: flex;
            justify-content: space-between;
            padding: 0 8px;
            line-height: 1.6rem;
            font-size: $extra-size;
            color: $main-title-color;
            &_status {
                color: $main-color;
            }
        }
    }
	.order_list {
        .van-pull-refresh {
        padding-top:44px;
        height: 100%;
        overflow: auto;
        }
        padding-top: 46px;
        padding-bottom: 0;
		&--footer_btn {
			text-align: right;
		}
        &_tabs {
            position: fixed;
            top: 46px;
            width: 100%;
            z-index: 2000;
        }
		&--panel{
            margin-bottom: 10px;
            &_inner_normal {
                height: 4rem;
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
                line-height: 1.2rem;
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
                    line-height: $product-title-size;
                }
                &_spec_title {
                    color: $spec-text-color;
                }
                &_price {
                    margin-top: .64rem;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    &_value {
                        color: $main-title-color;
                        font-size: $extra-size;
                        span {
                            color: $price-color;
                            font-size: $main-title-size;
                        }
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
            display: flex;
            justify-content: space-between;
            align-items: center;
            .totel_fee {
                font-size: $product-title-size;
                color: $main-color;
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
        height: 2.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px 0 8px;
        &_price {
            color: $main-color;
            font-size: $product-title-size;
            font-weight: 700;
        }
        &_btn {
            background: $main-color;
            color: #fff;
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
            height: 1.32rem;
            line-height: 1.32rem;
            text-align: center;
        }
    }

</style>

