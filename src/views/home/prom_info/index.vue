<template>
	<div class="prom_info">
		
		<div class="fixedTop">
			<nav-bar
                :title="prom_title || '促销活动'" 
                @back="backTo"/>
		</div>

        <!-- <img :src="prom_img" alt="" class="prom_info_banner" v-if="prom_img"/> -->
        <div ref="scroll_view" class="scroll_view">
        <img :src="prom_img?prom_img:'https://img.naifenpifa168.com/upfile/nadmin/image/20181005/7caa448e1116ec21e19dd9c49782e0c8.jpg!bg'" alt="" class="prom_info_banner" />

        <div id="tabs" :style="fixed?'position: fixed;top: 46px':''">
            <van-tabs v-model="active" @click="onClick" class="prom_info_tabs">
                <van-tab v-for="item in items" :title="item.title" :key="item.id">
                    
                </van-tab>
            </van-tabs>
            <!-- <div class="prom_info_tabs_arrow">
                <van-icon name="arrow" />
            </div> -->
        </div>

        <div class="prom_info_banner_slot" v-if="fixed">

        </div>
        
        

		<!-- <van-list
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
		</van-list> -->

        <div class="prom_info_content">
            <item-group v-for="(item,index) in items" :key="index" :id="'content'+index">
                <img :src="item.picpath" alt="" v-show="item.picpath" class="prom_info_content_banner" :id="'img'+index"/>
                <item-card-doub
                    v-for="(good, i) in item.plist" 
                    :key="i"
                    :goods="good"
                    @click="itemClick(good.pro_pid)"
                >

                </item-card-doub>
            </item-group>
        </div>

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
    import { PROMOTE_PROM_INFO } from '@/api/activity';
    
    import { Tab, Tabs } from 'vant';
	
	import ItemGroup from "@/vue/components/item-group/";
	import IsEmpty from "@/vue/components/is-empty/";
    import NavBar from '@/vue/components/NavBar/';
    import ItemCardDoub from '@/vue/components/item-card-doub/';
	
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
                active: 0,
                show_arrow: false,
                content_offsetTop_arr: null,            //设置每个品牌距离顶部距离的数组
                fixed: false,               //是否固定到顶部
                prom_title: '',             //促销专题标题
                prom_img: '',                   //促销专题图片
                prom_id: ''                //促销专题id
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
				return this.$reqGet(PROMOTE_PROM_INFO, {
					id: this.$route.params.itemClass,
					pagesize: this.pages.perPage,
					page: this.pages.currPage
				},{
					hideLoading: true
				}).then(res => {
                    const { list, page } = res.data;
                    if(list.length === 0)   this.isEmpty = true;
                    this.items.push(...list);
                    this.prom_id = res.data.id;
                    this.prom_title = res.data.title;
                    this.prom_img = res.data.picpath;
                    setTimeout(()=>{
                        this.setTabsContent(list)
                    },500)
                    
					return page
				})
            },
            setTabsContent(list) {
                //设置每个品牌距离顶部的距离
                let arr = [];
                list.map((item,index) => {
                    let offsetTop = document.querySelector('#content'+index).offsetTop - document.querySelector('#img0').offsetHeight;
                    arr.push(offsetTop)
                })
                this.content_offsetTop_arr = arr;
            },
			// eventListen(isBind = true){
			// 	if(isBind){
			// 		this.$el.addEventListener("scroll", this.scrollShowArrow)
			// 	}else{
			// 		this.$el.removeEventListener("scroll", this.scrollShowArrow)
			// 	}
			// },
			// scrollShowArrow(){
            //     let scroll_div = this.$refs['scroll_view']
            //     //将tabs固定到顶部
            //     let offsetTop = document.querySelector('#tabs').offsetTop;
            //     if(this.scroll_div.scrollTop > offsetTop) {
            //         this.fixed = true
            //     }else {
            //         this.fixed = false;
            //     }
            //     //滚动时切换tab
            //     if(this.content_offsetTop_arr) {
            //         this.content_offsetTop_arr.map((item,index) => {
            //             if(this.scroll_div.scrollTop >= item && this.scroll_div.scrollTop < this.content_offsetTop_arr[index+1]) {
            //                 this.active = index;
            //             }
            //         })
            //     }
                
            //     // console.log(document.querySelector('#content0').offsetTop)
			// 	// this.showArrow = this.$el.scrollTop > 120;
            // },
            onClick(index,title) {
                let scroll_div = this.$refs['scroll_view'];
                //点击切换视图位置
                scroll_div.scroll(0,this.content_offsetTop_arr[index])
            },
			// backTop(){
			// 	this.$el.scrollTop = 0;
            // },
            backTo() {
                this.$router.back(-1)
            },
			itemClick(id){
                let ver = false;
                wx.miniProgram.getEnv(function (res) {
                    if(res.miniprogram) {
                        ver = true;
                    }
                })
                if(ver) {
                    wx.miniProgram.navigateTo({url: '/pages/product/show/show?id='+id})
                }else {
                    this.$router.push({ name: "detail", params: { itemId: id }});
                }
				
            }
		},
		
		components:{
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
			[ItemGroup.name]: ItemGroup,
            [NavBar.name]: NavBar,
            [ItemCardDoub.name]: ItemCardDoub,
			[IsEmpty.name]: IsEmpty,
        },

        beforeRouteLeave (to, from, next) {
            // ...
            if(to.name === 'home') {
                this.$destroy();
            }
            next();
        },

        beforeRouteEnter (to, from, next) {
            // ...
            if(window.location.href.indexOf('!token=') !== -1) {
                let token = window.location.href.split('!token=');
                localStorage.setItem('Authorization', token[1]);
                setTimeout(()=>{
                    next(vm => {
                        
                    });
                },500)
            }else {
                next();
            }
            
            
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
	
	.prom_info{
		background-color: #fff;
        padding-top: 50px;
        padding-bottom: 0;
        box-sizing: border-box;
        &_banner {
            width: 100%;
            height: auto;
        }
        #tabs {
            width: 100%;
            z-index: 2000;
            position: relative;
        }
        &_tabs {
            &_arrow {
                position: absolute;
                top: 0;
                right: 0;
                width: 1.76rem;
                height: 1.76rem;
                background: #fff;
                z-index: 3001;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        &_banner_slot {
            height: 44px;
        }
        &_content {
            &_banner {
                width: 100%;
                height: auto;
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
		right: 20px;
		bottom: 20px;
		font-size: 24px;
	}
</style>
