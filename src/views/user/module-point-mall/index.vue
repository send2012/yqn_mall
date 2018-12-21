<template>
	<div class="point_list">
		
		<div class="fixedTop">
			<nav-bar
                title="积分兑换" 
                @back="backTo"/>
		</div>
        <div ref="scroll_view" class="scroll_view">
        <img :src="point_banner" alt="" class="point_list_banner">
        <div class="point_list_text">
            <!-- <img :src="point_left" alt="" class="point_list_text_left" />
            <img :src="point_right" alt="" class="point_list_text_right" /> -->
            <div class="point_list_text_left">当前 <span>{{user_point}}</span> 积分</div>
            <div class="point_list_text_right">
                <img :src="point_sign_status" alt="" @click="todaySign"/>
            </div>
                
        </div>

        <van-tabs v-model="active" sticky @click="clickTab" class="point_list_tabs">
            <van-tab v-for="(item,index) in tabs" :title="item.name" :key="index">
                <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    :immediate-check="false"
                    :offset="100"
                    @load="loadMore"
                    class="point_list_tabs_list"
                >
                    <!-- <item-group
                        :setting="setting"> -->
                        <item-card-doub
                            v-for="(item, i) in items" 
                            :key="i"
                            :goods="item"
                            @click="itemClick(item.id)"
                            class="point_list_tabs_list_item"
                        >
                        <!-- <template slot="leftTopIcon">
                            <span class="point_list_tabs_list_item_topIcon">全场通用</span>
                        </template> -->

                        <div slot="goodDesc"  class="point_list_tabs_list_item_coupon" v-if="item.coupon_id">
                            <span class="point_list_tabs_list_item_coupon_markdown">备注：{{item.bz}}</span>
                            <span class="point_list_tabs_list_item_coupon_point"><van-icon name="yqn_point" /> {{item.point}}积分</span>
                            <span class="point_list_tabs_list_item_coupon_primarybtn"  v-if="item.num<=0 || user_point<item.point">{{user_point>item.point?'库存不足':'积分不足'}}</span>
                            <span class="point_list_tabs_list_item_coupon_btn" @click="exchangeNow(item.id)" v-else>立即兑换</span>
                        </div>

                        <div slot="goodDesc"  class="point_list_tabs_list_item_good" v-if="!item.coupon_id">
                            <span class="point_list_tabs_list_item_good_spec">规格：{{item.spec}}</span>
                            <span class="point_list_tabs_list_item_good_markdown">备注：{{item.bz}}</span>
                            <div>
                                <span class="point_list_tabs_list_item_good_point"><span><van-icon name="yqn_point" /> {{item.point}}</span></span> 
                                <span class="point_list_tabs_list_item_good_primarybtn"  v-if="item.num<=0 || user_point<item.point">{{user_point>item.point?'库存不足':'积分不足'}}</span>
                                <span class="point_list_tabs_list_item_good_btn" @click="exchangeNow(item.id)" v-else>立即兑换</span>
                                <!-- <span class="point_list_tabs_list_item_good_btn" @click="exchangeNow(item.id)">立即兑换</span> -->
                            </div>
                        </div>
                        </item-card-doub>
                    <!-- </item-group> -->
                </van-list>
                </van-pull-refresh>
            </van-tab>
        </van-tabs>


        <van-dialog
            v-model="showSign"
            :show-confirm-button="false"
            class="point_list_sign"
            close-on-click-overlay
            >
            <img :src="point_sign_window" alt="" />
            <span class="point_list_sign_point">+{{userpoint}}</span>
        </van-dialog>

        <img :src="point_info" alt="积分说明" class="point_list_img" v-if="!isEmpty" />

		<is-empty v-if="isEmpty">
            <div class="is-empty">
                <span class="is-empty_text">哎呀！空空如也</span>
            </div>
        </is-empty>

        </div>
		
		<transition name="fade">
			<!-- <van-icon 
				name="arrowupcircle" 
				class="backTop" 
				@click.native="backTop" 
				v-show="showArrow"
			/> -->
            <img 
                src="../../../assets/images/topup.png" 
                alt="" 
                class="yqn-backToTop"
                @click="backTop" 
                v-show="show_arrow" />
		</transition>
	</div>
</template>

<script>
    import { POINT_PRO_LIST } from '@/api/point';
    import { USER_BASE_INFO } from '@/api/system';
     
    import { Tab, Tabs, PullRefresh } from 'vant';
	
	import ItemGroup from "@/vue/components/item-group/";
	import IsEmpty from "@/vue/components/is-empty/";
    import ItemCardDoub from '@/vue/components/item-card-doub/';
    import NavBar from '@/vue/components/NavBar/'
	
	import loadMore from '@/vue/mixin/list-load-more';
    import scrollFixed from '@/vue/mixin/scroll-fixed';

    import {USER_SIGNED_INFO,USER_SIGNED_SUB} from '@/api/user'
    import POINT_INFO from '@/assets/images/mine_point_info.png';
    import POINT_BANNER from '@/assets/images/user/user_pointmall_banner.png';
    import POINT_LEFT from '@/assets/images/user/user_pointmall_textL.png';
    import POINT_RIGHT from '@/assets/images/user/user_pointmall_textR.png';
    import POINT_SIGN from '@/assets/images/user/user_point_sign.png';
    import POINT_SIGNED from '@/assets/images/user/user_point_signed.png';
    import POINT_WINDOW from '@/assets/images/user/user_point_sign_win.png';
    
    import { POINT_MALL_TAB } from '@/config.js'
	
	export default {
		name: "Item-list",
		props: {
			itemClass: {
				type: [String, Number],
				default: ""
			}
		},
		
		mixins: [loadMore, scrollFixed],
		
		data(){
			const shop_id = this.$util.getLocationParam("shop_id")
			return {
                tabs: [],
				shop_id,
				sortVal: "",
                show_arrow: false,
                setting: {
                    style: 2
                },
                isLoading:false,
                userpoint:0,                  //领取积分数量
                userstatus:0,                //用户当前是否可以领取积分
                user_point: 0,                //用户当前积分
                IsEmpty: false,             //没有可兑换的商品
                active: 0,                   //默认选中的tab
                showSign: false,                 //签到后的弹出层
                point_info: POINT_INFO,          //积分说明
                point_banner: POINT_BANNER,          //积分商城banner
                point_left: POINT_LEFT,               //当前积分底板
                point_right: POINT_RIGHT,              //签到领积分
                point_sign_status: POINT_SIGN,              //签到状态
                point_sign_window: POINT_WINDOW         //签到后弹出层

			}
		},

		watch: {
			itemClass(val){
				this.scrollTop = 0;
				this.resetInit();
			}
		},
		
		activated(){
			this.eventListen(true);
		},
		
		deactivated(){
			this.eventListen(false);
		},
		
		created(){
            this.tabs.push(...POINT_MALL_TAB)
            this.resetInit();
            this.initUserInfo();
            this.getsigned_info()
            this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);
		},
		
		methods:{
			initData(loadMore = false){
				return this.$reqGet(POINT_PRO_LIST, {
                    // pagesize: this.pages.perPage,
                    pagesize: 50,
                    page: this.pages.currPage,
                    type: POINT_MALL_TAB[this.active].type
				},{
					hideLoading: true
				}).then(res => {
                    const { list, hasmore } = res.data;
                    if(list.length === 0) this.isEmpty = true;
                    if(this.active === 0) {
                        list.map((item)=>{
                            item.title = item.spec;
                            item.subtitle = '';
                            item.spec = '';
                        })
                    }
					this.items.push(...list);
					return hasmore
				})
            },
            initUserInfo() {
                //获取当前用户积分
                this.$reqGet(USER_BASE_INFO).then((res => {
                    this.user_point = res.data.point;
                }))
            },
			// eventListen(isBind = true){
			// 	if(isBind){
			// 		this.$el.addEventListener("scroll", this.scrollShowArrow)
			// 	}else{
			// 		this.$el.removeEventListener("scroll", this.scrollShowArrow)
            //     }
			// },
			// scrollShowArrow(){
            //     this.showArrow = this.$el.scrollTop > 120;
            //     console.log(111,this.$el.scrollTop )
			// },
			// backTop(){
			// 	this.$el.scrollTop = 0;
            // },
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
            backTo() {
                this.$router.back(-1)
            },
			itemClick(id){
				this.$router.push({name: "user-point-mall-product", params: {itemId: id}})
            },
            clickTab(index, title) {
                //选中tab回调
                this.active = index;
                this.resetInit();
            },
            exchangeNow(id) {
                //立即兑换
                this.$router.push({name: 'user-point-mall-order', params:{itemId: id}})
            },
            getsigned_info(){
                this.$reqGet(USER_SIGNED_INFO,{}).then(res=>{
                    this.userstatus=res.data.count
                    if(!this.userstatus){
                        this.point_sign_status=POINT_SIGN
                    }else{
                        this.point_sign_status=POINT_SIGNED
                    }
                })
            },
            todaySign() {
                console.log(1)
                //签到
                // let status = this.point_sign_status;
                if(!this.userstatus) {
                    //今日还未签到
                    this.$reqPost(USER_SIGNED_SUB,{}).then(res=>{
                        this.userpoint=res.data.point
                        this.showSign = true;
                        this.userstatus=1
                        this.point_sign_status = POINT_SIGNED;
                        setTimeout(()=>{
                            this.showSign = false;
                        },2000)
                    })
                    
                }else {
                    //今日已签到
                    this.$toast('今日您已签到！')
                }
            }
		},
		
		components:{
			[ItemGroup.name]: ItemGroup,
            [ItemCardDoub.name]: ItemCardDoub,
            [NavBar.name]: NavBar,
            [IsEmpty.name]: IsEmpty,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            [PullRefresh.name]: PullRefresh
        },
        
        beforeRouteLeave (to, from, next) {
            // ...
            this.$destroy();
            next();
        }
	}
</script>

<style lang="scss" scoped>
	
	
	.fade-enter,
	.fade-leave-to{
		opacity: 0;
	}
	
	.fade-enter-active,
	.fade-leave-active,{
		transition:  all .5s;
    }
    
    .scroll_view {
        height: 100%;
        overflow-y: auto; 
    }
	
	
	.point_list{
        padding-bottom: 0;
		background-color: #fff;
		padding-top: 50px;
        box-sizing: border-box;
        &_banner {
            width: 100%;
            height: auto;
        }
        &_text {
            padding: 0 8px;
            display: flex;
            justify-content: space-between;
            &_left {
                width: 7.2rem;
                height: 2.4rem;
                background: url('../../../assets/images/user/user_pointmall_textL.png') no-repeat center;
                background-size: contain;
                text-align: center;
                line-height: 2.4rem;
                color: #fff;
                font-size: $sub-title-size;
                span {
                    font-size: 1.12rem;
                }
            }
            &_right {
                width: 7.2rem;
                height: 2.4rem;
                background: url('../../../assets/images/user/user_pointmall_textR.png') no-repeat center;
                background-size: contain;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: 5.16rem;
                    height: auto;
                }
            }

        }
        &_tabs {
            &_list {
                padding: 0 8px;
                background: $background-color;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                &_item {
                    width: 7.12rem !important;
                    margin-top: 4px !important;
                    flex: none !important;
                    &_topIcon {
                        display: inline-block;
                        width: 3.08rem;
                        height: .88rem;
                        background:rgba(239,69,8,1);
                        border-radius:30px 0px 30px 0px;
                        line-height: .88rem;
                        text-align: center;
                        font-size: $extra-size;
                        font-weight:400;
                        color:rgba(255,255,255,1);
                    }
                    &_coupon {
                        position: relative;
                        &_markdown {
                            font-size: $extra-size;
                            color: $sub-title-color;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 1;
                        }
                        &_point {
                            display: inline-block;
                            margin-top: 1rem;
                            font-size: $product-title-size;
                            color: $main-color;
                        }
                        &_btn {
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            width: 2.72rem;
                            height: 1rem;
                            background:$main-color;
                            border-radius:15px 5px 5px 15px;
                            line-height: .92rem;
                            text-align: center;
                            color: #fff;
                            font-size: $params-title-size;
                        }
                         &_primarybtn {
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            width: 2.72rem;
                            height: 1rem;
                            background:$gray-deep;
                            border-radius:15px 5px 5px 15px;
                            line-height: .92rem;
                            text-align: center;
                            color: #fff;
                            font-size: $params-title-size;
                        }
                    }
                    &_good {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        &_primarybtn {
                            display: inline-block;
                                color: $sub-title-color;
                                font-size: $extra-size;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                max-width: 6.4rem;
                                background: gray !important;
                        }
                        >span {
                            &:nth-child(1), &:nth-child(2) {
                                display: inline-block;
                                color: $sub-title-color;
                                font-size: $extra-size;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                max-width: 6.4rem;
                            }
                        }
                        >div {
                            margin-top: .48rem;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            >span {
                                &:nth-child(1) {
                                    color: $sub-title-color;
                                    font-size: $params-title-size;
                                    span {
                                        color: $main-color;
                                        font-size: $sub-title-size;
                                    }
                                }
                                &:nth-child(2) {
                                    display: inline-block;
                                    width: 2.2rem;
                                    height: .88rem;
                                    font-size: $extra-size;
                                    line-height: .88rem;
                                    background: $main-color;
                                    color: #fff;
                                    text-align: center;
                                    border-radius:3px;
                                }
                            }
                        }
                    }
                }
            }
        }
        &_img {
            width: 100%;
            height: auto;
        }
        &_sign {
            background: transparent;
            img {
                width: 100%;
                height: auto;
            }
            &_point{
                position: absolute;
                top: 5.6rem;
                left: 6rem;
                font-size: $main-title-size;
                color: #FCFF00;
                z-index: 9999;
            }
        }
	}
	.fixedTop{
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 999;
	}
	
	.items_loading{
		margin: 0 auto;
	}
	.backTop{
		position: fixed;
		right: .8rem;
		bottom: .8rem;
		font-size: 24px;
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
