<template>
    <div class="tab_recommend">

        <nav-bar
            title="推荐"
            @back="backTo"
            :no_more="true"
            :left_arrow="false" />
        <div ref="scroll_view" class="scroll_view">
            <van-cell-group>
                <van-cell title="新品" icon="yqn_newgood" class="tab_recommend_newgood" is-link @click="jumpTo" />
                <van-cell title="爆款推荐" icon="yqn_hotRe" class="tab_recommend_cellTitle" />
            </van-cell-group>

            <!-- 下拉刷新 -->
            <van-pull-refresh v-model="isLoading"
                              @refresh="onRefresh">
                <div class="you_like" v-if="goodsGroup">
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
                                v-for="(item, i) in goodsGroup"
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

        <transition name="fade">
            <!-- <van-icon
                      name="arrowupcircle"
                      class="backTop"
                      @click.native="backTop"
                      v-show="showArrow"
                  /> -->
            <img src="../../assets/images/topup.png"
                 alt=""
                 class="yqn-backToTop"
                 @click="backTop"
                 v-show="show_arrow"
            />
        </transition>
    </div>
</template>

<script>
    // import { HOME_module, ALL_GOODS } from '@/api/shop';
    import {GROOM_LIST} from '@/api/product'

    import mx_be_to from "@/assets/images/mx_be_to.png";
    import mx_start from "@/assets/images/mx_start.png";

    import NavBar from "@/vue/components/NavBar/";
    import ItemGroup from "@/vue/components/item-group/";
    import ItemCardDoub from '@/vue/components/item-card-doub/';

    import loadMore from '@/vue/mixin/list-load-more';
    import scrollFixed from '@/vue/mixin/scroll-fixed';

    import {PullRefresh} from 'vant';

    export default {
        mixins: [loadMore, scrollFixed],

        data() {
            const shop_id = this.$util.getLocationParam("shop_id");
            return {
                mx_be_to,
                mx_start,

                isLoading: false, // 下拉刷新是否在加载中

                // 一起牛参数与数据
                show_arrow: false,
                goodsGroup: [],    // 猜你喜欢
            }
        },

        computed: {},

        created() {

            this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);
            this.resetInit();
        },

        activated() {
            this.eventListen(true);
        },

        deactivated() {
            this.eventListen(false);
        },

        methods: {
            initData() {
                return this.$reqGet(GROOM_LIST, {
                    act: '',
                    pagesize: this.pages.perPage,
                    page: this.pages.currPage
                }, {
                    hideLoading: true
                }).then(res => {
                    const {list, hasmore} = res.data;
                    console.log(this.goodsGroup);
                    this.goodsGroup.push(...list);
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

            //   },

            itemClick(id) {
                this.$router.push({name: "detail", params: {itemId: id}});
            },
            //   backTop() {
            //     this.$el.scrollTop = 0;
            //   },
            jumpTo() {
                //跳至商品列表
                this.$router.push({name: 'list', query: {st: '1'}});
            },
            backTo() {
                this.$router.back(-1);
            },

            // 下拉刷新
            onRefresh() {
                this.refresh();
            },

            async refresh() {
                this.pages.currPage = 1;
                const result = await this.initData();
                this.isLoading = false;
                this.$toast({
                    message: '刷新成功',
                });
            },
        },

        components: {
            [ItemGroup.name]: ItemGroup,
            [ItemCardDoub.name]: ItemCardDoub,
            [NavBar.name]: NavBar,
            [PullRefresh.name]: PullRefresh,
        },


        beforeRouteEnter(to, from, next) {
            // ...
            next(vm => {
                if (from.name === 'login' || vm.goodsGroup.length === 0) {
                    vm.pages.currPage = 1;
                    vm.resetInit();
                }
            })
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
    .tab_recommend {
        padding-top: 1.84rem;

        .scroll_view {
            height: 100%;
            overflow-y: auto;
        }

        &_newgood {
            i {
                color: #f0c819;
            }
        }

        &_cellTitle {
            margin-top: .2rem;

            i {
                color: #ed322e;
            }
        }

        .you_like {
            // padding: 0 8px;
        }
    }

    .home_grab {
        padding: 0 .32rem;
    }

    .interval_bot {
        margin-bottom: .4rem;
    }

    .backTop {
        position: fixed;
        right: .8rem;
        bottom: 2.8rem;
        font-size: 24px;
    }
</style>

<style lang="scss">
    .tab_recommend {
        &_newgood {
            i {
                &:nth-child(1) {
                    font-size: 1rem;
                    color: #f0c819;
                }
            }
        }

        &_cellTitle {
            i {
                font-size: 1rem;
                color: #ed322e;
            }
        }

        .van-cell-group {
            background: transparent;
        }

        i.van-cell__right-icon {
            position: relative;
        }
    }
</style>
