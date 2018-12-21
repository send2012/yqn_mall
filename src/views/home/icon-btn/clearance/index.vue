<template>
	<div class="item_list">
		
		<div class="fixedTop">
			<nav-bar
                title="清仓特卖" 
                @back="backTo"/>
		</div>
		
		<van-list
		  	v-model="loading"
		  	:finished="finished"
			:immediate-check="false"
	  		:offset="100"
		  	@load="loadMore"
		>
			<item-group>
				<item-card-hori
					v-for="(item, i) in items" 
					:key="i"
					:goods="item"
					@click="itemClick(item.id)"
				 />
			</item-group>
		</van-list>

		<is-empty v-if="isEmpty">抱歉,没有找到符合条件商品</is-empty>
		
		<transition name="fade">
			<!-- <van-icon 
				name="arrowupcircle" 
				class="backTop" 
				@click.native="backTop" 
				v-show="showArrow"
			/> -->
            <img 
                src="../../../../assets/images/topup.png" 
                alt="" 
                class="yqn-backToTop"
                @click="backTop" 
                v-show="showArrow" />
		</transition>
	</div>
</template>

<script>
	import { GOODS_SEARCH } from '@/api/goods';
	
	import ItemGroup from "@/vue/components/item-group/";
	import IsEmpty from "@/vue/components/is-empty/";
    import ItemCardHori from '@/vue/components/item-card-hori/';
    import NavBar from '@/vue/components/NavBar/'
	
	import loadMore from '@/vue/mixin/list-load-more';
	import scrollFixed from '@/vue/mixin/scroll-fixed';
	
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
				shop_id,
				sortVal: "",
				showArrow: false
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
			this.resetInit();
			this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);
		},
		
		methods:{
			initData(loadMore = false){
				return this.$reqGet(GOODS_SEARCH, {
					q: this.searchVal,
					shop_id: this.shop_id,
					cid: this.itemClass,
					'per-page': this.pages.perPage,
					page: this.pages.currPage,
					sort: this.sortVal,
					is_haitao: this.isHaitao
				},{
					hideLoading: true
				}).then(res => {
					const { items, page } = res.data.data;
					this.items.push(...items);
					return page
				})
			},
			eventListen(isBind = true){
				if(isBind){
					this.$el.addEventListener("scroll", this.scrollShowArrow)
				}else{
					this.$el.removeEventListener("scroll", this.scrollShowArrow)
				}
			},
			scrollShowArrow(){
				this.showArrow = this.$el.scrollTop > 120;
			},
			backTop(){
				this.$el.scrollTop = 0;
            },
            backTo() {
                this.$router.back(-1)
            },
			itemClick(id){
				this.$router.push({name: "detail", params: {itemId: id}})
			},
		},
		
		components:{
			[ItemGroup.name]: ItemGroup,
            [ItemCardHori.name]: ItemCardHori,
            [NavBar.name]: NavBar,
			[IsEmpty.name]: IsEmpty,
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
	
	
	.item_list{
		background-color: #fff;
		padding-top: 50px;
		box-sizing: border-box;
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
		right: 20px;
		bottom: 20px;
		font-size: 24px;
	}
</style>
