<template>
	<div class="payment">

        <nav-bar 
            title="收银台"
            @back="backTo"/>

        <div class="pay_box">
            <div class="time_down payment_group count_down" v-if="list.endtime">
                    
                支付剩余时间: <span class="count_down">
                    <countdown :time="getCountDown(list.endtime)" >
                        <template slot-scope="props">
                            {{props.days*24 + Number(props.hours) }}:{{ props.minutes }}:{{ props.seconds }}
                        </template>
                    </countdown>
                </span>
            </div>
            
            <van-cell-group class="payment_group">
                <van-cell>
                    <div slot="title" class="payment_group_title_all">订单信息</div>
                </van-cell>
              
                <!-- <div class="order-goods_self"  v-if="list.pros && list.pros.length == 1">
                    <van-card 
                        v-for="(item,index) in list.pros"
                        :key="index"
        
                    >   
                        <div slot="thumb" class="order-goods_self_card_imgbox"><img  :src="item.picpath" alt=""></div>
                        <div slot="title" class="order-goods_self_card_title">{{item.title}}</div>
                        <div slot="desc" class="order-goods_self_card_desc">
                            <span class="order-goods_self_card_desc_sku">{{item.spec}}  {{item.bz}}</span>
                            <span class="order-goods_self_card_desc_sku" style="color:#ff6600">{{`运费:${item.shipmoney}元    优惠:${item.prom_minus || ''}元`}}</span>
                            <span class="order-goods_self_card_desc_freight">{{getSendWay(item.shiptype,index)}}</span>
                            <div slot="footer" class="order-goods_self_card_footer">
                            <span class="order-goods_self_card_desc_skumark">{{item.spec_title}}  </span>
                            <span class="order-goods_self_card_footer_price">
                                ￥<span class="order-goods_self_card_footer_price_num">{{item.price}}*{{item.buynum}}</span>
                            </span>
                            <span class="order-goods_self_card_footer_point">
                                <span class="order-goods_self_card_footer_point_symbol">送</span>
                                <span class="order-goods_self_card_footer_point_num">{{item.price}}</span>
                                积分
                            </span>
                        </div>
                        </div>
                        
                    </van-card>
                
               
                </div> -->
                <div >
                    <van-cell value="" >
                    <template slot="title">
                        <div class="order-goods_goodlist">
                            <img  v-for='(item,i) in  list.pros' :key="i" :src="item.picpath" alt="">

                        </div>
                    </template>
                    </van-cell>
                </div>
                <van-cell>
                    <div slot="title" class="payment_group_title">
                        <div>   
                            <span>合计金额：</span>
                            <span class="payment_group_num">￥
                                <span class="payment_group_num_price">{{list.pay_money}}</span>
                            </span>
                        </div>
                    </div>
                </van-cell>
            </van-cell-group>
            
            <div class="pay_way_group">
                <!-- <div class="pay_way_title">选择支付方式</div> -->
                <van-radio-group v-model="payWay">
                    <van-cell-group>

                        
                        <van-cell>
                            <van-radio name="weixin">
                                <div class="radio_wx">
                                    <img src="../../../assets/images/wx_pay.png" alt="微信支付" class="radio_wx_img">
                                    <span class="radio_wx_desc">
                                        <span class="radio_wx_desc_title">微信支付</span>
                                        <span class="radio_wx_desc_desc">
                                            微信安全支付
                                        </span>
                                    </span>
                                </div>
                                
                            </van-radio>
                        </van-cell>
                        <van-cell v-if="browsertype!='WeChat'">
                            <van-radio name="alipay">
                                <div class="radio_wx">
                                    <img src="../../../assets/images/ali_pay.png" alt="支付宝支付" class="radio_wx_img">
                                    <span class="radio_wx_desc">
                                        <span class="radio_wx_desc_title">支付宝支付</span>
                                        <span class="radio_wx_desc_desc">
                                            支付宝安全支付
                                        </span>
                                    </span>
                                </div>
                                
                            </van-radio>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
            <van-button class="pay_submit" @click="paySubmit" :loading="isSubmit" type="primary"  bottomAction>立即付款</van-button>
        </div>


        <van-dialog
            v-model="leave_pay"
            show-cancel-button
            :before-close="beforeClose"
           
            > 
           <div class="payment_no_pay"  >
               <span class="payment_no_pay_title">确认要离开吗？</span>
               <span class="payment_no_pay_content" v-if="list.endtime">
                   您的订单在
                   <countdown :time="getCountDown(list.endtime)" >
                        <template slot-scope="props">
                            {{props.days*24 + Number(props.hours) }}:{{ props.minutes }}:{{ props.seconds }}
                        </template>
                    </countdown>
                   后未支付将被取消，请尽快完成支付。
                </span>
           </div>
        </van-dialog>
	
		
	</div>	
</template>

<script>
	import {
		Radio,
        RadioGroup,
        Card 
    } from 'vant';
    import NavBar from "@/vue/components/NavBar/"
    import {SYS_GOODS_GETPAYPROS,SYS_GOODS_SUBAPI} from "@/api/system"
	export default {
		name: "payment",

        props:{
            pay_id:[
                String, Number
            ]
        },
		data() {
            let pay_id_new, act;
            if(this.pay_id.indexOf('&') === -1) {
                //纯商品订单
               pay_id_new = this.pay_id.split('_');
               act = '';
            }else {
                //优惠券订单
                let coupon_arr = this.pay_id.split('&');
                let arr = [];
                arr.push(coupon_arr[0]);
                pay_id_new = arr;
                act = coupon_arr[1].split('=')[1];
            }
            
			return {
                browsertype:'',
				isSubmit: false,
                payWay: "weixin",
                list:[],
                goods:[],
                pay_id_new,                         //订单号数组
                act,                            //订单操作类型
                pay_data: null,                 //支付数据
                pay_fail: false,             //支付是否失败
                paygoods:'',                //支付订单返回的订单号
                leave_pay: false        //是否离开当前页面
			}
        },
        created(){
            this.getgoodsinfo()
            this.browsertype = this.$util.checkTheTerminal()
        },
        mounted(){
            window.appPayAction_callback=this.appPayAction_callback
        },
		methods: {
            onBridgeReady(data){
                let _this = this;
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', 
                    data,
                    function(res){
                       
                        if(res.err_msg == "get_brand_wcpay_request:ok" ){
                            let str = 'goods=' + data.paygoods + '&' + 'act=';
                            _this.$router.push({name:'paymentStatus',params:{status: str}})
                        // 使用以上方式判断前端返回,微信团队郑重提示：
                                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                        }else{
                            
                            _this.pay_fail = true;

                        } 
                }); 
            },

   

            appPayAction_callback(response) {
                
                // 原生支付方式
                const that=this
                var rt = JSON.parse(response);
                // alert(that.paygoods)
                switch (rt.status) {
                    case 1:
                        that.$dialog.alert({
                            message:'支付成功!'
                        }).then(() => {
                            let str = 'goods=' + that.paygoods + '&' + 'act=' + '&' + 'goodsdetail='+that.pay_id_new;
                            that.$router.push({name:'paymentStatus',params:{status:str}})
                        });
                        break;
                    // case 4:
                    //     that.$dialog.alert({
                    //         message:'没有安装客户端!'
                    //     }).then(() => {
                    //         that.$router.push({name:'user-order-list',params:{active:1}})
                    //     });
                    //     break;
                    // case 5:
                    //     that.$dialog.alert({
                    //         message:'支付验证失败!'
                    //     }).then(() => {
                    //         that.$router.push({name:'user-order-list',params:{active:1}})
                    //     });
                    //     break;
                    // default:
                    //     that.$dialog.alert({
                    //         message:'其他问题'
                    //     }).then(() => {
                    //         that.$router.push({name:'user-order-list',params:{active:1}})
                    //     });
                    //     break;
                    default:
                        that.$dialog.alert({
                            message:'支付失败'
                        }).then(() => {
                            that.$router.push({name:'user-order-list',params:{active:1}})
                        });
                        break;
                }
            },
               

			paySubmit() {

                let parm={
                    goods:this.pay_id_new,
                    payfs:this.payWay,
                    act: this.act,
                }
                this.isSubmit = true;
                if(this.pay_fail) {
                    this.isSubmit = false
                    if(this.browsertype === 'WeChat'){
                        if (typeof WeixinJSBridge == "undefined"){
                            if( document.addEventListener ){
                                document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                            }else if (document.attachEvent){
                                document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady); 
                                document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
                            }
                        }else{
                            this.onBridgeReady(this.pay_data);
                        }
                   }
                //    else {
                //        //H5跳转需要的backurl
                //        let origin = window.location.origin;
                //        let str = 'goods=' + res.data.paygoods + '&' + 'act=';
                //        let back_url = origin + '/#/order/payment-status/' + str;
                //        window.location.href = res.data.payurl
                //    }
                }else {
                    //第一次提交
                    if(this.browsertype === 'WeChat'){
                        this.$reqPost(SYS_GOODS_SUBAPI,parm).then(res=>{
                            this.isSubmit = false
                           
                            if (typeof WeixinJSBridge == "undefined"){
                                
                                if( document.addEventListener ){
                                    document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                                }else if (document.attachEvent){
                                    document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady); 
                                    document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
                                }
                            }else{
                                this.pay_data = Object.assign({},res.data);
                                this.onBridgeReady(res.data);
                            }
                        })
                            
                    }else if(this.browsertype==='IOS'){
                        if(this.$util.checkPrimalFunc){          
                            this.$reqPost(SYS_GOODS_SUBAPI,parm).then(res=>{
                                this.paygoods=res.data.paygoods
                                this.isSubmit = false
                                this.$util.iosFunc('appPayAction',res.data)
                            })
                        } 
                    }else if(this.browsertype==='android'){
                        if(this.$util.checkPrimalFunc){
                            this.$reqPost(SYS_GOODS_SUBAPI,parm).then(res=>{
                                this.isSubmit = false
                                this.paygoods=res.data.paygoods
                                this.$util.androidFunc('appPayAction',res.data)
                            })
                            // let origin = window.location.origin;
                            // let str = 'goods={paygoods}&act=';
                            // let back_url = origin + '/#/order/payment-status/' + str;
                            // parm['return_url'] = back_url;
                            // this.$reqPost(SYS_GOODS_SUBAPI,parm).then(res=>{
                            //     this.isSubmit = false
                            //     window.location.href = res.data.payurl
                            // })
                        } 
                    }else {
                        //H5跳转需要的backurl
                        let origin = window.location.origin;
                        let str = 'goods={paygoods}&act=';
                        let back_url = origin + '/#/order/payment-status/' + str;
                        parm['return_url'] = back_url;
                        // console.log(parm)
                        // return
                        this.$reqPost(SYS_GOODS_SUBAPI,parm).then(res=>{
                            this.isSubmit = false

                            window.location.href = res.data.payurl
                        })   
                    }
                }
                

				// this.$router.push({
				// 	name: "paymentStatus",
				// 	params: {
				// 		status: "success"
				// 	}
				// })
            },
            backTo() {
                // this.$dialog.setOptions({
                //     confirmButtonText: '继续支付',
                //     cancelButtonText: '确认离开'
                // })
                this.leave_pay = !this.leave_pay;
                // this.$dialog.confirm({
                //     title: '确认要离开吗？',
                //     message: '您的订单在22小时35分钟后未支付将被取消，请尽快完成支付。'
                // }).then(() => {
                //     // on confirm
                //     this.$router.back(-1)
                // }).catch(() => {
                //     // on cancel
                    
                // });
            },
            beforeClose(action, done) {
                if (action === 'confirm') {
                    //确认离开
                    done();
                    this.$router.back(-1);
                } else {
                    //取消
                    done();
                }
            },
            getgoodsinfo(){
                let parm={
                    goods: this.pay_id_new.join('_'),
                    act: this.act,
                    pay: 1
                }
                 this.$reqGet(SYS_GOODS_GETPAYPROS,parm).then(res => {
                    if(res.code === 402){  
                        setTimeout(()=>{
                             this.$toast({
                            message:res.msg,
                            duration:3000
                        })  
                        },500)
                           
                        setTimeout(()=>{
                            this.$toast.clear()
                            this.$router.back(-1)
                        },1500)
                    }else{
                        this.list=res.data
                    }
                     
                })
            },
            getCountDown(data){
                return data * 1000
            }
            
        },
        

		components: {
			[Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup,
            [NavBar.name]: NavBar
        },
        beforeRouteLeave (to, from, next) {
            // ...
            this.$destroy()
            next()
        }

	}

</script>

<style lang="scss" scoped>
    @import "../../../assets/scss/_var.scss";
    .van-radio__label{
        width: 100%;
    }
    .goodlist{
        max-width: 100%;
        box-sizing: border-box;
        overflow:hidden;
        white-space: nowrap; 
    }
    .payment_no_pay {
        padding: 25px 0;
        text-align: center;
        display: flex;
        flex-direction: column;
    }
    .pay_box {
        padding: 46px 10px 10px 10px;
        .time_down {
            // background-color: #fffeec;
            padding-top: 8px;
            padding-bottom: 10px;
            text-align: center;
            font-size: $sub-title-size;
            color: $main-title-color;
            display: flex;
            flex-direction: column;
            .count_down {
                margin-top: 2px;
                font-size: .88rem;
                color: $main-color;
            }
        }
        .payment_group {
            margin-top: 6px;
            &_title {
                font-size: $params-title-size;

            }
            &_num {
                padding-left: 10px;
                color: $main-title-color;
                &_price {
                    color: $price-color;
                    font-size: $main-title-size;
                    font-weight: 500;
                }
            }
        }
        .pay_way_group {
            margin-top: 10px;
            .radio_wx {
                display: flex;
                &_img {
                    width: 1.76rem;
                    height: 1.76rem;
                }
                &_desc {
                    margin-left: 6px;
                    display: flex;
                    height: 1.76rem;
                    flex-direction: column;
                    justify-content: space-between;
                    &_title {
                        margin-top: 5px;
                        font-size: $product-title-size;
                    }
                    &_desc {
                        margin-bottom: 5px;
                        font-size: $extra-size;
                        color: $explain-text-color;
                    }
                }
            }
        }
        .pay_submit {
            width: 100%;
            margin-top: .64rem;
            background: $main-color;
            border-radius: 5px;
            height: 1.76rem;
            line-height: 1.76rem;
            font-size: $product-title-size;
        }
    }

	

	

	.pay_way_group img {
        vertical-align: middle;
	}

	.pay_way_title {
		padding: 15px;
		background-color: #fff;
    }
    .payment_no_pay_content{
            color: $explain-text-color !important;
            padding: 0.68rem 1.1rem 0;
        }
    .order-goods{
        
        &_goodlist{
                max-width:400px;height:50px;overflow-x:scroll;white-space:nowrap;
                img{
                    width: 50px;margin-left: 4px;vertical-align: top;
                }
            }
         &_self {
                &_title {
                    display: block;
                    height: 1.4rem;
                    font-size: $product-title-size;
                    color: #333;
                    font-weight: 500;
                    line-height: 1.4rem;
                    padding:15px; 
                   
                }
                &_card {
                    &_imgbox{
                        float: left;
                        margin:0 15px ;
                        img{
                            height: 2.8rem;
                        }
                    }
                    &_title {
                        font-size: $product-title-size;
                        color: #333;
                        font-weight: 400;
                        line-height: .72rem;
                        max-height: 1.44rem;
                        overflow: hidden;
                        text-overflow:ellipsis;//文本溢出显示省略号
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                         .goods_notice{
                        font-size: $product-title-size;
                         line-height: 1.4rem;
                         color: #FF6600;
                         border: 1px solid #FF6600;
                         padding: 2px;
                         border-radius:3px; 
                    }
                    }
                    &_desc {
                        &_sku {
                            display: block;
                            font-size: $extra-size;
                            font-weight: 400;
                            color: $sub-title-color;
                            line-height: .8rem;
                        }
                        &_skumark {
                            display: block;
                            font-size: $extra-size;
                            font-weight: 400;
                            color: #008000;
                            line-height: .8rem;
                        }
                        &_freight {
                            font-size: $extra-size;
                            font-weight: 400;
                            color: $main-color;
                            line-height: .8rem;
                            // border: 1px solid $main-color;
                            border-radius: 3px;
                            // padding: 0 3.5px;
                        }
                    }
                    &_footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        &_price {
                            color: $price-color;
                            font-size: $params-title-size;
                            &_num {
                                font-size: $sub-title-size;
                                line-height: 2rem;

                                .goods_sta{
                                    font-size: $font-size-small;
                                    color: #fff;
                                    background: #999999;
                                    padding: 2px 4px;
                                    border-radius:3px; 
                                }
                            }
                        }
                        &_point {
                            color: $sub-title-color;
                            font-size: $extra-size;
                            &_symbol {
                                display: inline-block;
                                width: .52rem;
                                height: .52rem;
                                background:#FF3333;
                                border-radius:3px;
                                color: #fff;
                                font-size: $tag-size;
                                line-height: .52rem;
                                text-align: center;
                            }
                            &_num {
                                color: #FF3333;
                            }
                        }
                    }
                }
            }
    }

</style>

<style lang="scss">

    .van-radio__label{
    width:100%;
    }

</style>
