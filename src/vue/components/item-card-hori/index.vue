<template>
	<!-- 一行一个 -->
	<div class="item_card_H_wrap one_border" @click="OnClick">
		<div class="clearfix item_card_H_wrap_inner">
			<div class="item_card_image float-l">
                <!-- 左上icon -->
				<div v-if="$slots.leftTopIcon" class="leftTopIcon">
					<slot name="leftTopIcon"></slot>
				</div>

				<div class="item_img_mask" v-if="goods.sh && goods.sh !== 1">
					<!-- <slot name="mask"></slot> -->
                    <img :src="require('../../../assets/images/'+ getImgExtra('sh',goods.sh) +'.png')" alt="" />
				</div>
                <!-- 商品图片 -->
				<img v-lazy="goods.pics">

                <!-- 左上角大促狂欢购 -->
                <img v-if="goods.prom_large && !(goods.prom_large instanceof Array)" :src="goods.prom_large.picsm" alt="" class="item_card_image_pro" />

                <!-- 左下角直发代发 -->
                <van-icon v-if="goods.owner" :name="getImgIcon(goods.owner)" class="item_card_image_icon"/>

				<div class="item_image_desc">{{goodsStatusToMe}}</div>
			</div>

			<div class="item_card_info">
				<div class="item_card_name">
                    <!-- 商品名称 -->
					<van-tag plain type="danger" v-if="goods.is_haitao">海淘</van-tag>
					<span v-if="$slots.icon" class="item_card_icon"><slot name="icon"></slot></span>
                    <span class="goods_title_tag" v-if="goods.owner === 0">自营</span>
					{{goods.title + ' ' + goods.subtitle + ' ' + goods.spec}}
				</div>

				<!-- <div class="item_card_info_desc">{{goods.sell_point}}</div> -->
                <div class="item_card_info_tags">
                    <span v-for="(item,index) in goods.prom" :key="index">{{item}}</span>
                </div>

				<div class="item_card_footer">
					<div class="item_card_footer_left">

                        <div class="footer_price" v-if="!(goods.prom_limit instanceof Array) && goods.prom_limit.nowdate >= goods.prom_limit.startdate">
                            <!-- 秒杀直降价格区间 -->
							￥
                            <!-- 当 max_price 或者 min_price 为空时, 将价格改为默认 0.00 -->
                            <span v-if="goods.prom_limit.max_price === '' || goods.prom_limit.min_price === ''">
                                0.00
                            </span>
                            <span v-else>{{goods.prom_limit.min_price | show_price(goods.prom_limit.max_price) }}</span>

                            <span class="marketPrice" v-if="goods.market_price">{{goods.market_price | yuan}}</span>
						</div>
                        <div class="footer_price" v-else>
                            <!-- 价格区间 -->
							￥
                            <!-- 当 max_price 或者 min_price 为空时, 将价格改为默认 0.00 -->
                            <span v-if="goods.max_price === '' || goods.min_price === ''">
                                0.00
                            </span>
                            <span v-else>{{goods.min_price | show_price(goods.max_price) }}</span>

                            <span class="marketPrice" v-if="goods.market_price">{{goods.market_price | yuan}}</span>
						</div>
                        <div class="item_card_sumSale">
                            热度：{{goods.sum_sale}}
                        </div>
						<!-- <vm-progress :percentage="70" :text-inside="true" :stroke-width="18" status="exception" striped class="progress">已售 70%</vm-progress> -->
					</div>

					<div class="item_card_footer_right" v-if="!(goods.prom_limit instanceof Array)">
                        <!-- 秒杀直降 -->
                        <img v-if="!(goods.prom_limit instanceof Array)" :src="require('../../../assets/images/'+ getImgExtra('prom_limit',goods.prom_limit) +'.png')" alt="" class="item_card_footer_right_img" >
                        <!-- 右下角按钮 -->
						<!-- <van-button type="warning" size="small" class="snatch">立即抢购</van-button> -->
					</div>


					<div class="footer_desc" v-if="$slots.footer">
						<slot name="footer"></slot>
					</div>


				</div>
			</div>
		</div>
	</div>
</template>


<script>
	import item_mix from '@/vue/mixin/item-card';
    import { Button } from 'vant';
    import { SIM_IMG_EXTRA } from '@/config.js';

	export default {
        name: "item-card-hori",
        data() {
            return {
                span: ['折','增','满减','满赠']
            }
        },
        mixins: [item_mix],
        methods: {
            getImgExtra(type,id) {
                //获取商品图片上的标签
                if(type === 'sh') {
                    //商品状态（0:下架，1：正常，2：缺货)
                    switch(id) {
                        case 0:
                            return SIM_IMG_EXTRA['under_carriage'];
                        case 2:
                            return SIM_IMG_EXTRA['sold_out'];
                    }
                }else if(type === 'prom_limit'){
                    //秒杀直降
                    switch(id.type) {
                        case 1:
                            return SIM_IMG_EXTRA['spike'];
                        case 2:
                            return SIM_IMG_EXTRA['index_direct'];
                    }
                }
            },
            getImgIcon(type) {
                //获取代发直发
                switch(type){
                    case 1:
                        //代发
                        return 'yqn_replace'
                    case 2:
                        //直发
                        return 'yqn_straight'
                    default:
                        return false
                }
            }
        },
		components: {
			[Button.name]: Button
		}
	}

</script>

<style lang="scss" scoped>

	.item_card_H_wrap {
        padding: 8px 0;
        width: 100%;
        &_inner {
            height: 4.68rem;
        }
	}


	.item_card_image {
		position: relative;
		width: 4.64rem;
		height: 4.64rem;
        text-align: center;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
		img{
			display: inline-block;
			max-height: 100%;
			max-width: 100%;
        }
        &_pro {
            width: 1.32rem;
            height: auto;
            position: absolute;
            top: .2rem;
            left: 0;
        }
		.leftTopIcon{
			position: absolute;
			left: 0;
			top: 0;
			max-width: 50%;
			text-align: left;
		}
		.item_image_desc{
			position: absolute;
			bottom: 0;
			background-color: rgba(244,133,145, .8);
			width: 100%;
			color: #fff;
			font-size: $extra-size;
		}
		.item_img_mask{
			position: absolute;
			top: 50%;
			left: 50%;
			z-index: 2;
			transform: translate(-50%, -50%);
			width: 2.96rem;
			height: 2.96rem;
			overflow: hidden;
        }
        &_icon {
            font-size: 21px;
            position: absolute;
            left: .24rem;
            bottom: 0;
            color: rgba(0, 0, 0, .3)
        }
	}

	.item_card_info{
		position: relative;
		margin-left: 5.12rem;
		height: 100%;
		.item_card_name {
			font-size: $product-title-size;
			overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
            line-height: 1rem;
		}

		.item_card_name .item_card_icon {
			width: 1rem;
			height: 0.56rem;
			vertical-align: middle;
			display: inline-block;
			background-repeat: no-repeat;
		}

		// .isHaiTao{
		// 	background-image: url(http://mamaqunaer.oss-cn-shanghai.aliyuncs.com/20171121/xMACDPN2Bz.png);
        // }

        .goods_title_tag {
            /*display: inline-block;*/
            /*width: 1.12rem;*/
            /*height: .52rem;*/
            padding: .08rem;
            background: $price-color;
            border-radius:3px;
            color: #fff;
            font-size: $tag-size;
            line-height: .52rem;
            text-align: center;
            position: relative;
            bottom: 1px;
        }

		.item_card_info_desc{
			font-size: $extra-size;
			color: $font-color-gray;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
		}

		.item_card_icon img{
			max-height: 100%;
			max-width: 100%;
        }

        .item_card_info_tags {
            margin-top: 2px;
            span {
                padding: 0 2px;
                color: $main-color;
                border: 1px solid $main-color;
                font-size: $tag-size;
                border-radius:3px;
                margin-left: 3px;
            }
        }

		.item_card_footer{
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
            justify-content: space-between;
            height: 1.84rem;
			.item_card_footer_left {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
				.footer_price{
                    margin-top: 5px;
					color: $price-color;
                    margin-right: 5px;
                    font-size: $extra-size;
                    span {
                        font-size: $sub-title-size;
                    }
				}

				.footer_price .marketPrice{
					color: $font-color-gray;
					font-size: $extra-size;
					text-decoration: line-through;
					margin-left: 5px;
				}
				.progress {
					width: 100%;
					font-size: $extra-size;
                }
                .item_card_sumSale {
                    color: $sub-title-color;
                    font-size: $extra-size;
                }
			}

			.item_card_footer_right {
				width: 30%;
                position: relative;
                &_img {
                    width: 1rem;
                    height: auto;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
				.snatch {
					position: absolute;
					bottom: 0;
				}
			}


			.footer_desc{
				flex: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

		}
	}


</style>
