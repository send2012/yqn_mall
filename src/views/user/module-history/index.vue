<template>
	<div class="user-history">

        <nav-bar 
            title="我的足迹"
            @back="backTo" />
        <div ref="scroll_view" class="scroll_view">
        <div class="you_like">
			<home-title 
				:title="goodsGroup.setting.title"
				:sub_title="goodsGroup.setting.sub_title" />
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
                        v-for="(item, i) in goodsGroup.items" 
                        :key="i"
                        :goods="item"
                        @click="itemClick(item.pro_pid)"
                    />
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
    import HomeTitle from '@/vue/components/home-title/';
    import ItemCardDoub from '@/vue/components/item-card-doub/';
    import ItemGroup from "@/vue/components/item-group/";
    import NavBar from '@/vue/components/NavBar/';

    import { GROOM_LIST } from '@/api/product'

    import loadMore from '@/vue/mixin/list-load-more';
    import scrollFixed from '@/vue/mixin/scroll-fixed';
	
	export default {
        mixins: [loadMore, scrollFixed],
		data() {
			return {
                isLogin: false,
                orderGroup: [],      //图标按钮组,  myList: 我的订单,preList: 我的预售订单,myService: 我的服务,myPoints: 我的积分
                goodsGroup: {
                    setting: {
                        title: '我的足迹',
                        sub_title: '最近浏览'
                    },
                    items: []
                },     //猜你喜欢
                loading: false,
                show_arrow: false,
                showService: true          //客服电话弹出层
                
			}
        },
        
        created() {
            this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);
        },
		
		activated(){
            this.getLoginStatus();
            this.resetInit();
            this.eventListen(true);
        },
        
        deactivated(){
			this.eventListen(false);
		},
		
		methods: {
            initData(loadMore = false){
				return this.$reqGet(GROOM_LIST, {
					act: 'history',
					pagesize: this.pages.perPage,
					page: this.pages.currPage
				}).then(res => {
					const { list, hasmore } = res.data;
                    this.goodsGroup.items.push(...list);
                    this.has_more = hasmore;
					return hasmore
				})
			},
			quit(){
				this.$util.removeLocalStorage('Authorization', 'user_id', 'avatar', 'background_image', 'nick_name');
				this.$router.push({name: 'login'});
			},
			getLoginStatus(){
				this.isLogin = !!localStorage.getItem('Authorization') && !!localStorage.getItem('user_id');
            },
            itemClick(id){
				this.$router.push({name: "detail", params: {itemId: id}})
            },
            // eventListen(isBind = true){
			// 	if(isBind){
			// 		this.$el.addEventListener("scroll", this.scrollShowArrow)
			// 	}else{
			// 		this.$el.removeEventListener("scroll", this.scrollShowArrow)
			// 	}
			// },
			// scrollShowArrow(){
			// 	this.showArrow = this.$el.scrollTop > 120;
            // },
            service_call() {

            },
            backTo() {
                this.$router.back(-1)
            },
            // backTop() {
            //     this.$el.scrollTop = 0;
            // }
		},

		components: {
            [HomeTitle.name]: HomeTitle,
            [ItemCardDoub.name]: ItemCardDoub,
            [NavBar.name]: NavBar,
            [ItemGroup.name]:ItemGroup
        },

        beforeRouteLeave (to, from, next) {
            // ...
            this.$destroy();
            next();
        }
	}

</script>


<style scoped lang="scss">
	.user-history {
        padding-top: 1.84rem;
        padding-bottom: 0;
        .scroll_view {
            height: 100%;
            overflow-y: auto; 
        }
		>div {
			margin-bottom: .4rem;
		}
        ._home_title {
            padding: 0 .32rem;
        }
        .backTop{
            position: fixed;
            right: .8rem;
            bottom: 2.8rem;
            font-size: .96rem;
        }
	}

</style>
