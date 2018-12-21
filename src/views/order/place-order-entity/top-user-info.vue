<template>
	<!-- <van-cell-group>
		<van-cell icon="dingwei" isLink title="张三  13512124547" label="浙江省 杭州市 西湖区 创新创业园" />
		
		<van-cell class="daodian" >
			<van-checkbox v-model="isDaoDian" slot="icon" label="浙江省 杭州市 西湖区 创新创业园">
				<span class="van-cell__text">到店自提</span>
				<span class="text-desc">可免邮费哦~</span>
			</van-checkbox>
			<div class="text-desc shop_address" slot="title">门店地址: 浙江省 杭州市 西湖区 创新创业园</div>
		</van-cell>
		
		<van-cell icon="id-card" title="张三" label="330327********1574" isLink />
	</van-cell-group> -->
    <div>
    <div class="point_order_address" @click="toAddress" v-if="info">
        
        <span class="point_order_address_text" >
            <span class="point_order_address_text_user">
                <!-- <van-icon name="yqn_location" class="point_order_address_text_address_icon" /> -->
                <span class="point_order_address_text_user_name">{{info.truename}}</span>
                <span class="point_order_address_text_user_mobile">{{info.mobile}}</span>
            </span>
            <span class="point_order_address_text_address">
                    {{info.province + ' ' + info.city + ' ' + info.county + ' ' + info.address}}          
            </span>
        </span>
        <van-icon  slot="right-icon" name="yqn_rightIcon"  class="address_rightIcon"/>
        <!-- <span class="point_order_address_add" v-else>
            请添加收货地址
        </span>
        <van-icon name="arrow" class="point_order_address_icon"/> -->
    </div>

    <van-cell icon="yqn_add" title="请添加收货地址" @click="toAddress"  is-link v-else>
        <van-icon  slot="right-icon" name="yqn_rightIcon"  />
    </van-cell>
    </div>
</template>

<script>
    import { Checkbox ,Cell} from 'vant';
	
	export default {
        name: 'top-user-info',
        
        props: {
            info: {
                type: Object,
                default: () => {}
            }
        },
		
		data(){
            const address_info=this.info
			return {
                address_info,
				isDaoDian: false
			}
        },
        
        
        methods: {
            toAddress() {
                //标记从普通订单跳转到收货地址的
                sessionStorage.setItem('from_order',true);
                this.$router.push({name: 'address'});
                
            }
        },

		components: {
			[Checkbox.name]: Checkbox,
		}
	}
</script>


<style lang="scss">
    .van-cell--clickable{
        padding-right: 4px;
    }
    .van-cell__title{
        font-size: $sub-title-size;
        color:$main-title-color;
    }
	
	.daodian {
		.van-checkbox .van-icon-success{
			height: 16px;
			width: 16px;
			font-size: $font-size-small;
			&::before{
				line-height: 16px;
			}
		}
		.van-checkbox__input{
			height: 16px;
		}
		.van-checkbox__label{
			margin-left: 0;
		}
		.shop_address{
			padding-left: 25px;
			box-sizing: border-box;
		}
	}

    .point_order_address {
            height: 50px;
            position: relative;
            background: #fff;
            padding: 14px 13px 12px 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .address_rightIcon{
                font-size:.9rem !important; 
            }
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
            &_add {
                padding-left: 1rem;
            }
            &_text {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                &_address {
                    // padding: 0 0 5px .7rem;
                    font-size: $extra-size;
                }
                &_user {
                    padding: 0 1rem 0 0;
                    font-size: $product-title-size;
                    color: $main-title-color;
                    font-weight: bold;
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
</style>