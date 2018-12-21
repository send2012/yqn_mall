<template>
	<div class="order_list">
        <nav-bar
            title="售后申请"
            @back="backTo"/>
        
            
        <div class="order_list_tabs">
            <van-tabs
                sticky
                :active="activeIndex"
                :swipe-threshold="4"
                @click="handleTabClick"
            >
                <van-tab 
                    v-for="tab in tabsItem"
                    :title="tab.name" 
                    :key="tab.status">
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
			<van-panel 
				v-for="(el, i) in items"
				class="order_list--panel"
				:key="i"
				:status="getStatusText(el.status)"
			>
                <div slot="header" class="order_list--panel_header">
                    <span class="order_list--panel_id">订单号: {{el.zt_tag?el.goods:el.refund_no}}</span>
                    <!-- <span class="order_list--panel_created">下单时间：2018-04-24 14:22:21</span> -->
                    <span class="order_list--panel_created" v-if="el.zt_tag">{{ el.zt_tag }}</span>
                    <span class="order_list--panel_created" :class="el.status==0||el.status==3?'order_list--panel_createdmark':''" v-if="!el.zt_tag">{{ getStatusText(el.status) }}</span>
                </div>
                <!-- 可申请列表 -->
                <div v-if="el.zt_tag">
                    <div v-for="(goods,i) in el.pros" :key="i">
                        <van-card
                            class="order_list--van-card"
                            :thumb="goods.picpath"
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
                                <!-- <span class="card_desc_spec_title text-ellipsis">{{goods.spec_title}}</span> -->
                                <div class="card_desc_price">
                                    <span class="card_desc_price_value">￥{{goods.pricebuy}}</span>
                                    <span class="card_desc_price_num">x{{goods.buynum}}</span>
                                </div>
                            </div>
                        </van-card>
                        <div class="order_list--panel_footer">
                            <component 
                                slot="footer"
                                :is="'status100'"
                                @handle="refund_handle($event, goods)"
                            />
                        </div>
                    </div>
                
                    <!-- <div class="order_list--total">
                        合计: {{el.refund_fee | yuan}}（含运费{{el.refund_post_fee | yuan}}）
                    </div> -->
                    <!-- <div v-if="el.status !== 0" class="list_status">
                        <van-icon :name="getStatusIcon(el.status)" />
                        <span class="list_status_text">{{getStatusText(el.status)}}</span>
                    </div> -->
                
                </div>

                <div v-else>
                    <van-card
                            class="order_list--van-card"
                            :thumb="el.picpath"
                        >
                            <div slot="title" class="card_title">
                                    {{el.ptitle}}
                            </div>
                            <div slot="desc" class="card_desc">
                                <!-- <span class="card_desc_spec text-ellipsis">{{el.spec}}</span> -->
                                <!-- <span class="card_desc_bz text-ellipsis">{{el.bz}}</span> -->
                                <span class="card_desc_spec_title text-ellipsis">{{el.spec_title}}</span>
                                <div class="card_desc_price">
                                    <span class="card_desc_price_value">￥{{el.pricebuy}}</span>
                                    <span class="card_desc_price_num">x{{el.buynum}}</span>
                                </div>
                            </div>
                        </van-card>

                </div>
                
                <component 
                    slot="footer" 
                    v-if="el.status !== 10 && el.status !== 70 && !el.zt_tag"
                    :is="'status' + (el.zt_tag?'100':el.status)"
                    @handle="refund_handle($event, el)"
                />
                
				<!-- <div slot="footer" style="text-align: right;">
					<van-button size="small" @click="refund_handle(i)">{{ el.status == 10 ? "撤销申请" : "查看详情"}}</van-button>
				</div> -->
			</van-panel>
		</van-list>
		<is-empty v-if="isEmpty">抱歉,没有找到符合条件的订单</is-empty>
        </van-pull-refresh>
        </div>

        <!-- 申请退货弹出层 -->
        <van-sku
            v-model="showApply"
            :sku="sku"
            :goods="goods"
            :goods-id="goodsId"
            :close-on-click-overlay="true"
            @buy-clicked="onBuyClicked('refund_apply')"
            class="order_list_apply">

            <div slot="sku-header-price" slot-scope="props" class="order_list_apply_price">
                <!-- 价格展示区 -->
                <span class="order_list_apply_price_spec">{{goods.spec}}</span>
                <span class="order_list_apply_price_price">
                    ￥{{goods.pricebuy}}
                    <span>x{{goods.buynum}}</span>
                </span>
            </div>

            <template slot="sku-stepper" slot-scope="props">
                <!-- 步进器，数量选择区 -->
                <md-field-group class="field_group">

                <logis-field
                    label="退货原因：" 
                    formType="select"
                    v-model="apply_form.reason" 
                    
                    placeholder="--请选择原因--"
                    :selectList="log_reason"
                    @selectSEvent="selectReason" />

                <logis-field
                    label="退货数量：" 
                    formType="stepper"
                    v-model="apply_form.refund_num"
                    :max="logis_max"
                   
                    @stepperEvent="refundNum" />

                <logis-field
                    label="备注说明：" 
                    formType="textarea"
                    v-model="apply_form.remark" 
                    placeholder="备注说明" />

                <logis-field
                    v-if="showApply"
                    label="上传图片：" 
                    formType="uploadGroup"
                    @imgurl='currentimgurl'
                    :uploadGroupText="uploadGroupText"
                    v-model="apply_form.pics"/>
                 
            </md-field-group>

                
            </template>

            <!-- <template slot="sku-messages" slot-scope="props">
                商品留言区
                已购数量： 1
            </template> -->

            <template slot="sku-actions" slot-scope="props">
                <!-- 底部按钮区 -->
                <div class="sku_bottom_btn" bottom-action @click="props.skuEventBus.$emit('sku:buy')">确 定</div>
            </template>

        </van-sku>

        <!-- 请退货弹出层 -->
        <van-sku
            v-model="showRefund"
            :sku="sku"
            :goods="goods"
            :goods-id="goodsId"
            :close-on-click-overlay="true"
            @buy-clicked="onBuyClicked('refund_express')"
            class="order_list_refundList">
            
            <template slot="sku-header-price" slot-scope="props" class="order_list_refundList_price">
                <!-- 价格展示区 -->
                <span class="order_list_refundList_price_spec">{{refund_data.spec}}</span>
                <span class="order_list_refundList_price_price">
                    退款金额 {{refund_data.refund_money}} 元
                </span>
            </template>

            <template slot="sku-stepper" slot-scope="props">
                <!-- 步进器，数量选择区 -->
                <md-field-group class="field_group">
                <logis-field
                    label="">
                    <span slot="extra">{{refund_data.ret_address}}</span>
                </logis-field>

                <logis-field
                    label="物流公司：" 
                    formType="select"
                    v-model="refund_form.express_name" 
                    placeholder="--选择配送物流--"
                    :selectList="express_list"
                    @selectSEvent="selectExpress" />

                <logis-field
                    label="物流单号：" 
                    formType="input"
                    v-model="refund_form.express_no" 
                    placeholder="请输入物流单号"/>

                <logis-field
                    label="备注说明：" 
                    formType="textarea"
                    v-model="refund_form.express_remark" 
                    placeholder="备注说明" />
                
            </md-field-group>

                
            </template>

            <!-- <template slot="sku-messages" slot-scope="props">
                商品留言区
                已购数量： 1
            </template> -->

          

            <template slot="sku-actions" slot-scope="props">
                <!-- 底部按钮区 -->
                <div class="sku_bottom_btn" bottom-action @click="props.skuEventBus.$emit('sku:buy')">确 定</div>
            </template>

        </van-sku>

	</div>
</template>

<script>
	import { ORDER_GOODS_REFUND_PUTLIST, ORDER_GOODS_REFUND_REASONLIST, ORDER_GOODS_REFUND_APPLY, ORDER_GOODS_REFUND_LIST, ORDER_GOODS_REFUND_EXPRESS } from '@/api/order';
    import { SYS_EXPRESS_LIST } from "@/api/system";
    import { Tab, Tabs, Panel, Card, Sku, Popup, PullRefresh } from 'vant';
    import IsEmpty from "@/vue/components/is-empty/";
    import field from '@/vue/components/field/logistics_index.vue';
	import fieldGroup from '@/vue/components/field-group/';
    import NavBar from "@/vue/components/NavBar/";
    import status100 from "./handle-status-0";
	import status10 from "./handle-status-10";
	import status2 from "./handle-status-50";
	import status1 from "./handle-status-60";
	import status70 from "./handle-status-70";
	import status0 from "./handle-status-80"; 
	
	import loadMore from '@/vue/mixin/list-load-more';
	import scrollFixed from '@/vue/mixin/scroll-fixed';
	
	import { REFUND_LIST_STATUS } from '@/config.js'

    const STATUS_ICON = {
        0: "",
        10: "yqn_orderCancel",
        50: "yqn_success",
        60: "yqn_orderCancel",
        70: "yqn_success",
        80: "yqn_success"
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
            const shop_id = this.$util.getLocationParam("shop_id")
            
			return {
				shop_id,
				activeIndex: 0,
                items: [],
                showApply: false,               //申请退货弹出层
                logis_max: 1,                   //申请退货的最大数量
                uploadGroupText:['图片上传'],           //申请退货上传图片
                showRefund: false,                  //请退货弹出层
                isEmpty: false,                     //没有订单
                log_reason: [],                 //申请退货原因
                isLoading:false,
                apply_form: {
                    goods: '',                  //订单号
                    pro_id: '',                    //商品sku_id
                    refund_num: '',             //退货数量
                    reason: '',                  //退货原因id
                    remark: '',                 //退货备注
                    pics: [0,0]                    //退货照片
                },                 //提交申请的参数
                refund_form: {
                    refund_no: '',         //退货单号         
                    express_name: '',       //物流公司ID
                    express_no: '',     //物流单号
                    express_remark: ''          //备注说明
                },            //立即退货参数
                refund_data: {},            //立即退货信息
                express_list: [],               //所有的物流公司  
                index_info:[],                //首页信息      
				tabsItem: [{
						name: "申请",
						status: 100,
					},
					{
						name: "审核",
						status: 0,
                    },
                    {
                        name: "物流",
						status: 3,
                    },
					{
						name: "结束",
						status: 5,
					},
                ],
                //申请退货start
                sku: {
                    // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
                    // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
                    tree: [],
                    // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
                    list: [
                        {
                            id: 2259, // skuId，下单时后端需要
                            price: 100, // 价格（单位分）
                            s1: '1215', // 规格类目 k_s 为 s1 的对应规格值 id
                            s2: '1193', // 规格类目 k_s 为 s2 的对应规格值 id
                            s3: '0', // 最多包含3个规格值，为0表示不存在该规格
                            stock_num: 110 // 当前 sku 组合对应的库存
                        }
                    ]
                },
                goods: {
                    // 商品标题
                    title: '测试商品',
                    // 默认商品 sku 缩略图
                    picture: 'https://img.yzcdn.cn/1.jpg'
                },
                //申请退货end

			}
		},
		
		watch: {
			'$route': 'resetInit'
		},

		created() {
            this.getRefundReason();
            this.resetInit();
            this.index_info=this.$route.query
		},
		
		methods: {
			initData(loadMore = false) {
                //获取可申请列表
				const i = this.activeIndex;
                const status = this.tabsItem[i].status;
                if(i === 0) {
                    //申请TAB
                    return this.$reqGet(ORDER_GOODS_REFUND_PUTLIST, {
                        pagesize: this.pages.perPage,
                        page: this.pages.currPage
                    }, {
                        hideLoading: true
                    }).then(res => {
                        const { list, hasmore } = res.data;
                        this.items.push(...list);
                        if(list.length === 0) this.isEmpty = true;
                        this.has_more = hasmore;
                        return hasmore;
                    })
                }else {
                    //审核，物流，结束TAB
                    return this.$reqGet(ORDER_GOODS_REFUND_LIST, {
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
                }
				  
                
            },
            getRefundList(index) {
                //获取审核，物流，结束列表
                let zt = this.tabsItem[index].status;
                return this.$reqGet(ORDER_GOODS_REFUND_LIST, {
					pagesize: this.pages.perPage,
                    page: this.pages.currPage,
                    zt
				}, {
					hideLoading: true
				}).then(res => {
					const { list, hasmore } = res.data;
                    this.items.push(...list);
                    if(list.length === 0) this.isEmpty = true;
                    this.has_more = hasmore;
					return hasmore;
                }) 
                // this.$reqGet(ORDER_GOODS_REFUND_LIST,params).then(res => {
                //     //清空数组
                //     this.items.splice(0,this.items.length);
                //     const { list } = res.data;
                //     this.items.push(...list);
                // })
            },
            onRefresh() {
                this.refresh();
            },
            async  refresh (){
                this.pages.currPage=1;
                const result = await this.resetInit();
                this.isLoading = false;
                this.$toast({
                    message:'刷新成功'
                })
            },
            getExpressList() {
                //获取物流公司列表
                this.$reqGet(SYS_EXPRESS_LIST).then(res => {
                    res.data.map((item)=>{
                        item.value = item.title;
                    })
                    this.express_list.push(...res.data);
                })
            },
            getRefundReason() {
                //获取退货原因
                this.$reqGet(ORDER_GOODS_REFUND_REASONLIST).then(res => {
                    this.log_reason.push(...res.data)
                })
            },
            applyRefund(goods) {
                //申请退货
                 this.apply_form={
                    goods: '',                  //订单号
                    pro_id: '',                    //商品sku_id
                    refund_num: '',             //退货数量
                    reason: '',                  //退货原因id
                    remark: '',                 //退货备注
                    pics: [0,0]                    //退货照片
                }
                this.apply_form.goods = goods.goods;
                this.apply_form.pro_id = goods.pro_id;
                this.goods = Object.assign({},goods);
                this.$set(this.goods,'title',goods.ptitle);
                this.$set(this.goods,'picture',goods.picpath);
                this.logis_max = goods.buynum;
                this.showApply = true;
            },
            refund(goods) {
                //立即退货弹出框
                 this.refund_form={
                    refund_no: '',         //退货单号         
                    express_name: '',       //物流公司ID
                    express_no: '',     //物流单号
                    express_remark: ''          //备注说明
                }, 
                this.getExpressList();
                this.$set(this.goods,'title',goods.ptitle);
                this.$set(this.goods,'picture',goods.picpath);
                this.refund_data = Object.assign({},goods);
                this.refund_form.refund_no = goods.refund_no;
                this.showRefund = true;

            },
            showReason(goods) {
                //未通过原因
                this.$dialog.alert({
                    message: goods.sh_remark?goods.sh_remark:'审核不通过'
                });
            },
            serviceshow(){
                // 联系客户
                let yg_mobile=sessionStorage.getItem('yg_mobile')
                window.location.href = `tel:${yg_mobile}`;
            },
            // deleteRefund(i) {
            //     //删除申请
            //     this.$dialog.confirm({
            //         title: '确认提示',
            //         message: '您确认要删除吗？'
            //     }).then(() => {
            //         // on confirm
            //     }).catch(() => {
            //         // on cancel
            //     });
            // },
			refund_handle(handle,i){
                this[handle] && this[handle](i)
				// const item = this.items[i];
				// if(item.status == 10){
				// 	this.$dialog.confirm({
				// 		message: "撤销后将不能再次发起申请，确定要撤销该申请吗？"
				// 	}).then((res) => {
				// 		this.$toast("已撤销该退款申请");
				// 		this.items[i].status = 50;
				// 	})
				// }else{
				// 	//跳转退款详情
				// }
            },
			handleTabClick(index){
                this.items = []
				if(this.activeIndex != index){
                    this.activeIndex = index;
                    // if(index === 0) {
                    //     this.resetInit();
                    // }else {
                    //     this.getRefundList(index);
                    // }
                    //切换状态回弹
                    this.change_tab_action = true;
                    
                    //标记已经改变过路由
                    this.change_route = true;
                    this.$router.replace({name: "user-refund-list", params: { active: index }})
				}
            },
            getStatusIcon(status){
				return STATUS_ICON[status] || '';
            },
			getStatusText(status){
				return REFUND_LIST_STATUS[status] || '';
            },
            selectReason(value) {
                //选择原因
                this.apply_form.reason = value;
            },
            selectExpress(value) {
                //选择物流公司
                this.refund_form.express_name = value;
            },
            refundNum(value) {
                //选择数量
                this.apply_form.refund_num = value;
            },
            onBuyClicked(type) {
                

                if(type === 'refund_apply') {
                    if(!this.apply_form.reason){
                        this.$toast('请选择退款原因')
                        return
                    }if(!this.apply_form.refund_num){
                        this.$toast('请选择退款数量')
                        return
                    }if(!this.apply_form.remark){
                        this.$toast('请输入退款备注')
                        return
                    }
                    if(this.apply_form.pics[0] == 0 && this.apply_form.pics[1] == 0){
                        this.$toast('请至少上传一张图片')
                        return
                    }
                    //申请退货回调
                    this.$reqPost(ORDER_GOODS_REFUND_APPLY,this.apply_form).then(res => {
                        this.$toast('申请成功，请等待审核');
                        this.resetInit();
                        this.showApply = false;
                    })
                }else if(type === 'refund_express'){
                        if(!this.refund_form.express_name){
                            this.$toast('请选择物流公司')
                            return
                        }if(!this.refund_form.express_no){
                            this.$toast('请输入物流单号')
                            return
                        }
                    //立即退货回调
                    this.$reqPost(ORDER_GOODS_REFUND_EXPRESS,this.refund_form).then(res => {
                        this.$toast('物流信息提交成功，请等待发货');
                        this.showRefund  = false;
                    })
                }
                
            },
            getApplyStatus(id) {
                //获取审核tab中的状态
                switch(id) {
                    
                }
            },
            currentimgurl(data){
                this.apply_form.pics.splice(data[1],1,data[0])
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
            [Sku.name]: Sku,
            [Popup.name]:Popup,
            [fieldGroup.name]: fieldGroup,
            [field.name]: field,
            [IsEmpty.name]: IsEmpty,
            [NavBar.name]: NavBar,
            [PullRefresh.name]: PullRefresh,
            status100,
            status10,
            status2,
            status1,
            status70,
            status0
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
@import "../../../assets/scss/_var.scss";

	.order_list {
        padding: 90px 0 0;
        .scroll_view {
            height: 100%;
            overflow-y: auto; 
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
            // padding-bottom: 10px;
            &_header {
                line-height: 1.32rem;
                color: $sub-title-color;
                font-size: $extra-size;
                padding: 0 8px;
                display: flex;
                justify-content: space-between;
            }
            &_created {
                font-size: $extra-size;
                color: $explain-text-color;
            }
            &_createdmark {
                font-size: $extra-size;
                color: #FF6600 !important;
            }
            // .list_status {
            //     padding-left: 18px;
            //     height: 40px;
            //     line-height: 40px;
            //     border-top: 1px solid #eee;
            //     &_text {
            //         padding-left: 8px;
            //     }
            // }
            &_footer {
                margin-top: 10px;
                padding-right: 0.8rem;
                padding-bottom: 10px;
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
                line-height: .8rem;
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
                    color: $explain-text-color;
                    line-height: .56rem;
                    margin-top: 5px;
                }
                &_spec_title {
                    margin-top: 5px;
                    color: $explain-text-color;
                    font-size: $extra-size;
                }
                &_price {
                    margin-top: 5px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    color: $price-color;
                    &_value {
                        font-size: $product-title-size;
                    }
                    &_num {
                        color: $explain-text-color;
                        font-size: $extra-size;
                    }
                }
            }
		}
		
		&--total{
			text-align: right;
			padding: 10px;
        }

        &_apply {
            padding-top:20px; 
            &_price {
                display: flex;
                flex-direction: column;
                &_spec {
                    margin-top: 6px;
                    color: $explain-text-color;
                    font-size: $extra-size;
                }
                &_price {
                    margin-top: 5px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    color: $price-color;
                    font-size: $product-title-size;
                    span {
                        color: $explain-text-color;
                        font-size: $extra-size;
                    }
                }
            }
        }

        &_refundList {
            &_price {
                display: flex;
                flex-direction: column;
                &_spec {
                    margin-top: 6px;
                    color: $explain-text-color;
                    font-size: $extra-size;
                }
                &_price {
                    margin-top: 5px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    color: $price-color;
                    font-size: $product-title-size;
                    span {
                        color: $explain-text-color;
                        font-size: $extra-size;
                    }
                }
            }
        }
        
        .sku_bottom_btn {
            width: 100%;
            height: 50px;
            text-align: center;
            line-height: 50px;
            font-size: 16px;
            color: #fff;
            background: linear-gradient(to right ,#fe5d28 , #fe8246)!important;
        }
	}

</style>
<style lang="scss">

.order_list {
    .van-sku-container{
        padding-top:1rem;
    }
    .van-sku__close-icon{
        top:-10px !important;
    }
    .van-sku-group-container {
        display: none;
    }
    .van-pull-refresh {
        height: 100%;
        overflow: auto;
    }
    &_apply {
        .van-sku-body {
            max-height: 18.6rem !important;
        }
    }

}
.show_service {
    width: 100%;
    height: 5.32rem;
    display: flex;
    flex-direction: column;
    span {
        // @include one-border;
        flex: 1;
        color: $sub-title-color;
        display: inline-block;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: $sub-title-size;
        &:nth-child(3) {
            color: $explain-text-color;
        }
    }
}
</style>

