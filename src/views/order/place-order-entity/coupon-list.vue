<template>
	<div class="order_list">

        <nav-bar
            title="选择优惠券"
            @back="backTo"/>

		<van-tabs
			sticky
            :offset-top="46"
			:active="activeIndex"
			:swipe-threshold="2"
			@click="handleTabClick"
		>
			<van-tab title="可用券" class="order_list_coupon">

                <van-checkbox-group v-model="result" v-if="coupon_list['cous']">
                    <van-checkbox
                        v-for="(el, i) in coupon_new['cous']"
                        :key="el.id"
                        :name="el.id"
                        :disabled="el.checked === 0"
                        @click.native="changeCheckCoupon(el)"
                    >
                        <yqn-coupon
                            :key="i"
                            :img_src="getImgBg(el)"
                            :data="el" />

                    </van-checkbox>
                </van-checkbox-group>


                <is-empty v-if="cousIsEmpty" >
                    <div class="is-empty">
                        <span class="is-empty_text">哎呀！暂无优惠券</span>
                    </div>
                </is-empty>

			</van-tab>

            <van-tab title="不可用券" class="order_list_no_coupon">

                <yqn-coupon
                    v-for="(el, i) in coupon_new['cous_no']"
                    :key="i"
                    :img_src="getImgBg(el)"
                    :data="el" />


                <is-empty v-if="cousNoIsEmpty">
                    <div class="is-empty">
                        <span class="is-empty_text">哎呀！暂无优惠券</span>
                    </div>
                </is-empty>

			</van-tab>
		</van-tabs>

        <van-submit-bar
            :price="price*100"
            button-text="确定"
            :label="'已选择' + result.length + '张，抵扣'"
            @submit="onSubmit"
        />

	</div>
</template>

<script>
	import { PRO_SUBCHANGE } from '@/api/cart';

	import { Tab, Tabs, Panel, Card, SubmitBar, Checkbox, CheckboxGroup } from 'vant';
    import IsEmpty from "@/vue/components/is-empty/";
    import Coupon from "@/vue/components/coupon/cart_coupon"
    import NavBar from "@/vue/components/NavBar/"

	// import loadMore from '@/vue/mixin/list-load-more';
    // import scrollFixed from '@/vue/mixin/scroll-fixed';

    //引入底层图片
    import FREIGHT_IMG from "@/assets/images/cart/cart_ticket_ship.png";
    import DEFAULT_IMG from "@/assets/images/cart/cart_ticket_default.png";
    import DISABLED_IMG from "@/assets/images/cart/cart_ticket_disabled.png";

	const STATUS_TEXT = {
        0: "未开始",
		10: "待付款",
		40: "已完成",
		60: "已关闭",
		70: "已关闭",
		100: "待使用",
		110: "已使用",
		120: "已过期",
    }


    const IMGS = {
        3: DISABLED_IMG,
        0: DEFAULT_IMG,
        1: DISABLED_IMG,
        2: DISABLED_IMG
    }


	export default {
		name: 'coupon-list',

		// mixins: [loadMore, scrollFixed],

		props: {
			status: {
				type: [String, Number],
				default: 0
            },
            coupon_list: {
                type: Object,
                default: () => {}
            },
            paytype:String,
		},

		data() {
            const activeIndex = this.status;
            const shop_id = this.$util.getLocationParam("shop_id");
            const coupon_new = this.coupon_list;
            const buytype = this.paytype
            const result = [];
            let price = 0;
            let cousIsEmpty, cousNoIsEmpty = false;
            //第一次进入默认选中项
            coupon_new['cous'].map(item => {
                if(item.selected === 1) {
                    result.push(item.id);
                    price += item.money;
                }
            })
            //判断是否有优惠券
            if(coupon_new['cous'].length === 0) {
                cousIsEmpty = true;
            }
            if(coupon_new['cous_no'].length === 0) {
                cousNoIsEmpty = true;
            }

			return {
				shop_id,
                activeIndex,
                isEmpty: false,
                coupon_new,                         //传递过来的可用不可用优惠券列表
                items: [],
				tabsItem: [{
						name: "可用券",
						status: 0,
					},
					{
						name: "不可用券",
						status: 1,
					}
                ],
                result,                              //多选选中的项
                price,                              //优惠券优惠的金额
                buytype,
                cousIsEmpty,                        //没有可用优惠券
                cousNoIsEmpty,                       //没有不可用优惠券
                reset_data: null                    //点击优惠券后的整个表单的数据
			}
		},

		watch: {
            '$route': 'resetInit'
		},

		created() {
			// this.resetInit();
		},

		methods: {
			initData(address_id,cou_ids,buytype) {
				this.$reqPost(PRO_SUBCHANGE,{
                    address_id,
                    cou_ids,
                    buytype
                }).then(res => {
                    //第一次进入默认选中项
                    let result = [];
                    let price = 0;
                    res.data['coupon']['cous'].map(item => {
                        if(item.selected === 1) {
                            result.push(item.id);
                            price += item.money;
                        }
                    })

                    //重新赋值
                    this.coupon_new = Object.assign({},res.data['coupon'])

                    this.result = result;
                    this.price = price;
                    //判断是否有优惠券
                    if(res.data['coupon']['cous'].length === 0) {
                        this.cousIsEmpty = true;
                    }
                    if(res.data['coupon']['cous_no'].length === 0) {
                        this.cousNoIsEmpty = true;
                    }
                    //传递整个数据
                    this.reset_data = Object.assign({},res.data);
                })
			},
			handleTabClick(index){
				// this.$router.replace({name: "user-order-ele-list", params: { status: index }})
			},
			getStatusText(status){
				return STATUS_TEXT[status] || '';
            },
            getImgBg(el) {
                if(el.checked === 0) {
                    return DISABLED_IMG
                }else {
                    if(el.type === 0) {
                        return DEFAULT_IMG
                    }else {
                        return FREIGHT_IMG
                    }
                }
                return IMGS[status] || '';
            },
            changeCheckCoupon(el) {
                //改变多选框的值
                if(el.checked){
                    console.log(22222222222222,this.result)
                    this.initData('',this.result,this.buytype);
                }

            },
            onSubmit() {
                //确认选择
                this.$emit('popupCoupon',this.reset_data,this.result)
            },
            backTo() {
                this.$emit('popupCoupon',this.reset_data,this.result)
            }
		},
		components: {
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Panel.name]: Panel,
            [Card.name]: Card,
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
            [SubmitBar.name]: SubmitBar,
            [IsEmpty.name]: IsEmpty,
            [Coupon.name]: Coupon,
            [NavBar.name]: NavBar,
        }
	}

</script>

<style lang="scss" scoped>
	.order_list {
        background: $background-color;
        padding-top: 1.84rem;
        padding-bottom: 0;
        width: 100%;
        height: 100%;
		box-sizing: border-box;
		overflow-x: hidden;
		overflow-y: scroll;
		.coupon_list {
            padding: 0 .32rem;
        }
        &_no_coupon {
            padding-left: 1rem;
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
                padding: .4rem 0;
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
	}

</style>
<style lang="scss">

.order_list {
    .van-tabs
    {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        padding-bottom: 1rem;
    }

    .van-tabs__content {
        padding-top: .6rem;

        .van-checkbox {
            padding-left: .6rem;
        }
    }
    .coupon_item_data_desc_desc_area{
        font-size:0.4rem;
    }
    .coupon_item_data_desc_title{
        line-height: auto !important;
    }
    .van-tabs{
        height: 100%;
        overflow: auto;
    }
    .van-tabs__content{
        padding-bottom:2rem;
    }
}

</style>

