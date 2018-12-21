<template>
    <div class="order_list">
        <nav-bar title="物流详情" @back="backTo" />
        <div ref="scroll_view" class="scroll_view">
        <div v-if="items">
            <div class="order_list_info">
                <span>快递公司：{{items.wltitle}}</span>
                <div class="order_list_info_company" v-if="items.telephone || items.url">
                    <span class="order_list_info_company_tel" v-if="items.telephone">
                        <a :href="'tel:'+items.telephone">
                            <van-icon name="yqn_tel"></van-icon>
                            <span>{{items.telephone}}</span>
                        </a>
                    </span>
                    <span class="order_list_info_company_link" v-if="items.url">
                        <a :href="items.url">
                            <van-icon name="yqn_link"></van-icon>
                            <span>{{items.url}}</span>
                        </a>
                    </span>
                </div>
                <span class="order_list_info_address">收货地址：{{items.province + items.city + items.county + ' ' + items.address}}</span>
            </div>

            <div class="mine_wuliu">

                <!-- <div class="mine_wuliu_list">
                    <div class="mine_wuliu_list_tit">
                        <img :src="truck" alt="">
                        <span class="mine_wuliu_list_tit_text">包裹1：已签收</span>
                    </div>
                    <div class="mine_wuliu_list_cen">
                        <div class="mine_wuliu_list_cen_dh">百世快递：51163995406213</div>
                        <div class="mine_wuliu_list_cen_dh">【收货地址】河南省郑州市二七区 淮南街168号</div>
                        物流详情
                        <div class="mine_wuliu_list_cen_detil">
                            first
                            <div 
                                class="mine_wuliu_list_cen_detil_li first_li"
                                v-for="(item,index) in logistics"
                                :key="index"
                                v-if="expand?true:index === 0">
                                <div class="mine_wuliu_list_cen_detil_li_x"></div>
                                <div class="mine_wuliu_list_cen_detil_li_time">
                                    {{item.time}}
                                </div>
                                <div class="mine_wuliu_list_cen_detil_li_text">
                                    {{item.msg}}
                                </div>
                            </div>
                            <div class="mine_wuliu_list_cen_detil_li first_li">
                                <div class="mine_wuliu_list_cen_detil_li_x"></div>
                                <div class="mine_wuliu_list_cen_detil_li_time">
                                    2018-09-30 10:18:45 
                                </div>
                                <div class="mine_wuliu_list_cen_detil_li_text">
                                    开封市|开封市【开封市杞县】，【陈丽娟/18837836360】正在派件 
                                </div>
                            </div>
                            <div class="mine_wuliu_list_cen_detil_li first_li">
                                <div class="mine_wuliu_list_cen_detil_li_x"></div>
                                <div class="mine_wuliu_list_cen_detil_li_time">
                                    2018-09-30 10:18:14 
                                </div>
                                <div class="mine_wuliu_list_cen_detil_li_text">
                                    开封市|到开封市【开封市杞县】 
                                </div>
                            </div>
                            <div class="mine_wuliu_list_cen_detil_li first_li">
                                <div class="mine_wuliu_list_cen_detil_li_x"></div>
                                <div class="mine_wuliu_list_cen_detil_li_time">
                                    2018-09-30 03:27:51 
                                </div>
                                <div class="mine_wuliu_list_cen_detil_li_text">
                                    郑州市|郑州市【郑州转运中心】，正发往【开封市杞县】 
                                </div>
                            </div>
                            <div class="mine_wuliu_list_cen_detil_li first_li">
                                <div class="mine_wuliu_list_cen_detil_li_x"></div>
                                <div class="mine_wuliu_list_cen_detil_li_time">
                                    2018-09-29 23:28:07 
                                </div>
                                <div class="mine_wuliu_list_cen_detil_li_text">
                                    郑州市|到郑州市【郑州转运中心】 
                                </div>
                            </div>
                            <div class="mine_wuliu_list_cen_detil_li first_li">
                                <div class="mine_wuliu_list_cen_detil_li_x"></div>
                                <div class="mine_wuliu_list_cen_detil_li_time">
                                    2018-09-29 19:33:10 
                                </div>
                                <div class="mine_wuliu_list_cen_detil_li_text">
                                    郑州市|郑州市【郑州天明路分部】，【刘龙彬/13461101511】已揽收 
                                </div>
                            </div>
                        </div>
                        展开、收起
                        <div class="mine_wuliu_list_cen_detil_zk" data-type="1" style="display: block; transform: rotate(0deg);" @click="show_more">
                            <van-icon name="arrow" />
                        </div>
                    </div>
                </div> -->

                <div class="mine_wuliu_list" v-for="(bag,index) in items.list" :key="index">
                    <div class="mine_wuliu_list_tit">
                        <img v-lazy="truck" alt="">
                        <span class="mine_wuliu_list_tit_text">包裹{{index+1}}：{{bag.number}}</span>
                        <span class="mine_wuliu_list_tit_status">{{bag.status}}</span>
                    </div>
                    <div class="mine_wuliu_list_cen">
                        <!-- 物流详情 -->
                        <div class="mine_wuliu_list_cen_detil">
                            <!-- first -->
                            <div 
                                class="mine_wuliu_list_cen_detil_li first_li"
                                v-for="(item,i) in bag.items"
                                :key="i"
                                v-if="bag.expand?true:i === 0"
                                >
                                <div class="mine_wuliu_list_cen_detil_li_x" v-if="i !== 0"></div>
                                <div :class="'mine_wuliu_list_cen_detil_li_time ' + (i !== 0?'not_first_date':'') ">
                                    {{item.time}}
                                </div>
                                <div :class="'mine_wuliu_list_cen_detil_li_text ' + (i !== 0?'not_first_msg':'')">
                                    {{item.context}}
                                </div>
                            </div>
                            <!-- 查询无信息 -->
                            <div class="mine_wuliu_list_cen_detil_message">{{bag.message}}</div>
                            <!-- <div class="mine_wuliu_list_cen_detil_li first_li">
                                <div class="mine_wuliu_list_cen_detil_li_x"></div>
                                <div class="mine_wuliu_list_cen_detil_li_time">
                                    2018-09-30 10:18:45 
                                </div>
                                <div class="mine_wuliu_list_cen_detil_li_text">
                                    开封市|开封市【开封市杞县】，【陈丽娟/18837836360】正在派件 
                                </div>
                            </div>
                            <div class="mine_wuliu_list_cen_detil_li first_li">
                                <div class="mine_wuliu_list_cen_detil_li_x"></div>
                                <div class="mine_wuliu_list_cen_detil_li_time">
                                    2018-09-30 10:18:14 
                                </div>
                                <div class="mine_wuliu_list_cen_detil_li_text">
                                    开封市|到开封市【开封市杞县】 
                                </div>
                            </div>
                            <div class="mine_wuliu_list_cen_detil_li first_li">
                                <div class="mine_wuliu_list_cen_detil_li_x"></div>
                                <div class="mine_wuliu_list_cen_detil_li_time">
                                    2018-09-30 03:27:51 
                                </div>
                                <div class="mine_wuliu_list_cen_detil_li_text">
                                    郑州市|郑州市【郑州转运中心】，正发往【开封市杞县】 
                                </div>
                            </div>
                            <div class="mine_wuliu_list_cen_detil_li first_li">
                                <div class="mine_wuliu_list_cen_detil_li_x"></div>
                                <div class="mine_wuliu_list_cen_detil_li_time">
                                    2018-09-29 23:28:07 
                                </div>
                                <div class="mine_wuliu_list_cen_detil_li_text">
                                    郑州市|到郑州市【郑州转运中心】 
                                </div>
                            </div>
                            <div class="mine_wuliu_list_cen_detil_li first_li">
                                <div class="mine_wuliu_list_cen_detil_li_x"></div>
                                <div class="mine_wuliu_list_cen_detil_li_time">
                                    2018-09-29 19:33:10 
                                </div>
                                <div class="mine_wuliu_list_cen_detil_li_text">
                                    郑州市|郑州市【郑州天明路分部】，【刘龙彬/13461101511】已揽收 
                                </div>
                            </div> -->
                        </div>
                        <!-- 展开、收起 -->
                        <div :class="'mine_wuliu_list_cen_detil_zk ' + (bag.expand?'arrow_deg':'')" data-type="1" @click="show_more(index)" v-show="index !== 0 && !bag.message">
                            <van-icon name="yqn_rightIcon" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </div>

    </div>
</template>

<script>
import NavBar from "@/vue/components/NavBar/";
import topUserInfo from "@/views/order/place-order-entity/top-user-info";

import scrollFixed from "@/vue/mixin/scroll-fixed";
import TRUCK from "@/assets/images/truck.png";

import { SYS_TRACK_GET } from "@/api/system"

export default {
    name: "order-logistics",

    mixins: [scrollFixed],

    props: {
        active: {
            type: [String, Number],
            default: 0
        }
    },

    data() {
        const activeIndex = this.active;
        const shop_id = this.$util.getLocationParam("shop_id");
        return {
            shop_id,
            expand: false, //收起展开订单
            truck: TRUCK,           //卡车图片
            activeIndex,
            route_name: '',             //跳转后上个路由名称
            items: null,
            logistics: [
                {
                    time: "2018-09-30 16:25:37",
                    msg: "开封市|开封市【开封市杞县】，陈丽娟代签18837836360从前羞于告白，现在害怕没人点赞，请在评价小件员处给予五星好评！ 已签收"
                },
                {
                    time: "2018-09-30 10:18:45",
                    msg: "开封市|开封市【开封市杞县】，【陈丽娟/18837836360】正在派件"
                },
                {
                    time: "2018-09-30 10:18:45",
                    msg: "开封市|开封市【开封市杞县】，【陈丽娟/18837836360】正在派件"
                },
                {
                    time: "2018-09-30 10:18:45",
                    msg: "开封市|开封市【开封市杞县】，【陈丽娟/18837836360】正在派件"
                },
                {
                    time: "2018-09-30 10:18:45",
                    msg: "开封市|开封市【开封市杞县】，【陈丽娟/18837836360】正在派件"
                }
            ]
        };
    },

    watch: {
        $route(to, from) {
            
        }
    },

    created() {
        // this.initData();
    },

    mounted() {
        // this.initData();
    },

    methods: {
        checkListLog() {
            //通过路由判断不同种类的订单的物流追踪
            let name = this.route_name;
            if(name === 'user-order-list' || name === 'user-order-detail'){
                //从商品订单进入
                return ''
            }else if(name === 'user-point-record' || name === 'user-point-record-detail'){
                //从积分订单进入
                return 'point'
            }else if(name === 'user-order-pre-list' || name === 'user-preOrder-detail'){
                //从预售订单进入
                return 'presell'
            }else if(name === 'user-gift-record' || name === 'user-gift-record-detail'){
                //从奖品订单进入
                return 'prize'
            }else {
                //否则禁止进入路由，跳出并返回
                this.$router.back(-1);
            }
        },
        initData() {
            const i = this.active;
            let act = this.checkListLog();
            return this.$reqGet(
                SYS_TRACK_GET,
                {
                    goods: i,
                    act
                },
                {
                    hideLoading: false
                }
            ).then(res => {
                //判断是否折叠
                res.data.list.map((item,index) => {
                    item.expand = false;
                    if(index === 0) {
                        item.expand = true;
                    }
                })
                this.items = Object.assign({},res.data)
            });
        },
        getStatusText(status) {
            return STATUS_TEXT[status] || "";
        },
        expandCard(i) {
            //展开、收起订单
            let className = this.$refs["cardList" + i][0].className;
            if (className.indexOf("visible") === -1) {
                this.$refs["cardList" + i][0].className =
                    "order_list--panel_inner_normal visible";
                this.$refs["expand" + i];
                this.$refs["expand" + i][0].innerHTML = "收起";
            } else {
                this.$refs["cardList" + i][0].className =
                    "order_list--panel_inner_normal";
                this.$refs["expand" + i][0].innerHTML = "展开";
            }
        },
        backTo() {
            this.$router.back(-1);
        },
        show_more(index) {
            //展示更多
            console.log(this.items)
            this.$set(this.items.list[index],'expand',!this.items.list[index]['expand'])
        }
    },
    components: {
        [NavBar.name]: NavBar,
        [topUserInfo.name]: topUserInfo
    },
    beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
        vm.route_name = from.name;
        vm.initData();
    })
  },
};
</script>

<style lang="scss" scoped>
.order_list {
    padding-bottom: 0;
}
.scroll_view {
    height: 100%;
    overflow-y: auto; 
    background: $background-color;
}
.not_first_date {
    color: $explain-text-color !important;
}
.not_first_msg {
    color: $sub-title-color !important;
}
.arrow_deg {
    -webkit-transform:rotate(270deg);
    transform:rotate(270deg) !important;
    -webkit-transition:-webkit-transform 1s linear;
    transition:transform .5s linear;
}
.order_list_info {
    margin: 46px 8px 0;
    min-height: 50px;
    position: relative;
    background: #fff;
    padding: .6rem 1.6rem .6rem .88rem;
    display: flex;
    flex-direction: column;
    &_company {
        width: 100%;
        margin-top: .18rem;
        i {
            color: #333;
            font-size: .64rem;
        }
        span {
            color: #333;
        }
        >span {
            &:nth-child(2) {
                margin-left: 2.24rem;
            }
        }
    }
    span {
        &:nth-child(1) {
            color: $main-title-color;
            font-size: $product-title-size;
        }
        &:nth-child(2) {
            margin-top: .48rem;
            color: $main-title-color;
            font-size: $extra-size;
        }
    }
    &_address {
        margin-top: .18rem;
        color: $main-title-color;
        font-size: $extra-size;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
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
}
.mine_wuliu {
    // width: 100%;
    background-color: $background-color;
    padding: 5px 5px 10px;
    font-size: 12px;
}
.mine_wuliu_list {
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    padding-bottom: 12px;
    margin-bottom: 6px;
}
.mine_wuliu_list_tit {
    height: 45px;
    border-bottom: 1px solid #eee;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
}
.mine_wuliu_list_tit > img {
    width: 1rem;
    height: auto;
    margin-left: 10px;
}
.mine_wuliu_list_tit_text {
    font-size: $product-title-size;
    color: $main-title-color;
    margin-left: 5px;
}
.mine_wuliu_list_tit_status {
    font-size: $product-title-size;
    color: $sub-title-color;
    font-size: $extra-size;
    position: absolute;
    right: 8px;
}


.mine_wuliu_list_cen {
    padding: .64rem 10px;
    position: relative;
}
.mine_wuliu_list_cen_dh {
    padding-top: 5px;
    font-size: 13px;
}
.mine_wuliu_list_cen_address {
    padding-top: 5px;
    font-size: 13px;
}
.mine_wuliu_list_cen_detil {
    padding-top: 3px;
}
.mine_wuliu_list_cen_detil_li {
    position: relative;
    overflow: hidden;
}
.mine_wuliu_list_cen_detil_message {
    color: $explain-text-color;
    font-size: $params-title-size;
}
.mine_wuliu_list_cen_detil_li_x {
    width: 0;
    height: 20px;
    border-left: 1px solid #ccc;
    margin-left: 31px;
}
.mine_wuliu_list_cen_detil_li::after {
    content: "";
    display: block;
    width: 0;
    height: 100%;
    border-left: 1px solid #ccc;
    position: absolute;
    left: 31px;
    top: 60px;
}
.mine_wuliu_list_cen_detil_li:nth-last-child(1)::after {
    display: none;
}
.mine_wuliu_list_cen_detil_li_time {
    width: 68px;
    color: $main-color;
    float: left;
    text-align: center;
    background-color: #fff;
    z-index: 2;
}
.mine_wuliu_list_cen_detil_li_text {
    padding-left: 3.2rem;
    width: 70%;
}
/*.mine_wuliu_list_cen_detil_li.first_li .mine_wuliu_list_cen_detil_li_x{*/
/*border-left: 1px dashed #888;*/
/*}*/
.mine_wuliu_list_cen_detil_li.first_li .mine_wuliu_list_cen_detil_li_text {
    color: #f60;
}
/* å±•å¼€ã€æ”¶èµ· */
.mine_wuliu_list_cen_detil_zk {
    position: absolute;
    top: 40px;
    right: .52rem;
    display: block; 
    transform: rotate(90deg);
}
.mine_wuliu_list_cen_detil_zk .iconfont {
    font-size: 30px;
}

/*-----------------------------m-æ”¯ä»˜é¡µé¢------*/
.mine_pay_time {
    padding-top: 8px;
    padding-bottom: 10px;
    text-align: center;
    font-size: 20px;
    color: #f60;
}
.mine_pay_time .mine_pay_time_cen {
    margin-bottom: 2px;
    font-size: 13px;
    color: #666;
}
.xz_box_tab_con_xz_icon {
    width: 30px;
    height: 30px;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAezSURBVHjaxJh7cFTVGcB/5967r7ubbJJNINls3hAeCR1gqE5RUJRHwabQWqm1SCkdZSot+KCjLVrbaR21D6czHae2U+3gjLZiW2EMIJYCIuUhIPLGEJLdhGQhkOfu3s3u3kf/aBJZEzQEsd/+s/Odb8/+znfO+R5HnOo4wcmuE5zsPEEw0nCbpsdWxVKxSiFESiBMroNYWEKAUxJyqNhT8pcJWVV/60l1MzVvGqIz3sm/W7dKfzz1/JbzWniuhYUsZCQkLKzrwYMATCx000AIyHXmNcwLLLh5TtG8sPJBxyE2BP+58Ux33dyAu6jP/PqADAYTWFi0xFrKNze9+e5thXOq5ew7PfN3tG77eaEa4P8lmfZMQtFgjiSEpXQk2pdJQhrOvhM34mipGCkzhSQkXIoLVXajSMo1AZmWic+Zy6GLBxYq7b3tE1yyOui8CARCCLqTXVzQzmOTbPjdAapyJuGxedBNgwtamOZoE53JTtyKSr7qxybZMK2rvwtO2YmF5VNMy1A+vkJFUuhOdNESO0d55hh+NHktN+TdSIV3LAWqf8BO02Oc6a4jGGmkNrSRt5prkYVMcUYpAjESMEncsfn24+e1cJVLUQGwSTaaoiF0U+fHU37K8vH3Y5Nsw5rtWMdRfnHoCXa2bqc0owxVUTEsY1i/NSwDp+xqldI9YyMYacRt87D1jp2smLhy2DAAk3K+wPo5G1k79UlCkUZiepThnM80F/V/kYXMeS2Mqqisn7ORcVkTRnxIV09aw5PTfkkoEsIw9ZEBJc0kcUPj6Rt/yzjv+DSjV86s4yfvraEr0TloglA0yMN7f8CboTfS9A9UrebuMd8mFA1elZcUACEELbFzzAnMo6ZkUZrBvgt7WPL2MoiCW8lg7dQn08bv2XYXe+oOsm7US5z6ZiOjXKMHxlZVP8zO1u1ouoZTdg7fQ4ZlIhB8vWzxIIOxWZXUVMylrCifm/JnDBpfUnkvgUIfi8ruTIMBGOOt5Ob8GZzuPEGvEcfCQiA+OXrfsfn2442RhipVcbN+zgbKMioGGWl6jISRINuRM+Qkmh5DVdxoeozNTbWc7jqJQDDGW0lDTz21oY0kzSRhrQVF2Ch0B1AkJS0s9N8yBUA3DdyKm0ybd8g/VBU3quK+4qpUxc2r9S/zdvNbVOVMYlreDfjdhXhsGXy1dBGPTnmcNu0CB9r289rZV9jRuo1Mu5cC1U/KTA1xhvpSgzmCpJowEjyy94coko3npv+eHIdvSLt8tYCa0kXUlC7infAOVu1ewdmeesozx6BfBiX1x59IMkJnouOqc9B9u77DxOxqfjf9+SvCfFxuKZjFlgXbKfIU0RQJogglHcghO7jY28b+tr1XBfTrI09TqAZ4oGpVWhIeKmVYfZ9+8bsD/GnmOhyyg65k58Bhl/oTqVN28vrZvw4bpiV2jqZokLVTf5am/82RZ6h+vWLQ4h5/71G++I9JnOn+cEA3Mbua1ZPW0BZvG4CV+vkLVD/vXzrAc0efHRbQjtZtTPZNxWPzpOn3X9jDqbNBznTXpceztj0cajhBKBJK0y8oriHgKSKua+mRGiEoUP386oOneKPx758KFIoE+V+FmS5/mPki+763h3vG3Jum//MtL3Ng2X5mB+am6Ys8xUzMqqIr2fXRLQOwLBO34mGUK5+Vu++jK9nBd8fd/4kFm9eRNUif5xxFnnPUIH1ZRjllGeVD30C3n4SRQKR5qC84+Rw+fM5c1ux9kA+7Tl0RyCbZSRi9n0kJezHehl2yY13uoX7RLR1Nj1FTsnAg49c2beR4+1Fu8c+iMms8PkcuDtlBc7TpmmHORZs51nGEbEd2+pZdvhW6qXNX+bfoSHTw2L6H2NK8iUiqhxdPv0CBu5Ach4/67jpmB+axtHL5NQHVNm2gNdZCkaf4o1x2ecXYnwBLMso4fOkg7b2XqMgci02ykzQTxI04vXocRSgkzSQvzHyJWf7ZI4I5fOkgi/+1kAy7F5fswiE7W6WheiVJSBxtP4yqqIzPmogkJAxLRxYyHsVDrjMPnzMXEKz+z/epuyy2DFdC0SAr3l0OCDJt3o/HocEpwWvPwim7rlgTG5ZBobuQWCrGoq3zeSe8Y9gwp7tOMn/TLC7GLxDwFGNY+uCKcSSSMlOUZJSCZXH3tq+xYtcydp/fRSTVM2Rkb4w0ANAYCRLWzlPsKU1LrACKhSX4lKLp06BGuUaT7chhS1MtbzVtoiijhLKMcoo9JchCIRQNcqLzGHFdY2nlclZWP8iSsUvZ2ryJ0WpB2pUSX95068lLvRcnOGXXZ9KrG5ZB3IgTTUXQdA3LslBtKln2bCzLpL7nDNNHzyBfLeBI+/sDdZZpmdhle1jx2rNaGnrOTnC51Gt+7bCwkISEW3HjvkJBN9k3lXOxZsJaK1mOLPS+riRpJlEVNSIVugOvjaT1HakYloHX7u1rx/W+dlWivfcS+ap/n7Sw5M51PmdufVhrRRby5/7yIQmJnmQ3TsXF/OKvPCVVeCtSj015oiZfLYhe7G0jaSQ+t7ch3dJp720nYSRYXf3I4vlFC+qUtngbt/pvOx3WWgvXn331WQn5GykzKVtYukBct5crC0txSA7yMvP2FHtKH/rS6Jvqo6ko/x0AG5IlCYJv69gAAAAASUVORK5CYII=");
    background-size: 100% 100%;
    position: absolute;
    left: 10px;
    top: 10px;
}
</style>



