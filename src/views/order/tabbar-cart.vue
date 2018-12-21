<template>
  <div class="tab-cart">

        <nav-bar 
            title="进货单"
            @back="backTo"
            :no_more="true"
            :left_arrow="false"
        />
        <div ref="scroll_view" class="scroll_view">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="tab-cart_inner">
            <div class="tab-cart_inner_coupons" v-if="coupon.length !== 0">
                <div class="tab-cart_inner_coupons_left">
                    <span>优惠券</span>
                    <span>亲，你有优惠券可以领取</span>
                </div>
                <div class="tab-cart_inner_coupons_right" @click="showCoupon">
                    <span>去领券</span>
                    <van-icon name="yqn_rightIcon" />
                </div>
            </div>

            <van-checkbox-group class="card-goods" v-model="checkedGoods" @change="watchgoods" >
                <div class="card-goods_group" v-for="(cart,index) in carts" :key="index">
                    <!-- 满增满减活动头 -->
                    <cart-tag 
                        v-if="cart.typeid === 3 || cart.typeid === 4"
                        :tag_type="cart.typeid"
                        :tag_text="tag_desc[index]"
                        :prom_id="cart.prom_id"
                        />
                    <!-- 正常商品 -->
                    <div v-for="(item, i) in cart.pros" class="card-goods__item" :key="i">
                            <!-- 普通商品 -->
                            <van-checkbox
                                :key="item.pro_id"
                                :name="item.pro_id"
                                :disabled="item.sh === 0 || item.sh === 2 || item.num <= 0"
                            >
                            </van-checkbox>

                            <van-card
                                
                            >   
                                <div class="van-card__row" slot="thumb" @click="itemClick(item.pro_pid)" >
                                        <img v-lazy="item.picpath" alt=""  >
                                </div>
                                <div class="van-card__row" slot="title" @click="itemClick(item.pro_pid)"  >
                                    <div class="van-card__title"><van-tag plain type="danger" class="van-card__title_tag" v-if="item.owner === 0">自营</van-tag> {{item.title}}</div>
                                    <!-- <div class="van-card__price">{{item.price | yuan}}</div> -->
                                </div>
                                <div slot="desc" class="van-card__desc" @click="itemClick(item.pro_pid)" >
                                    <span>{{item.spec_title}}</span>
                                    <span>{{item.spec}}</span>
                                </div>
                                <div slot="tags" class="van-card__tags">
                                    <span v-if="item.zk" class="van-card__tags_off">{{item.zk*100}}折</span>
                                    <div>
                                        <span class="van-card__tags_price" v-if="item.sh === 1">
                                            ￥<span>{{item.price}}</span>
                                        </span>
                                        <span v-if="item.sh === 0" class="van-card__tags_undercarriage">已下架</span>
                                        <span v-if="item.sh === 2" class="van-card__tags_undercarriage">缺货</span>
                                        <van-stepper
                                            v-model="item.buynum"
                                            integer
                                            :min="1"
                                            :max="item.num"
                                            :step="1"
                                            @change="changeNum(index,i)"
                                        />
                                    </div>
                                    
                                    <!-- 占位 -->
                                    <div class="van-card__tags_slot"></div>
                                </div>
                                <!-- <div slot="footer" v-if="isEditor">
                                    <van-stepper v-model="item.num" disableInput/>
                                </div> -->
                                <div slot="footer" class="van-card__footer_freight">
                                    <span class="van-card__footer_freight_btns">
                                        <span 
                                            :style="(item.ship_type === 0 || item.ship_type === 1)?'':{color: '#999', border: '1px solid #999'}"
                                            :class="item.shiptype == '1'?'checked_freight':''"
                                            @click="checked_freight(item.sh,1,index,i)" >
                                            快递配送
                                        </span>
                                        <span 
                                            :style="(item.ship_type === 0 || item.ship_type === 2)?'':{color: '#999', border: '1px solid #999'}"
                                            :class="item.shiptype == '2'?'checked_freight':''" 
                                            @click="checked_freight(item.sh,2,index,i)" >
                                            物流配送
                                        </span>
                                    </span>
                                    <span class="cart_delete" @click="deleteCart(index,i)">删除</span>
                                </div>
                            </van-card>
                            
                            
                    </div>

                    <!-- 满赠品 -->
                    <div v-for="(item, i) in cart.mzplist" class="card-goods__item"  @click="itemClick(item.pro_pid)" :key="i">

                            <van-checkbox
                                :key="item.pro_id"
                                :name="item.pro_id"
                                disabled
                                class="card-goods__item_full_gifts"
                            >
                            </van-checkbox>

                            <van-card
                            >   

                                <div slot="thumb" >
                                    <img v-lazy="item.picpath" alt="">
                                    <div v-if="full_gift[index]>item.num"  class="notenough">库存不足</div>
                                </div>
                                <div class="van-card__row" slot="title">
                                    <div class="van-card__title" >
                                        <van-tag plain type="danger" class="van-card__title_tag" v-if="item.owner === 0">自营</van-tag>
                                        <van-tag plain type="danger" class="van-card__title_taggift" v-else>赠品</van-tag>
                                         {{item.title}}</div>
                                    
                                    <!-- <div class="van-card__price">{{item.price | yuan}}</div> -->
                                </div>
                                <div slot="desc" class="van-card__desc">
                                    <span> {{item.spec_title}}</span>
                                    <span>{{item.spec}}</span>
                                </div>
                                <div slot="tags" class="van-card__tags">
                                    <span v-if="item.zk" class="van-card__tags_off">{{item.zk*100}}折</span>
                                    <div>
                                        <span class="van-card__tags_price">
                                            ￥<span>0.00</span>x{{full_gift[index]>item.num?item.num:full_gift[index]}}
                                        </span>

                                        <span v-if="full_gift[index]>item.num">当前库存: {{item.num}}</span>
                                        <!-- <van-stepper
                                            v-model="item.buynum"
                                            integer
                                            :min="0"
                                            :max="item.num"
                                            :step="1"
                                            @change="changeNum(index,i)"
                                        /> -->
                                    </div>
                                    
                                    <!-- 占位 -->
                                    <div class="van-card__tags_slot"></div>
                                </div>
                                <!-- <div slot="footer" v-if="isEditor">
                                    <van-stepper v-model="item.num" disableInput/>
                                </div> -->
                                <!-- <div slot="footer" class="van-card__footer_freight">
                                    <span class="van-card__footer_freight_btns">
                                        <span 
                                            :style="(item.ship_type === 0 || item.ship_type === 1)?'':{color: '#999', border: '1px solid #999'}"
                                            :class="item.shiptype == '1'?'checked_freight':''"
                                            @click="checked_freight(1,index,i)" >
                                            快递发货
                                        </span>
                                        <span 
                                            :style="(item.ship_type === 0 || item.ship_type === 2)?'':{color: '#999', border: '1px solid #999'}"
                                            :class="item.shiptype == '2'?'checked_freight':''" @click="checked_freight(2,index,i)" >
                                            物流发货
                                        </span>
                                    </span>
                                    <span class="cart_delete" @click="deleteCart(index,i)">删除</span>
                                </div> -->
                            </van-card>
                            
                            
                    </div>

                    <!-- 赠品 -->
                    <div v-for="(item,i) in (gift_list[index] || [])" :key="i" class="card-goods__gift">
                        <span>【赠品】{{item.title}}  </span>
                        <span>x{{item.send_num*cart.pros[gift_list[index].index].buynum}}</span>
                    </div>

                    <!-- <div v-for="(item,i) in 8" :key="i" class="card-goods__gift">
                        <span>【赠品】wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww</span>
                        <span>x2</span>
                    </div> -->
                </div>
                
            </van-checkbox-group>

        </div>

        

		<!-- <div class="editor_head" v-show="goods.length">
			<van-icon :name="isEditor ? 'success' : 'editor'" />
			<span @click="isEditor = !isEditor">{{isEditor ? '完成' : '编辑'}}</span>
		</div> -->
   
    
    
		<div class="clear_invalid" v-if="iscleargood" @click="clearInvalid">
			<van-icon name="yqn_trashbin"/>
			清除失效商品
		</div>

        <div class="clear_invalid_slot" v-if="carts.length"></div>
		
    <!-- <is-empty v-if="!carts.length">进货单空空如也，快去购物吧</is-empty> -->

    <div class="tab-cart_empty" v-if="!carts.length">
        <img src="../../assets/images/cart-empty.png" alt="进货单空空如也">  
        <span>进货单空空如也，快去购物吧</span>  
        <div>
            <van-button plain @click="jumpTo">去逛逛</van-button>
        </div>  
    </div>


    <div class="tab-cart_you_like" v-if="!carts.length">
        <div class="you_like" v-if="goodsGroup.setting">
            <div class="you_like_title">
                <home-title 
                    :title="goodsGroup.setting.title"
                    :sub_title="goodsGroup.setting.sub_title"
                    :more="goodsGroup.setting.more" />
            </div>
			
            <van-list
                v-model="loading"
                class="scroll-load"
                :finished="finished"
                :immediate-check="false"
                :offset="100"
                @load="loadMore"

            >
                <item-group>
                    <item-card-doub
                        v-for="(item, i) in goodsGroup.items" 
                        :key="i"
                        :goods="item"
                        @click="itemClick(item.pro_pid)"
                    >

                    </item-card-doub>
                </item-group>
            </van-list>
		</div>
    </div>


    </van-pull-refresh>
    </div>

    <!-- 优惠券 -->
            <van-popup v-model="show_coupon" position="bottom">
            <div class="tab-cart_popup_coupon_content">
                <div class="tab-cart_popup_title" style="text-align:center;">
                    优惠券
                    <van-icon name="yqn_close" class="tab-cart_popup_title_close" @click="showCoupon"/>
                </div>
                
                <div v-if="coupon_receive.length !== 0">
                <div class="tab-cart_popup_title">
                    <span>可领取优惠券 <span class="tab-cart_popup_title_notice">领取后可用于进货单商品</span></span>

                </div>
                
                <div >
                    <span class="tab-cart_popup_coupon_content_title"></span>
                    <div v-for="(item,index) in coupon_receive" :key="index">
                        <yqn-coupon 
                            :key="index" 
                            :data="item"
                            :img_src="getImgBg(item)"
                            @toGetCoupon="getCoupon"
                        />
                    </div>
                    
                </div>
                </div>
                <div v-else class="tab-cart_popup_coupon_content_empty" >
                    
                    <img src="@/assets/images/cart/none_of_coupon.png" alt="">
                    <p class="tab-cart_popup_title_notice">暂无可领取优惠券</p>
                </div>
                    

             
                
                <div class="tab-cart_popup_title" v-if="coupon_use.length !== 0">
                    <span>可使用优惠券 <span class="tab-cart_popup_title_notice">领取后可用于进货单商品</span></span>
                    
                </div>


                    <div v-if="coupon_use.length !== 0">
                        <yqn-coupon 
                            v-for="(item,index) in coupon_use" 
                            :key="index" 
                            :data="item"
                            :img_src="getImgBg(item)"
                        />
                    </div>
                </div>
            </van-popup>

    <van-submit-bar
     	style="bottom: 50px"
        v-if="carts.length"
        :price="totalPrice"
        :disabled="!checkedGoods.length"
        buttonText="去结算"
		:loading="isSubmit"
        label="合计："
        @submit="cartSubmit"
     >
    	<van-checkbox v-model="checkedAll" @click.native="setCheckAll(checkedAll)" style="padding: 0 10px;" class="tab-cart_checkAll">全选</van-checkbox>
    </van-submit-bar>

    <transition name="fade">
        <!-- <van-icon 
            name="arrowupcircle" 
            class="backTop" 
            @click.native="backTop" 
            v-show="showArrow"
        /> -->
        <img 
            src="../../assets/images/topup.png" 
            alt="" 
            class="yqn-backToTop"
            @click="backTop" 
            v-show="show_arrow" />
    </transition>
    
  </div>
</template>

<script>
	import {
		Checkbox,
		CheckboxGroup,
		Card,
		SubmitBar,
        Stepper,
        PullRefresh,
    } from 'vant';
    
    import NavBar from "@/vue/components/NavBar/";
    import Cart_Tag from "./tab-cart_activity/";
    import Coupon from '@/vue/components/coupon/item_detail_coupon.vue';
    import computeTag from './compute.js'

    import HomeTitle from '@/vue/components/home-title/';
	import ItemGroup from "@/vue/components/item-group/";
	import ItemCardDoub from '@/vue/components/item-card-doub/';

    //引入底层图片
    import FREIGHT_IMG from "@/assets/images/user/mine_icon_Ticket_freight.png";
    import DEFAULT_IMG from "@/assets/images/user/mine_icon_Ticket_default.png";

    import { HOME_GOODS } from '@/config.js'

    import { PRO_LIST, PRO_EDIT, PRO_DEL, PRO_SUBSELECTED, PRO_SUBCLEAR } from '@/api/cart'
    import { COUPON_ADD } from "@/api/coupon";
    import { GROOM_LIST } from '@/api/product'

    import isEmpty from "@/vue/components/is-empty/";
    
    import loadMore from '@/vue/mixin/list-load-more';
	import scrollFixed from '@/vue/mixin/scroll-fixed';
	
	export default {
		data() {
			return {
				isEditor: false,
				checkedAll: false,
				isSubmit: false,
                checkedGoods: [],
                carts: [],              //购物车列表
                coupon: [],             //优惠券列表
                coupon_receive:[],      //可领取优惠券列表
                coupon_use:[],         //可使用优惠券列表
                show_coupon: false,     //展示优惠券弹出框
                gift_list: {},          //赠品列表
                goodsGroup: HOME_GOODS,     //猜你喜欢
                iscleargood:false,      //清除失效商品按钮是否显示
                isLoading:false,
                show_arrow: false,
				goods: [{
                        id: '1',
                        title: '进口香蕉',
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
                    }, {
                        id: '3',
                        title: '美国伽力果',
                        desc: '约680g/3个',
                        price: 2680,
                        status: 1,
                        num: 1,
                        thumb: 'https://img.yzcdn.cn/public_files/2017/10/24/320454216bbe9e25c7651e1fa51b31fd.jpeg'
                    }]
			};
        },
        
        mixins: [computeTag, loadMore, scrollFixed],
		
		activated(){
			this.checkedAll = false;
			this.isEditor = false;
            this.isSubmit = false;
        },

        watch: {
            checkedGoods: function(){
                this.tag_desc.splice(0,this.tag_desc.length);
                this.computeText()
            }
        },
        
        created() {
            // this.initData();
            
            console.log(this.carts)
        },

		computed: {
			submitBarText() {
				const count = this.checkedGoods.length;
				return this.isEditor ? "删除" : '结算' + (count ? `(${count})` : '');
			},
			totalPrice() {
                // return this.goods.reduce((total, item) => total + (this.checkedGoods.indexOf(item.id) !== -1 ? item.price * item.num : 0), 0);
                let total = 0;

                this.carts.map((item,index) => {
                    //分组进行价格的计算
                    let group_total = 0;            //此组总价格
                    let sub_total = 0;              //满减的金额
                    item.pros.map((i,j) => {

                        this.checkedGoods.map(good => {
                            if(i.pro_id == good) {
                                if(i.zk) {
                                    //如果有折扣(单种商品进行计算)
                                    group_total += Number(i.price * i.buynum * i.zk);
                                }else {
                                    group_total += Number(i.price * i.buynum);
                                }  
                            }
                        })

                    })
                    //满减需进行分组计算
                    if(item.typeid === 3) {
                        //如果有满减
                            //每满减
                            if(item.rule.type === 0) {
                                //阶梯满减
                               for(let i = 0; i <= item.rule.mx.length - 1; i++) {
                                    if(Number(group_total) < Number(item.rule.mx[i].money)) {
                                        if(i !== 0) {
                                            group_total = group_total - item.rule.mx[i-1]['jian'];
                                            return total += Number(group_total);
                                        }else {
                                            return group_total
                                        }
                                    }
                                }
                            }else if(item.rule.type === 1){
                                //每满减
                                let sub_time = 0;           //满减的次数
                                sub_time = parseInt(Number(group_total)/item.rule.mx[0]['money']);
                                group_total = group_total - item.rule.mx[0]['jian'] * sub_time;
                            }

                    }
                    
                    total += Number(group_total);
                    
                })

                return parseInt(total*100);
			},
		},

		methods: {
            initData() {
                return this.$reqGet(GROOM_LIST, {
					act: 'cart',
					pagesize: this.pages.perPage,
					page: this.pages.currPage
				}, {
					hideLoading: true
				}).then(res => {
                    const { list, hasmore } = res.data;
                    this.goodsGroup.items.push(...list);
                    this.has_more = hasmore;
					return hasmore
                })
            },
            initList() {
                //初始化订货单列表
                this.checkedGoods=[]
                this.$reqGet(PRO_LIST).then(res => {
                    const { coupon, list } = res.data;
                    this.carts.push(...list);
                    this.coupon.push(...coupon);
                    if(this.carts[0]){   
                        this.carts[0].pros.forEach((good,index)=>{
                            if(good.sh!=1){
                                this.iscleargood=true
                                return false
                            }
                        })
                    }

                    this.coupon.map(item=>{
                        if(item.zt===0){
                            this.coupon_receive.push(item)
                        }else{
                           this.coupon_use.push(item) 
                        }
                    })
                    // console.log('当前购物车===========',this.carts)
                    // console.log('当前优惠券===============',this.coupon)
                    if(list.length === 0) {
                        this.resetInit();
                    }
                    //默认选中
                    list.map((item,index)=>{
                        item.pros.map((i,idx) => {
                            if(i.selected && i.sh === 1) {
                                this.checkedGoods.push(i.pro_id)
                            }
                            //添加赠品
                            let json = {};
                            json[index] = i.zplist;
                            json[index].index=idx;
                            Object.assign(this.gift_list,json)
                        })
                    })
                    this.computeText();
                })
            },
            editPro(pro_id,buynum,shiptype,index,i) {
                let good = this.carts[index]['pros'][i];
                //修改购买数量，配送方式
                this.$reqPost(PRO_EDIT,{
                    pro_id,
                    buynum,
                    shiptype
                },{
                    hideLoading: true
                }).then(res => {
                    if(res.code === 200) {
                        //返回正常值
                        Object.assign(good,res.data);
                        if(this.carts[index].typeid == 3) {
                            //满减
                            this.computeFullSub(index)
                        }else if(this.carts[index].typeid == 4) {
                            //满赠
                            this.computeFullGifts(index)
                        }
                        this.$bus.$emit('cart_num',res.data.cart_sumnum)
                    }else if(res.code === 402) {
                        //商品库存为0
                        Object.assign(good,res.data);
                        //从checkGoods中删除此项
                        let flag = this.checkedGoods.indexof(pro_id);
                        if(flag != -1) {
                            //此项存在于选中项
                            this.checkedGoods.splice(flag,1);
                        }
                    }
                })
            },
            delPro(pro_id,index,i) {
                //删除商品
                this.$reqPost(PRO_DEL,{
                    pro_id
                }).then(res => {
                    if(res.code === 200) {
                        //删除本地数据
                        this.carts[index]['pros'].splice(i,1);
                        //若该组不存在商品则删除此组
                        if(this.carts[index]['pros'].length === 0) {
                            this.carts.splice(index,1);
                            //删除满赠列表中的数据
                            delete this.full_gift[index];
                            //删除赠品列表
                        }
                        this.$bus.$emit('cart_bus',res.data.cart_sumnum)
                        if(res.data.cart_sumnum == 0) {
                            this.resetInit();
                        }
                        this.$nextTick(() => {
                            this.deleteNext(pro_id)
                        })
                    }
                })
            },
			cartSubmit(){
                //批量删除功能（暂弃）
				// if(this.isEditor){
				// 	this.$dialog.confirm({message: "确定删除所选商品吗?", cancelButtonText: "再想想"}).then(() => {
				// 		this.goods = this.goods.filter( goods => (this.checkedGoods.indexOf(goods.id) == -1));
				// 		this.checkedGoods = [];
				// 		this.checkedAll = false;
				// 		this.isEditor = !this.goods.length;
				// 	})
				// }else{
				// 	this.isSubmit = true;
				// 	this.$router.push({name: "placeOrderEntity"})
                // }
                //确认订货单
                this.$reqPost(PRO_SUBSELECTED,{
                   pro_id:  this.checkedGoods
                }).then(res => {
                    if(res.code === 200) {
                        this.$bus.$emit('cart_num',res.data.cart_sumnum)
                        this.$router.push({name: "placeOrderEntity"})
                    }else if(res.code === 402){
                        if(res.data.maxnum) {
                            //超出限购量
                            this.$dialog.alert({
                                title: '提示',
                                message: res.data.title + '的限购量为' + res.data.maxnum + '件'
                            }).then(() => {
                                // on close
                            });
                        }else if(res.data.minnum) {
                            //低于起订量
                            this.$dialog.alert({
                                title: '提示',
                                message: res.data.title + '的起订量为' + res.data.minnum + '件'
                            }).then(() => {
                                // on close
                            });
                        }
                    }
                })
                
			},
			formatPrice(price) {
				return (price / 100).toFixed(2);
			},
			setCheckAll(val){
                const that=this
                //全选

                let checkedGoods = [];
                if(val) {
                    that.carts.map(item => {
                        item.pros.map(i => {
                            if(i.sh === 1) {
                                checkedGoods.push(i.pro_id);
                            }
                        })
                    })
                    that.checkedGoods = checkedGoods;
                }else{
                    that.checkedGoods = []
                }
				// this.checkedGoods = val ? this.carts.filter(goods => !!goods.status).map(goods => goods.id) : [];
			},
			deleteCart(index,i){
                //从购物车进行删除
				this.$dialog.confirm({message: "确定删除所选商品吗", cancelButtonText: "再想想"}).then(() => {
                    let pro_id = this.carts[index]['pros'][i]['pro_id'];
                    this.delPro(pro_id,index,i);
				})
			},
			deleteNext(goodsId){
                //删除选中的项
                this.isEditor = !!this.goods.length;
                this.tag_desc.splice(0,this.tag_desc.length);
				this.checkedGoods.forEach((goods, i) => {
					if(goods == goodsId){
                        this.checkedGoods.splice(i, 1);
                        //重新计算tag_title
                        this.computeText();
						// return false;
					}
				})
			},
			clearInvalid(){
				this.$dialog.confirm({
                    message: "确定清除所有失效商品吗?", 
                    cancelButtonText: "再想想"
                }).then(() => {
                    // this.goods = this.goods.filter(goods => goods.status)
                    this.$reqPost(PRO_SUBCLEAR).then(res => {
                        //清除下架无库存商品
                        this.initList();
                        this.resetInit();
                        this.iscleargood=false;
                    })
				})
            },
            showCoupon() {
                //显示优惠券的弹出框
                this.show_coupon = !this.show_coupon;
            },
            getImgBg(el) {
                //根据优惠券类型对优惠券底板进行渲染
                if(el.type === 0) {
                    return DEFAULT_IMG
                }else {
                    return FREIGHT_IMG
                }
                
                // return IMGS[status] || '';
            },
            countcheckedGoods(){
                // 计算选中多少个商品
                if(this.checkedGoods.length==this.carts[0].pros.length){
                    this.checkedAll=true
                }
                else{
                     this.checkedAll=false
                }
            },
            getCoupon(id) {
                //领取优惠券
                this.$reqPost(COUPON_ADD,{
                    cou_id: id
                }).then(res => {
                    if(res.code === 200) {
                        //成功领取优惠券
                        let index = '';
                        let obj = {};
                        this.coupon.map((item,i) => {
                            //从可领取删除，再在可使用添加
                            if(item.id === id) {
                                index = i;
                                item.zt = 1;
                                obj = Object.assign({},item);
                            }
                        })
                        this.coupon.splice(index,1);
                        // this.coupon_list.use.push(obj);
                    }
                })
            },
            changeNum(index,i) {
                //更改物品数量
                let good = this.carts[index]['pros'][i];
                const {pro_id, buynum, shiptype} = good;
                this.editPro(pro_id, buynum, shiptype, index, i);
                //默认选中单选
                if(this.checkedGoods.indexOf(pro_id) === -1) {
                    //原数组中不存在这个id
                    this.checkedGoods.push(pro_id);
                }
            },
            checked_freight(selct,id,index,i) {
                let good = this.carts[index]['pros'][i];
                if(selct!=1){
                    return false;
                }
                //选中物流的回调
                if(good.ship_type === 0) {
                    //可以选中物流或快递
                    this.$set(good,'shiptype',id);
                }else if(good.ship_type === 1) {
                    //只能选中快递
                    if(id === 2) {
                        this.$toast('该商品不支持物流配送');
                    }
                    this.$set(good,'shiptype',1);
                }else if(good.ship_type === 2) {
                    //只能选中物流
                    if(id === 1) {
                        this.$toast('该商品不支持快递配送');
                    }
                    this.$set(good,'shiptype',2);
                }

                const {pro_id, buynum, shiptype} = good;
                this.editPro(pro_id, buynum, shiptype, index, i);

                //默认选中单选
                if(this.checkedGoods.indexOf(pro_id) === -1) {
                    //原数组中不存在这个id
                    this.checkedGoods.push(pro_id);
                }
                
            },
            onRefresh(){
                // 下拉刷新
                console.log('asdsadasd',this.carts)
                this.carts=[],              //购物车列表
                this.coupon=[],             //优惠券列表
                this.coupon_receive=[],      //可领取优惠券列表
                this.coupon_use=[],         //可使用优惠券列表
                this.refresh();
            },

            async  refresh (){
                const result = await this.initList()
                if(this.carts.length == 0){
                    this.pages.currPage = 1;
                    const result1 = await this.resetInit();
                }
                this.isLoading = false;
                this.$toast({
                    message:'刷新成功'
                })
            },

            watchgoods(val){
                let totalnum=0
                this.carts.forEach(item=>{
                    totalnum+=item.pros.length
                })
                 if(this.checkedGoods.length==totalnum && this.checkedGoods.length!=0){
                     this.checkedAll=true
                 }else{
                     this.checkedAll=false
                    //  let index=0;
                    //  index=this.checkedGoods.indexOf(val);
                    //  this.checkedGoods.splice(index,1)
                 }
            },

            itemClick(id){
                // 跳转商品详情
                this.$router.push({name: "detail", params: {itemId: id}})
            },
            jumpTo() {
                //去逛逛
                this.$router.push({name: 'class'});
            },
            backTo() {
                //返回上一级
                this.$router.back(-1);
            },

            async isload(){
                if(this.carts.length === 0){
                    const result = this.initList()
                    if(this.carts.length === 0){
                        const result1 = this.resetInit()
                    }
                }else if(this.items === 0){
                    this.resetInit()
                }
            }
		},

		components: {
            [Card.name]: Card,
            [PullRefresh.name]: PullRefresh,
            [Stepper.name]: Stepper,
            [NavBar.name]: NavBar,
            [Cart_Tag.name]: Cart_Tag,
            [Coupon.name]: Coupon,
			[isEmpty.name]: isEmpty,
			[Checkbox.name]: Checkbox,
			[SubmitBar.name]: SubmitBar,
            [CheckboxGroup.name]: CheckboxGroup,
            [HomeTitle.name]: HomeTitle,
            [ItemGroup.name]: ItemGroup,
			[ItemCardDoub.name]: ItemCardDoub,
        },
        
        beforeRouteEnter (to, from, next) {
            // ...
            next(vm => {
                vm.isload();
            })
        },
        
        beforeRouteLeave (to, from, next) {
            //因为将所有的组件进行了缓存，所以退出的时候要将其组件销毁
            // if(to.name != 'detail'){
            //     this.$destroy();
			//     // ...
            // }
            this.$destroy();
			next();
		}
	}

</script>


<style lang="scss" scoped>
	
	@import "../../assets/scss/mixin";
	
	.tab-cart {
        .scroll_view {
            height: 100%;
            overflow-y: auto; 
            >div {
                min-height: 100%;
            }
        }
		padding-bottom: 50px;
        box-sizing: border-box;
        &_inner {
            padding-top: 46px;
            &_coupons {
                padding: 0 8px;
                height: 1.32rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #FCE7DE;
                &_left {
                    span {
                        &:nth-child(1) {
                            padding: 1px 3px;
                            color: $main-color;
                            border: 1px solid $main-color;
                            font-size: $tag-size; 
                            border-radius:3px; 
                        }
                        &:nth-child(2) {
                            color: $main-title-color;
                            font-size: $extra-size;
                            display: box;
                            box-orient: vertical;
                            line-clamp: 3;
                            overflow: hidden;
                        }
                    }
                }
                &_right {
                    color: $price-color;
                    span {
                        &:nth-child(1) {
                            font-size: $extra-size;
                        }
                    }
                    i {
                        font-size: $extra-size;
                    }
                }
            }
        }

        &_popup_title {
            width: 100%;
            height: 1.92rem;
            line-height: 1.92rem;
            text-align: left;
            position: relative;
            &_notice{
                font-size: $params-title-size !important;
                color: $sub-title-color !important;
            }
            span {
                font-size: $sub-title-size;
                color: $main-title-color;
                padding-left: 7px;
            }
            i {
                font-size: 14px;
                position: absolute;
                top: 35%;
                right: .6rem;
            }
           
        }
        &_popup_coupon_content {
            padding: 0 .3rem;
            height: 14.26rem;
            overflow-y: auto;
            &_title {
                display: inline-block;
                color: $main-title-color;
                font-size: $product-title-size;
                margin-bottom: .42rem;
            }&_empty{
                width: 100%;
                margin-bottom: .42rem;
                text-align: center;
                img{
                    width: 4rem;
                    margin: 0 auto;
                }
            }
        }
        &_checkAll {
            font-size: $extra-size;
        }

        &_empty {
            width: 100%;
            height: 6.08rem;
            padding-top: 1.32rem;
            flex-direction: column;
            display: flex;
            align-items: center;
            img {
                width: 3rem;
                height: auto;
                display: block;
            }
            >span {
                color: $explain-text-color;
                margin-top: .64rem;
            }
            >div {
                padding-top: .64rem;
                width: 100%;
                text-align: center;
            }
        }
        .you_like {
            &_title {
                padding: 0 .4rem 0 .6rem;
            }
        }
    }
    
    .van-card__row {
        .van-card__title {
            &_tag {
                position: static;
                height: .62rem;
                padding: 0 4px;
                // border: 1px solid $price-color;
                color: #fff !important;
                background: $price-color;
                font-size: $tag-size;
                border-radius: 3px;
                line-height: .62rem;
                vertical-align: middle
            }
            &_taggift {
                height: .62rem;
                padding: 0 4px;
                // border: 1px solid #FF6600;
                color: #FF6600 !important;
                // background: $price-color;
                font-size: $tag-size;
                border-radius: 3px;
                line-height: .62rem;
                vertical-align: center
            }
        }
    }

    .van-card__desc {
        max-width: 6.68rem;
        max-height: 1.28rem;
        display: flex;
        flex-direction: column;
        line-height: 16px;
        font-size: $extra-size;
        span {
            display: inline-block;
            max-width: 6.68rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    .van-card__tags {
        // margin-top: 5px;
        position: relative;
        &_off {
            position: absolute;
            top: 0;
            left: 0;
            color: $main-color;
            border: 1px solid $main-color;
            font-size: $tag-size;
            border-radius:3px;
            padding: 0 3px;
        }
        div {
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        &_price {
            font-size: $params-title-size;
            color: $price-color;
            span {
                font-size: $sub-title-size;
            }
        }
        &_slot {
            padding-top: 0 !important;
            height: 1.2rem;
        }
        &_undercarriage {
            background: $explain-text-color;
            color: #fff;
            font-size: $tag-size;
            padding: 1px 5px;
            border-radius:3px;
        }
    }

    .van-card__footer_freight {
        width: 8.2rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        &_btns {
            // width: 70%;
            display: flex;
            font-size: $extra-size;
            span {
                color: $main-title-color;
                display: inline-block;
                padding: 3px 8px;
                border-radius: 3px;
                border: 1px solid $sub-title-color;
                &:nth-child(2) {
                    margin-left: 8px;
                }
            }
        }
    }

	
	.editor_head {
		@include one-border;
		text-align: right;
		padding: 10px;
		font-size: $font-size-normal;
		background-color: #fff;
	}

	.card-goods {
        background-color: $bg-color;
        padding: 0 8px;
        &_group {
            background-color: #fff;
            margin-top: 5px;
        }

		.card-goods__item {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
            background-color: #fff;
            border-bottom:1px solid #F0F0F0;
            &_full_gifts {
                opacity: 0;
            }
        }
        &__gift {
            margin-left: 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-right: 6px;
            padding-bottom: 10px;
            span {
                &:nth-child(1) {
                    display: inline-block;
                    max-width: 10.2rem;
                    overflow: hidden;
                    white-space:nowrap;
                    text-overflow:ellipsis;
                }
            }
        }
		.cart_delete{
			color: $sub-title-color;
		}
		.card-goods__footer{
			font-size: $font-size-normal;
			color: $font-color-gray;
		}
	}
	
	.clear_invalid{
		width: 120px;
		color: $font-color-gray;
		border: 1px solid $font-color-gray;
        margin: 0 auto;
        margin-bottom: 20px;
		text-align: center;
        padding: 5px 3px;
		border-radius: 3px;
    }

    .clear_invalid_slot {
        width: 100%;
        height: 2rem;
    }
    
    //选中物流的样式
    .checked_freight {
        border-color: $main-color !important;
        color: $main-color !important;
        background: #FEF4ED !important;
    }

    

</style>
<style lang="scss">
.tab-cart {
    .van-submit-bar{
        box-shadow:0 3px 8px #000;
    }
    .card-goods {
        .van-checkbox {
            margin-left: 8px;
        }
        .van-card {
            padding-right: 5px;
            width: 13rem;
            height: auto;
            &__content{
                padding-bottom:.5rem;
            }
            .van-card__thumb{
                img{
                    height:3.6rem !important;
                }
                .notenough{
                    font-size: $params-title-size;
                    line-height: .72rem;
                    background: #525252;
                    color: #FFFFFF;
                    text-align:center;
                }
            }
        }
        .van-stepper__minus, .van-stepper__plus {
            width: 1rem;
            height: 1rem;
        }
        .van-stepper__input {
            width: 1.64rem;
            height: 1rem;
            padding: 0 !important;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
        }
        .van-card__footer {
            height: 1rem;
            width: 100%;
            padding: 0;
            right: 5px;
            bottom: 10px;
            display: flex;
            justify-content: flex-end;
        }
        
    }
    .van-submit-bar__text {
        text-align: left;
        @media screen and (max-width:320px){
            font-size:$font-size-small;
        }
    }
    .van-button--disabled {
        background: $explain-text-color;
        color: #fff;
    }
    &_empty {
        .van-button {
            // width: 3.32rem;
            height: 1rem;
            line-height: 1rem;
            color: $main-color;
            border: 1px solid $main-color;
            background: transparent;
            span {
                display: inline-block;
                height: 100%;
            }
        }
    }
}
.van-button--danger{
    border:none;    
}

</style>

