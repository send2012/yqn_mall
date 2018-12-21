<template>
	<div class="yqn-swiper" v-if="imgs">
		<van-swipe 
            :autoplay="autoplay"
            :duration="duration"
            :loop="loop"
            :vertical="vertical"
            :touchable="touchable"
            :show-indicators="show_indicators"
            :initial-swipe="initial_swipe"
            :width="width"
            :height="height"
            @change="onChange">
            <van-swipe-item v-for="(image, index) in imgs.list" :key="index">
                <router-link :to="image.linkurl">
                    <img v-lazy="image.picpath" class="swipe-img"/>
                </router-link>
            </van-swipe-item>
        </van-swipe>
	</div>	
</template>

<script>
	import { Swipe, SwipeItem } from 'vant';
	
	export default {
        name: 'yqn-swipe',
        props: {
            autoplay: {
                type: Number,
                default: 3000
            },
            duration: {
                type: Number,
                default: 500
            },
            loop: {
                type: Boolean,
                default: true
            },
            vertical: {
                type: Boolean,
                default: false
            },
            touchable: {
                type: Boolean,
                default: true
            },
            show_indicators: {
                type: Boolean,
                default: true
            },
            initial_swipe: {
                type: Number,
                default: 0
            },
            width: {
                type: Number,
                default: 0
            },
            height: {
                type: Number,
                default: 0
            },
            imgs: {
                type: Object,
                default: () => {}
            }
        },
		data(){
			return {
				images: [
                    'https://p2.gexing.com/G1/M00/FB/0C/rBACE1KjKqbhiuRLAADn4HtvkSA203.jpg',
                    'https://p2.gexing.com/G1/M00/FB/0C/rBACE1KjKqbB4UOYAADlZycfyFA008.jpg'
                ]
			}
		},
		methods:{
			onChange(index) {
                // this.$toast('当前 Swipe 索引：' + index);
            }
		},
		activated(){

		},
		components: {
			[Swipe.name]: Swipe,
			[SwipeItem.name]: SwipeItem
		}
	}
</script>


<style lang="scss" scoped>
	.yqn-swiper {
        .swipe-img {
            width: 100%;
            min-height: 6.6rem;
            height: auto;
        }
        .van-swipe__indicator {
            width: 4px;
        }
    }

	
</style>
<style lang="scss">
    .yqn-swiper {
        .van-swipe {
            max-height: 6.92rem;
            overflow: hidden;
        }
        .van-swipe__indicator {
            width: 4px;
            /*border-radius: 2px;*/
            height: 4px;
        }
    }
</style>

