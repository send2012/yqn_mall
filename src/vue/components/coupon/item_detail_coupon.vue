<template>
	<div class="coupon_item">
		<img :src="img_src" alt="">
        <div class="coupon_item_data">
            <div class="coupon_item_data_title">
                <span class="coupon_item_data_title_price">
                    ￥<span class="coupon_item_data_title_price_value">{{data.money}}</span>
                </span>
                <span class="coupon_item_data_title_msg">满{{data.minmoney}}元可用</span>
            </div>
            <div class="coupon_item_data_desc">
                <span class="coupon_item_data_desc_title">
                    <span :class="data.type === 0?'coupon_item_data_desc_title_blueIcon':'coupon_item_data_desc_title_redIcon'">{{data.type === 0?'优惠券':'运费券'}}</span>
                    <span class="coupon_item_data_desc_title_title">{{data.title}}</span>
                </span>
                <span class="coupon_item_data_desc_special" v-if="data.ignore_day">大促期间不可用</span>
                <span class="coupon_item_data_desc_desc">
                    <span class="coupon_item_data_desc_desc_area">
                        <span>{{data.all === 0?'仅限部分':'全平台'}}商品可用</span>
                    </span>
                    <!-- <span :class="'coupon_item_data_desc_desc_btn '+ getBtnColor(data.zt)">立即使用</span> -->
                    <span class='coupon_item_data_desc_desc_btn coupon_item_data_desc_desc_get' v-if="data.zt === 0" @click="getCoupon(data.id)">点击领取</span>
                    <span class='coupon_item_data_desc_desc_btn' v-if="data.zt === 1" @click="jumpTo(data.id)">立即使用</span>
                </span>
                <span class="coupon_item_data_desc_date">{{data.startdate + ' ~ ' + data.enddate}}</span>
            </div>
        </div>
        <!-- <img :src="stamp_used" alt="" class="stamp_used" v-if="data.zt === 1"> -->
	</div>
</template>

<script>

    import Stamp from  "@/assets/images/user/coupon_used.png"
 
	export default {
		name: 'yqn-coupon',
		
		props: {
            img_src: String,
            data: {
                type: Object,
                default: () => {}
            }
		},

		data() {
			
			return {
                stamp_used: Stamp
			}
		},
		
		watch: {
			
		},

		created() {
			
		},
		
		methods: {
			getBtnColor(status) {
                // switch(status) {
                //     case 3:
                //         return "coupon_item_data_desc_desc_grey";
                //     case 0: 
                //         return "coupon_item_data_desc_desc_orange";
                //     case 1:
                //         return "coupon_item_data_desc_desc_display";
                //     case 2: 
                //         return "coupon_item_data_desc_desc_display";
                //     default: 
                //         return " "
                // } 
            },
            getCoupon(id) {
                //领取优惠券
                this.$emit('toGetCoupon',id);
            },
            jumpTo(id) {
                //立即使用
                this.$router.push({name: 'list', query:{cou_id: id}})
            }
		},
		components: {
			
		}
	}

</script>

<style lang="scss" scoped>
@import "../../../assets/scss/_var.scss";

.coupon_item {
    width: 100%;
    margin-top: 5px;
    position: relative;
    img {
        display: inline-block;
        width: 100%;
        height: auto;
    }
    &_data {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        &_title {
            width: 35%;
            padding: 2% 0 5%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            &_price {
                display: block;
                font-size: $product-title-size;
                &_value {
                    font-size: 27px;
                }
                padding-bottom: 5px;
            }
            &_msg {
                display: block;
                font-size: $product-title-size;
            }

        }
        &_desc {
            width: 60%;
            padding: 6px 10px 8px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            &_title {
                font-size: $tag-size;
                height: 1.32rem;
                &_blueIcon {
                    padding: 3px 5px;
                    border-radius: 4px;
                    // background: linear-gradient(to right ,#66CECD , #81DEDD)!important;
                    background: #3E9CE5;
                    color: #fff;
                }
                &_redIcon {
                    padding: 3px 5px;
                    border-radius: 4px;
                    // background: linear-gradient(to right ,#EF615B , #FB7B74)!important;
                    background: #FF7B75;
                    color: #fff;
                }
                &_title {
                    color: $main-title-color;
                    font-size: $params-title-size;
                }
            }
            &_special {
                padding: .08rem .2rem;
                width: 3.32rem;
                border: 1px solid #FF0000;
                border-radius: .32rem;
                color: #FE0101;
                position: relative;
                bottom: .21rem;
                font-size: $tag-size;
                text-align: center;
                line-height: .6rem;

              @media screen and (max-width: 398px)
              {
                width: 4rem;
                bottom: .15rem;
              }
            }
            &_desc {
                font-size: $tag-size;
                display: flex;
                justify-content: space-between;
                &_area {
                    color: $sub-title-color;
                    position: relative;
                    width: 3.2rem;
                    span {
                        display: inline-block;
                        position: absolute;
                        bottom: 0;
                    }

                  @media screen and (max-width: 398px)
                  {
                    width: 4rem;
                    bottom: .1rem;
                  }
                }
                &_btn {
                    display: inline-block;
                    border: 1px solid $main-color;
                    border-radius: 3px;
                    outline: none;
                    color: $main-color;
                    background: #fff;
                    line-height: .8rem;
                    height: .8rem;
                    width: 2.72rem;
                    font-size: $params-title-size;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                &_orange {
                    border: 1px solid #f60;
                    color: #ff6600;
                }

                &_grey {
                    border: 1px solid #ccc;
                    color: #ccc;
                }

                &_display {
                    display: none;
                }

                &_get {
                    background:linear-gradient(90deg,rgba(255,102,0,1) 0%,rgba(254,121,56,1) 100%);
                    color: #fff;
                }
            }
            &_date {
                line-height: .88rem;
                height: 1rem;
                border-top: 1px solid #e6e6e6;
                color: $sub-title-color;
                font-size: $tag-size;
            }
        }
    }

    .stamp_used {
        width: 2rem;
        height: auto;
        position: absolute;
        z-index: 10;
        bottom: 4px;
        right: 0;
    }
}

</style>
