<template>
    <div class="buy_coupon_list">
        <nav-bar title="购买优惠券" @back="backTo" />
        <div ref="scroll_view" class="scroll_view">
            <van-list v-model="loading"
                      class="scroll-load"
                      :finished="finished"
                      :immediate-check="false"
                      :offset="100"
                      @load="loadMore">
                <item-group>
                    <item-card-doub class="buy-coupon-detail-info"
                                    v-for="(item, i) in coupons_list"
                                    :key="i"
                                    :goods="item"
                                    @click.native="itemClick(item)">
                    </item-card-doub>
                </item-group>
            </van-list>
        </div>

        <transition name="fade">
            <!-- <van-icon
                      name="arrowupcircle"
                      class="backTop"
                      @click.native="backTop"
                      v-show="showArrow"
                  /> -->
            <img src="../../../assets/images/topup.png"
                 alt="返回顶部按钮"
                 class="yqn-backToTop"
                 @click="backTop"
                 v-show="show_arrow"
            />
        </transition>
    </div>
</template>

<script>
    import NavBar from '@/vue/components/NavBar/';
    import ItemCardDoub from '@/vue/components/item-card-doub/buy_coupon_index.vue';
    import ItemGroup from "@/vue/components/item-group/";

    import {USER_BUY_COUPON_LIST} from '@/api/user.js';

    import scrollFixed from '@/vue/mixin/scroll-fixed';

    export default {
        name: 'buy-coupon-list',

        mixins: [scrollFixed],

        data() {
            return {
                coupons_list: [],
                show_arrow: false
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
            this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);
        },

        methods: {
            initData() {
                this.$reqGet(USER_BUY_COUPON_LIST).then(res => {
                    this.coupons_list.push(...res.data);
                })
            },

            itemClick(item) {
                //点击进入详情页
                if (item.isbuy) {
                    this.$router.push({name: 'buy-coupon-detail', params: {coupon_id: item.id}})
                } else {
                    //如果用户已经购买过则不允许再次购买
                    this.$toast({
                        message: '您已购买过此商品'
                    })
                }

            },

            //   eventListen(isBind = true){
            //         if(isBind){
            //             this.$el.addEventListener("scroll", this.scrollShowArrow)
            //         }else{
            //             this.$el.removeEventListener("scroll", this.scrollShowArrow)
            //         }
            //     },
            //     scrollShowArrow(){
            //         this.showArrow = this.$el.scrollTop > 120;
            //     },

            backTo() {
                this.$router.back(-1);
            },

            //   backTop() {
            //     this.$el.scrollTop = 0;
            //   }
        },

        components: {
            [NavBar.name]: NavBar,
            [ItemCardDoub.name]: ItemCardDoub,
            [ItemGroup.name]: ItemGroup
        }
    }
</script>

<style lang="scss" scoped>
    .buy_coupon_list {
        padding-bottom: 0;

        .scroll_view {
            height: 100%;
            overflow-y: auto;
        }

        padding-top: 1.84rem;
    }
</style>
