<template>
	<div class="prom_area_list">
		
		<div class="fixedTop">
			<nav-bar
                :title="prom_title || '促销活动'" 
                @back="backTo"/>
		</div>

        <div ref="scroll_view" class="scroll_view">

        <img :src="prom_banner" alt="" v-if="prom_banner" class="prom_area_list_banner"/>


        <!-- <div class="prom_area_list_abstract">{{prom_abstract}}</div> -->
		
        <item-group>
            <item-card-doub
                v-for="(good, i) in items" 
                :key="i"
                :goods="good"
                @click="itemClick(good.pro_pid)"
            >

            </item-card-doub>
        </item-group>
        
		

		<is-empty v-if="isEmpty">抱歉,没有找到符合条件商品</is-empty>
		
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
	</div>
</template>

<script>
	import { PROMOTE_AREA_LIST } from '@/api/activity';
	
	import ItemGroup from "@/vue/components/item-group/";
    import IsEmpty from "@/vue/components/is-empty/";
    import ItemCardDoub from '@/vue/components/item-card-doub/';
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

			return {
                show_arrow: false,
                prom_title: '',                 //促销专区title
                prom_banner: '',                //促销专区banner
                prom_abstract: ''               //促销专区描述
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
				return this.$reqGet(PROMOTE_AREA_LIST, {
					id: this.$route.params.itemClass
				},{
					hideLoading: true
				}).then(res => {
                    const { promplist, page, title, bannerpic, abstract } = res.data;
                    if(promplist.length === 0)   this.isEmpty = true;
                    this.items.push(...promplist);
                    this.prom_title = title;
                    this.prom_banner = bannerpic;
                    this.prom_abstract = abstract;
					return page
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
			// 	this.showArrow = this.$el.scrollTop > 120;
			// },
			// backTop(){
			// 	this.$el.scrollTop = 0;
            // },
            backTo() {
                this.$router.back(-1)
            },
			itemClick(id){
				this.$router.push({name: "detail", params: {itemId: id}})
			},
		},
		
		components:{
			[ItemGroup.name]: ItemGroup,
            [ItemCardDoub.name]: ItemCardDoub,
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
    
    .scroll_view {
        height: 100%;
        overflow-y: auto; 
    }
	
	
	.prom_area_list{
		background-color: #fff;
		padding-top: 50px;
        box-sizing: border-box;
        padding-bottom: 0;
        &_banner {
            width: 100%;
            height: auto;
        }
        &_abstract {
            padding: 0 8px;
            line-height: .6rem;
            font-size: $product-title-size;
            color: $main-title-color;
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
		right: 20px;
		bottom: 20px;
		font-size: 24px;
	}
</style>
