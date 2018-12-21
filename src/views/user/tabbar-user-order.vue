<template>
	<div class="user_order">
		<van-cell-group>
			<van-cell :title="list.title" :is-link="list.more" @click="to(list.more_url)">
                <span slot="title" class="user_order_title">{{list.title}}</span>
				<router-link :to="list.more_url" class="text-desc user_order_value" v-if="list.more">{{list.more_text}}</router-link>
			</van-cell>
		</van-cell-group>

        <!-- 图标数量在4个及以下 -->
        <van-row class="order_status" v-if="list.children.length !== 0">
            <van-col span="6" v-for="(item,index) in list.children" :key="index" @click.native="clickIcon(item,index)" v-if="index <= 3">
				<div class="order_status_icon">
					<!-- <van-icon :name="item.icon" :info="item.info?item.info:''"/> -->
                    <img :src="require('../../assets/images/user/'+ item.icon +'.png')" alt="" class="order_status_icon_img" :style="item.size === 'big'?'':'width: 1rem'"/>
                    <div class="van-info" v-if="item.info">{{item.info>99?'99+':item.info}}</div>
				</div>
				<div>{{item.text}}</div>
			</van-col>
        </van-row>
        <!-- 图标数量在4个以上8个以下 -->
        <van-row class="order_status" v-if="list.children.length > 4 && isWeChat">
            <van-col span="6" v-for="(item,index) in list.children" :key="index" @click.native="clickIcon(item)" v-if="index > 3">
				<div class="order_status_icon">
					<img :src="require('../../assets/images/user/'+ item.icon +'.png')" alt="" class="order_status_icon_img" :style="item.size === 'big'?'':'width: 1rem'"/>
                    <div class="van-info" v-if="item.info">{{item.info | greater}}</div>
				</div>
				<div>{{item.text}}</div>
			</van-col>
        </van-row>


		<!-- <van-row class="order_status">
			<van-col span="6">
				<div class="order_status_icon" @click="$router.push({path: '/user/order/list/1'})">
					<van-icon name="daifukuan" />
				</div>
				<div>待付款</div>
			</van-col>
			<van-col span="6">
				<div class="order_status_icon" @click="$router.push({path: '/user/order/list/2'})">
					<van-icon name="daifahuo" info="1" />
				</div>
				<div>待发货</div>
			</van-col>
			<van-col span="6">
				<div class="order_status_icon" @click="$router.push({path: '/user/order/list/3'})">
					<van-icon name="wuliu" info="3" />
				</div>
				<div>待收货</div>
			</van-col>
			<van-col span="6">
				<div class="order_status_icon" @click="$router.push({path: '/user/refund/list'})">
					<van-icon name="shouhouguanli" />
				</div>
				<div>退款售后</div>
			</van-col>	
		</van-row> -->
		
	</div>
</template>

<script>
    import { Row, Col } from 'vant'
	export default {
        name: "order-group",
        props: {
            list: {
                type: Object,
                default: ()=>{}
            },
            index_info: null
        },
        data() {
            return {
                isWeChat: false
            }
        },
        created() {
            //判断终端内核
            let version = this.$util.checkTheTerminal();
            if(version === 'WeChat'){
                this.isWeChat = true;
            }
        },
		methods: {
            clickIcon(item,index) {
                if(item.url){
                    this.$router.push({path: item.url,params:{active:index}})
                }else {
                    switch(item.text) {
                        case '绑定微信': 
                            this.$dialog.confirm({
                                message: '确认与您当前的微信进行绑定吗？'
                            }).then(()=>{
                                //确认
                                
                                let location = window.location.origin + "/#/user";
                                // 编码
                                let encode_url = encodeURIComponent(location);
                                // 跳转验证
                                window.location.href = "https://m.naifenpifa168.com/client/wx/get_code?backurl=" + encode_url;    
                            }).catch({
                                //取消

                            })
                            break;
                        case '消息授权':
                            this.$emit('focusWechat');
                            break;
                    }
                }
            },
            to(url) {
                //点击跳转
                this.$router.push({path: url })
            }
        },
		components: {
			[Row.name]: Row,
			[Col.name]: Col,
		}
	}
</script>


<style scoped lang="scss">
	
    @import "../../assets/scss/mixin";
    @import "../../assets/scss/_var.scss";
    .user_order {
        margin-top: 5px;
        padding: 0 8px;
        box-shadow:0px 0px 0px rgba(153,153,153,0.23);
        border-radius:3px;
        &_title {
            font-size: $product-title-size;
            color: $main-title-color;
        }
        &_value {
            font-size: $extra-size;
            color: $main-title-color;
        }
        .order_status{
            background-color: #fff;
            text-align: center;
            padding: 10px 0;
            font-size: $params-title-size;
            color: $main-title-color;

            .order_status_icon{
                position: relative;
                width: 1.4rem;
                height: 1.4rem;
                border-radius: 50%;
                display: inline-block;
                &_img {
                    width: 1.4rem;
                    height: auto;
                }
                // i{
                //     position: absolute;
                //     top: 50%;
                //     left: 50%;
                //     transform: translate3d(-50%, -50%, 0);
                //     font-size: 24px;
                //     color: #000;
                // }
            }
        }
    } 
	
</style>

<style lang="scss">
@import "../../assets/scss/_var.scss";
.user_order {
    .van-cell {
        line-height: .6rem;
        &--clickable {
            padding-right: 15px;
        }
        .van-cell__title {
            height: .6rem;
            line-height: .6rem;
            font-size: $product-title-size;
            color: $main-title-color;
            border-left: 2px solid $main-color;
            padding-left: .4rem;
        }
        .van-cell__value {
            padding-right: .4rem;
        }
        i.van-cell__right-icon {
            right: 8px;
            bottom: .2rem;
            font-size: $extra-size;
        }
    }
    .van-hairline--top-bottom::after {
        border-width: 0;
    }
    .van-info {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid $price-color;
        background: #fff;
        color: $price-color;
        min-width: .64rem;
        border-radius: .32rem;
        font-size: 10px;
        line-height: .64rem;
        height: .64rem;
    }
}

</style>
