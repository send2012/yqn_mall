<template>
	<div class="place_order_entity">
        <nav-bar 
            title="订单确认"
            @back="BackTo"/>
        <div class="place_order_entity_user">
            <top-user-info
                style="margin-bottom: 5px;"
                :info="address_info"
            />
        </div>
        <div v-if="list_info['pros']">
            <bottom-goods-info 
                :list="list_info"
                :has_freight="has_freight"
                @popupCoupon="popUp"
                @selectFreight="selectWlid"
                @remark="remarkInput"
                @name="nameInput"
                @idcard="idcardInput"
                @selectPayType="selectedPayType"
            />
        </div>
		
        <div v-if="list_info">
            <van-submit-bar
                :price="list_info['sum_money']*100"
                label="合计："
                buttonText="提交订单"
                :loading="isSubmit"
                :disabled="isDisabled"
                @submit="onSubmit"
            />
        </div>

        <van-popup v-model="show" position="right">
            <coupon-list
                v-if="show"
                :coupon_list="list_info['coupon']"
                :paytype="buytype"
                @popupCoupon="popUp"
                @selectCouponReset="resetData"/>
        </van-popup>
		
	</div>
</template>

<script>
    import NavBar from '@/vue/components/NavBar/';
    import CouponList from './coupon-list.vue'
	import topUserInfo from "./top-user-info";
	import bottomGoodsInfo from './bottom-goods-info';
    import { SubmitBar, Popup } from 'vant';
    
    import { USER_ADDRESS_INFO } from '@/api/user'
    import { PRO_BUYLIST } from '@/api/cart'
    import { OREDER_GOODS_ADD } from '@/api/order'

	export default {
		
		data(){
			return {
				isSubmit: false,
                isDisabled: false,
                buytype: '',                //是否是从detail过来的
                address_info: null,      //获取的地址联系人
                total: 0,
                show: false,                //选择优惠券弹出层
                has_freight: false,             //是否有物流公司选择项
                form: {
                    address_id: '',             //选择的收货地址
                    wlid: '',                   //选择的物流
                    paytype: '',                //选择的支付方式
                    cou_ids: [],                //选择的优惠券
                    bz: '',                     //输入的备注
                    idname:'',                  //输入的姓名
                    idcard:''                   //输入的身份证号
                },
                list_info: {
                    sum_money: 0
                }             //预订购的列表其他信息
			}
        },
        
        created() {
            this.initAddressInfo();
            // this.initBuyList();
            this.$bus.$on('address_id', id => {
                this.initAddressInfo(id)
            })
        },

        computed: {
            totalPrice() {
                return this.list_info['sum_money']
            }
        },
		
		methods:{
            initAddressInfo(address_id) {
                //获取收货地址联系人
                this.$reqGet(USER_ADDRESS_INFO,{
                    address_id
                },{
                    hideLoading: true
                }).then(res => {
                    if(!(res.data instanceof Array)) {
                        sessionStorage.setItem('address_id',res.data.address_id);
                        
                        this.address_info = Object.assign({},res.data);
                    }else{
                    }
                    
                })
            },
            initBuyList(address_id,cou_ids,buytype) {
                //获取预提交订单列表
                this.$reqGet(PRO_BUYLIST,{
                    address_id,
                    cou_ids,
                    buytype
                }).then(res => {
                    //优惠券赋值
                    res.data.coupon.cous.map(item => {
                        if(item.selected === 1) {
                            this.form.cou_ids.push(item.id);
                        }
                    })
                    //是否需要显示物流公司
                    res.data.pros.map(item => {
                        if(item.shiptype == 2) {
                            this.has_freight = true;
                        }
                    })
                    Object.assign(this.list_info,res.data)
                })
            },
			onSubmit(){
                let address_id = sessionStorage.getItem('address_id') || '';
                let form = this.form;
                form['address_id'] = address_id;
                console.log(this.form)
                if(this.buytype){
                    form['buytype'] = this.buytype;
                }
                let flag = true;
                if(this.form.paytype === '') {
                    //未选择支付方式
                    this.$toast.fail({
                        position: 'middle',
                        message: '请选择支付方式'
                    })
                    flag = false;
                }else if(this.has_freight) {
                    //有物流公司行
                    if(this.form.wlid === '') {
                        this.$toast.fail({
                            position: 'middle',
                            message: '请选择物流公司'
                        })
                        flag = false;
                    } 
                
                }
                if(this.list_info.idcard != 0){
                    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                    if(!this.form.idname){
                        this.$toast.fail({
                        position: 'middle',
                        message: '请输入姓名'
                        })
                        flag = false;
                    }else if(!this.form.idcard){
                        this.$toast.fail({
                        position: 'middle',
                        message: '请输入身份证号'
                        })
                        flag = false;
                    }else if(!reg.test(this.form.idcard)){
                        this.$toast.fail({
                        position: 'middle',
                        message: '身份证号不合法'
                        })
                        flag = false;
                    }
                }
                if(flag) {
                    //将按钮loading开启
                    this.isSubmit = true;
                    this.$reqPost(OREDER_GOODS_ADD,form).then(res => {
                        this.isSubmit = false;
                        
                        if(res.data.pay_goods.length === 0) {
                            //需要支付的订单为空跳转到成功页面
                            let str = 'goods=' + res.data.goods + '&' + 'act=Topay'+'&'+'goodsdetail='+res.data.nopay_goods;
                            this.$router.replace({name: "paymentStatus", params: {status:str}})
                        }else if(res.data.nopay_goods.length === 0){
                            //不需要支付的订单为空则跳转到支付页面
                            console.log(res.data.pay_goods)
                            let str = res.data.pay_goods.join('_');
                            // alert(JSON.stringify (res.data.goods))
                            // alert(JSON.stringify(res.data.pay_goods))
                            this.$router.replace({name: "payment",params:{pay_id: str}})
                        }else{
                            //都不为空跳转混单页面
                            let param ={pay_goods:res.data.pay_goods,goods:res.data.goods}
                            this.$router.replace({name:'mixOrder',params:{order_id: JSON.stringify(param)}})
                        }
                        
                    })
                }
                

                //若是超过5000ms则自动取消掉loading
                setTimeout(()=>{
                    this.isSubmit = false;
                },5000)
				
            },
            popUp(reset_data,cou_ids) {
                //弹出关闭弹出层
                this.show = !this.show;
                //重置数据
                if(reset_data) {
                    this.list_info = Object.assign({},reset_data);
                    let arr = [];
                    arr.push(...this.list_info.coupon.cous);
                    //清空数据,并重置
                    this.list_info.coupon.cous.splice(0,this.list_info.coupon.cous.length);
                    this.list_info.coupon.cous.push(...arr);
                    this.form.cou_ids = cou_ids;
                }
            },
            selectWlid(id) {
                //子组件选择物流id后回调回父组件
                this.form.wlid = id;
                console.log('选择的物流方式=============',this.form.wlid)
            },
            remarkInput(value) {
                //子组件输入备注后的回调
                this.form.bz = value;
            },
            nameInput(value){
                if(value){
                    this.form.idname = value;
                }
            },
            idcardInput(value){
                if(value){
                    this.form.idcard = value;
                }
            },
            selectedPayType(value) {
                //子组件选择支付方式后的回调
                this.form.paytype = value;
                console.log('选择的支付方式=============',this.form.paytype)
            },
            BackTo() {
                //返回上一层路由
                this.$router.back(-1);
            }
		},
		
		components: {
            [NavBar.name]: NavBar,
            [CouponList.name]: CouponList,
            [SubmitBar.name]: SubmitBar,
            [Popup.name]: Popup,
			[topUserInfo.name]: topUserInfo,
			[bottomGoodsInfo.name]: bottomGoodsInfo,
        },
        
        beforeRouteEnter (to, from, next) {
            // ...
            next(vm => {
                let address_id = sessionStorage.getItem('address_id') || '';
                let cou_ids = vm.form.cou_ids;
                if(from.name === 'address') {
                    //从收获地址跳过来的
                    //清除从订单跳转标记
                    sessionStorage.removeItem('from_order');
                    setTimeout(()=>{
                        address_id = sessionStorage.getItem('address_id') || '';
                        vm.initBuyList(address_id,cou_ids,'');
                    },100)
                }else if(from.name === 'detail'){
                    //如果从详情点击立即购买,则带once,并保存到本地
                    sessionStorage.setItem('buytype','once');
                    vm.buytype = 'once';
                    vm.initBuyList(address_id,cou_ids,'once');
                }else if(from.name && from.name !== 'detail'){
                    vm.initBuyList(address_id,cou_ids,'');
                }else if(!from.name) {
                    //如果刷新页面
                    let buytype = sessionStorage.getItem('buytype');
                    if(buytype) {
                        //是在立即订购页面过来的,然后刷新了
                        vm.initBuyList(address_id,cou_ids,'once');
                    }else {
                        //从进货单进入后进行了刷新
                        vm.initBuyList(address_id,cou_ids,'');
                    }
                }
                // setTimeout(() => {
                //     let address_id = sessionStorage.getItem('address_id') || '';
                //     let cou_ids = vm.form.cou_ids;
                //     // vm.initAddressInfo(address_id);
                //     console.log(from.name)
                //     if(from.name === 'detail'){
                //         //如果从详情点击立即购买,则带once,并保存到本地
                //         sessionStorage.setItem('buytype','once');
                //         vm.buytype = 'once';
                //         vm.initBuyList(address_id,cou_ids,'once');
                //     }else if(from.name && from.name !== 'detail'){
                //         vm.initBuyList(address_id,cou_ids,'');
                //     }else if(!from.name) {
                //         //如果刷新页面
                //         let buytype = sessionStorage.getItem('buytype');
                //         if(buytype) {
                //             //是在立即订购页面过来的,然后刷新了
                //             vm.initBuyList(address_id,cou_ids,'once');
                //         }else {
                //             //从进货单进入后进行了刷新
                //             vm.initBuyList(address_id,cou_ids,'');
                //         }
                //     }
                // }, 100);
            })
        },

         beforeRouteLeave (to, from, next) {
            if(this.buytype && to.name) {
                //如果是从detail过来的,并且不是刷新
                sessionStorage.removeItem('buytype');
            }
            //因为将所有的组件进行了缓存，所以退出的时候要将其组件销毁
            if(to.name != 'address'){
                this.$destroy();
            }
			
			// ...
			next();
		}
	}
</script>


<style lang="scss" scoped>
	
	.place_order_entity{
        padding-top: 46px;
		padding-bottom: 70px;
        &_user {
            padding: 4px 7px;
        }
	}
</style>

<style lang="scss">
.place_order_entity {
    .van-submit-bar__text {
        text-align: left;
        padding-left: 10px;
    }
    .van-popup--right {
        bottom: 0;
        left: 0;
        height: 100%;
    }
}
</style>
