<template>
	<div class="items_ads_group">
		<van-cell-group v-if="setting && !!setting.desc" :class="getTitleStyle(setting.title_style)">
			<van-cell>
				<home-title 
					:title="setting.title"
					:sub_title="setting.desc" 
					:more="setting.more"
                    :color="setting.title_style?'white':''" />
			</van-cell>
		</van-cell-group>

        <div v-if="setting.lx === 1" class="items_ads_group_1">
            <!-- 一整张图 -->
            <router-link v-for="(item,index) in list" :key="index" :to="item.linkurl">
                <img :src="item.picpath" :alt="item.title" >
            </router-link>
            
        </div>

        <div v-else-if="setting.lx === 2" class="items_ads_group_2">
            <!-- 上二下二 -->
            <router-link v-for="(item,index) in list" :key="index" class="items_ads_group_2_link" :to="item.linkurl">
                <img :src="item.picpath" :alt="item.title" >
            </router-link>
        </div>

        <div v-else-if="setting.lx === 3" class="items_ads_group_3">
            <!-- 上二下四 -->
            <router-link v-for="(item,index) in list" :key="index" class="items_ads_group_3_link" :to="item.linkurl">
                <img :src="item.picpath" :alt="item.title" class="items_ads_group_3_img">
            </router-link>
        </div>

        <div  v-else-if="setting.lx === 4" class="items_ads_group_5">
            <!-- 广告窄图 -->
            <router-link v-for="(item,index) in list" :key="index" :to="item.linkurl">
                <img :src="item.picpath" :alt="item.title" />
            </router-link>
        </div>


        <div v-else-if="setting.lx === 5" class="items_ads_group_4">
            <!-- 单个商品详情 -->
            <router-link  v-for="(item,index) in list" :key="index" class="items_ads_group_4_link" :to="{ name: 'pre_sale_detail', params: { itemId: item.id }}">
                <div class="items_ads_group_4_link_detail">
                    <div class="items_ads_group_4_link_detail_left">
                        <img v-lazy="item.pics" alt="" class="items_ads_group_4_link_detail_left_img">
                    </div>
                    <div class="items_ads_group_4_link_detail_right">
                        <span class="items_ads_group_4_link_detail_right_top">{{item.title}}</span>
                        <span class="items_ads_group_4_link_detail_right_bottom">
                            <span>￥{{item.price}}</span>
                            <span>热度：{{item.sale}}</span>
                        </span>
                    </div>
                </div>
            </router-link>
            
        </div>
		
	</div>
</template>
<script>
	import HomeTitle from '@/vue/components/home-title/';
	import { Cell, CellGroup, Icon, Row, Col } from 'vant';
	import scrollArrow from '../_directive/scrollMore';
	import util from "@/assets/js/util";
	
	export default{
		name: "item-ads-group",
		props: {
			setting: {
				type: Object,
				default: () => ({})
			},
			col: {
				type: Number,
				default: 3
            },
            list: {
                type: Array,
                default: ()=> {[]}
            }
		},
		data(){
			const clientW = document.body.clientWidth || document.documentElement.clientWidth,
						col = this.col,
						itemW = Math.floor(clientW / col),
						itemsLen = this.setting.item_len
			return {
				itemW,
				scrollWidth: (itemW * itemsLen) + "px",
				rightOver: false,
				leftOver: true,
				isShowArrow: itemsLen > col,
			}
		},
		methods: {
			scrollMore(obj){
				this.rightOver = !obj.isLeftOver;
				this.leftOver = !obj.isRightOver;
            },
            getTitleStyle(title_style){
                switch(title_style) {
                    case 1:
                        return 'yqn_home_title linear';
                    case 2: 
                        return 'yqn_home_title red';
                    default: 
                        return 'yqn_home_title';
                }
            }
		},
		directives:{
			scrollArrow,
		},
		components: {
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[HomeTitle.name]: HomeTitle
		}
	}
</script>

<style lang="scss" scoped>
	
	.items_ads_group{
        padding: 0 8px;
        margin-top: 7px;
        
		.yqn_home_title {
            background: inherit;
			.van-cell {
				background: inherit;
			}
        }

        .linear {
            height: 1.76rem;
            line-height: 1.76rem;
            background-image: linear-gradient(96deg, #40d7fd 0%, #3fc4fd 50%, #3db0fd 100%);
            border-radius: 8px 8px 0px 0px;
            padding: 0 10px 0 15px;
        }

        .red {
            padding: 0 10px;
            background-color: #f76f6f;
        }
        
        &_1 {
            img {
                width: 100%;
                height: auto;
            }
        }

        &_2 {
            display: flex;
            flex-wrap: wrap;
            &_link {
                width: 50%;
                margin-bottom: 1px;
                img {
                    display: block;
                    width: 100%;
                    height: auto;
                    margin-right: 2px;
                }
            }
            
        }

        &_3 {
            display: flex;
            flex-wrap: wrap;
            &_link {
                width: 25%;
                img {
                    display: block;
                    height: auto;
                    width: 100%;
                    margin-right: 1px;
                    margin-bottom: 1px; 
                }
                &:nth-child(1), &:nth-child(2){
                    width: 50%;
                }
            }
            
        }
        &_4 {
            background: #f76f6f;
            padding: 0 10px 10px;
            &_link {
                width: 100%;
                &_detail {
                    background: #fff;
                    display: flex;
                    justify-content: space-between;
                    padding: 15px 20px;
                    margin-bottom: 5px;
                    &_left {
                        width: 25%;
                        height: 2.8rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        &_img {
                            height: 2.8rem;
                            width: auto;
                        }
                    }
                    &_right {
                        width: 65%;
                        padding-left: .8rem;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        &_top {
                            height: 1.6rem;
                            line-height: .8rem;
                            font-size: $product-title-size;
                            color: $main-title-color;
                            overflow : hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                        }
                        &_bottom {
                            display: flex;
                            justify-content: space-between;
                            span {
                                &:nth-child(1) {
                                    font-size: $sub-title-size;
                                    color: $price-color;
                                    line-height: 1rem;
                                }
                                &:nth-child(2) {
                                    font-size: $extra-size;
                                    color: $sub-title-color;
                                    line-height: 1rem;
                                }

                            }
                        }
                    }
                }
            }
        }
        &_5 {
            width: 100%;
            img {
                width: 100%;
                height: auto;
            }
        }
		
	}
	
</style>

<style lang="scss">
	.items_ads_group {
		.van-cell {
			padding: 0 0 0 4px;
        }
        .van-hairline--top-bottom::after {
            border-width: 0 !important;
        }
        
	}
</style>
