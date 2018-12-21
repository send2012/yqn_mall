<template>
  <div class="order_list">

    <nav-bar
      title="我的优惠券"
      @back="backTo"
    />
    <div class="order_list_tabs">
    <van-tabs
      sticky
      :active="activeIndex"
      :swipe-threshold="4"
      @click="handleTabClick"
    >
      <van-tab
        v-for="tab in tabsItem"
        :title="tab.name"
        :key="tab.type"
      >
      </van-tab>
    </van-tabs>
    </div>
    <div
      ref="scroll_view"
      class="scroll_view"
    >
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        :offset="100"
        @load="loadMore"
        class="coupon_list"
      >

        <yqn-coupon
          v-for="(el, i) in items"
          :key="i"
          :img_src="getImgBg(el)"
          :data="el"
          @useCoupon="useCouponNow"
        />
        <!-- <van-panel
                v-for="(el, i) in items"
                class="order_list--panel"
                :key="el.id"
                :title="'订单编号: ' + el.id"
                :status="getStatusText(el.status)"
            >
                <div>
                    <van-card
                        v-for="(goods, i) in el.serviceItems"
                        class="order_list--van-card"
                        :key="i"
                        :title="goods.item_name"
                        :desc="goods.sku_props_str"
                        :num="goods.quantity"
                        :price="(goods.price / 100).toFixed(2)"
                        :thumb="goods.pic_url"
                    />
                    <div class="order_list--total">
                        合计: {{el.total_fee | yuan}}（含运费{{el.post_fee | yuan}}）
                    </div>
                </div>
                <component
                    slot="footer"
                    :is="'status' + el.status"
                    @delete-order="delOrder(i)"
                    @pay="toPay(el.id)"
                    @cancel="cancelOrder(i)"
                />
            </van-panel> -->
      </van-list>

      <is-empty v-if="isEmpty">
        <div class="is-empty">
          <span class="is-empty_text">哎呀！暂无优惠券</span>
        </div>
      </is-empty>
      </van-pull-refresh>
    </div>

    <!-- 购买优惠券 -->
    <router-link
      class="buy-more-coupons"
      to="/user/buy-coupon-list"
    >
      <section class="buy-more-coupons-image">
        <img
          src="../../../assets/images/user/user_buy_ticket.png"
          alt="购买更多优惠券"
        >
      </section>
    </router-link>
  </div>
</template>

<script>
import { COUPON_USERS_LIST } from "@/api/coupon";

import { Tab, Tabs, Panel, Card, PullRefresh } from "vant";
import IsEmpty from "@/vue/components/is-empty/";
import Coupon from "@/vue/components/coupon/";
import NavBar from "@/vue/components/NavBar/";
import status10 from "./handle-status-10";
import status40 from "./handle-status-40";
import status60 from "./handle-status-60";
import status70 from "./handle-status-70";
import status100 from "./handle-status-100";
import status110 from "./handle-status-110";
import status120 from "./handle-status-120";

import loadMore from "@/vue/mixin/list-load-more";
import scrollFixed from "@/vue/mixin/scroll-fixed";

//引入底层图片
import FREIGHT_IMG from "@/assets/images/user/mine_icon_Ticket_freight.png";
import DEFAULT_IMG from "@/assets/images/user/mine_icon_Ticket_default.png";
import DISABLED_IMG from "@/assets/images/user/mine_icon_Ticket_disabled.png";

const STATUS_TEXT = {
  0: "未开始",
  10: "待付款",
  40: "已完成",
  60: "已关闭",
  70: "已关闭",
  100: "待使用",
  110: "已使用",
  120: "已过期"
};

const IMGS = {
  3: DISABLED_IMG,
  0: DEFAULT_IMG,
  1: DISABLED_IMG,
  2: DISABLED_IMG
};

export default {
  name: "order-list",

  mixins: [loadMore, scrollFixed],

  props: {
    status: {
      type: [String, Number],
      default: 0
    }
  },

  data() {
    const activeIndex = this.status;
    const shop_id = this.$util.getLocationParam("shop_id");
    return {
      shop_id,
      activeIndex,
      isEmpty: false,
      items: [],
      isLoading:false,
      tabsItem: [
        {
          name: "未开始",
          status: 3
        },
        {
          name: "待使用",
          status: 0
        },
        {
          name: "已使用",
          status: 1
        },
        {
          name: "已过期",
          status: 2
        }
      ]
    };
  },

  watch: {
    $route: "resetInit"
  },

  created() {
    this.resetInit();
  },

  methods: {
    initData() {
      const i = this.status;
      const status = this.tabsItem[i].status;
      return this.$reqGet(
        COUPON_USERS_LIST,
        {
          pagesize: this.pages.perPage,
          page: this.pages.currPage,
          zt: status
        },
        {
          hideLoading: true
        }
      ).then(res => {
        const { list, hasmore } = res.data;
        this.items.push(...list);
        if (list.length === 0) this.isEmpty = true;
        this.has_more = hasmore;
        return hasmore;
      });
    },
    delOrder(i) {
      this.$dialog.confirm({ message: "确定删除订单?" }).then(() => {
        this.items.splice(i, 1);
        this.$toast("已删除");
      });
    },
    async cancelOrder(i) {
      const id = this.items[i].id;
      this.$dialog
        .confirm({ message: "确定要取消该订单吗?" })
        .then(() => {
          this.items.splice(i, 1);
          this.$toast("已取消该订单");
        })
        .catch(() => {});
    },
    toPay(id) {
      this.$router.push({ name: "payment", params: { order_id: id } });
    },

    onRefresh() {
      // 下拉刷新
        this.refresh()
    },
     async  refresh (){
        this.pages.currPage=1;
        const result = await this.resetInit();
        this.isLoading = false;
        this.$toast({
            message:'刷新成功'
        })
    },

    handleTabClick(index) {
        //标记已经改变过路由
        this.change_route = true;
      this.$router.replace({
        name: "user-order-ele-list",
        params: { status: index }
      });
    },
    getStatusText(status) {
      return STATUS_TEXT[status] || "";
    },
    getImgBg(el) {
      if (el.zt === 1 || el.zt === 2) {
        return DISABLED_IMG;
      } else {
        if (el.type === 0) {
          return DEFAULT_IMG;
        } else {
          return FREIGHT_IMG;
        }
      }
      return IMGS[status] || "";
    },
    useCouponNow(id) {
        if(id === 'all') {
            //跳转至全部商品列表
            this.$router.push({name: 'list', query: {cou_id: ""}})
        }else {
            //跳转至部分商品列表
            this.$router.push({name: 'list', query: {cou_id: id}})
        }
    },
    backTo() {
      this.$router.back(-1);
    }
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Panel.name]: Panel,
    [Card.name]: Card,
    [IsEmpty.name]: IsEmpty,
    [Coupon.name]: Coupon,
    [NavBar.name]: NavBar,
    [PullRefresh .name]: PullRefresh ,
    status10,
    status40,
    status60,
    status70,
    status100,
    status110,
    status120
  },

  beforeRouteEnter (to, from, next) {
    // ...
    next()
  },

  beforeRouteLeave (to, from, next) {
      // ...
        this.$destroy();
        next();
  }

};
</script>

<style lang="scss" scoped>
.scroll_view {
  height: 100%;
  overflow-y: auto;
}
.order_list {
  padding-top: 46px;
  padding-bottom: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: scroll;
  &_tabs {
    position: fixed;
    top: 46px;
    width: 100%;
    z-index: 2000;
  }
  .coupon_list {
    padding: 46px 8px 2rem;
  }

  .is-empty {
    width: 100%;
    display: flex;
    flex-direction: column;

    &_text {
      color: $explain-text-color;
      font-size: $sub-title-size;
    }

    div {
      padding: 0.4rem 0;
    }

    &_btn {
      display: inline-block;
      border: 1px solid $main-color;
      border-radius: 3px;
      color: $main-color;
      font-size: $product-title-size;
      width: 3.12rem;
      height: 1.32rem;
      line-height: 1.32rem;
      text-align: center;
    }
  }

  .buy-more-coupons {
    position: fixed;
    right: 0;
    bottom: 1rem;

    &-image {
      width: 4.56rem;
      height: 1.76rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
<style lang="scss">
  .coupon_item_data_desc_desc{
    height:.8rem !important;
  }

  .coupon_item_data_desc_desc_area{
    overflow: hidden;
    white-space:nowrap;
  }
</style>