<template>
	<div class="mix-order">

        <nav-bar 
            title="订单提交成功"
            right_text="我的订单"
            :no_more="true"
            @linkTo="goOrder"
            @back="backTo"/>

        <van-cell-group class="mix-order_cell">
            <van-cell>
                <div slot="title" class="mix-order_cell_item">
                    <span>货到付款：￥{{goodslist.nopay_money}}</span>
                    <span class="mix-order_cell_item_success">
                        <van-icon name="yqn_success" />
                        已出单
                    </span>
                </div>
            </van-cell>
            <van-cell>
                <div slot="title" class="mix-order_cell_item">
                    <span>在线支付：￥{{goodslist.pay_money}}</span>
                    <span class="mix-order_cell_item_fail">
                        <van-icon name="yqn_warn" />
                        待支付
                    </span>
                </div>
            </van-cell>
        </van-cell-group>


        <div class="mix-order_pay">
            <div>部分商品需要在线支付，请尽快完成付款</div>
            <van-button size="large" type="danger" @click="paySubmit">去支付 ￥{{goodslist.pay_money}}</van-button>
        </div>
        
	</div>	
</template>

<script>

    import NavBar from "@/vue/components/NavBar/"
    import {ORDER_GOODS_GETSELECT} from "@/api/order" 

    import { Cell, CellGroup } from 'vant';
   

	export default {
		name: "mix-order",

		props: {
			order_id:[
                String,Number
            ]
        },
        

		data() {
            const order_id_new=JSON.parse(this.order_id)
			return {
                order_id_new,
                goodslist:[]
			}
		},

		computed: {
			
        },
        
        created() {
            this.order_id=JSON.parse(this.order_id)
            this.getgoods()
        },

		activated() {
            
        },

        deactivated(){
			
        },
        
        methods: {
            initData(){
				
                
            },
            getgoods(data){
                this.$reqGet(ORDER_GOODS_GETSELECT,{goods:this.order_id.goods}).then(res=>{
                    this.goodslist=res.data
                })
            },
            backTo() {
                this.$router.back(-1);
            },
            paySubmit(){
                let goods = this.order_id_new.pay_goods.join('_')
                this.$router.push({name:'payment',params:{pay_id:goods}})
            },
            goOrder(){
                let goods = this.order_id_new.pay_goods
                this.$router.push({name: 'user-order-detail',params:{active:goods}})
            }
        },
        
        components: {
            [NavBar.name]: NavBar,
            [Cell.name]: Cell,
            [CellGroup.name]: CellGroup
        }

	}

</script>


<style lang="scss" scopd>
	
	
	.mix-order {
		padding-top: 46px;
		background-color: $background-color;
        &_cell {
            margin-top: 5px;
            &_item {
                width: 100%;
                display: flex;
                justify-content: space-between;
                font-size: $params-title-size;
                span {
                    &:nth-child(1) {
                        color: $main-title-color;
                    }
                    &:nth-child(2) {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        i {
                            margin-right: 8px;
                        }
                    }
                }
                &_success {
                    color: #08BB07;
                }
                &_fail {
                    color: $price-color;
                }
            }
        }
        &_pay {
            padding: 0 .64rem;
            margin-top: 2.88rem;
            text-align: center;
            >div {
                font-size: $params-title-size;
                color: $main-title-color;
                font-weight: 400;
            }
            button {
                margin-top: .6rem;
            }
        }
	}


</style>
<style lang="scss">
.mix-order {
    .van-button--large {
        height: 1.76rem;
        line-height: 1.76rem;
    }
}
</style>



