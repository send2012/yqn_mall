<template>
    <div class="item_list">
        <!-- 废弃 -->
        <!--
          <div class="fixedTop">
            <nav-bar title="预售商品" @back="backTo" />
          </div>
         -->

        <!-- 顶部搜索 -->
        <div class="item_list_header">
            <search-bar :click="true"
                        @to="toSearch"
                        :placeholder="placeholder"
            />
        </div>

        <div ref="scroll_view" class="scroll_view">
            <!-- 单行列表 -->
            <van-list v-model="loading"
                      :finished="finished"
                      :immediate-check="false"
                      :offset="100"
                      @load="loadMore">
                <item-group class="item_card_single_line">
                    <!-- 一行一个 -->
                    <div class="item_card_H_wrap one_border"
                         v-for="item in items"
                         @click="viewDetail(item.id)">
                        <div class="clearfix item_card_H_wrap_inner">
                            <div class="item_card_image float-l">
                                <!-- 左上icon -->
                                <div v-if="$slots.leftTopIcon" class="leftTopIcon">
                                    <slot name="leftTopIcon"></slot>
                                </div>

                                <img v-lazy="item.pics" />
                            </div>

                            <div class="item_card_info">
                                <div class="item_card_name">
                                    <!-- 商品名称 -->
                                    {{ item.title }}
                                </div>

                                <!--<div class="item_card_info_desc">{{goods.sell_point}}</div>-->
                                <!--<div class="item_card_info_tags">-->
                                <!--<span v-for="(item,index) in goods.prom" :key="index">{{item}}</span>-->
                                <!--</div>-->

                                <!-- 规格 -->
                                <div class="item_detail_spec">
                                    <span class="item_detail_spec_line">
                                        规格：
                                        <span>
                                            {{ item.spec }}
                                        </span>
                                    </span>

                                    <span style="" class="item_detail_spec_line">
                                        备注：
                                        <span>
                                            {{ item.bz }}
                                        </span>
                                    </span>
                                </div>

                                <div class="item_card_footer">
                                    <div class="item_card_footer_left">
                                        <div class="footer_price">
                                            <!-- 价格 -->
                                            ￥<span>{{ item.price }}</span>
                                        </div>
                                    </div>

                                    <!--<div class="item_card_footer_right" v-if="item.prom_limit">-->
                                    <!--&lt;!&ndash; 秒杀直降 &ndash;&gt;-->
                                    <!--<img :src="require('../../../assets/images/'+ getImgExtra('prom_limit',item.prom_limit) +'.png')"-->
                                    <!--alt=""-->
                                    <!--class="item_card_footer_right_img"-->
                                    <!--v-if="!(item.prom_limit instanceof Array)">-->
                                    <!--&lt;!&ndash; 右下角按钮 &ndash;&gt;-->
                                    <!--&lt;!&ndash; <van-button type="warning" size="small" class="snatch">立即抢购</van-button> &ndash;&gt;-->
                                    <!--</div>-->

                                    <div class="footer_desc" v-if="$slots.footer">
                                        <slot name="footer"></slot>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </item-group>
            </van-list>

            <is-empty v-if="isEmpty">抱歉,没有找到符合条件商品</is-empty>

            <transition name="fade">
                <!-- <van-icon
                          name="arrowupcircle"
                          class="backTop"
                          @click.native="backTop"
                          v-show="showArrow"
                      /> -->
                <img src="../../../assets/images/topup.png"
                     alt="返回顶部"
                     class="yqn-backToTop"
                     @click="backTop"
                     v-show="show_arrow"
                />
            </transition>
        </div>
    </div>
</template>

<script>
    import {GOODS_SEARCH} from '@/api/goods';

    import {PRE_SALE_LIST} from "@/api/product";

    import ItemGroup from "@/vue/components/item-group/";
    import IsEmpty from "@/vue/components/is-empty/";
    import ItemCardHori from '@/vue/components/item-card-hori/';
    import NavBar from '@/vue/components/NavBar/';
    import {Search, Tab, Tabs, Collapse, CollapseItem, Tag} from 'vant';
    import SearchBar from '@/vue/components/NavBar/search.vue';

    import loadMore from '@/vue/mixin/list-load-more';
    import scrollFixed from '@/vue/mixin/scroll-fixed';

    export default {
        name: "Item-list",
        props: {
            itemClass: {
                type: [String, Number],
                default: ""
            }
        },

        mixins: [loadMore, scrollFixed],

        data() {
            const shop_id = this.$util.getLocationParam("shop_id");
            return {
                shop_id,
                sortVal: "",
                show_arrow: false,

                // 模拟预售订单列表
                // resaleList: [
                //   {
                //     "goods": "2018091917013202713898_s9",//订单号
                //     "buynum": 1,//商品数量
                //     "summoney": "33.00",//合计金额
                //     "pro_id": 1549, //SKU_id
                //     "pro_pid": 1549, //商品ID
                //     "ptitle": "马博氏[大号]婴儿爬行垫 地垫 游戏垫 26元/套", //商品名称
                //     "sub_title": "26元/套",//副标题
                //     "picpath": "https://img.naifenpifa168.com/upfile/admin/image/20180702/0ed5c45e68f1fdd9d32aac26e3eab5a2.jpg!sm",//商品图片
                //     "spec": "1箱24盒",//商品规格
                //     "spec_title": "口味:有机小米 ",//SKU标题
                //     "wlnumber": ['123456', '789011'], //不为空可以进行物流跟踪
                //     "zt": 9,//订单状态,(1:待出库(可取消订单),2:待发货,3:待收货,4:已完成,9:已取消)
                //     "bz": "",//订单备注
                //     "createdate": "2018-07-03 10:45:28",//下单时间
                //     "zt_tag": "已取消" //订单状态说明
                //   }
                // ],

                span: ['折', '增', '满减', '满赠']
            }
        },

        watch: {
            itemClass(val) {
                this.scrollTop = 0;
                this.resetInit();
            }
        },

        activated() {
            this.eventListen(true);
        },

        deactivated() {
            this.eventListen(false);
        },

        created() {
            this.resetInit();
            this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);

            // 初始化预售订单列表数据
            this.getResaleList();
        },

        methods: {
            initData(loadMore = false) {
                return this.$reqGet(PRE_SALE_LIST, {
                    keyword: this.searchVal,
                    pagesize: this.pages.perPage,
                    page: this.pages.currPage,
                }).then(res => {
                    const {list, hasmore} = res.data;
                    this.items.push(...list);
                    this.has_more = hasmore;
                    return hasmore;
                })
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
            //     this.showArrow = this.$el.scrollTop > 120;
            //   },
            //   backTop() {
            //     this.$el.scrollTop = 0;
            //   },
            backTo() {
                this.$router.back(-1);
            },
            itemClick(id) {
                this.$router.push({name: "detail", params: {itemId: id}});
            },

            // 获取预售订单列表
            getResaleList() {
                // this.$reqGet(ORDER_GOODS_RESALE_LIST).then(
                //   res =>
                //   {
                //     console.log(res);
                //   }
                // )
            },

            getImgExtra(type, id) {
                //获取商品图片上的标签
                if (type === 'sh') {
                    //商品状态（0:下架，1：正常，2：缺货)
                    switch (id) {
                        case 0:
                            return SIM_IMG_EXTRA['under_carriage'];
                        case 2:
                            return SIM_IMG_EXTRA['sold_out'];
                    }
                } else if (type === 'prom_limit') {
                    //秒杀直降
                    switch (id.type) {
                        case 1:
                            return SIM_IMG_EXTRA['spike'];
                        case 2:
                            return SIM_IMG_EXTRA['index_direct'];
                    }
                }
            },
            getImgIcon(type) {
                //获取代发直发
                switch (type) {
                    case 1:
                        //代发
                        return 'yqn_replace'
                    case 2:
                        //直发
                        return 'yqn_straight'
                    default:
                        return false
                }
            },

            viewDetail(id) {
                this.$router.push({name: 'pre_sale_detail', params: {itemId: id}})
            }
        },

        components: {
            [ItemGroup.name]: ItemGroup,
            [ItemCardHori.name]: ItemCardHori,
            [NavBar.name]: NavBar,
            [IsEmpty.name]: IsEmpty,
            [Search.name]: Search,
            [SearchBar.name]: SearchBar
        }
    }
</script>

<style lang="scss" scoped>
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
    }

    .item_list {
        background-color: #f7f7f7;
        padding-top: 1.5rem;
        box-sizing: border-box;
        padding-bottom: 0;
        &_header {
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
        }

        .item_card_single_line {
            margin-top: .4rem;
            padding: 0;
            background-color: #fff !important;
        }

        .item_card_H_wrap {
            width: 100%;
            padding: .32rem 0;

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

            img {
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

            .leftTopIcon {
                position: absolute;
                left: 0;
                top: 0;
                max-width: 50%;
                text-align: left;
            }

            .item_image_desc {
                position: absolute;
                bottom: 0;
                background-color: rgba(244, 133, 145, .8);
                width: 100%;
                color: #fff;
                font-size: $extra-size;
            }

            .item_img_mask {
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
                color: rgba(0,0,0,.3)
            }
        }

        .item_card_info {
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
                height: .56rem;
                vertical-align: middle;
                display: inline-block;
                background-repeat: no-repeat;
            }

            .item_detail_spec {
                /* height: 2.2rem; */
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                /*padding: .36rem .32rem .4rem 0;*/
                /* margin-bottom: .2rem; */

                img {
                    margin-bottom: .24rem;
                }

                &_line {
                    /*height: 1.3rem;*/
                    /*overflow: hidden;*/
                    font-size: $params-title-size;
                    color: $main-title-color;

                    &:nth-child(1) {
                        margin-bottom: .1rem;
                    }

                    span {
                        width: 83%;
                        float: right;
                        height: .64rem;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        /*display: -webkit-box;*/
                        /*-webkit-line-clamp: 2;*/
                        /*-webkit-box-orient: vertical;*/
                        white-space: nowrap;
                        color: $sub-title-color;
                        font-size: $extra-size;

                        @media screen and (max-width: 340px) {
                            width: 80%;
                        }
                    }
                }
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
                border-radius: 3px;
                color: #fff;
                font-size: $tag-size;
                line-height: .52rem;
                text-align: center;
                position: relative;
                bottom: 1px;
            }

            .item_card_info_desc {
                font-size: $extra-size;
                color: $font-color-gray;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
            }

            .item_card_icon img {
                max-height: 100%;
                max-width: 100%;
            }

            .item_card_info_tags {
                margin-top: .08rem;

                span {
                    padding: 0 .08rem;
                    color: $main-color;
                    border: 1px solid $main-color;
                    font-size: $tag-size;
                    border-radius: 3px;
                    margin-left: .12rem;
                }
            }

            .item_card_footer {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-between;
                /* height: 1.84rem; */

                .item_card_footer_left {
                    display: flex;
                    justify-content: space-between;
                    flex-direction: column;

                    .footer_price {
                        margin-top: .2rem;
                        margin-right: .2rem;
                        color: $price-color;
                        font-size: $extra-size;

                        span {
                            font-size: $sub-title-size;
                        }
                    }

                    .footer_price .marketPrice {
                        color: $font-color-gray;
                        font-size: $extra-size;
                        text-decoration: line-through;
                        margin-left: .2rem
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


                .footer_desc {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

    .items_loading {
        margin: 0 auto;
    }

    .backTop {
        position: fixed;
        right: .8rem;
        bottom: .8rem;
        font-size: .96rem;
    }
</style>
