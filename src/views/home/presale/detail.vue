<template>
    <div class="point_item_detail">
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
            <section class="point_item_detail_swipe_yqn">
                <van-swipe class="point_item_detail_yqn_swipe"
                           v-if="goods && goods.pics && goods.pics.length !== 0">
                    <van-swipe-item class="point_item_detail_yqn_swipe_item"
                                    v-for="(image, index) in goods.pics"
                                    :key="index">
                        <img src="../../../assets/images/goods_default.png"
                             alt="轮播图图片"
                             v-lazy="image"
                        />
                    </van-swipe-item>
                </van-swipe>

                <div v-else>
                    <div>
                        <img class="point_item_detail_img"
                             src="../../../assets/images/goods_default.png"
                             alt="轮播图图片"
                        />
                    </div>
                </div>
            </section>

            <van-cell-group style="margin-top: 1px;" class="item_cell_group" v-if="goods">
                <van-cell class="item_info">
                    <div class="item-title">
                        <!-- <van-tag plain type="danger" v-if="goods.is_haitao">海淘</van-tag> -->
                        {{ goods.title }}
                    </div>
                    <div>
                      <span class="item_price">
                        价格:
                        <span class="item_price_detail">
                          <span class="item_price_detail_symbol">
                            ￥
                          </span>

                          <span class="item_price_detail_num">
                            {{ goods.price }}
                          </span>
                        </span>
                      </span>
                        <!-- <span class="item_market_price">{{goods.market_price | yuan}}</span> -->
                    </div>
                    <!-- <div class="item_intro">{{goods.sell_point}}</div> -->
                </van-cell>
            </van-cell-group>

            <van-cell-group class="item_cell_group item_detail_content" v-if="goods">
                <van-cell class="item_spec">
                    <div class="item_dispatch">规格： <span>{{goods.spec}}</span></div>
                    <div class="item_dispatch">备注： <span>{{goods.bz}}</span></div>
                </van-cell>
            </van-cell-group>

            <div class="item_desc" v-if="goods && imageTextContent">
                <div class="item_desc_title">
                    <span>图文详情</span>

                    <!-- <span>上传</span> -->

                    <span @click="shareImg"
                          class="item_desc_title_target">
                        <van-icon :name="item_desc_icon" />
                        <!-- <span>下载APP</span> -->
                    </span>
                    <!--<span @share="shareImg">-->
                    <!--<van-icon name="yqn_share"></van-icon>-->
                    <!--</span>-->
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


            <!--<van-button type="default"-->
            <!--class="exchange_btn abled_btn"-->
            <!--@click="exchange">-->
            <!--立即购买-->
            <!--</van-button>-->
        </div>
        <van-goods-action v-if="goods">
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
            <!--<van-goods-action-big-btn @click="addCart"-->
            <!--:text="getInCartText(goods.sh)"-->
            <!--:class="'item_detail_addCart ' + (goods.sh !== 1?'disabled':'') "-->
            <!--/>-->
            <van-goods-action-big-btn primary
                                      @click="exchange"
                                      text="立即购买"
                                      :class="'item_detail_buy ' + (goods.sh !== 1 ? 'disabled' : '')"
            />
        </van-goods-action>

        <van-popup v-model="showContact">
            <md-kefu mobile="16454193338" />
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
                 v-show="show_arrow"
            />
        </transition>

        <!-- 拨打客服热线 -->
        <!--<van-popup v-model="show_service_call" position="bottom">-->
        <!--<div class="item_detail_show_service_call" v-if="user_base_info">-->
        <!--&lt;!&ndash;<a href="tel: 400-801-5562">&ndash;&gt;-->
        <!--&lt;!&ndash;<van-button size="large" type="danger" class="login_register">&ndash;&gt;-->
        <!--&lt;!&ndash;400热线电话&ndash;&gt;-->
        <!--&lt;!&ndash;</van-button>&ndash;&gt;-->
        <!--&lt;!&ndash;</a>&ndash;&gt;-->

        <!--<p class="item_detail_show_service_call_hot_line"-->
        <!--@click="callThePhone('400-801-5562')">-->
        <!--热线电话：400-801-5562-->
        <!--</p>-->

        <!--<p class="item_detail_show_service_call_customer_service">-->
        <!--&lt;!&ndash;专属客服：{{ user_base_info.yg_name }}（{{ user_base_info.yg_mobile }}）&ndash;&gt;-->
        <!--专属客服: {{ user_base_info.yg_name }} ( {{ user_base_info.yg_mobile }} )-->
        <!--</p>-->

        <!--<p class="item_detail_show_service_call_cancel"-->
        <!--@click="callTheService">-->
        <!--取消-->
        <!--</p>-->
        <!--</div>-->
        <!--</van-popup>-->

        <!-- 拨打客服热线 -->
        <van-popup v-model="show_service_call" position="bottom">
            <div class="item_detail_show_service_call" v-if="user_base_info">
                <a href="tel: 400-801-5562">热线电话：400-801-5562</a>
                <span>专属客服：{{user_base_info.yg_name}}（{{user_base_info.yg_mobile}}）</span>
                <span @click="callTheService">取消</span>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import {PRE_SALE_INFO} from '@/api/product';
    import {USER_BASE_INFO} from '@/api/system';
    import scrollFixed from '@/vue/mixin/scroll-fixed';

    import {
        Swipe,
        SwipeItem,
        GoodsAction,
        GoodsActionBigBtn,
        GoodsActionMiniBtn,
        Search, Tab, Tabs, Collapse, CollapseItem, Tag
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
                show_service: false,                //售后保障弹出层
                show_service_call: false,              //专属客服电话

                show_search_compo: false, // 是否显示搜索弹出层
                popup: true, // 搜索弹出
                item_desc_icon: 'yqn_downLoad', // 商品详情中 content 的图标
                imageTextContent: true,         // 商品详情内容
            }
        },

        watch: {
            itemClass(val) {
                this.scrollTop = 0;
                this.resetInit();
            }
        },

        created() {
            this.initData();
            this.getUserInfo();
            this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);

            let name = this.$util.checkTheTerminal();

            if (name === 'IOS' || name === 'android') {
                this.isLoading = false;
                this.item_desc_icon = 'yqn_share';
            } else {
                this.isLoading = true;
            }
        },

        activated() {
            this.eventListen(true);
        },

        deactivated() {
            this.eventListen(false);
        },

        methods: {
            initData() {
                this.$reqGet(PRE_SALE_INFO, {
                    id: this.$route.params.itemId
                }).then(res => {
                    // console.log(res);
                    // let strUrl = res.data.content || res.data.pics[0];
                    // let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                    // let listReg = strUrl.match(urlReg);

                    if (res.data.content === '') {
                        this.imageTextContent = false;
                    }
                    // 判断content中是否有图片
                    else if (res.data.content.indexOf('<img') === -1) {
                        this.item_desc_mark = false;
                    }

                    this.goods = Object.assign({}, res.data);
                });
            },

            // 获取用户基本信息
            getUserInfo() {
                this.$reqGet(USER_BASE_INFO).then(res => {
                    this.user_base_info = Object.assign({}, res.data);
                });
            },

            doBuyNow() {
                this.$router.push({name: 'placeOrderEntity'})
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

            // 拨打 400 电话
            callThePhone() {
                window.location.href = `tel: ${data}`;
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
                this.$router.push({name: "pre_sale_order", params: {item_id: this.$route.params.itemId}});
            },
            backTo() {
                this.$router.back(-1);
            },
            //   eventListen(isBind = true){
            //     if(isBind){
            //       this.$el.addEventListener("scroll", this.scrollShowArrow)
            //     }else{
            //       this.$el.removeEventListener("scroll", this.scrollShowArrow)
            //     }
            //   },
            //   scrollShowArrow(){
            //     this.showArrow = this.$el.scrollTop > 120;
            //   },
            //   backTop(){
            //     this.$el.scrollTop = 0;
            //   },

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
                            let strUrl = this.goods.content || this.goods.pics[0];
                            let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                            let listReg = strUrl.match(urlReg);
                            // console.log(listReg);

                            // 如果是 android, 调用 android 共享链接源生函数
                            // this.$util.androidFunc('shareImgAction', {
                            //     title: this.goods.title,
                            //     imglist: listReg
                            // });

                            // 如果分享的图片为空, 则不调用源生函数
                            if (listReg.length === 0) {
                                this.$toast("没有可用的分享图片, 无法实现分享");

                                return false;
                            } else {
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
                            let strUrl = this.goods.content || this.goods.pics[0];
                            let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                            let listReg = strUrl.match(urlReg);
                            // console.log(listReg);

                            // 如果分享的图片为空, 则不调用源生函数
                            // if (strUrl === '' || strUrl === null)
                            // {
                            //     return false;
                            // }
                            if (listReg.length === 0)
                            {
                                this.$toast('没有可分享的图片, 无法实现分享');
                            }
                            else
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
                        // 判断源生函数是否存在
                        let iosInfo = this.$util.checkPrimalFunc('qynsharelink');

                        if (iosInfo) {
                            // 使用正则截取 pics 的图片 url
                            let strUrl = this.goods.pics[0] || this.goods.content;
                            let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                            let listReg = strUrl.match(urlReg);
                            // console.log(listReg[0]);

                            // 如果分享里的图片为空, 则不调用源生函数
                            if (this.goods.content !== '' && this.goods.pics.length !== 0)
                            {
                                // 如果是 ios, 调用 IOS 共享链接源生函数
                                this.$util.iosFunc('qynsharelink', {
                                    title: this.goods.title,
                                    description: this.goods.abstract,
                                    images: listReg[0],
                                    url: window.location.href
                                });
                            }
                            else
                            {
                                this.$toast('分享中没有图片, 无法完成分享');
                                return false;
                            }
                        }
                        break;

                    case 'android':
                        // 引用判断源生函数是否存在
                        let androidInfo = this.$util.checkPrimalFunc('shareLinkAction');
                        // console.log(androidInfo);

                        if (androidInfo) {
                            // 使用正则截取 pics 的图片 url
                            let strUrl = this.goods.pics[0] || this.goods.content;
                            let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                            let listReg = strUrl.match(urlReg);
                            // console.log(listReg[0]);

                            // 如果分享里的图片为空, 则不调用源生函数
                            if (this.goods.content !== '' && this.goods.pics.length !== 0)
                            {
                                // 如果是 android， 调用 android 共享链接源生函数
                                this.$util.androidFunc('shareLinkAction',
                                    {
                                        title: this.goods.title,
                                        description: this.goods.abstract,
                                        images: listReg[0],
                                        url: window.location.href
                                    }
                                );
                            }
                            else
                            {
                                this.$toast('没有课分享的图片, 无法完成分享');
                                return false;
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

    .disabled_btn {
        background: #999 !important;
        color: #fff !important;
    }

    .abled_btn {
        background: linear-gradient(to right, #fe5d28, #fe8246) !important;
        color: #fff !important;
    }

    .point_item_detail {
        /* padding-top: 1.84rem; */

        .item_list_search {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 2000;
        }

        .scroll_view {
            overflow-y: auto;
        }

        &_swipe_yqn {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 15rem;

            .point_item_detail_yqn_swipe
            {
                &_item {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    img {
                        width: 100%;
                        height: auto;
                    }
                }
            }
        }

        /*&_img {*/
        /*width: 100%;*/
        /*height: auto;*/
        /*}*/
        /*img {*/
        /*max-width: 100%;*/
        /*}*/

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
        margin-bottom: .2rem;
    }

    .item_price {
        font-size: $extra-size;
        color: $main-title-color;
        /* margin-right: 10px; */

        &_detail {
            margin-left: .56rem;
            color: $price-color;

            &_symbol {
                font-size: $product-title-size !important;
            }

            &_num {
                font-size: .92rem !important;
            }
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
        padding: .5rem;
        margin-bottom: 2.4rem;

        img {
            max-width: 100%;
        }

        &_title {
            padding-bottom: .4rem;
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
            padding-bottom: .4rem;
        }
    }

    .item_detail_show_service_call {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 5.32rem;

        a {
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

<style lang="scss">
    .point_item_detail {
        .van-swipe__track {
            display: flex;
            align-items: center;
        }
    }
</style>
