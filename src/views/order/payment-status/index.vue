<template>
	<div class="payment_status">

        <nav-bar 
            :title="statusTitle"
            right_text="完成"
            :left_arrow="false"
             @linkTo="goHome"
            :no_more="true"/>
        <div ref="scroll_view" class="scroll_view">
		<div class="status_top">
			<van-icon :name="statusIcon"  class="statusicon" />
            <!-- <img :src="img_src" alt=""> -->
			<div class="status_top_status">{{statusText}}</div>
            <div class="status_top_detail">
                <span>{{payTypetxt}}：<span v-if="act!='point'">￥</span>{{summoney}}</span>
                <span>付款方式：{{payType}}</span>
            </div>
            
            
            <div class="status_top_btns" v-if="this.payzt == 0 && this.count < 20">
                <p class="payload">交易完成后会自动跳转</p>
            </div>
            <div class="status_top_btns" v-else-if="this.payzt == 0 && this.count == 20">
                <van-button plain type="default" @click="calltel" size="small">联系客服</van-button>
                <van-button plain type="default" @click="goto" size="small">继续逛逛</van-button>
            </div>
            <div class="status_top_btns" v-else>
                <van-button plain type="default" @click="getgoodsdetail" size="small">查看订单</van-button>
                <van-button plain type="default" @click="goto" size="small">继续逛逛</van-button>
            </div>
		</div>
		
		<!-- <div class="status_text" v-if="isSuccess"><span class="red">3秒</span>后返回到商品详情, 您也可以查看订单详情</div>
		<div class="status_text" v-else>系统繁忙, 支付遇到问题, 请您稍后再试!</div>
		
		<div class="status_goLink">
			<router-link class="red" :to="{name: 'home'}">查看订单详情<van-icon name="arrow" /></router-link>
		</div> -->

        <div class="you_like">
            <home-title 
				:title="setting.title"
				:sub_title="setting.sub_title" />
            <van-list
                v-model="loading"
                class="scroll-load"
                :finished="finished"
                :immediate-check="false"
                :offset="100"
                @load="loadMore"
            >
                <item-group>
                    <item-card-doub
                        v-for="(item, i) in goodsGroup" 
                        :key="i"
                        :goods="item"
                        @click="itemClick(item.pro_pid)"
                    >

                    </item-card-doub>
                </item-group>
            </van-list>
		</div>

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

    import NavBar from "@/vue/components/NavBar/"

    import IMG_CHECKED from "@/assets/images/checked.png"

    import { GROOM_LIST } from '@/api/product'

    import {SYS_GOODS_SUCCESS} from '@/api/system'

    import ItemGroup from "@/vue/components/item-group/";
    import ItemCardDoub from '@/vue/components/item-card-doub/';
    import HomeTitle from '@/vue/components/home-title/';
	
	import loadMore from '@/vue/mixin/list-load-more';
	import scrollFixed from '@/vue/mixin/scroll-fixed';

	export default {
		name: "payment-status",

		props: {
			status: String
        },
        
        mixins: [loadMore, scrollFixed],

       
		data() {
            let init_arr = this.status.split('&');
            let goods = init_arr[0].split('=')[1].split('_');
            let act = init_arr[1].split('=')[1];
            let goodsdetail = init_arr[2]?init_arr[2].split('=')[1]:''
            // const status_data = JSON.parse(this.status);
			return {
                goods,
                act,
                goodsdetail,
                isSuccess: true,
                img_src: IMG_CHECKED,
                isLoading: false,
                show_arrow: false,
                goodsGroup: [],     //猜你喜欢 
                summoney:'',
                payzt:'',
                count:0,
                timer:null,
                setting: {
                    title: '为您推荐',
                    sub_title: '品牌集锦 优惠到底'
                }
			}
		},

		computed: {
			statusText() {
                if(this.act == 'presell' || this.act == 'Topay'){
                    // 商品货到付款或者预售订单
                    return '订单已成功提交'
                }else if(this.act == 'point'){
                    return '您已成功兑换'
                }else if(this.payzt == 0 && this.count == 20){
                    return '支付失败'
                }else if(this.payzt == 0 && this.count < 20){
                    return '正在支付...'
                }else if(this.payzt == 1){
                    return '您已成功付款'
                }

            },
            payTypetxt(){
                if(this.act=='point'){
                    return '消耗积分'
                }else{
                    return '订单金额'
                }
            },
            payType() {
                if(this.act == 'presell' || this.act == 'Topay'){
                    // 商品货到付款或者预售订单
                    return '货到付款'
                }else if(this.act == 'point'){
                    return '积分订单'
                }else{
                    return '在线支付'
                }

            },
            statusTitle() {
                if(this.act=='presell'||this.act=='Topay'){
                    // 商品货到付款或者预售订单
                    return '订单提交成功'
                }else if(this.act == 'point'){
                    return '付款成功'
                }else if(this.payzt == 0 && this.count == 20){
                    return '支付失败'
                }else if(this.payzt == 0 && this.count < 20){
                    return '支付中'
                }else if(this.payzt == 1){
                    return '付款成功'
                }

            },
			statusIcon() {
                if(this.payzt == 0 && this.count == 20){
                     return  'yqn_pay_fail'
                }else if(this.payzt == 0 && this.count < 20){
                    return 'yqn_pay_waiting'
                }else{
                    return 'yqn_pay_success'
                }
			},
			// statusClass() {
			// 	return this.isSuccess ? 'success_icon' : 'fail_icon'    
			// }
        },
        
        created() {
            this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);
            this.resetInit();
            this.getgoods();
        },

		activated() {
            this.isSuccess = this.status == "1";
            this.eventListen(true);
        },

        deactivated(){
			this.eventListen(false);
        },
        
        methods: {
            initData(){
				return this.$reqGet(GROOM_LIST, {
					act: '',
					pagesize: this.pages.perPage,
					page: this.pages.currPage
				}, {
					hideLoading: true
				}).then(res => {
                    const { list, hasmore } = res.data;
                    this.goodsGroup.push(...list);
                    this.has_more = hasmore;
					return hasmore
                })
                
            },
            
            goods_getsuccess(){
                let count=1
                const that = this
                that.timer = setInterval(()=>{
                    that.$reqGet(SYS_GOODS_SUCCESS,{
                    goods:(that.act=='Topay' || that.act=='')?that.goods:that.goods.join(''),
                    act:that.act=='Topay'?'':that.act,
                    pay:(that.act=='Topay' || that.act=='presell' || that.act=='point')?0:1
                    }).then(res=>{
                        count+=1
                        this.count = count
                        this.payzt = res.data.payzt
                        that.summoney=res.data.summoney;
                        if(that.payzt  == 1){ 
                            clearInterval(that.timer)
                        }else if(that.payzt  == 0 && that.payzt  >= 20){
                            clearInterval(that.timer)
                        }else if(!that.payzt){
                            clearInterval(that.timer)
                        }else{

                        }
                    })
                },1500)
                
            },

            getgoods(){
                const that=this
                that.$reqGet(SYS_GOODS_SUCCESS,{
                    goods:(that.act=='Topay' || that.act=='')?that.goods:that.goods.join(''),
                    act:that.act=='Topay'?'':that.act,
                    pay:(that.act=='Topay' || that.act=='presell' || that.act=='point')?0:1
                    }).then(res=>{
                        this.count=1
                        that.payzt = res.data.payzt
                        that.summoney=res.data.summoney;
                        if(that.payzt && that.payzt!=1){ 
                            this.goods_getsuccess()
                        }else{
                            
                        }
                })
            },

			// eventListen(isBind = true){
			// 	if(isBind){
			// 		this.$el.addEventListener("scroll", this.scrollShowArrow)
			// 	}else{
			// 		this.$el.removeEventListener("scroll", this.scrollShowArrow)
			// 	}
			// },

			// scrollShowArrow(){
            //     //显示回到顶部
            //     this.showArrow = this.$el.scrollTop > 120;
                
			// },
			
            itemClick(id){
				this.$router.push({name: "detail", params: {itemId: id}})
            },
			// backTop(){
			// 	this.$el.scrollTop = 0;
            // },
            jumpTo() {
                //跳至商品列表
                this.$router.push({name: 'list',params: {st: '1'}})
            },
            goto(){
                // 继续逛逛
                if(this.act == 'point'){
                    this.$router.push({name: 'user-point-mall'})
                }else if(this.act == 'coupon'){
                    this.$router.push({name: 'buy-coupon-list'})
                }else if(this.act == 'presell'){
                    this.$router.push({name: 'pre_sale_list'})
                }else{
                    this.$router.push({name: 'class',params: {st: '1'}})
                }
                
            },
            goHome(){
                this.$router.push({name: 'home',params: {st: '1'}})
            },
            calltel(){
                window.location.href='tel:400-801-5562'
            },
            getgoodsdetail(){
                // 跳转订单详情
                if(this.act == 'presell') {
                    //跳至预售订单详情
                    this.$router.push({name: 'user-preOrder-detail',params:{active:this.goods.join('')}})
                }else if(this.act == 'point') {
                    //跳至积分订单详情
                    this.$router.push({name: 'user-point-record-detail',params:{order_id:this.goods.join('')}})
                }else  {
                    //跳至货到付款订单详情
                    // console.log(111111111,this.goodsdetail)
                    this.$router.push({name: 'user-order-detail',params:{active:this.goodsdetail}})
                }
                
            },

        },
        
        components: {
            [NavBar.name]: NavBar,
            [ItemGroup.name]: ItemGroup,
            [ItemCardDoub.name]: ItemCardDoub,
            [HomeTitle.name]: HomeTitle
        },
        beforeRouteLeave (to, from, next) {
            this.$destroy()
            next()
        }  

	}

</script>


<style lang="scss" scopd>
	
    .scroll_view {
        height: 100%;
        overflow-y: auto; 
        .statusicon{
            font-size: 1.6rem;
            color:#ff6600;
            padding: .2rem 0;
        }
    }
    
	.payment_status {
		padding-top: 46px;
		box-sizing: border-box;
		background-color: $background-color;
        text-align: center;
        padding-bottom: 0;
        .you_like {
            text-align: left;
            ._home_title {
                padding: 0 8px;
            }
        }
	}
	
	.status_top{
        margin-top: 5px;
        width: 100%;
        height: 7.36rem;
        background: #fff;
        margin-bottom: 15px;
        font-size: $product-title-size;
        color: $main-title-color;
        line-height: $product-title-size;
		i{
			margin-bottom: 5px;
        }
        img {
            margin-top: 8px;
            width: 1.8rem;
            height: auto;
        }
		&_status {
            margin-top: 8px;
            font-weight: 500;
        }
        &_detail {
            font-weight: 400;
            margin-top: .6rem;
            font-size: $params-title-size;
            display: flex;
            flex-direction: column;
            span {
                display: inline-block;
                line-height: .8rem;
            }
        }
        &_btns {
            margin-top: .5rem;
            button {
                &:nth-child(2) {
                    margin-left: .6rem;
                }   
            }
        }
	}
	
	.status_text{
		color: $font-color-gray;
		margin-bottom: 50px;
	}

	.status_icon {
		font-size: 80px;
	}

	i.success_icon {
		@extend .status_icon;
		color: #06bf04
	}

	i.fail_icon {
		@extend .status_icon;
		color: #f44
    }
    
    .backTop{
		position: fixed;
		right: 20px;
		bottom: 70px;
		font-size: 24px;
	}

</style>
<style lang="scss">
.payment_status {
    .status_top_btns {
        .payload{
            color:$explain-text-color;
            font-size:$extra-size;
            padding:.3rem 0;
        }
        .van-button--small {
            width: 3rem ;
            height: 1.1rem !important;
            background: #fff;
        }
        .van-button--plain.van-button--default {
            color: #333333 ;
            // border-color: $main-color;
            border:1px solid #333333 !important;
        }
    }
}
</style>

