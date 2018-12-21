<template>
    <div class="swiper_bot">
        <!-- <img src="https://img.naifenpifa168.com/upfile/nadmin/image/20180922/9b79b59aca8b8f8f4a0d792056c9322b.png!bg" alt="" class="swiper_bot_img"> -->
        <div class='icon_group'>
            <div class="icon_area" v-for="(icon, i) in class_icon.list" :key="i">
                <router-link :to="icon.linkurl" class="icon_link">
                    <img :src="icon.picpath" alt="" class="icon_group_img">
                    <span class="icon_title">{{icon.title}}</span>
                    <div class="van-info" v-if="icon.tipnum">{{icon.tipnum | greater}}</div>
                </router-link>
            </div>
        </div>
    </div>
	
</template>

<script>
	
	export default {
		name: "class-icon",
		props: {
			class_icon: {
				type: Object,
                required: true,
                default: () => {[]}
			}
		},
		
		data(){
			
			return {
				
			}	
		},
		
		created(){
			
		},
		
		components: {

		}
	}
</script>


<style lang="scss" scoped>
    .swiper_bot {
        text-align: center;
        margin: 0 0 8px 0;
        background: #fff;
        // padding-top: 12px;
        &_img {
            width: auto;
            height: 94px;
        }
        .icon_group {
            display: flex;
            padding: 0 8px 10px;
            &_img {
                width: 45px;
                height: auto;
            }
            .icon_area {
                width: 25%;
                .icon_link {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 10px;
                    position: relative;
                    .van-info {
                        left: 75%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid $price-color;
                        background: #fff;
                        color: $price-color;
                        width: .84rem;
                        height: .84rem;
                        border-radius: 50%;
                        font-size: 12px;
                        line-height: .84rem;
                        padding: 0;
                        min-width: 0;
                    }
                    .icon_title {
                        line-height: 30px;
                    }
                }
                
            }
        }
    }
	
</style>