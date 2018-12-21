<template>
  <div class="tabbar-user">
    <div ref="scroll_view">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="35">
      <user-header @showserver='updataserver' :isLogin="is_login" :index_info="index_info"/>
      <user-model :index_info="index_info"/>
      <order-group
        v-for="(item,index) in orderGroup"
        :key="index"
        :list="item"
        :index_info="index_info"
        @service="service_call"
        @focusWechat="popupWechat"
      />
      <!-- <ecoupon-group /> -->
      <!-- <user-module /> -->
      <!-- <van-button  size="large" class="tabbar-user__quit" v-if="isLogin" @click="quit">退出当前账户</van-button> -->
      <div class="you_like" v-if="goodsGroup.setting">
        <home-title
          :title="goodsGroup.setting.title"
          :sub_title="goodsGroup.setting.sub_title"
          :more="goodsGroup.setting.more"
        />
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
            ></item-card-doub>
          </item-group>
        </van-list>
      </div>




    </van-pull-refresh>

    <transition name="fade">
        <!-- <van-icon
				name="arrowupcircle"
				class="backTop"
				@click.native="backTop"
				v-show="show_arrow"
        />-->
        <img
          src="../../assets/images/topup.png"
          alt
          class="yqn-backToTop"
          @click="backTop"
          v-show="show_arrow"
        >
      </transition>
      </div>
       <!-- 消息授权二维码弹出框 -->
      <van-popup v-model="show_Official_accounts">
        <div class="tabbar-user_follow">
          <span>长按二维码关注公众号</span>
          <div class="imgbox">
            <div class="imgmask">
              <span>点击重新获取</span>
            </div>
            <img src="../../assets/images/yqn_download_ewm.png" alt>
          </div>
          <div>
            <countdown :time="180000">
              <template slot-scope="props">{{props.minutes*60 + Number(props.seconds)}}</template>
            </countdown>秒后此二维码过期
          </div>
          <div class="btn_follow">
            确定
          </div>
        </div>
      </van-popup>
      <van-popup v-model="show_service" position="bottom" class="user_header_service_popup">
            <div class="user_header_show_service" v-if="index_info">
                <span @click="calltel('400-801-5562')">热线电话：400-801-5562</span>
                <span @click="calltel(index_info.yg_mobile)">专属客服：{{index_info.yg_name}}（{{index_info.yg_mobile}}）</span>
                <span @click="updataserver">取消</span>
            </div>
    </van-popup>
  </div>
</template>

<script>
import userHeader from "./tabbar-user-header";
import userModel from "./tabbar-user-model";
import orderGroup from "./tabbar-user-order";
import ecouponGroup from "./tabbar-user-ecoupon";
import userModule from "./tabbar-user-module";
import HomeTitle from "@/vue/components/home-title/";
import ItemCardDoub from "@/vue/components/item-card-doub/";
import ItemGroup from "@/vue/components/item-group/";
import loadMore from "@/vue/mixin/list-load-more";
import scrollFixed from "@/vue/mixin/scroll-fixed";
import { PullRefresh,Popup } from "vant";

import { USER_INDEX_INFO, USER_OPENID_SET, USER_BIND_EDIT } from "@/api/user";
import { GROOM_LIST } from "@/api/product";
import { USERS_CONFIG } from "@/config.js";

export default {
  mixins: [loadMore, scrollFixed],
  data() {
    return {
      isLoading: false,
      is_login: false,
      orderGroup: [], //图标按钮组,  myList: 我的订单,preList: 我的预售订单,myService: 我的服务,myPoints: 我的积分
      goodsGroup: {}, //猜你喜欢
      loading: false,
      show_arrow: false,
      index_info: null, //用户-首页信息
      show_Official_accounts: false, //消息授权（二维码弹出框）
      show_service:false   //客服弹窗
    };
  },

  created() {
    console.log(this)
    this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);
    // this.$reqGet(USER_PROFILE).then((res)=>{
    //     return res.data.data
    // }).then((json)=>{
    //     let orderGroup = [];
    //     orderGroup.push(json['myList'],json['preList'],json['myService'],json['myPoints']);
    //     this.orderGroup = orderGroup;
    //     Object.assign(this.goodsGroup,json['goods']);
    //     // this.goodsGroup = json['goods'];
    // })

    let version = this.$util.checkTheTerminal();
    if(version === 'WeChat'){
        let code=window.location.href.split('=')[1];
        if(code){
            this.$reqPost(USER_OPENID_SET,{
                code:code
            }).then(res=>{
                this.$reqPost(USER_BIND_EDIT,{}).then(res=>{
                    localStorage.setItem('Authorization',res.data.authorization)
                    let url=window.location.origin;
                    window.location.href=`${window.location.origin}/#/user`
                })
            })
        }

    }

    //将页面结构化，可配置化
    let json = USERS_CONFIG;
    let orderGroup = [];
    orderGroup.push(
      json["myList"],
      json["preList"],
      json["myService"],
      json["myPoints"]
    );
    this.orderGroup = orderGroup;
    Object.assign(this.goodsGroup, json["goods"]);

    //用户-首页信息
    this.$reqGet(USER_INDEX_INFO).then(res => {
      this.index_info = res.data;
      //修改我的订单-图标info
      //待付款
      this.$set(this.orderGroup[0]["children"][0], "info", res.data.goods_pay);
      //待发货
      this.$set(this.orderGroup[0]["children"][1], "info", res.data.goods_send);
      //待收货
      this.$set(this.orderGroup[0]["children"][2], "info", res.data.goods_take);
      //修改我的服务-图标info
      //优惠券
      this.$set(
        this.orderGroup[2]["children"][0],
        "info",
        res.data.coupon_count
      );
    });

    this.resetInit();
  },

  activated() {
    this.getLoginStatus();
    this.eventListen(true);
  },

  deactivated() {
    this.eventListen(false);
  },

  methods: {
    initData(loadMore = false) {
      return this.$reqGet(
        GROOM_LIST,
        {
          pagesize: this.pages.perPage,
          page: this.pages.currPage,
          act: ""
        },
        {
          hideLoading: true
        }
      ).then(res => {
        const { list, hasmore } = res.data;
        this.goodsGroup.items.push(...list);
        this.has_more = hasmore;
        return hasmore;
      });
    },
    quit() {
        localStorage.removeItem('Authorization');
        this.$util.removeLocalStorage(
            "Authorization",
            "user_id",
            "avatar",
            "background_image",
            "nick_name"
        );
        this.$router.push({ name: "login" });
    },
    getLoginStatus() {
      this.is_login =
        !!localStorage.getItem("Authorization") &&
        !!localStorage.getItem("user_id");
    },
    itemClick(id) {
      this.$router.push({ name: "detail", params: { itemId: id } });
    },
    // eventListen(isBind = true) {
    //   if (isBind) {
    //     this.$el.addEventListener("scroll", this.scrollShowArrow);
    //   } else {
    //     this.$el.removeEventListener("scroll", this.scrollShowArrow);
    //   }
    // },
    // scrollShowArrow() {
    //   this.show_arrow = this.$el.scrollTop > 120;
    // },
    service_call() {
      //服务电话
    },
    updataserver(data){
      //客服弹窗
      console.log(1111,data)
      this.show_service=!this.show_service
    },
    popupWechat() {
      //弹出消息授权的微信二维码弹出框
      this.show_Official_accounts = !this.show_Official_accounts;
    },
    // backTop() {
    //   //回到顶部
    //   this.$el.scrollTop = 0;
    // },
    onRefresh() {
      // 下拉刷新
      this.pages['currPage'] = 1;
      //用户-首页信息
      this.$reqGet(USER_INDEX_INFO).then(res => {
        this.index_info = res.data;
        //修改我的订单-图标info
        //待付款
        this.$set(
          this.orderGroup[0]["children"][0],
          "info",
          res.data.goods_pay
        );
        //待发货
        this.$set(
          this.orderGroup[0]["children"][1],
          "info",
          res.data.goods_send
        );
        //待收货
        this.$set(
          this.orderGroup[0]["children"][2],
          "info",
          res.data.goods_take
        );
        //修改我的服务-图标info
        //优惠券
        this.$set(
          this.orderGroup[2]["children"][0],
          "info",
          res.data.coupon_count
        );
      });

      this.refresh();
    },

    async refresh(){
      const result = await  this.resetInit();
      this.$toast("刷新成功");
      this.isLoading = false;
    },
  
    calltel(data){
      window.location.href=`tel:${data}`
    }
  },

  components: {
    [userHeader.name]: userHeader,
    [userModel.name]: userModel,
    [orderGroup.name]: orderGroup,
    [ecouponGroup.name]: ecouponGroup,
    [userModule.name]: userModule,
    [HomeTitle.name]: HomeTitle,
    [ItemCardDoub.name]: ItemCardDoub,
    [ItemGroup.name]: ItemGroup,
    [PullRefresh.name]: PullRefresh,
    [Popup.name]: Popup
  },

  beforeRouteEnter (to, from, next) {
    // ...
    next(vm=>{

      if(vm.goodsGroup.length === 0){
        vm.pages.currPage = 1;
        vm.resetInit()
      }
    })
  },

  beforeRouteLeave (to, from, next) {
      // ...
      if(to.name !== 'detail') {
          this.$destroy();
      }

      next();
  }
};
</script>

<style lang="scss" scoped>
.tabbar-user {
  > div {
      &:nth-child(1) {
        margin-bottom: 0.4rem;
        height: 100%;
        overflow-y: auto;
      }

  }
  > div:nth-child(1) {
    margin-bottom: 0;
  } 
  // &__quit {
  // 		border: 0;
  // 		border-radius: 0;
  // }
  ._home_title {
    padding: 0 0.32rem;
  }
  &_follow {
    display: flex;
    align-content: center;
    flex-direction: column;
    align-items: center;
    text-align: center;
    .imgbox{
      position: relative;
      width: 80%;
      border: 1px solid #999999;
      img{
        width: 100%;
        border-radius:2px;
      }
    }
    .imgmask{

      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.7);
      display: flex;
      align-content: center;
      align-items: center;
      display: none;
      span{
        color: #000;
        padding: 4px;
        background: #fff;
        border-radius: 3px;
        margin: 0 auto;
      }

    }
    span{
      padding: .8rem 0;
    }

    .btn_follow{
      color: #FF6600;
      font-size: $font-size-big;
      padding: .4rem 0;
    }
  }
}
</style>

<style lang="scss">
@import '../../assets/scss/_var';
@import "../../assets/scss/mixin";
.tabbar-user {
  .van-pull-refresh {
  background-image: url("../../assets/images/pull_down_bg.png");
  background-position:top center;
  background-repeat: no-repeat;
  background-size: 100% 7.45rem;
  .van-pull-refresh__head {
    color: #fff !important;
    .van-pull-refresh__text {
      color: #fff !important;
    }
  }
}
}

  .user_header_show_service{
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

</style>

<style lang="scss">

</style>
