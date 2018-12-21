<template>
    <div class="point_item_detail">
        <!--<nav-bar -->
        <!--:title="goods && goods.title || ''"-->
        <!--@back="backTo"/>-->
        <!-- 头部搜索 -->
        <div class="item_list_header">
            <search-bar
                name="point_item_detail"
                :click="true"
                @to="toSearch"
                @share="shareLink" />
        </div>

        <!-- 结果为空页 -->
        <is-empty v-if="isEmpty">抱歉,没有找到符合条件商品</is-empty>

        <div class="item_list_search" v-if="show_search_compo">
            <!-- 搜索显示层 -->
            <search-compo
                :show="show_search_compo"
                :popup="popup"
                @SearchKeyword="searchKeyword"
                @closePopup="closeSearch"
            >

            </search-compo>
        </div>

        <div ref="scroll_view" class="scroll_view">
            <section class="yqn-swipe-content">
                <van-swipe v-if="goods && typeof(goods.picpath) !== 'string'">
                    <van-swipe-item v-for="(image, index) in goods.item_imgs" :key="index">
                        <img v-lazy="image.picpath" />
                    </van-swipe-item>
                </van-swipe>

                <van-swipe v-if="goods && typeof(goods.picpath) === 'string'">
                    <van-swipe-item>
                        <img v-lazy="goods.picpath" class="point_item_detail_img" />
                    </van-swipe-item>
                </van-swipe>
            </section>

            <van-cell-group class="item_cell_group" v-if="goods">
                <van-cell class="item_info">
                    <div class="item-title">
                        <!-- <van-tag plain type="danger" v-if="goods.is_haitao">海淘</van-tag> -->
                        {{ goods.title }}
                    </div>
                    <div>
                        <span class="item_price">积分：<span>{{ goods.point }}</span></span>
                        <!-- <span class="item_market_price">{{goods.market_price | yuan}}</span> -->
                    </div>
                    <!-- <div class="item_intro">{{goods.sell_point}}</div> -->
                </van-cell>
            </van-cell-group>

            <van-cell-group class="item_cell_group" v-if="goods">
                <van-cell class="item_spec">
                    <div class="item_dispatch">规格： <span>{{goods.spec}}</span></div>
                    <div class="item_dispatch">备注： <span>{{goods.bz}}</span></div>
                </van-cell>
            </van-cell-group>

            <div class="item_desc"
                 v-if="goods && imageTextContent">
                <div class="item_desc_title">
                    <span>图文详情</span>

                    <!--<span>上传</span>-->

                    <span @click="shareImg"
                          class="item_desc_title_target">
                        <van-icon :name="item_desc_icon" />
                        <!-- <span>下载APP</span> -->
                    </span>
                </div>
                <div class="item_desc_mark" v-if="item_desc_mark">（单击图片 保存到手机 转发朋友圈 轻松卖货）</div>
                <div class="item_desc_wrap" v-html="goods.content"></div>
            </div>

            <!-- <van-goods-action>
                <van-goods-action-mini-btn @click="doContact" icon="wangwang" iconClass="red afterTag" />
                <van-goods-action-mini-btn @click="toCart" icon="cart" :info="cartInfo"/>
                <van-goods-action-mini-btn @click="addCollect" icon="shoucang" />
                <van-goods-action-big-btn @click="addCart" text="加入购物车" />
                <van-goods-action-big-btn primary @click="doBuyNow" text="立即购买" />
            </van-goods-action> -->
        </div>

        <van-goods-action>
            <!-- <van-goods-action-mini-btn @click="toHome" icon="wangwang" iconClass="red afterTag" text="更多"/> -->
            <van-goods-action-mini-btn @click="toHome"
                                       icon="yqn_index"
                                       text="主页"
            />
            <van-goods-action-mini-btn @click="toCart"
                                       icon="yqn_cart"
                                       :info="cartInfo | greater"
                                       text="进货单"
            />
            <van-goods-action-mini-btn @click="callTheService"
                                       icon="yqn_service"
                                       text="客服"
            />
            <van-goods-action-big-btn primary
                                      @click="exchange"
                                      text="立即购买"
                                      :class="'item_detail_buy ' + (goods.sh === 0 || goods.num === 0 || goods.point > user_base_info.point?'disabled_btn':'') "
            />
        </van-goods-action>
        <!-- <van-button type="default" :class="'exchange_btn ' + (user_base_info.point > goods.point?'abled_btn':'disabled_btn')" @click="exchange">{{(user_base_info.point > goods.point?'立即兑换':'积分不足')}}</van-button> -->

        <van-popup v-model="showContact">
            <md-kefu mobile="16454193338" />
        </van-popup>

        <!-- 拨打客服热线 -->
        <van-popup v-model="show_service_call" position="bottom">
            <div class="item_detail_show_service_call" v-if="user_base_info">
                <a href="tel: 400-801-5562">热线电话：400-801-5562</a>
                <span>专属客服：{{user_base_info.yg_name}}（{{user_base_info.yg_mobile}}）</span>
                <span @click="callTheService">取消</span>
            </div>
        </van-popup>

        <transition name="fade">
            <!-- <van-icon
                name="arrowupcircle"
                class="backTop"
                @click.native="backTop"
                v-show="showArrow"
            /> -->
            <img src="../../../assets/images/topup.png"
                 alt=""
                 class="yqn-backToTop"
                 @click="backTop"
                 v-show="show_arrow" />
        </transition>
    </div>
</template>

<script>
    import {POINT_PRO_INFO} from '@/api/point';
    import {USER_BASE_INFO} from '@/api/system';
    import scrollFixed from '@/vue/mixin/scroll-fixed';
    import {
        Swipe,
        SwipeItem,
        GoodsAction,
        GoodsActionBigBtn,
        GoodsActionMiniBtn,
        Search,
        Tab,
        Tabs,
        Collapse,
        CollapseItem,
        Tag
    } from 'vant';

    import md_kefu from '@/vue/components/md-kefu/';
    import NavBar from '@/vue/components/NavBar/';

    // 搜索组件相关
    import IsEmpty from "@/vue/components/is-empty/";
    import SearchBar from '@/vue/components/NavBar/search.vue';
    import SearchCompo from '@/vue/components/Search/';

    export default {
        props: {
            itemId: [String, Number],
            keyword: {
                type: String,
                default: "",
            }
        },

        mixins: [scrollFixed],

        data() {
            const isLogin = !!localStorage.getItem('Authorization');
            return {
                show_arrow: false,
                isLogin,
                showContact: false,
                cartInfo: "5",
                mobile: "13454193338",
                show_service_call: false,              //专属客服电话
                selectSku: {
                    selectedNum: 1,
                    selectedSkuComb: {}
                },
                addressVal: {
                    id: null,
                    area_name: "",
                    district: "",
                    city: "",
                    province: ""
                },
                item_desc_mark: true,               //根据content是否有img标签来判断是否显示这段文字
                goods: {
                    point: 0
                },                                  //积分商品信息
                user_base_info: {},              //用户积分获取

                // 搜素相关
                show_search_compo: false, // 是否显示搜索弹出层
                popup: true, // 搜索弹出

                item_desc_icon: 'yqn_downLoad', // 商品详情 content 的图标
                imageTextContent: true
            }
        },

        activated() {
            this.eventListen(true);
        },

        deactivated() {
            this.eventListen(false);
        },

        created() {
            this.initData();
            this.getUserInfo();
            this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);

            // 使用源生函数判断设备类型
            let name = this.$util.checkTheTerminal();

            // ios 和 android 时, 关注我们不显示, 图片换成下载
            if (name === 'IOS' || name === 'android')
            {
                this.isLoading = false;
                this.item_desc_icon = 'yqn_share';
            }
            else
            {
                this.isLoading = true;
            }
        },

        methods: {
            initData() {
                this.$reqGet(POINT_PRO_INFO, {
                    id: this.itemId
                }).then(res => {
                    // 判断 content 是否为空, 为空则图文详情模块隐藏
                    if (res.data.content === '')
                    {
                        this.imageTextContent = false;
                    }
                    // 判断 content 中是否有图片
                    else if (res.data.content.indexOf('<img') === -1)
                    {
                        this.item_desc_mark = false;
                    }

                    this.goods = Object.assign({}, res.data);
                    // console.log(this.goods);
                })
            },


            getUserInfo() {
                this.$reqGet(USER_BASE_INFO).then(res => {
                    this.user_base_info = Object.assign({}, res.data)
                })
            },
            doBuyNow() {
                if ((this.goods.has_sku && this.selectSku.sku_id) || !this.goods.has_sku) {
                    this.$router.push({name: 'placeOrderEntity'})
                } else {
                    let goodAction = this.$refs.goodAction
                    goodAction.showSku = true;
                    goodAction.isSkuBuy = true;
                }
            },
            addCart() {
                if (this.goods.has_sku && this.selectSku.sku_id) {
                    this.$toast({
                        message: "已添加至购物车",
                        duration: 1500
                    });
                    this.cartInfo = String(parseInt(this.cartInfo) + 1);
                } else {

                }
            },
            doContact() {
                this.showContact = true;
            },

            toHome() {
                // this.showContact = true;
                // this.showMoreIcon = !this.showMoreIcon;
                this.$router.push({name: 'home'});
            },
            toCart() {
                this.$router.push({
                    name: "cart"
                })
            },

            callTheService() {
                //呼叫客服弹出框
                this.show_service_call = !this.show_service_call;
            },

            toSearch() {
                //跳转到搜索页
                // this.$router.push({path: '/home/search'})
                //开启弹出层
                this.show_search_compo = !this.show_search_compo;
            },
            closeSearch() {
                //关闭弹出层
                this.show_search_compo = !this.show_search_compo;
            },
            searchKeyword(word) {
                // 开始搜索
                // 重置数据
                this.placeholder = word;
                this.show_search_compo = !this.show_search_compo;
                this.popup = false;
                this.$router.push({name: "list", query: {keyword: word.trim()}});
            },

            addCollect() {
                this.$toast({
                    message: "已添加至我的收藏",
                    duration: 1500
                });
            },
            exchange() {
                if (this.user_base_info.point > this.goods.point) {
                    this.$router.push({name: "user-point-mall-order", params: {itemId: this.itemId}})
                } else {
                    this.$toast('您的积分不足')
                }
            },
            backTo() {
                this.$router.back(-1);
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

            // 图文分享
            shareImg() {
                // console.log('图文共享');

                // 判断设备终端信息
                let name = this.$util.checkTheTerminal();

                // 调用源生函数
                switch (name) {
                    case 'IOS':
                        // 判断源生函数是否存在, 存在返回 true
                        let iosInfo = this.$util.checkPrimalFunc('shareImgAction');

                        if (iosInfo) {
                            // 使用正则截取 contents 的图片 url
                            // console.log(this.goods.content);
                            let strUrl = this.goods.content;
                            let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                            let listReg = strUrl.match(urlReg);
                            // console.log(listReg);

                            // 如果是 android, 调用 android 共享链接源生函数
                            // this.$util.androidFunc('shareImgAction', {
                            //     title: this.goods.title,
                            //     imglist: listReg
                            // });

                            // 如果分享的图片为空, 则不调用源生函数
                            if (this.goods.content === '')
                            {
                                return false;
                            }
                            else
                            {
                                // 如果是 ios, 调用 IOS 共享链接源生函数
                                this.$util.iosFunc('shareImgAction', {
                                    title: this.goods.title,
                                    imglist: listReg
                                });
                            }
                        }
                        break;

                    case 'android':
                        // 引用判断源生函数是否存在
                        let androidInfo = this.$util.checkPrimalFunc('shareImgAction');

                        if (androidInfo) {
                            // console.log(this.goods.content);

                            // 使用正则截取 contents 的图片 url
                            let strUrl = this.goods.content;
                            let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                            let listReg = strUrl.match(urlReg);
                            // console.log(listReg);

                            // 如果分享的图片为空, 则不调用源生函数
                            if (this.goods.content === '')
                            {
                                // 如果是 android, 调用 android 共享链接源生函数
                                this.$util.androidFunc('shareImgAction', {
                                    title: this.goods.title,
                                    imglist: listReg
                                });
                            }
                        }
                        break;

                    case 'WeChat':
                        this.$util.openInApp();
                        break;

                    default:
                        this.$util.openInApp();
                        break;
                }
            },

            // 共享链接
            shareLink() {
                // console.log('共享链接');

                // 引用判断设备终端信息
                let name = this.$util.checkTheTerminal();
                // console.log(name);

                // 调用源生函数
                switch (name) {
                    case 'IOS':
                        // console.log(name);
                        // 引用判断源生函数是否存在
                        let iosInfo = this.$util.checkPrimalFunc('qynsharelink');

                        if (iosInfo) {
                            // 使用正则截取 pics 的图片 url
                            let strUrl = this.goods.picpath;
                            let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                            let listReg = strUrl.match(urlReg);
                            // console.log(listReg[0]);

                            // 如果分享里的图片为空, 则不调用源生函数
                            if (this.goods.picpath === '') {
                                return false;
                            } else {
                                // 如果是 ios, 调用 IOS 共享链接源生函数
                                this.$util.iosFunc('qynsharelink', {
                                    title: this.goods.title,
                                    description: this.goods.content,
                                    images: listReg[0],
                                    url: window.location.href
                                });
                            }
                        }
                        break;

                    case 'android':
                        // 引用判断源生函数是否存在
                        let androidInfo = this.$util.checkPrimalFunc('shareLinkAction');
                        // console.log(androidInfo);

                        if (androidInfo) {
                            // 使用正则截取 pics 的图片 url
                            let strUrl = this.goods.picpath;
                            let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                            let listReg = strUrl.match(urlReg);
                            // console.log(listReg[0]);

                            // 如果分享里的图片为空, 则不调用源生函数
                            if (this.goods.picpath === '') {
                                return false;
                            } else {
                                // 如果是 android, 调用 android 共享链接源生函数
                                this.$util.androidFunc('shareLinkAction', {
                                    title: this.goods.title,
                                    description: this.goods.content,
                                    images: listReg[0],
                                    url: window.location.href
                                });
                            }
                        }
                        break;

                    default:
                        break;
                }
            },
        },

        components: {
            [md_kefu.name]: md_kefu,
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [GoodsAction.name]: GoodsAction,
            [GoodsActionBigBtn.name]: GoodsActionBigBtn,
            [GoodsActionMiniBtn.name]: GoodsActionMiniBtn,
            [NavBar.name]: NavBar,
            [IsEmpty.name]: IsEmpty,
            [SearchBar.name]: SearchBar,
            [SearchCompo.name]: SearchCompo,
        },

        beforeRouteLeave(to, from, next) {
            //因为将所有的组件进行了缓存，所以退出的时候要将其组件销毁
            this.$destroy();
            // ...
            next();
        }
    }

</script>

<style lang="scss" scoped>
    @import "../../../assets/scss/mixin";

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all .5s;
    }

    .scroll_view {
        height: 100%;
        overflow-y: auto;

        .yqn-swipe-content
        {
            display: flex;
            jusitify-content: center;
            align-items: center;
            width: 15rem;
            height: 15rem;

            .van-swipe
            {
                width: 100%;

                &__track
                {
                    width: 100%;

                    .van-swipe-item
                    {
                        width: 100%;
                    }
                }
            }
        }
    }

    .disabled_btn {
        background: #999 !important;
        color: #fff !important;
        border: 0;
    }

    .show_service_call {
        width: 100%;
        height: 5.32rem;
        display: flex;
        flex-direction: column;

        span {
            @include one-border;
            flex: 1;
            color: $sub-title-color;
            display: inline-block;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: $sub-title-size;

            &:nth-child(3) {
                color: $explain-text-color;
            }
        }
    }

    .abled_btn {
        background: linear-gradient(to right, #fe5d28, #fe8246) !important;
        color: #fff !important;
    }

    .point_item_detail {
        /* padding-top: 46px; */

        .item_list_search {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 2000;
        }

        &_img {
            width: 100%;
            height: auto;
        }

        img {
            max-width: 100%;
        }

        .exchange_btn {
            position: fixed;
            bottom: 0;
            width: 100%;
            font-size: $sub-title-size;
            height: 2rem;
            color: #fff;
            border: 0;
        }
    }

    .item_cell_group {
        margin-bottom: 5px;
    }

    .item_price {
        font-size: $main-title-size;
        color: $red;
        margin-right: 10px;

        span {
            font-size: 1.16rem;
        }
    }

    .item_market_price {
        color: $font-color-gray;
        text-decoration: line-through;
        font-size: $font-size-small;
    }

    .item-title {
        height: 1.76rem;
        font-size: $sub-title-size;
        color: $main-title-color;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .item_dispatch {
        font-size: $font-size-small;
        color: $font-color-gray;

        span {
            color: $main-title-color;
        }
    }

    .item_intro {
        line-height: .72rem;
        margin: 5px 0;
        font-size: $font-size-small;
        color: $font-color-gray;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }

    .item_desc {
        background-color: #fff;
        padding: .4rem .4rem 2rem .4rem;

        img {
            max-width: 100%;
        }

        &_title {
            padding-bottom: 10px;
            display: flex;
            justify-content: space-between;
            color: $main-title-color;
            font-size: $sub-title-size;
        }

        &_mark {
            width: 100%;
            text-align: center;
            font-size: $params-title-size;
            color: $main-color;
            padding-bottom: 10px;
        }
    }

    .item_detail_show_service_call
    {
        width: 100%;
        height: 5.32rem;
        display: flex;
        flex-direction: column;

        a
        {
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
            color: $sub-title-color;
            font-size: $sub-title-size;
        }

        span {
            @include one-border;
            flex: 1;
            color: $sub-title-color;
            display: inline-block;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: $sub-title-size;

            &:nth-child(3) {
                color: $explain-text-color;
            }
        }
    }
</style>
