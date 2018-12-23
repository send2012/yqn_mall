<template>
  <!-- 一行两个 -->
  <div class="item_card_D_wrap">
    <div class="item_card_image" @click="OnClick">
      <div v-if="$slots.leftTopIcon" class="leftTopIcon">
        <!-- 左上角icon -->
        <slot name="leftTopIcon"></slot>
      </div>

      <div v-if="$slots.mask" class="item_img_mask">
        <!-- 图片上标识 -->
        <slot name="mask"></slot>
      </div>
      <!-- 商品图片 -->
      <img v-lazy="goods.picpath || goods.pics">

      <!-- 左上角大促狂欢购 -->
      <!-- <img :src="require('../../../assets/images/'+ getImgExtra('promotion') +'.png')" alt="" class="item_card_image_pro" v-if="goods.prom_large && goods.prom_large.length !== 0"/> -->
      <img :src="goods.prom_large.picsm" alt="" class="item_card_image_pro" v-if="goods.prom_large && !(goods.prom_large instanceof Array)"/>

      <!-- 左下角直发代发 -->
      <van-icon v-if="goods.owner" :name="getImgIcon(goods.owner)" class="item_card_image_icon"/>

      <!-- 右下角秒杀直降 -->
      <span class="item_card_image_spike" v-if="goods.prom_limit && goods.prom_limit.length !== 0">
                <span class="item_card_image_spike_text">距{{goods.prom_limit.type === 1?'秒杀':'直降'}}结束：</span>
                    <countdown :time="getCountDownTime(goods.prom_limit.enddate)">
                        <template slot-scope="props">
                            {{ props.days*24 + Number(props.hours) }}:{{ props.minutes }}:{{ props.seconds }}
                        </template>
                    </countdown>
            </span>

      <!-- 图片详情 -->
      <div class="item_image_desc">{{goodsStatusToMe}}</div>
    </div>
    <div :class="goods.point?'item_point_name':'item_card_name'" @click="OnClick">
      <!-- 商品名称 -->
      <span v-if="$slots.icon" class="item_card_icon"><slot name="icon"></slot></span>
      <span class="goods_title_sh" v-if="goods.sh === 0">缺货</span>
      <span class="goods_title_sh" v-if="goods.sh === 2">已下架</span>
      <span class="goods_title_tag" v-if="goods.owner === 0">自营</span>
      <span v-if="goods.point && !goods.coupon_id">【积分兑换】</span>
      {{goods.title + ' ' + goods.subtitle + ' ' + goods.spec}}
    </div>
    <div v-if="$slots.goodDesc" class="item_card_action">
      <!-- 商品详情 -->
      <slot name="goodDesc"></slot>
    </div>
    <div v-if="!goods.point && goods.point !== 0">
      <!-- 非积分，普通商品形态 -->
      <!-- <div class="item_card_proDesc_tags">
        <span class="item_card_proDesc_tags_item" v-for="(item,index) in goods.prom_tags" :key="index">{{item}}</span>
       
      </div> -->
      <!-- <div class="item_card_proDesc_tags">
          <span class="item_card_proDesc_tags_item" v-for="(item,index) in span" :key="index">{{item}}</span>
      </div> -->
      <div class="item_card_proDesc">
        <span class="item_card_proDesc_price">￥{{goods.min_price | show_price(goods.max_price)}}</span>

      </div>
      <div class="item_card_sumSale">
        热度：{{goods.sum_sale}} 
        <span class="item_card_proDesc_tags_item" v-for="(item,index) in goods.prom_tags" :key="index">{{item}}</span>
      </div>
    </div>
    <!-- <div class="item_card_action">
            <div class="item_card_action_point">

                <span class="item_card_price_title">积分：</span><div class="item_card_price">{{goods.sales_price | yuan}}</div>
            </div>
            <van-button type="warning" size="mini" @click="exchange">立即兑换</van-button>
        </div> -->

  </div>
</template>


<script>
  import item_mix from '@/vue/mixin/item-card';
  import { Button } from 'vant'
  import { IMG_EXTRA } from '@/config.js'
  export default {
    name: "item-card-doub",
    mixins: [item_mix],
    data() {
      return {
        span: ['折','增','满减','满赠']
      }
    },
    components: {
      [Button.name]: Button
    },
    methods: {

      exchange() {
        this.$router.push({name: 'user-point-mall-order'})
      },
      getImgExtra(type) {
        //获取商品图片上的标签
        return IMG_EXTRA[type]
      },
      getImgIcon(type) {
        //获取代发直发
        switch(type){
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
      getCountDownTime(stamp) {
        //获取倒计时的秒数
        if(stamp) {
          //属于秒杀直降活动
          let nowStamp = this.goods.prom_limit.nowdate;
          let countDownTime = (stamp - nowStamp) * 1000;
          return countDownTime;
        }
      }
    }
  }

</script>

<style lang="scss" scoped>

  @import '../../../assets/scss/_var.scss';

  .item_card_D_wrap {
    min-height: 11rem;
    overflow: hidden;
    background: #fff;
    display: block;
    flex: 0 0 50%;
    width: 50%;
    padding: 0 0 10px 0;
    margin: 0 0 1px;
    position: relative;

    .item_card_proDesc {
      padding: 5px 8px;
      display: flex;
      overflow: hidden;
      &_price {
        display: inline-block;
        color: $price-color;
        font-size: $main-title-size;
        font-weight: 400;
        margin-right: 6px;
      }
      &_tags {
        padding-top: 2px;
        display: inline-block;
        white-space: nowrap;
        &_item {
          padding: 0 2px;
          color: $main-color;
          border: 1px solid $main-color;
          font-size: $tag-size;
          border-radius:3px;
          margin-left: 3px;
        }
      }
    }

    .item_card_sumSale {
      padding-left: 9px;
      font-size: $extra-size;
      color: $sub-title-color;
    }

    .goods_title_sh {
      position: relative;
    //   display: inline-block;
      overflow: hidden;
      padding: 0 .14rem;
      background: $explain-text-color;
      border-radius: 3px;
      line-height: .52rem;
      color: #fff;
      font-size: $tag-size;
      text-align: center;
      bottom: 1px;
    }

    .goods_title_tag {
    //   display: inline-block;
      height: .52rem;
      overflow: hidden;
      padding: 0 .14rem;
      background: $price-color;
      border-radius: 3px;
      color: #fff;
      font-size: $tag-size;
      line-height: .52rem;
      text-align: center;
      position: relative;
      bottom: 1px;
    }
  }

  .item_card_D_wrap::after {
    content: "";
    pointer-events: none; /* 防止点击触发 */
    box-sizing: border-box;
    position: absolute;
    width: 200%;
    height: 200%;
    left: 0;
    top: 0;
    // border-radius: 8px;
    border:1px solid #f2f2f2;
    border-top: 0;
    border-bottom: 0;
    -webkit-transform:(scale(0.5));
    -webkit-transform-origin: 0 0;
    transform:(scale(0.5));
    transform-origin: 0 0;
  }


  .item_card_image {
    position: relative;
    width: 100%;
    height: 7.2rem;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    text-align: center;
    .leftTopIcon{
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      max-width: 50%;
      text-align: left;
    }
    img{
      display: inline-block;
      max-height: 100%;
      max-width: 100%;
    }
    &_pro {
      width: 1.56rem;
      height: auto;
      position: absolute;
      top: .56rem;
      left: 0;
    }
    &_icon {
      font-size: 21px;
      position: absolute;
      left: .24rem;
      bottom: 0;
      color: rgba(0, 0, 0, .3)
    }
    &_spike {
      height: .72rem;
      line-height: .72rem;
      position: absolute;
      right: 0;
      bottom: 0;
      color: #fff;
      font-size: $extra-size;
      background: $main-title-color;
      border-radius:10px 0px 0px 0px;
      padding: 0 6px;
      display: flex;
      align-items: center;
      &_text {
        font-size: $tag-size;
      }
    }
    .item_image_desc{
      position: absolute;
      bottom: 0;
      background-color: rgba(244,133,145, .8);
      width: 100%;
      color: #fff;
      font-size: $extra-size;
    }
    .item_img_mask{
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 2;
      transform: translate(-50%, -50%);
      width: 2.8rem;
      height: 2.8rem;
      overflow: hidden;
    }
  }


  .item_card_name {
    padding: 0 6px;
    line-height: .8rem;
    // height: 1.25rem;
    font-size: $product-title-size;
    color: $main-title-color;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    box-sizing: border-box;
    // text-align: center;
  }

  .item_point_name {
    padding: 0 6px;
    line-height: .8rem;
    // max-height: 1.25rem;
    font-size: $product-title-size;
    color: $main-title-color;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    // text-align: center;
  }

  .item_card_icon {
    width: 1.2rem;
    height: .56rem;
    vertical-align: middle;
    display: inline-block;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .item_card_icon img{
    max-height: 100%;
    max-width: 100%;
  }

  .isHaiTao{
    background-image: url(http://www-dev.mamaqunaer.com/images/common/icon_menu_bdt.png);
  }

  .item_card_action {
    padding: 0 5px;
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    .item_card_action_point {
      display: flex;

      .item_card_price_title {
        font-size: $extra-size;
      }
      .item_card_price{
        display: inline-block;
        text-align: center;
        color: $price-color;
      }
    }


    .exchange {
      width: 3.2rem;;
      height: .8rem;
      span {
        width: 2rem;
        line-height: .8rem;
        font-size: $extra-size;
      }
    }
  }




</style>

<style lang="scss">
  @import '../../../assets/scss/_var.scss';
  .exchange {
    span {
      position: absolute;
      width: 100%;
      line-height: .8rem;
      font-size: $extra-size;
      top: 0;
      left: 0;
    }
  }
</style>
