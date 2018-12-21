<template>
    <div class="slot_header">
        <div
            style="z-index: 1999"
            class="search_navBar"
        >
        <van-icon name="yqn_leftIcon" class="back_arrow" @click.native="backTo"/>
        <van-search
            v-model="value"
            :placeholder="placeholder"
            @search="onSearch"
            @click="onClick"
            background="inherit"
            class="search_bar"
            readonly
            show-action
            >
            <van-icon name="yqn_nav_more" slot="action" class="search_navBar_right_icon" @click="onClickRight" v-if="!name"/>
            <!-- 商品详情分享链接 -->
            <van-icon :name="shareIcon" slot="action" class="search_navBar_right_icon" @click="shareLink" v-if="name"/>
        </van-search>

        <div class="search_navBar_popup_bg" v-show="show_more" @click="closeMore">
            <!-- 弹出层的遮罩层 -->
        </div>

        <div class="search_navBar_popup" v-show="show_more">
            <img :src="popup_bg" alt="弹出框背景图">
            <div class="search_navBar_popup_text">
                <span v-for="item in nav_bar" :key="item.title" @click="jumpTo(item.name)">
                    <van-icon :name="item.icon" />
                    <span>{{item.title}}</span>
                    <span v-show="item.name === 'cart' && item.info != '0'">{{item.info | greater}}</span>
                </span>
            </div>
        </div>

        </div>
    </div>
</template>


<script>
    import { Search } from 'vant';
    
    import Popup_bg from '@/assets/images/nav_bar_popup.png';

	export default {
		name: 'search-bar',
		props: {
            name: {
                type: String,
                default: ''
            },
			placeholder: {
				type: String,
				default: '请输入搜索关键词'
            },
            click: {
                type: Boolean,
                default: false
            }

		},
		data() {
			return {
                value: '',
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
                show_more: false,                //标题栏更多弹出框
                shareIcon: 'yqn_downLoad'           //商品详情分享链接图标
			}
		},
		
		watch:{
			'$route': 'changeActive'
		},
		
		created(){
            const toName = this.$route.name;
            let info = sessionStorage.getItem('cart_num');
            if(info) {
                this.$set(this.nav_bar[2],'info',info);
            }
            //先从本地拿出默认关键词
            this.placeholder = sessionStorage.getItem('search_default') || '请输入搜索关键词';
            //否则监听从tabbar过来的关键词
            this.$bus.$on('search_default', keyword => {
                this.placeholder = keyword;
                this.keyword = this.placeholder;
            })

            //判断商品详情右上角图标为分享还是下载APP
            let device = this.$util.checkTheTerminal();
            if(device === 'IOS' || device === 'android') {
                this.shareIcon = 'yqn_shareLink';
            }
		},
		
		methods: {
			backTo () {
                if(window.history.length <= 1) {
                    location.href = '/#/'
                }else {
                    this.$router.back(-1)
                }
                
            },
            onSearch () {
				console.log(this.value);
				this.$emit('search',this.value);
            },
            onClick () {
                // 传递前判断是否允许触发
                if(this.click) {
                    this.$emit('to')
                }else {
                    console.log(1)
                }
                
            },
            onClickRight() {
                this.show_more = !this.show_more;
            },
            shareLink() {
                let device = this.$util.checkTheTerminal();
                if(device === 'IOS' || device === 'android') {
                    //在APP里面
                    this.$emit('share');
                }else {
                    this.$util.openInApp();
                }
                
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
             [Search.name]: Search
		}
	}

</script>
<style lang="scss">
.slot_header {
    width: 100%;
    height: 44px;
    .search_navBar {
        // background: -webkit-linear-gradient(#fff, #ececec); /* Safari 5.1 - 6.0 */
        // background: -o-linear-gradient(#fff, #ececec); /* Opera 11.1 - 12.0 */
        // background: -moz-linear-gradient(#fff, #ececec); /* Firefox 3.6 - 15 */
        // background: linear-gradient(#fff, #ececec);
        background: #fff;
        display: flex;
        height: 44px;
        position: fixed;
        top: 0;
		left: 0;
        width: 100%;
        align-items: center;
        padding-left: 8px;
        .back_arrow {
            font-size: 1rem;
            width: 30px;
            line-height: 44px;
        }
        .search_bar {
            width: 89%;
            height: 44px;
            padding-left: 0;
        }
        .van-field {
            background: $background-color;
            .van-cell__left-icon {
                color: $sub-title-color;
            }
            #placeholder {
                color: $explain-text-color;
            }
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
}


</style>
<style lang="scss">
.search_navBar {
    .van-search__action {
        display: flex;
        i {
                color: $main-title-color;
                font-size: .76rem;
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
