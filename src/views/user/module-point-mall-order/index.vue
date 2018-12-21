<template>
	<div class="point_order">

        <nav-bar 
            title="填写兑换订单"
            @back="backTo"/>

        <div class="point_order_address" v-if="!goods.coupon_id" @click="changeAddress">
            <span class="point_order_address_text">
                <span class="point_order_address_text_user">
                    <van-icon name="yqn_location" class="point_order_address_text_address_icon" />
                    <span class="point_order_address_text_user_name">{{user_address.truename}}</span>
                    <span class="point_order_address_text_user_mobile">{{user_address.mobile}}</span>
                </span>
                <span class="point_order_address_text_address">
                     {{user_address.province + ' ' + user_address.city + ' ' + user_address.county + ' ' + user_address.address}}          
                </span>
            </span>
            <van-icon name="yqn_rightIcon" class="point_order_address_icon"/>
        </div>

        <div class="point_order_product">
            <div class="point_order_product_title">商品信息</div>
            <!-- 单个商品详情 -->
            <div class="point_order_product_link">
                <div class="point_order_product_link_detail">
                    <div class="point_order_product_link_detail_left">
                        <!-- <img :src="goods.item_imgs[0].url" alt="" class="point_order_product_link_detail_left_img"> -->
                        <img v-lazy="goods.picpath" alt="" class="point_order_product_link_detail_left_img">
                    </div>
                    <div class="point_order_product_link_detail_right">
                        <span class="point_order_product_link_detail_right_top">{{goods.title + ' ' + goods.spec + ' ' + goods.bz}}</span>
                        <span class="point_order_product_link_detail_right_bottom">
                            <span>单价：<strong>{{goods.point}}</strong></span>
                            <span><van-stepper @overlimit="toastpointless"
                                    v-model="value"
                                    integer
                                    :min="0"
                                    :max="Math.min(Math.floor(user_base_info.point / goods.point),goods.num)  || 0"
                                    :step="1"
                                    class="point_order_product_link_detail_right_bottom_stepper"
                                    />
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <van-cell-group class="point_order_remark">
            <van-cell>
                <template slot="title">
                    <span class="point_order_remark_title">备注信息</span>
                    <input type="text" class="point_order_remark_input" placeholder="请输入备注信息" @input="bz_msg"/>
                </template>
            </van-cell>
        </van-cell-group>

        <van-cell-group class="point_order_remark point_order_point">
            <van-cell>
                <template slot="title">
                    <span class="point_order_remark_title">账户积分</span>
                    <span class="point_order_remark_value" >{{user_base_info.point}}</span>
                </template>
            </van-cell>
            <van-cell>
                <template slot="title">
                    <span class="point_order_remark_title">商品积分</span>
                    <span class="point_order_remark_value" >{{goods.point}}</span>
                </template>
            </van-cell>
        </van-cell-group>
        

        
	
        <div class="exchange_enter">
            <span class="exchange_enter_point">
                <span class="exchange_enter_point_sum">
                    合计积分： <span>{{point_now_count}}</span>
                </span>
            </span>
            <van-button type="default" class="exchange_enter_btn" @click="exchange" :disabled="value == 0">确认兑换</van-button>
        </div>
        
		
		
		
	</div>
</template>

<script>
    import { POINT_PRO_INFO, POINT_GOODS_EXCHANGE } from '@/api/point'
    import { USER_BASE_INFO } from '@/api/system';
    import { USER_ADDRESS_INFO } from '@/api/user';


	
	import { Stepper,Toast  } from 'vant';
	
    import NavBar from '@/vue/components/NavBar/';

	export default {
		props: {
			itemId: [String, Number]
		},

		data() {
            const isLogin = !!localStorage.getItem('Authorization');
            const id = this.itemId;
			return {
				isLogin,
				showContact: false,
				cartInfo: "5",
				mobile: "13454193338",
				selectSku: {
					selectedNum: 1,
					selectedSkuComb: {}
                },
                value: 1,               //步进器步数
				addressVal: {
					id: null,
					area_name: "",
					district: "",
					city: "",
					province: ""
                },
                form: {
                    id: id,
                    buynum: 1,
                    bz: '',
                    address_id: ''
                },                   //商品兑换订单提交
                goods: {},                  //商品详情
                user_base_info: {},                  //用户积分详情
                user_address: {},                    //用户默认收货地址
                point_now_count: 0                  //合计所需积分       
			}           
        },
        
        watch: {
            value() {
                this.form.buynum = this.value;
                this.point_now_count = this.value * this.goods.point;
            }
        },

		created() {
            this.initData();
            this.getUserInfo();
            this.getAddress();
            this.$bus.$on('address_id', id => {
                this.getAddress(id)
            })
		},

		methods: {
			initData() {
                //获取商品详情
				// this.$reqGet(`${GOODS_DETAIL}`, {
				// 	expand: "desc,skus,prop_imgs,item_imgs"
				// }).then(res => {
				// 	this.goods = res.data.data;
                // })
                this.$reqGet(POINT_PRO_INFO, {id: this.itemId}).then(res => {
                    this.goods = Object.assign({},res.data);
                    this.point_now_count = res.data.point;
                })
            },
            getUserInfo() {
                //获取用户基本信息
                this.$reqGet(USER_BASE_INFO).then(res => {
                    this.user_base_info = Object.assign({},res.data)
                })
            },
            getAddress(id) {
                let address_id;
                if(id) {
                    address_id = id;
                }
                //获取默认收获地址
                this.$reqGet(USER_ADDRESS_INFO,{
                    address_id
                }).then(res => {
                    if(!(res.data instanceof Array)) {
                        this.form.address_id = res.data.address_id;
                        this.user_address = Object.assign({},res.data);
                    }
                    
                })
            },
			doBuyNow() {
				if ((this.goods.has_sku && this.selectSku.sku_id) || !this.goods.has_sku) {
					this.$router.push({name: 'placeOrderEntity'})
				} else {
					let goodAction = this.$refs.goodAction
					goodAction.showSku = true;
					goodAction.isSkuBuy = true;
				}
			},
			doContact() {
				this.showContact = true;
			},
			toCart() {
				this.$router.push({
					name: "cart"
				})
			},
			addCollect() {
				this.$toast({
					message: "已添加至我的收藏",
					duration: 1500
				});
            },
            exchange() {
                
                this.$reqPost(POINT_GOODS_EXCHANGE,this.form).then(res => {
                    let str = 'goods=' + res.data.goods + '&act=point'
                    this.$router.push({name: "paymentStatus", params: {status:str}})
                })
                
            },
            changeAddress() {
                //修改收货地址
                //标记从积分订单跳转到收货地址的
                sessionStorage.setItem('from_order',true);
                this.$router.push({name: 'address'});
            },
            bz_msg(e) {
                //输入备注信息
                this.form.bz = e.target.value;
            },
            backTo() {
                this.$router.back(-1);
            },
            toastpointless(){

                Toast('积分不足');

            }
		},

		components: {
            [Stepper.name]: Stepper,
            [NavBar.name]: NavBar
        },
        
        beforeRouteEnter (to, from, next) {
            // ...
            next(vm => {
                
                if(from.name === 'address') {
                    //清除从订单跳转标记
                    sessionStorage.removeItem('from_order');
                }
            })
        },     

		beforeRouteLeave (to, from, next) {
            //因为将所有的组件进行了缓存，所以退出的时候要将其组件销毁
            if(to.name === 'user-point-mall') {
                this.$destroy();
            }
			
			// ...
			next();
		}
	}

</script>

<style lang="scss" scoped>
	
	@import "../../../assets/scss/mixin";

	.point_order {
        padding-top: 46px;
		&_address {
            height: 2rem;
            position: relative;
            color: $main-title-color;
            background: #fff;
            padding: 14px 13px 12px 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &:before {
                content: '';
                left: 0;
                right: 0;
                bottom: 0;
                height: 2px;
                position: absolute;
                background: -webkit-repeating-linear-gradient( 135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #3283fa 0, #3283fa 45%, transparent 0, transparent 50% );
                background: repeating-linear-gradient( -45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #3283fa 0, #3283fa 45%, transparent 0, transparent 50% );
                background-size: 80px;
            }
            &_text {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                &_address {
                    padding: 5px 0 5px .92rem;
                    font-size: $extra-size;
                }
                &_user {
                    // padding: 0px .92rem;
                    font-size: $product-title-size;
                    color: $main-title-color;
                    &_name {
                        padding-left: 5px;
                    }
                    &_mobile {
                        padding-left: 10px;
                    }
                }
            }
            &_icon {
                font-size: 20px;
                color: #ccc;
            }
        }
        &_product {
            margin-top: 5px;
            background: #fff;
            padding: 10px 10px 10px;
            &_title {
                line-height: 1.48rem;
                color: $main-title-color;
                font-size: $sub-title-size;
            }
            &_link {
                width: 100%;
                height: 3.68rem;
                &_detail {
                    background: #fff;
                    display: flex;
                    &_left {
                        width: 3.06rem;
                        height: 3.06rem;
                        display: flex;
                        align-items: center;
                        &_img {
                            width: 100%;
                            // height: 100%;
                        }
                    }
                    &_right {
                        width: 75%;
                        padding-left: 20px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        &_top {
                            height: 1.6rem;
                            line-height: .8rem;
                            font-size: $product-title-size;
                            color: $main-title-color;
                            overflow : hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                        }
                        &_bottom {
                            margin-top: .8rem;
                            display: flex;
                            justify-content: space-between;
                            font-size: $extra-size;
                            span {
                                &:nth-child(1) {
                                    color: $sub-title-color;
                                    line-height: 1rem;
                                    strong {
                                        color: $main-color;
                                    }
                                }
                                &:nth-child(2) {
                                    color: $sub-title-color;
                                    line-height: 1rem;
                                }

                            }
                        }
                    }
                }
            }
        }
        &_remark {
            margin-top: 5px;
            &_input {
                // border: 1px solid #ccc;
                border: 0;
                border-radius: 4px;
                padding-left: 6px;
            }
            &_title {
                color: $sub-title-color;
                font-size: $params-title-size;
            }
            &_value {
                color: $main-title-color;
                font-size: $params-title-size;
            }
        }

        &_point {
            height: 11rem;
        }

        .exchange_enter {
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 2rem;
            display: flex;
            &_point {
                display: block;
                width: 70%;
                height: 100%;
                background-color: #fff;
                opacity: 0.7;
                color: $sub-title-color;
                font-size: $extra-size;
                position: relative;
                &_sum {
                    position: absolute;
                    left: .46rem;
                    bottom: .52rem;
                    span {
                        font-size: $main-title-size;
                        color: $price-color;
                    }
                }
            }
            &_btn {
                display: block;
                width: 30%;
                height: 100%;
                font-size: $sub-title-size;
                border: 0;
                padding: 0;
                border-radius: 0;
                color: #fff;
                background: linear-gradient(to right ,#fe5d28 , #fe8246)!important;
            }  
        }
         
	}

	

</style>

<style lang="scss">
.point_order {
        &_remark {
            .van-cell__title {
                display: flex;
                justify-content: space-between;
            }
            
        }
}
</style>

