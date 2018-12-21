<template>
	<div class="order-goods order_enter">
        
		<van-cell-group class="order-goods_extra">
			<!-- <van-field v-model="remark" placeholder="请输入备注" label="订单备注">
				<template slot="icon">
					3/50
				</template>
			</van-field>
			
			<van-cell title="商品金额">
				<span class="red">{{720096 | yuan}}</span>
			</van-cell>
			<van-cell title="邮费" value="¥8.96"></van-cell>
			<van-cell title="税费" value="¥8.96"></van-cell>
			<van-cell title="多件随机优惠">
				<span class="red">{{1000 | yuan}}</span>
			</van-cell> -->
            


            <!-- 商品信息 -->
            <div :class="show_more?'':'order-goods_'">
                <!-- 只有一个商品 -->
            <!-- <div class="order-goods_self" v-if="delivery_courier.length==1">
                <span class="order-goods_self_title">快递配送</span>
                <van-card  
                    v-for="(item,index) in delivery_courier"
                    :key="index"
                    :thumb="item.picpath"
                    
                >
                    <div slot="title" class="order-goods_self_card_title">{{item.title}}</div>
                    <div slot="desc" class="order-goods_self_card_desc">
                        <span class="order-goods_self_card_desc_sku">{{item.spec_title}}</span>
                        <span class="order-goods_self_card_desc_freight">{{getSendWay(item.shiptype,index)}}</span>
                        <div slot="footer" class="order-goods_self_card_footer">
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

            </div>

            <div class="order-goods_self" v-if="delivery_logistics.length==1">
                <span class="order-goods_self_title">物流配送</span>
                <van-card  
                    v-for="(item,index) in delivery_logistics"
                    :key="index"
                    :thumb="item.picpath"
                    
                >
                    <div slot="title" class="order-goods_self_card_title">{{item.title}}</div>
                    <div slot="desc" class="order-goods_self_card_desc">
                        <span class="order-goods_self_card_desc_sku">{{item.spec_title}}</span>
                        <span class="order-goods_self_card_desc_freight">{{getSendWay(item.shiptype,index)}}</span>
                        <div slot="footer" class="order-goods_self_card_footer">
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

            <!-- 多个商品 -->
                <div  class="moregoodsbox" v-if="delivery_courier.length>=1" @click="goodspopup(delivery_courier,'快递发货')">
                    <span class="order-goods_self_title"><span>快递发货</span> <span class="courier">快递随机选择</span>   </span>
                    <van-cell :value="`共${delivery_courier.length}件`" >
                    <van-icon slot="right-icon" name="yqn_downArrow" class="goods-icon" />
                    <template slot="title">
                        <div class="order-goods_goodlist">
                            <img  v-for='(item,i) in delivery_courier' :key="i" :src="item.picpath" alt="">
                        </div>
                    </template>
                    </van-cell>
                </div>
                <div  class="moregoodsbox" v-if="delivery_logistics.length>=1" >
                    <span class="order-goods_self_title">物流配送 
                         <span class="logistics" @click="freightWay">{{freight_way_default}}<van-icon slot="right-icon" name="yqn_downArrow" class="goods-icon" /></span>
                    </span>
                    <van-cell @click="goodspopup(delivery_logistics,'物流配送')" :value="`共${delivery_logistics.length}件`" >
                    <van-icon slot="right-icon" name="yqn_downArrow" class="goods-icon" />
                    <template @click="goodspopup(delivery_logistics,'物流配送')" slot="title">
                        <div @click="goodspopup(delivery_logistics,'物流配送')"  class="order-goods_goodlist">
                            <img  v-for='(item,i) in delivery_logistics' :key="i" :src="item.picpath" alt="">
                        </div>
                    </template>
                    </van-cell>
                </div>

            <!-- <div class="order-goods_other">
                <span class="order-goods_other_title">其他仓发货</span>
                <van-card
                    v-for="item in goods"
                    :key="item.id" 
                    :title="item.title"
                    :desc="item.desc"
                    :num="item.num"
                    price="2.00"
                    :thumb="item.thumb"
                >
                    <div slot="title" class="order-goods_self_card_title">{{item.title}}</div>
                    <div slot="desc" class="order-goods_self_card_desc">
                        <span class="order-goods_self_card_desc_sku">{{item.desc}}</span>
                        <span class="order-goods_self_card_desc_freight">物流发货</span>
                        
                    </div>
                    <div slot="footer" class="order-goods_self_card_footer">
                        <span class="order-goods_self_card_footer_price">
                            ￥<span class="order-goods_self_card_footer_price_num">{{item.price}}*{{item.num}}</span>
                        </span>
                        <span class="order-goods_self_card_footer_point">
                            <span class="order-goods_self_card_footer_point_symbol">送</span>
                            <span class="order-goods_self_card_footer_point_num">{{item.price}}</span>
                            积分
                        </span>
                    </div>
                </van-card>
            </div> -->
        </div>
        <!-- <div class="order-goods_more">
            <span :class="show_more?'rotate':''" style="display: inline-block;">
                <van-icon name="yqn_more" class="order-goods_more_icon" @click="showMore"/>
            </span>
        </div> -->
            <!-- <div class="van-cell_logistics">
                <van-cell  title="物流公司"  :value="freight_way_default" is-link @click="freightWay" v-if="has_freight"></van-cell>
            </div> -->
           <div class="van-cell_pay">
                <van-cell title="支付方式" :value="pay_way_default"  is-link @click="payWay" class="order-goods_extra_cell_payWay "></van-cell>
            </div>
            
            <van-cell is-link @click="coupon" class="order-goods_extra_cell_coupon">
                <div slot="title" class="order-goods_extra_coupon">
                    <span>优惠券</span>
                    <span v-if="list.coupon_count > 0 && list.cou_selected_count === 0" class="order-goods_extra_coupon_text">选择优惠券</span>
                    <span v-if="list.coupon_count <= 0" class="order-goods_extra_coupon_text">无可用优惠券</span>
                    <span v-if="list.cou_selected_count > 0" class="order-goods_extra_coupon_selected">
                        <span>已选{{list.cou_selected_count}}张</span>
                        <span>优惠{{list.cou_money}}元</span>
                    </span>
                </div>
            </van-cell>
            <van-field
                class="martop5"
                v-model="idname"
                label="真实姓名:"
                @input='nameInput'
                v-if="list.idcard"
                placeholder="请输入真实姓名"
            />
            <van-field
                v-model="idcard"
                label="身份证号:"
                @input='idcardInput'
                v-if="list.idcard"
                placeholder="请输入身份证号"
            />
            <van-field v-model="remark" type="textarea"  rows="1"  :autosize="{maxHeight:72,minHeight:24}" placeholder="请输入备注信息" label="备注信息" class="order-goods_extra_cell_markdown" @input="remarkInput">
				<!-- <template slot="icon">
					3/50
				</template> -->
			</van-field>
            

            <van-cell title="赠送积分" :value=" '共' + list.sum_point + '分' "></van-cell>
            
            <van-cell class="order-goods_extra_cell_card">
                <div slot="title" class="order-goods_extra_msg">
                    <span class="order-goods_extra_msg_line" v-for="(item,index) in good_msg" :key="index">
                        <span v-if="item.num!='-￥0.00'&&item.num!='￥0.00'" class="order-goods_extra_msg_line_label">{{item.label}}</span>
                        <span v-if="item.num!='-￥0.00'&&item.num!='￥0.00'" class="order-goods_extra_msg_line_num red">{{item.num}}</span>
                    </span>
                    <!-- <span class="order-goods_extra_msg_line" v-if="pay_way_default=='在线支付,货到付款'">
                        <span class="order-goods_extra_msg_line_label">运费</span>
                        <span class="order-goods_extra_msg_line_num red">￥{{list.ship_money}}+运费到付</span>
                    </span>
                    <span class="order-goods_extra_msg_line" v-else>
                        <span class="order-goods_extra_msg_line_label">{{pay_way_default=='货到付款'?'运费':'快递运费'}}</span>
                        <span class="order-goods_extra_msg_line_num red">{{pay_way_default=='货到付款'?'运费到付':`￥${list.ship_money}`}}</span> -->
                    </span>
                </div> 
				<!-- <span class="red">{{720096 | yuan}}</span> -->
			</van-cell>

            <van-cell  v-if="pay_way_default=='在线支付,货到付款'"  title="运费" :value="`${list.ship_money}元+运费到付`" class="martop5 freight"></van-cell>
            <van-cell  v-else title="运费"  :value="pay_way_default=='货到付款'?'货到付款':`${list.ship_money}元`" class="martop5 freight"></van-cell>
		</van-cell-group>

        <!-- 商品列表浮层 -->
        <van-popup v-model="goodspopupshow" position="bottom">

              <div class="order-goods_payWay"  >
                  <div class="order-goods_payWay_title">
                    <span class="order-goods_payWay_title_text">商品清单 <span class="order-goods_payWay_title_num">({{pay_way}})</span></span>
                    
                    <span class="order-goods_payWay_title_num">{{`共${currentpopupgoods.length}件`}}&nbsp;&nbsp;&nbsp;<van-icon name="close" class="order-goods_payWay_title_symbol" @click="goodspopupshow=false"/></span>
                    
                </div>
                <van-card  
                    v-for="(item,index) in currentpopupgoods"
                    :key="index"
                    :thumb="item.picpath"
                >
                    <div slot="title" class="order-goods_self_card_title"> <span class="goods_notice" v-if="item.typeid!=0">{{item.typeid==1?'赠品':'满赠品'}}</span>  {{item.title}}</div>
                    <div slot="desc" class="order-goods_self_card_desc">
                        <span class="order-goods_self_card_desc_sku">{{item.spec_title}}</span>
                        <!-- <span class="order-goods_self_card_desc_freight">{{getSendWay(item.shiptype,index)}}</span> -->
                        <div slot="footer" class="order-goods_self_card_footer">
                        <span class="order-goods_self_card_footer_price">
                            <span class="order-goods_self_card_footer_price_num"> <span class="goods_sta" v-if="item.sh!=1">{{item.sh==0?'已下回':'没库存'}}</span> <span v-else>￥ {{item.price}}*{{item.buynum}}</span></span>
                        </span>
                        <span class="order-goods_self_card_footer_point">
                            <!-- <span class="order-goods_self_card_footer_point_symbol">送</span>
                            <span class="order-goods_self_card_footer_point_num">{{item.price}}</span>
                            积分 -->
                        </span>
                    </div>
                    </div>
                </van-card>
            </div>
        </van-popup>


        <!-- 支付方式浮层 -->
        <van-popup 
            v-model="show_pay_way" 
            position="bottom" 
            class="order-goods_payPop"
            lazy-render>
            <div class="order-goods_payWay" v-if="show_pay_way">
                <div class="order-goods_payWay_title">
                    <span class="order-goods_payWay_title_text">支付方式</span>
                    <!-- <span class="order-goods_payWay_title_symbol" @click="payWay">完成</span> -->
                    <van-icon name="yqn_close" class="order-goods_payWay_title_symbol" @click="payWay"/>
                </div>
                <div class="order-goods_payWay_self" v-if="both_way.length !== 0">
                    <div class="order-goods_payWay_self_imgs">
                        <img v-for="(item,index) in both_way" :key="index" :src="item['picpath']" alt="" />
                    </div>
                    <div class="order-goods_payWay_self_btns" >
                        <span :class="check_pay_line_1 === 0?'check_btn':''" @click="checkPayLine1(0)">在线支付</span>
                        <span :class="check_pay_line_1 === 1?'check_btn':''" @click="checkPayLine1(1)">货到付款</span>
                    </div>
                    <p>该商品支持线上付款或者货到付款</p>
                </div>
                <div class="order-goods_payWay_other" v-if="online_way.length !== 0">
                    <div class="order-goods_payWay_other_imgs">
                        <img v-for="(item,index) in online_way" :key="index" :src="item['picpath']" alt="" />
                    </div>
                    <div class="order-goods_payWay_other_btns">
                        <span :class="check_pay_line_2 === 0?'check_btn':''" @click="checkPayLine2(0)">在线支付</span>
                        <span class="check_disabled" @click="checkPayLine2(1)">货到付款</span>
                    </div>
                    <p>该商品仅支持线上付款</p>
                </div>
                <span class="order-goods_payWay_btn" @click="payWay">确定</span>
            </div>
        </van-popup>

        <!-- 物流公司弹出框 -->
        <van-popup v-model="show_freight_way" position="bottom">
            <van-picker :columns="columns"  show-toolbar  
            @cancel="onCancel"
            @confirm="onConfirm"/>
        </van-popup>

	</div>
</template>

<script>
    import { Card, Picker ,Toast } from 'vant';
    
    import { SYS_EXPRESS_LIST } from '@/api/system'
	export default {
		
        name: "bottom-goods-info",
        
        props: {
            list: {
                type: Object,
                default: () => {}
            },
            has_freight: {
                type: Boolean,
                default: false
            }
        },
		
		data(){
			return {
                remark: "",
                show_more: false,           //商品数量显示更多弹出框
                show_pay_way: false,         //商品支付方式弹出框
                check_pay_line_1: 0,          //自营商品选中项
                check_pay_line_2: 0,          //其他商品选中项
                show_freight_way: false,             //物流公司弹出框
                pay_way_default: '选择支付方式',        //支付方式值
                freight_way_default: '选择配送物流',        //物流公司
                freightway_current:'选择配送物流',          //当前物流公司
                pay_way:'',                     //弹出层支付方式
                both_way: [],                   //线上和线下
                online_way: [],                 //只有线上
                delivery_courier:[],            //快递
                delivery_logistics:[],          //物流
                idname:'',                      //全球购收货人姓名
                idcard:'',                      //全球购收货人身份证号
                goodspopupshow:false,           //模态框是否显示
                currentpopupgoods:[],           //模态框的商品列表
                columns: [],
                images: [
                    'https://img.yzcdn.cn/1.jpg',
                    'https://img.yzcdn.cn/2.jpg'
                ],
				goods: [{
					id: '1',
					title: '进口香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉香蕉',
					desc: '约250g，2根',
					price: 200,
					status: 0,
					num: 1,
					thumb: 'https://img.yzcdn.cn/public_files/2017/10/24/2f9a36046449dafb8608e99990b3c205.jpeg'
				}, {
					id: '2',
					title: '陕西蜜梨',
					desc: '约600g',
					price: 690,
					status: 1,
					num: 3,
					thumb: 'https://img.yzcdn.cn/public_files/2017/10/24/f6aabd6ac5521195e01e8e89ee9fc63f.jpeg'
                }],
                good_msg: []
			}
        },

        created() {
            this.initData();
            this.initPaytype();
            this.initShipName();
            this.initshiptype();
        },

        watch: {
            list() {
                this.initData();
            }
        },
        
        methods: {
            initData() {
                //组合运费，商品总价等信息
                this.good_msg=[];
                const { pro_money, zk_money, prom_minus, ship_money, cou_money } = this.list;
                this.good_msg.push(
                    {
                        label: '商品总价',
                        num: '￥'+ pro_money
                    },
                    {
                        label: '折扣优惠',
                        num: '-￥'+ zk_money
                    },
                    {
                        label: '满减优惠',
                        num: '-￥'+ prom_minus
                    },
                    {
                        label: '优惠券',
                        num: '-￥'+ cou_money
                    },
                    // {
                    //     label: '运费',
                    //     num: '￥'+ ship_money
                    // }
                )
            },
            getSendWay(shiptype,index) {
                //获取配送方式
                let good = this.list['pros'][index];
                switch(shiptype) {
                    case '1': 
                        //快递
                        return '快递配送 运费：' + good['ship_price']*good['buynum'] +  '元';
                    case '2':
                        //物流
                        return '物流配送 运费到付'
                }
            },
            initPaytype() {
                //根据付款方式分配组
                this.list.pros.map(item => {
                    if(item.paytype === 0) {
                        //线上线下
                        this.both_way.push(item)
                    }else if(item.paytype === 1){
                        //只能线上
                        this.online_way.push(item)
                    }
                })
            },
            initshiptype() {
                //根据配送类型分配组
                this.list.pros.map(item => {
                    if(item.shiptype == 1) {
                        //快递
                        this.delivery_courier.push(item)
                    }else if(item.shiptype == 2){
                        //物流
                        this.delivery_logistics.push(item)
                    }
                })
                // console.log(222222222222,this.delivery_logistics)
            },
            initShipName() {
                //获取物流公司
                this.$reqGet(SYS_EXPRESS_LIST,{
                    lx:0,
                    ownerby:1
                },{
                    hideLoading: true
                }).then(res => {
                    res.data.map(item => {
                        item.text = item.title;
                    })
                    this.columns.push(...res.data)
                })
            },
            showMore() {
                this.show_more = !this.show_more
            },
            payWay() {
                //打开后对支付方式进行赋值
                if(!this.show_pay_way) {
                    this.$emit('selectPayType',1)
                }
                //选择支付方式
                this.show_pay_way = !this.show_pay_way;
                if(this.pay_way_default == '货到付款' && this.online_way.length!==0) {
                    this.pay_way_default = '在线支付,货到付款'
                    this.$emit('selectPayType',0);
                }else if(this.pay_way_default == '选择支付方式'){
                    this.pay_way_default = '在线支付'
                    this.$emit('selectPayType',1);
                }else{

                }
            },
            checkPayLine1(id) {
                //支付方式第一行选中项
                this.check_pay_line_1 = id;
                if(id === 1) {
                    this.pay_way_default = '货到付款'
                    this.$emit('selectPayType',0);
                }else {
                    this.pay_way_default = '在线支付';
                    this.$emit('selectPayType',1);
                }
            },
            checkPayLine2(id) {
                //支付方式第二行选中项
                if(id === 1) {
                    this.$toast('该商品不支持货到付款');
                }else {
                    this.check_pay_line_2 = id;
                }
                
            },
            freightWay() {
                this.show_freight_way = !this.show_freight_way;
            },
            onChange(picker, value, index) {
                //选择物流回调
                this.freight_way_default = value.title;
                //选择物流后改变物流的id
                this.$emit('selectFreight',value.id);
            },
            remarkInput(value) {
                //输入备注信息回调
                this.$emit('remark',value);
            },
            nameInput(value){
                this.$emit('name',value)
            },
            idcardInput(value){
                this.$emit('idcard',value)
            },
            coupon() {
                //选择优惠券弹出层
                this.$emit('popupCoupon')
            },
            // jumpToDetail(pro_pid) {
            //     //跳转到详情页
            //     this.$router.push({name: 'detail', params: {itemId: pro_pid}})
            // },

            goodspopup(data,status){
                // 打开商品列表信息
                this.goodspopupshow=true;
                this.currentpopupgoods=data;
                this.pay_way = status;
            },

             beforeRouteLeave (to, from, next) {
                this.$destroy();
                next()
            },
            onConfirm(value, index) {
                // Toast(`当前值：${value}, 当前索引：${index}`);
                this.freight_way_default = value.title;
                //选择物流后改变物流的id
                this.$emit('selectFreight',value.id);
                this.show_freight_way=false
            },
            onCancel() {
                Toast('已取消选择');
                this.show_freight_way=false
            }
        },
		
		components: {
            [Card.name]: Card,
            [Picker.name]: Picker
		}
	}
</script>
<style lang="scss" scoped>
    .martop5{
        margin-top:5px; 
    }
    .rotate {
        -webkit-transform:rotate(180deg);
        transform:rotate(180deg);
        -webkit-transition:-webkit-transform 1s linear;
        transition:transform .3s linear;
    }

	.order-goods{
		// background-color: #fff;
        // padding: 8px;
        .moregoodsbox{
            margin-top:0.2rem; 
        }
        &_ {
            // height: 4.5rem;
            padding-top: 5px;
            // overflow: hidden;
            background: #f7f7f7;
            &goodlist{
                max-width:8rem;
                height:2rem;
                overflow-x:scroll;
                white-space:nowrap;
                img{
                    vertical-align: middle;
                    height: 100%;
                    margin-left: 4px;
                }
            }
            &self {
                margin-top: 0.2rem;
                &_title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 1.4rem;
                    font-size: $product-title-size;
                    color: #333;
                    font-weight: 500;
                    line-height: 1.4rem;
                    padding:0 6px 0 15px; 
                    background: #fff;
                    .courier{
                        font-size: $extra-size;
                        color: #999999;
                    }
                    .logistics{
                        font-size: $extra-size; 
                        color: #333333;
                    }
                }
                &_card {
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
            // &other {
            //     &_title {
            //         display: block;
            //         height: 35px;
            //         font-size: 16px;
            //         color: #333;
            //         font-weight: 500;
            //         line-height: 35px;
            //     }
            //     &_card {
            //         &_title {
            //             font-size: 14px;
            //             color: #333;
            //             font-weight: 400;
            //             line-height: 18px;
            //         }
            //         &_desc {
            //             &_sku {
            //                 display: block;
            //                 font-size: 12px;
            //                 font-weight: 400;
            //                 color: #666;
            //                 line-height: 20px;
            //             }
            //             &_freight {
            //                 font-size: 10px;
            //                 font-weight: 400;
            //                 color: #FF6600;
            //                 line-height: 20px;
            //                 border: 1px solid #FF6600;
            //                 border-radius: 3px;
            //                 padding: 0 3.5px;
            //             }
            //         }
            //         &_footer {
            //             display: flex;
            //             justify-content: space-between;
            //             align-items: center;
            //             &_price {
            //                 color: #FF3300;
            //                 font-size: 13px;
            //                 &_num {
            //                     font-size: 16px;
            //                 }
            //             }
            //             &_point {
            //                 color: #666;
            //                 font-size: 12px;
            //                 &_symbol {
            //                     display: inline-block;
            //                     width:13px;
            //                     height:13px;
            //                     background:#FF3333;
            //                     border-radius:3px;
            //                     color: #fff;
            //                     font-size: 10px;
            //                     line-height: 13px;
            //                     text-align: center;
            //                 }
            //                 &_num {
            //                     color: #FF3333;
            //                 }
            //             }
            //         }
            //     }
            // }
            &more {
                width: 100%;
                display: inline-block;
                text-align: center;
                background: #fff;
                &_icon {
                    transform:rotate(90deg);
                }
            }
        }
        
        &_extra {
            &_cell_payWay, &_cell_markdown, &_cell_coupon, &_cell_card {
                margin-top: 5px;
            }
            &_coupon {
                display: flex;
                justify-content: space-between;
                &_text {
                    color: $explain-text-color;
                    font-size: $product-title-size;
                }
                &_selected {
                    span {
                        &:nth-child(1) {
                            font-size: $tag-size;
                            color: $main-color;
                            padding: 1px 7px;
                            border: 1px solid $main-color;
                            border-radius: 8px;
                        }
                        &:nth-child(2) {
                            font-size: $extra-size;
                            color: $main-title-color;
                        }
                    }
                }
            }
            &_msg {
                display: flex;
                flex-direction: column;
                &_line {
                    display: flex;
                    justify-content: space-between;
                    font-size: $params-title-size;
                    &_label {
                        color: $main-title-color;
                    }
                    &_num {
                        color: $price-color;
                    }
                }
            }
        }
        
        &_payPop {
            width: 100%;
        }
        &_payWay {
            height: 17.64rem;
            padding: .4rem;
            position: relative;

            &_title{
                // padding: .4rem;
                font-size: $sub-title-size;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: .6rem;
                &_text{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                &_num{
                    font-size: $extra-size;
                    float: right;
                    padding:0 .2rem;
                    display: flex;
                    align-items: center;

                }
            }
            
        
            &_self {
                 p{
                    color: #999999;
                    font-size:$extra-size; 
                }
                &_imgs {
                    display: inline-block;
                    width: 100%;
                    white-space:nowrap;
                    overflow-x: auto;
                    img {
                        width: 2.6rem;
                        height: 2.6rem;
                        margin-right: 10px;
                    }
                    &_sellf_title{
                        padding-left:15px;
                    }
                }
                &_btns {
                    margin-top: 10px 0;
                    span {
                        padding: 2px 3px;
                        border: 1px solid $explain-text-color;
                        border-radius: 3px;
                        font-size: $product-title-size;
                        display: inline-block;
                        &:nth-child(2) {
                            margin-left: 10px;
                        }
                    }
                }
                
            }
            &_other {
                p{
                    color: #999999;
                    font-size:$extra-size; 
                }
                &_imgs {
                    display: inline-block;
                    width: 100%;
                    white-space:nowrap;
                    overflow-x: auto;
                    img {
                        width: 2.6rem;
                        height: 2.6rem;
                        margin-right: 10px;
                    }
                }
                &_btns {
                    margin-top: 10px 0;
                    span {
                        padding: 2px 3px;
                        border: 1px solid #999;
                        border-radius: 3px;
                        font-size: $product-title-size;
                        display: inline-block;
                        &:nth-child(2) {
                            margin-left: 10px;
                        }
                    }
                }
            }

            &_btn {
                display: block;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 1.76rem;
                background: $linear-color;
                text-align: center;
                line-height: 1.76rem;
                color: #fff;
            }

        }
	}
    .check_disabled {
        border-color: $explain-text-color !important;
        color: $explain-text-color !important;
    }

    .check_btn {
        border-color: $main-color !important;
        background: #FEF4ED !important;
        color: $main-color !important;
    }
</style>
<style lang="scss">

    .order-goods{
        .van-field__control{
            min-height: 24px !important;
        }
        .van-cell__title{
            // height: 100vh;
            font-size:$product-title-size !important;
        }
        .van-cell{
            -webkit-align-items:flex-start !important;
            align-items: center !important;
        }
        .goods-icon{
            margin:0 .3rem;
            font-size: $product-title-size !important;
        }
    }

    .van-picker__cancel, .van-picker__confirm{
        color:$main-title-color;
    }
    .van-picker__toolbar{
        background:rgba(246,246,246,1);
    }
    .van-cell{
        align-items:center !important;
    }
    .order-goods {
        .van-card {
            height: 4.3rem;
        }
        .freight{
            .van-cell__value{
                color:#fe0101 !important;
            }
        }
        .van-cell-group {
            background-color: $background-color;
            padding-bottom:2rem;
        }
        .van-cell {
            padding-right: 5px;
        }
        i.van-cell__right-icon {
            position: relative;
        }
        .van-card__footer {
            // padding-left: 5rem;
        }
        .van-card__thumb img{
            max-height:80%;
        }
        .van-card:not(:first-child) {
            margin-top: 0;
        }
        .van-cell_pay{
            .van-cell__value{
                color:#FF6600 !important;
            }
        }
        .van-cell_logistics{
            border-top:1px solid #F2F2F2;
            .van-cell__value{
                  color:#999999 !important;
            }
        }
    }
</style>
