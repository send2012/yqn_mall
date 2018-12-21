<template>
    <div class="tab_home">
        <!-- 不是 app, 显示下载 app 横幅 -->
        <section v-show="hasApp" class="download-app-image">
            <section class="download-app-image-content">
                <img class="download-app-image-content-img"
                     src="../../assets/images/m_index_down_app_top_bg.jpg"
                     alt="立即下载 app 图片"
                />

                <img class="download-app-image-content-download"
                     src="../../assets/images/m_index_down_app_top_btn.png"
                     @click="downloadOurApp"
                     alt="立即下载按钮"
                />

                <img class="download-app-image-content-close"
                     src="../../assets/images/m_index_down_app_top_close.png"
                     @click="closeThisWindow"
                     alt="关闭按钮"
                />
            </section>
        </section>

        <home-search
            :class="hasApp ? 'home-search-beApp' : 'home-search-beNotApp'"
            :search_opacity="search_opacity" />

        <div ref="scroll_view" :class="isApp ? 'scroll_view' : 'scroll_view_no'">
            <!-- 下拉刷新 -->
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <div class="tab_home_bigSale">

                </div>

                <div class="tab_home_no_bigSale">
                    <!-- 轮播图 -->
                    <yqn-swipe class="tab_home_no_bigSale_yqn_swipe"
                               :imgs="banner_imgs" v-if="banner_imgs" />
                    <!-- 轮播图下的广告位 -->
                    <div class="tab_home_no_bigSale_SwiperDownimg" v-if="apic">
                        <router-link v-for="(item,index) in apic.list" :key="index" :to="item.linkurl">
                            <img v-lazy="item.picpath" :alt="item.title">
                        </router-link>
                    </div>
                    <!-- 菜单栏 -->
                    <class-icon
                        v-if="menu"
                        :class_icon="menu"
                    />
                    <!-- 每日必抢 -->
                    <item-group
                        v-if="activity_seckill"
                        class="interval_bot"
                        :setting="activity_seckill.setting"
                    >
                        <component
                            v-for="item in activity_seckill.seckill.list"
                            :goods="item"
                            :key="item.pro_pid"
                            :is="getStyle(activity_seckill.setting.style)"
                            @click="toGoods(item)"
                        >
                            <div slot="mask" v-if="lootAll(item)">
                                <img src="../../assets/images/not_enough.png" alt="已抢光">
                            </div>
                            <div slot="leftTopIcon" v-if="item.as_status < 2">
                                <img :src="mxStatus(item.as_status)" alt="秒杀">
                            </div>

                        </component>
                    </item-group>
                    <!-- 限时抢购，0.1元购 -->
                    <item-group
                        v-if="activity_zerodotone"
                        class="interval_bot"
                        :setting="activity_zerodotone.setting"
                    >
                        <component
                            v-for="item in activity_zerodotone.seckill"
                            :goods="item"
                            :key="item.pro_pid"
                            :is="getStyle(activity_zerodotone.setting.style)"
                            @click="toGoods(item)"
                        >
                            <div slot="mask" v-if="lootAll(item)">
                                <img src="../../assets/images/not_enough.png" alt="已抢光">
                            </div>
                            <div slot="leftTopIcon" v-if="item.as_status < 2">
                                <img :src="mxStatus(item.as_status)" alt="秒杀">
                            </div>

                        </component>
                    </item-group>
                </div>

                <!-- 广告位 -->
                <item-ads-group
                    v-for="(item,index) in adv"
                    :setting="item"
                    :key="index"
                    :list="item.list" />

                <!-- mock -->
                <!-- 轮播图 -->
                <!-- <yqn-swipe
                    :imgs="banner_imgs"/> -->
                <!-- 菜单栏 -->
                <!-- <class-icon
                    v-if="class_icon"
                    :class_icon="class_icon"
                /> -->
                <!-- 广告位 -->
                <!-- <item-ads-group
                    v-for="(item,index) in itemAdsGroup"
                    :setting="item.setting"
                    :key="index"
                    :list="item.items"/> -->

                <!-- <sign-board
                        v-once
                        v-if="shopInfo"
                        :boardUrl="shopInfo.avatar"
                        :storeName="shopInfo.shop_name"/> -->

                <!-- <div class="home_grab">
                        <home-title
                            title="每日必抢"
                            count_down="00:00"
                            more="/home/grab" />
                        <item-group>
                            <item-card-vert
                                v-for="(item, i) in itemGroup['activity_seckill'].items"
                                :key="i"
                                :goods="item"
                                @click="itemClick(item.id)"
                             />
                        </item-group>
                    </div> -->

                <!-- <shop-info-group
                        v-once
                        v-if="shopInfo"
                        class="interval_bot"
                        :location="location"
                        :address="shopInfo.address"
                        :notice="shopInfo.notice"
                        :mobile="shopInfo.contact"/> -->


                <!-- <van-list
                          v-model="loading"
                          class="scroll-load"
                          :finished="finished"
                        :immediate-check="false"
                          :offset="100"
                          @load="loadMore"
                    >
                        <item-group
                            class="interval_bot"
                            :setting="group.setting"
                        >
                            <component
                                v-for="item in group.items"
                                :goods="item"
                                :key="item.id"
                                :is="getStyle(group.setting.style)"
                                @click="toGoods(item)"
                            >
                                <div slot="mask" v-if="lootAll(item)">
                                    <img src="../../assets/images/not_enough.png" alt="已抢光">
                                </div>
                                <div slot="leftTopIcon" v-if="item.as_status < 2">
                                    <img :src="mxStatus(item.as_status)" alt="秒杀">
                                </div>

                            </component>
                        </item-group>
                    </van-list> -->

                <div class="you_like" v-if="goodsGroup.setting">
                    <div class="you_like_title">
                        <home-title
                            :title="goodsGroup.setting.title"
                            :sub_title="goodsGroup.setting.sub_title"
                            :more="goodsGroup.setting.more" />
                    </div>

                    <van-list
                        v-model="loading"
                        class="scroll-load"
                        :finished="finished"
                        :immediate-check="false"
                        :offset="100"
                        @load="loadMore"
                    >
                        <item-group>
                            <item-card-doub
                                v-for="(item, i) in goodsGroup.items"
                                :key="i"
                                :goods="item"
                                @click="itemClick(item.pro_pid)"
                            >

                            </item-card-doub>
                        </item-group>
                    </van-list>
                </div>
            </van-pull-refresh>

        </div>

        <!-- 返回顶部 -->
        <transition name="fade">
            <!-- <van-icon
                      name="arrowupcircle"
                      class="backTop"
                      @click.native="backTop"
                      v-show="showArrow"
                  /> -->
            <img
                src="../../assets/images/topup.png"
                alt="返回顶部"
                class="yqn-backToTop"
                @click="backTop"
                v-show="show_arrow" />
        </transition>
    </div>
</template>

<script>
    // import { HOME_module, ALL_GOODS } from '@/api/shop';

    import {HOME, HOME_GOODS} from "@/config.js";
    import {HOME_INFO} from "@/api/home";
    import {GROOM_LIST} from "@/api/product";

    import mx_be_to from "@/assets/images/mx_be_to.png";
    import mx_start from "@/assets/images/mx_start.png";

    import SignBoard from "./tabbar-home-sign-board";
    import ShopInfoGroup from "./tabbar-home-shop-info";
    import ClassIcon from "./tabbar-home-class-icon";
    import NavBar from "@/vue/components/NavBar/home_search";
    import ItemGroup from "@/vue/components/item-group/";
    import ItemCardVert from '@/vue/components/item-card-vert/';
    import ItemCardHori from '@/vue/components/item-card-hori/';
    import ItemCardDoub from '@/vue/components/item-card-doub/';
    import Swiper from '@/vue/components/swipe/';
    import HomeTitle from '@/vue/components/home-title/';
    import ItemAdsGroup from "@/vue/components/item-ads-group/";

    import loadMore from '@/vue/mixin/list-load-more';
    import scrollFixed from '@/vue/mixin/scroll-fixed';

    // 引入下拉刷新
    import {PullRefresh} from 'vant';

    export default {
        mixins: [loadMore, scrollFixed],

        data() {
            const shop_id = this.$util.getLocationParam("shop_id");
            return {
                hasApp: true,
                isApp: true, // 是否为 app
                shop_id,
                shopInfo: null,
                class_icon: null,
                itemGroup: {
                    mx_goods: null,
                    activity_seckill: null,
                    shop_recommend: null,
                    goods: null
                }, //每日抢购，限时抢购数据组
                itemAdsGroup: [], //广告位组
                mx_be_to,
                mx_start,
                isLoading: false,
                search_opacity: 0, //搜索框的渐变
                // 一起牛参数与数据
                show_arrow: false,
                // banner_imgs: {},                  //轮播图
                apic: null,                          //轮播图下的广告位
                menu: null,                         //菜单栏icon
                activity_seckill: null,                      //每日必抢
                activity_zerodotone: null,                   //限时抢购，0.1元抢购
                adv: null,                               //其他广告位
                ys: null,                           //预售
                goodsGroup: HOME_GOODS,     //猜你喜欢
                count: 0, // 刷新次数
            }
        },

        computed: {
            location() {
                const shopInfo = this.shopInfo;
                let local = {name: shopInfo.shop_name, lat: shopInfo.lat, lng: shopInfo.lng};
                return (local.lat && local.lng) ? local : null;
            }
        },

        created() {
            const shop_id = window.sessionStorage.getItem('id');
            shop_id && this.getShopInfo("avatar", "shop_name", "address", "notice", "contact").then(res => {
                this.shopInfo = res;
            });
            this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);

            if (!this.menu) {
                // this.initViews();
                // this.resetInit();
            }

            let name = this.$util.checkTheTerminal();

            if (name === 'IOS' || name === 'android') {
                this.isApp = false;
                this.closeThisWindow();
            } else {
                this.isApp = true;
            }
        },

        activated() {
            this.eventListen(true);
        },

        deactivated() {
            this.eventListen(false);
        },

        methods: {
            initViews() {
                // this.$reqGet(HOME_module, {
                // 	shop_id: this.shop_id,
                // 	'per-page': this.pages.perPage,
                // 	page: 1
                // }).then(res => {
                // 	let {shop_info, page, class_icon, ads } = res.data.data;
                // 	let { mx_goods, shop_recommend, activity_seckill, goods } = this.decorate(res.data.data);
                // 	this.shopInfo = shop_info;
                // 	this.itemGroup.mx_goods = mx_goods;
                // 	this.itemGroup.shop_recommend = shop_recommend;
                // 	this.itemGroup.activity_seckill = activity_seckill;
                // 	this.itemGroup.goods = goods;
                // 	this.itemAdsGroup = ads;
                // 	this.class_icon = class_icon.icon_group;
                // 	this.setPages(page);
                // })

                this.$reqGet(HOME_INFO).then(res => {
                    const {banner, apic, menu, seckill, zerodotone, adv, ys} = res.data;
                    //传递轮播图数据
                    if (!(banner instanceof Array)) {
                        //轮播图有数据
                        this.banner_imgs = Object.assign({}, banner);
                    }
                    //传递轮播图下的广告位
                    if (!(apic instanceof Array)) {
                        //传递轮播图下的广告位有数据
                        this.apic = Object.assign({}, apic);
                    }
                    //传递菜单栏数据
                    if (!(menu instanceof Array)) {
                        //传递菜单栏数据有数据
                        this.menu = Object.assign({}, menu);
                    }
                    //传递每日必抢
                    if (seckill.length !== 0) {
                        //传递每日必抢数据
                        this.activity_seckill = {};
                        this.activity_seckill['setting'] = {
                            "title": "每日必抢",
                            "sub_title": "限时秒杀 先到先得",
                            "more": seckill.linkurl,
                            "module_id": "shop_seckill",
                            "style": 1,
                            "sort": 1,
                            "is_show": 1,
                            "is_banner_show": 1
                        };
                        this.activity_seckill['seckill'] = seckill;
                    }
                    //传递限时抢购
                    if (!(zerodotone instanceof Array)) {
                        //传递限时抢购数据
                        this.activity_zerodotone = {};
                        this.activity_zerodotone['setting'] = {
                            "title": "0.1元抢购",
                            "count_down": "0",
                            "more": "/home/grab",
                            "module_id": "shop_zerodotone",
                            "style": 1,
                            "sort": 1,
                            "is_show": 1,
                            "is_banner_show": 1
                        };
                        this.activity_zerodotone['zerodotone'] = zerodotone;
                    }
                    //传递其他广告位
                    if (!(adv instanceof Array)) {
                        //传递其他广告位数据
                        //传递预售
                        if (ys.length !== 0) {
                            //传递预售数据
                            adv['ys'] = {};
                            //给预售加个红底
                            adv['ys']['title_style'] = 2;
                            //给预售加个模板
                            adv['ys']['lx'] = 5;
                            //给预售加个title
                            adv['ys']['title'] = '预售商品';
                            //给预售加个副标题
                            adv['ys']['desc'] = '品牌集锦  优惠到底';
                            adv['ys']['list'] = ys;
                            // 给预售加个更多
                            adv['ys']['more'] = '/home/pre-sale';
                        }

                        //给爆款促销加个蓝底
                        adv['37']['title_style'] = 1;
                        //整合至所有广告位
                        this.adv = Object.assign({}, adv);
                    }
                });

                // let {shop_info, page, class_icon, ads } = HOME.data;
                // let { mx_goods, shop_recommend, activity_seckill, goods } = this.decorate(HOME.data);
                // this.shopInfo = shop_info;
                // this.itemGroup.mx_goods = mx_goods;
                // this.itemGroup.shop_recommend = shop_recommend;
                // this.itemGroup.activity_seckill = activity_seckill;
                // this.itemGroup.goods = goods;
                // this.itemAdsGroup = ads;
                // this.class_icon = class_icon.icon_group;

            },

            initData() {
                return this.$reqGet(GROOM_LIST, {
                    act: 'index',
                    pagesize: this.pages.perPage,
                    page: this.pages.currPage
                }, {
                    hideLoading: true
                }).then(res => {
                    const {list, hasmore} = res.data;
                    console.log(this.goodsGroup);
                    this.goodsGroup.items.push(...list);
                    this.has_more = hasmore;
                    return hasmore;
                });
            },

            //   eventListen(isBind = true) {
            //     if (isBind) {
            //       this.$el.addEventListener("scroll", this.scrollShowArrow)
            //     }
            //     else {
            //       this.$el.removeEventListener("scroll", this.scrollShowArrow)
            //     }
            //   },

            //   scrollShowArrow() {
            //     //显示回到顶部
            //     this.showArrow = this.$el.scrollTop > 120;
            //     //监听显示搜索框透明度
            //     this.search_opacity = this.scroll_div.scrollTop / 200;
            //   },

            toGoods(item) {
                //如果是秒杀商品, 并且已经抢光
                if (this.lootAll(item)) {
                    this.$dialog.alert({message: '该秒杀商品已抢光，看看别的吧！'})
                    return;
                } else {
                    this.$router.push({path: `/items/detail/${item.pro_pid}`})
                }
            },

            groupIcon(key) {
                const iconGroup = {
                    activity_seckill: "naozhong",
                    goods: "list",
                    mx_goods: "n4",
                    shop_recommend: "good"
                };
                return iconGroup[key] || "";
            },

            getStyle(style) {
                switch (style) {
                    case 0:
                        //一行一个
                        return 'item-card-hori';
                    case 1:
                        //一行多个
                        return 'item-card-vert';
                    case 2:
                        //一行两个
                        return 'item-card-doub';
                }
                // return style ? 'item-card-vert' : 'item-card-hori'

            },

            decorate({mx_goods, shop_recommend, activity_seckill, goods}) {
                if (mx_goods) {
                    mx_goods.setting.icon = "n4";
                    mx_goods.setting.title_desc = "分享得金豆";
                    mx_goods.setting.title_color = "#db3d3c";
                    mx_goods.setting.item_len = mx_goods.items.length;
                }
                if (shop_recommend) {
                    shop_recommend.setting.icon = "good";
                    shop_recommend.setting.item_len = shop_recommend.items.length;
                }
                if (activity_seckill) {
                    activity_seckill.setting.icon = "naozhong";
                    activity_seckill.setting.title_color = "#db3d3c";
                    activity_seckill.setting.item_len = activity_seckill.items.length;
                }
                if (goods) {
                    goods.setting.icon = "list";
                    goods.setting.item_len = goods.items.length;
                }
                return {mx_goods, shop_recommend, activity_seckill, goods}
            },

            lootAll(item) {
                return typeof item.as_status != "undefined" && item.sold_num == item.total
            },

            mxStatus(as_status) {
                return as_status ? this.mx_start : this.mx_be_to;
            },
            itemClick(id) {
                this.$router.push({name: "detail", params: {itemId: id}})
            },
            //   backTop() {
            //     this.$el.scrollTop = 0;
            //   },

            // 下拉刷新
            onRefresh()
            {
                this.refresh();
            },

            async refresh()
            {
                const result = await this.resetInit();
                this.isLoading = false;
                this.$toast(
                    {
                        message: '刷新成功',
                    }
                );
            },

            // onRefresh: async function () {
            //     const result = await this.resetInit();
            //
            //     this.isLoading = false;
            //
            //     this.$toast(
            //         {
            //             message: '刷新成功',
            //         }
            //     );
            // },

            // 点击下载 app
            downloadOurApp() {
                // console.log('立即下载 app');
                let device = this.$util.checkTheTerminal();
                if (device === 'IOS' || device === 'android') {
                    // 在APP里面, 不显示下载 app 横幅
                    this.hasApp = false;
                    this.isApp = false;
                } else {
                    this.$util.openInApp();
                    this.closeThisWindow();
                }
            },

            // 关闭下载 app 横幅
            closeThisWindow() {
                this.hasApp = false;
                this.isApp = false;
            }
        },

        components: {
            [SignBoard.name]: SignBoard,
            [ShopInfoGroup.name]: ShopInfoGroup,
            [ItemGroup.name]: ItemGroup,
            [ItemCardVert.name]: ItemCardVert,
            [ItemCardHori.name]: ItemCardHori,
            [ItemCardDoub.name]: ItemCardDoub,
            [NavBar.name]: NavBar,
            [ClassIcon.name]: ClassIcon,
            [Swiper.name]: Swiper,
            [HomeTitle.name]: HomeTitle,
            [ItemAdsGroup.name]: ItemAdsGroup,
            [PullRefresh.name]: PullRefresh
        },

        beforeRouteEnter(to, from, next) {
            // ...

            if (window.location.href.indexOf('!token=') !== -1) {
                //小程序跳转至H5
                let token = window.location.href.split('!token=');
                localStorage.setItem('Authorization', token[1]);
                setTimeout(() => {
                    next(vm => {
                        vm.hasApp = false;
                        if (from.name === 'login' || vm.goodsGroup.items.length === 0 || !vm.menu) {
                            vm.initViews();
                            vm.resetInit();
                        }
                    })
                }, 500)
            } else {
                next(vm => {
                    console.log(111)
                    if (from.name === 'login' || vm.goodsGroup.items.length === 0 || !vm.menu) {
                        vm.initViews();
                        vm.resetInit();
                    }
                })
            }

        },

        beforeRouteLeave(to, from, next) {
            // ...
            if (to.name === 'login') {
                this.$destroy();
            }
            next();
        }
    }
</script>

<style lang="scss" scoped>
    .tab_home {
        .download-app-image {
            box-sizing: border-box;
            width: 100%;
            &-content {
                position: fixed;
                width: 100%;
                top: 0;
                left: 0;
                z-index: 2000;

                &-img {
                    width: 100%;
                }

                &-download {
                    position: absolute;
                    right: .3rem;
                    top: .6rem;
                    width: 4.3rem;
                }

                &-close {
                    position: absolute;
                    left: 3%;
                    top: 30%;
                    width: .8rem;
                }
            }
        }

        .home-search-beApp {
            padding-top: 2.2rem;
        }

        .home-search-beNotApp {
            padding-top: 0;
        }

        .scroll_view {
            height: 100%;
            padding-top: 2.2rem;
            overflow-y: auto;
        }

        .scroll_view_no {
            margin-top: 0;
            height: 100%;
            overflow-y: auto;
        }

        &_no_bigSale {
            // background: #fff;
            &_SwiperDownimg {
                padding: .4rem .6rem;

                img {
                    width: 100%;
                    height: auto;
                }
            }
        }

        .you_like {
            &_title {
                padding: 0 .4rem 0 .6rem;
            }
        }
    }

    .home_grab {
        padding: 0 .32rem;
    }

    .interval_bot {
        margin-bottom: .4rem;
    }

    /*.backTop {*/
    /*position: fixed;*/
    /*right: .1rem;*/
    /*bottom: 40px;*/
    /*font-size: 24px;*/
    /*}*/
</style>

<style lang="scss">
    .tab_home {
        .home-search-beApp {
            .home_title_background {
                padding-top: 2.2rem;
            }
        }
    }
</style>
