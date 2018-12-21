<template>
    <div class="navBar">
        <van-nav-bar
            :left-text="left_text"
            :right-text="right_text"
            :left-arrow="left_arrow"
            @click-left="onClickLeft"
            @click-right="no_more?onClickRight():showMore()"
            style="z-index: 2001"
        >
            <span slot="title">{{title}}</span>
            <van-icon name="yqn_nav_more" slot="right" class="navBar_right_icon" v-if="!no_more"/>
        </van-nav-bar>

        <div class="navBar_popup_bg" v-show="show_more" @click="closeMore">
            <!-- 弹出层的遮罩层 -->
        </div>

        <div class="navBar_popup" v-show="show_more">
            <img :src="popup_bg" alt="弹出框背景图">
            <div class="navBar_popup_text">
                <span v-for="item in nav_bar" :key="item.title" @click="jumpTo(item.name)">
                    <van-icon :name="item.icon" />
                    <span>{{item.title}}</span>
                    <span v-show="item.name === 'cart' && item.info != '0'">{{item.info | greater}}</span>
                </span>
            </div>
        </div>
    </div>
        
</template>


<script>
    import { NavBar } from 'vant';
    import Popup_bg from '@/assets/images/nav_bar_popup.png';
	export default {
		name: 'nav-bar',
		props: {
			left_text: String,
			right_text: String,
            title: String,
            left_arrow: {
                type: Boolean,
                default: true
            },
            no_more: {
                type: Boolean,
                default: false
            }
		},
		data() {
			return {
                nav_bar: [
                    {
                        title: '首页',
                        icon: 'yqn_index',
                        info: 0,
                        name: 'home'
                    },
                    {
                        title: '我的',
                        icon: 'yqn_mine',
                        info: 0,
                        name: 'user'
                    },
                    {
                        title: '进货单',
                        icon: 'yqn_cart',
                        info: 0,
                        name: 'cart'
                    }
                ],          //标题栏更多文字
                popup_bg: Popup_bg,             //标题栏更多背景图
                show_more: false                //标题栏更多弹出框
            }
		},
		
		
		
		created(){
            let info = sessionStorage.getItem('cart_num');
            if(info) {
                this.$set(this.nav_bar[2],'info',info);
            }
            
        },
        
		methods: {
			
            onClickLeft() {
				// this.$emit('back');
                // this.$toast('返回');
                let ver = false;
                wx.miniProgram.getEnv(function (res) {
                    if(res.miniprogram) {
                        //是小程序
                        ver = true
                    }
                })

                if(ver) {
                    wx.miniProgram.navigateBack();
                }else if(window.history.length <= 1) {
                    location.href = '/#/'
                }else {
                    this.$emit('back');
                }
            },
            onClickRight() {
                this.$emit('linkTo');
            },
            showMore() {
                //显示更多
                this.show_more = !this.show_more;
            },
            closeMore() {
                //关闭弹出框
                this.show_more = !this.show_more;
            },
            jumpTo(name) {
                this.show_more = !this.show_more;
                this.$router.push({name})
            }

		},
		
		components:{
			 [NavBar.name]: NavBar
		}
	}

</script>
<style lang="scss" scoped>
    @import "../../../assets/scss/_var.scss";
	.navBar {
        font-size: $main-title-size;
		width: 100%;
		position: fixed;
		top: 0;
        left: 0;
        z-index: 2001;
        &_right_icon {
            font-size: $main-title-size;
        }
        &_popup_bg {
            position: fixed;
            z-index: 2000;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
        &_popup {
            position: absolute;
            z-index: 2001;
            top: 30px;
            right: 0;
            img {
                width: 7rem;
                height: auto;
            }
            &_text {
                position: absolute;
                top: 19px;
                left: .45rem;
                width: 6.1rem;
                height: 5.7rem;
                display: flex;
                flex-direction: column;
                >span {
                    flex: 1;
                    padding-left: .8rem;
                    display: flex;
                    align-items: center;
                    >span {
                        &:nth-child(2) {
                            margin-left: .6rem;
                            font-size: $product-title-size;
                            color: $sub-title-color;
                        }
                        &:nth-child(3) {
                            margin-left: .7rem;
                            padding: 0 .1rem;
                            border-radius: .7em;
                            background: $price-color;
                            color: #fff;
                            font-size: $tag-size;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        
                    }
                }
            }
        }
	}
</style>
<style lang="scss">
.navBar {
    .van-nav-bar__right {
        .van-nav-bar__text {
            font-size: $params-title-size;
            color: $sub-title-color;
        }
    }

    &_popup {
            
            &_text {
                
                >span {
                    
                    i {
                        color: $main-title-color;
                        font-size: 1rem;
                    }
                }
            }
        }
}
</style>


