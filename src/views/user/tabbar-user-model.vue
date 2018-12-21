<template>
	<div class="user_model">
        <div class="user_model_inner">
            <div class="user_model_inner_pay">
                <span class="user_model_inner_title">总计消费</span>
                <span><span class="user_model_inner_value">{{index_info && index_info.buysummoney || '0'}}</span>元</span>
            </div>
            <span class="user_model_inner_border">
            </span>
            <div class="user_model_inner_point">
                <span class="user_model_inner_title">账户积分</span>
                <span><span class="user_model_inner_value">{{index_info && index_info.point>=0 && index_info.point || '0'}}</span>分</span>
            </div>
        </div>
    </div>
</template>

<script>
	
	import bg_default from "../../assets/images/user_head_bg.png";
	
	export default {
		name: "user-model",
		
		props: {
			isLogin: {
				type: Boolean,
				default: false
            },
            index_info: {
                type: Object,
                default: ()=>{}
            }
		},
		
		data(){
			return {
				nick_name: "昵称",
				background_image: bg_default
			}
		},
		
		activated(){
			// this.getUserInfo();	
		},
		
		methods: {
			// getUserInfo(){
			// 	const infoData = this.$util.getLocalStorage('nick_name', 'background_image', 'avatar');
			// 	this.nick_name = infoData.nick_name || '昵称';
				
			// 	this.background_image = infoData.background_image || bg_default;
			// },
			toSetting(){
				this.$router.push({name: "user-information"})
			},
			toLogin(){
				!this.isLogin && this.$router.push({name: 'login', query: {redirect: "user"}})
			}
		}
	}

</script>

<style lang="scss" scoped>
    @import '../../assets/scss/_var';
	.user_model {
        margin-bottom: 0 !important;
        padding: 0 13px;
        height: 2.4rem;
        margin-top: -2rem;
        &_inner {
            height: 1.6rem;
            background-color: #fff;
            border-radius: 3px;
            box-shadow:0px 0px 0px rgba(153,153,153,0.23);
            padding: .4rem 0;
            position: relative;
            display: flex;
            align-items: center;
            &_pay {
                width: 50%;
                font-size: $product-title-size;
                color: $main-title-color;
                text-align: center;
                display: flex;
                flex-direction: column;
                span:nth-child(2) {
                    line-height: 1.2rem;
                }
            }
            &_border {
                width: 1px;
                height: 1.2rem;
                background-color: #BABABA;
                position: absolute;
                left: 50%;
                top: 0.8rem;
            }
            &_point {
                width: 50%;
                font-size: $product-title-size;
                color: $main-title-color;
                text-align: center;
                display: flex;
                flex-direction: column;
                span:nth-child(2) {
                    line-height: 1.2rem;
                }
            }

            &_value {
                font-size: $product-title-size;
            }
        }
	}
	

</style>
