<template>
    <div class="wap" v-title="'抽奖'" ref="wap">
        <div class="banner">
            <img class="bannerImg" src="../../../assets/images/activity/lottery/banner.png" alt="">
            <div class="prizeInfoBtn" @click="lotteryRecord" v-show="hasRecord">
                <img class="prizeInfoBtnImg" src="../../../assets/images/activity/lottery/prizeInfo.png" alt="">
            </div>
            <div class="priceChanceBtn">
                您有{{remainingTimes}}次抽奖机会
            </div>
            <div class="whiteBar1 whiteBar">
                <img src="../../../assets/images/activity/lottery/whiteBar.png" alt="">
            </div>
            <div class="whiteBar2 whiteBar">
                <img src="../../../assets/images/activity/lottery/whiteBar.png" alt="">
            </div>
            <div class="whiteBar3 whiteBar">
                <img src="../../../assets/images/activity/lottery/whiteBar.png" alt="">
            </div>
            <div class="whiteBar4 whiteBar">
                <img src="../../../assets/images/activity/lottery/whiteBar.png" alt="">
            </div>
        </div>
        <div class="box">
            <div v-for="imgLi in prizeList" :key="imgLi.picUrlDesc" ref="pice" :style="{'backgroundImage':'url('+imgLi.bgSrc+')'}">
                <img :src="imgLi.picUrlDesc" v-if="imgLi.picUrlDesc" />
            </div>
        </div>
        <div class="prizers">
            <div class="prizeBar">
                <img src="../../../assets/images/activity/lottery/prizers.png" alt="">
            </div>
            <div class="prizer">
                <div class="prizeIcon">
                    <img src="../../../assets/images/activity/lottery/prizeIcon.png" alt="">
                </div>
                <div class="prizerList" id="prizerList">
                    <ul id="prizerList1">
                        <li v-for="item in prizers" :key="item.id">
                            <span>{{item.name}}</span>
                            <span>{{item.mobile| mobileTurn}}</span>
                            <span class="prizeName">{{item.commodityName}}</span>
                        </li>
                    </ul>
                    <ul id="prizerList2"></ul>
                </div>
            </div>
        </div>
        <div class="info">
            <div class="title">
                <div class="squire squire1">
                    <img src="../../../assets/images/activity/lottery/three.png" alt="">
                </div>
                <span>奖品说明</span>
                <div class="squire squire2">
                    <img src="../../../assets/images/activity/lottery/three.png" alt="">
                </div>
            </div>
            <div class="infoContent">
                <ul>
                    <li v-for="(item,index) in prizeDesc" :key="index"> {{item}}</li>
                </ul>
            </div>
        </div>
        <div class="info">
            <div class="title">
                <div class="squire squire1">
                    <img src="../../../assets/images/activity/lottery/three.png" alt="">
                </div>
                <span>活动说明</span>
                <div class="squire squire2">
                    <img src="../../../assets/images/activity/lottery/three.png" alt="">
                </div>
            </div>
            <div class="infoContent">
                <ul>
                    <li v-for="(item,index) in lotteryDesc" :key="index"> {{item}}</li>
                </ul>
            </div>
        </div>

        <div class="massage" v-show="prizeInfoShow" @touchmove="touchMove($event)">
            <div class="noPrize" v-if="noPrizeShow">
                <div class="close" @click="close()">
                    <img src="../../../assets/images/activity/lottery/close.png" alt="">
                </div>
                <p>很遗憾，您没有中奖</p>
                <div class="xiaofu">
                    <img src="../../../assets/images/activity/lottery/noprizeXF.png" alt="">
                </div>
                <div class="btn" @click="goIndex">
                    去逛逛吧
                </div>
            </div>
            <img src="../../../assets/images/activity/lottery/circleLight.png" class="circleLight" v-if="havePrizeShow" alt="">
            <div class="havePrize" v-if="havePrizeShow">
                <div class="oneBar">
                    <img src="../../../assets/images/activity/lottery/yellowCycle.png" />
                </div>
                <p>恭喜您抽中{{prizeName}}</p>
                <div class="proImg">
                    <img :src="prizeUrl" alt="">
                </div>
                <div class="btn" @click="lotteryRecord">
                    <a>立即领取</a>
                </div>
            </div>
            <div class="haveLottery" v-if="haveLottery">
                <div class="close" @click="close()">
                    <img src="../../../assets/images/activity/lottery/close.png" alt="">
                </div>
                <div class="xiaofu">
                    <img src="../../../assets/images/activity/lottery/receivedXF1.png" alt="">
                </div>
                <p>您已经抽过奖啦，不要太贪心哦！</p>
                <div class="btn" @click="close()">
                    我知道啦
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import noSelect from "@/assets/images/activity/lottery/border.png";
import isSelect from "@/assets/images/activity/lottery/borderSelect.png";
import notStart from "@/assets/images/activity/lottery/noStart.png";
import endLottery from "@/assets/images/activity/lottery/endLottery.png";
import prizeBtn from "@/assets/images/activity/lottery/prizeBtn.png";

import INFO from "../../../../static/data/lotteryInfo.json";

import {
    PROMOTE_PRIZE_INFO,
    PROMOTE_PRIZELOG_LIST,
    PRIZE_BEFORE_INFO,
    START_PRIZE_INFO
} from "@/api/activity.js";

export default {
    data() {
        return {
            swiperName: {
                // 获奖名单
                loop: true, // 当获奖人数大于等于5的时候滚动，否则不滚动
                direction: "vertical",
                slidesPerView: 5,
                freeMode: true,
                freeModeMomentum: true,
                freeModeMomentumVelocityRatio: 1,
                autoplay: 1000
            },
            // mobile: '15114785236',
            prizeIndex: 0,
            arrNum: [0, 1, 2, 5, 8, 7, 6, 3], // 定义转动的顺序
            clickFlage: true, // 点击事件，防止重复点击

            prizeInfoShow: false, // 显示中奖信息的遮罩层
            noPrizeShow: false, // 没中奖
            havePrizeShow: false, // 中奖了
            haveLottery: false, // 已经抽过奖了
            timer1: "",
            timer2: "",
            s1: "",
            s2: "",
            // lotteryDefineId: '3eb7b32ba51b4f9486e3dd368dad24c4', // 抽奖活动的id
            lotteryDefineId: this.$route.query.id, // 抽奖活动的id
            winnerNum: "20",
            prizeDesc: [], // 奖品说明
            lotteryDesc: [], // 活动说明
            hasRecord: false, // 是否显示获奖情况
            remainingTimes: "", // 剩余抽奖次数
            prizeList: [], // 奖项列表
            prizeLevel: "", // 中奖等级
            prizeName: "", // 奖品名称
            prizeUrl: "", // 奖品图片
            prizers: [], // 获奖名单
            timeFlag: 0, // 时间标记，抽奖请求时间过长，则返回错误
            startStatus: "" // 活动开始的状态
        };
    },
    created() {
        this.getUserInfo();
        this.getPrizeInfo();
        this.getLogList();
        this.startGame();
    },
    beforeRouteEnter(to, from, next) {
        document.title = "抽奖";
        next();
    },
    mounted() {
        this.$nextTick(() => {
            this.get();
        });
    },

    // 销毁组件重新加载
    deactivated() {
        this.$destroy();
    },
    methods: {
        getUserInfo() {
            //获取用户信息,抽奖前的预检
            this.$reqGet(PRIZE_BEFORE_INFO, {
                id: 12
            }).then(res => {
                if(res.data.baddress === 0){
                    //没有收货地址
                    this.$dialog.alert({
                        message: '您还没有填写收货地址！'
                    })
                }
            });
        },
        getPrizeInfo() {
            //获取奖品信息
            this.$reqGet(PROMOTE_PRIZE_INFO,{
                id: 19
            }).then(res => {
                
            })
        },
        getLogList() {
            //获取最近中奖名单
            this.$reqGet(PROMOTE_PRIZELOG_LIST,{
                id: 19
            }).then(res => {
                
            })
        },
        startGame() {
            //开始抽奖
            this.$reqGet(START_PRIZE_INFO,{
                id: 19
            }).then(res => {

            })
        },
        get() {
            //   this.$http.get('../../../../static/data/lotteryInfo.json').then((myData) => {
            let myData = INFO;
            let res = myData;
            if (res.success) {
                document.title = res.data.title;
                this.remainingTimes = res.data.remainingTimes;
                this.hasRecord = res.data.hasDrawed;
                this.prizeDesc = res.data.prizeDesc.split("$utf8$");
                this.lotteryDesc = res.data.lotteryDesc.split("$utf8$");
                res.data.prizeInfo.forEach(item => {
                    this.$set(item, "bgSrc", noSelect);
                });
                res.data.prizeInfo.splice(4, 0, " ");
                this.prizeList[0] = res.data.prizeInfo[0];
                this.prizeList[6] = res.data.prizeInfo[1];
                this.prizeList[5] = res.data.prizeInfo[2];
                this.prizeList[4] = res.data.prizeInfo[4];
                this.prizeList[2] = res.data.prizeInfo[3];
                this.prizeList[8] = res.data.prizeInfo[5];
                this.prizeList[7] = res.data.prizeInfo[6];
                this.prizeList[1] = res.data.prizeInfo[7];
                this.prizeList[3] = res.data.prizeInfo[8];
                this.prizers = res.data.winners;
                this.statusFun(
                    res.data.currTime,
                    res.data.beginTime,
                    res.data.endTime
                ); // 获取状态，开始，未开始，结束
                if (this.prizers && this.prizers.length > 5) {
                    this.prizerListScroll();
                }
                this.prizeZhuan();
            } else {
                //   Toast({
                //     message: res.bizMessage,
                //     position: 'middle',
                //     duration: 1500
                //   })
            }
            //   })
        },

        statusFun(c, s, e) {
            this.$nextTick(() => {
                if (c < s) {
                    // 当前时间小于开始时间，未开始
                    this.startStatus = 0;
                    this.$refs.pice[4].style.backgroundImage =
                        "url(" + notStart + ")";
                } else if (c > s && c < e) {
                    // 当前时间大于开始时间，并且小于结束时间，已经开始未结束
                    this.startStatus = 1;
                    this.$refs.pice[4].style.backgroundImage =
                        "url(" + prizeBtn + ")";
                } else if (c > e) {
                    // 当前时间大于结束时间，已经结束
                    this.startStatus = 2;
                    this.$refs.pice[4].style.backgroundImage =
                        "url(" + endLottery + ")";
                }
            });
        },
        move() {
            if (this.prizeIndex === 0) {
                this.$refs.pice[this.arrNum[7]].style.backgroundImage =
                    "url(" + noSelect + ")";
                this.$refs.pice[
                    this.arrNum[this.prizeIndex]
                ].style.backgroundImage = "url(" + isSelect + ")";
                this.prizeIndex++;
            } else if (this.prizeIndex === 8) {
                this.prizeIndex = 0;
                this.$refs.pice[this.arrNum[7]].style.backgroundImage =
                    "url(" + noSelect + ")";
                this.$refs.pice[
                    this.arrNum[this.prizeIndex]
                ].style.backgroundImage = "url(" + isSelect + ")";
                this.prizeIndex++;
            } else {
                this.$refs.pice[
                    this.arrNum[this.prizeIndex - 1]
                ].style.backgroundImage = "url(" + noSelect + ")";
                this.$refs.pice[
                    this.arrNum[this.prizeIndex]
                ].style.backgroundImage = "url(" + isSelect + ")";
                this.prizeIndex++;
            }

            if (this.s2 && this.prizeIndex == this.s2) {
                clearInterval(this.timer1);
                clearInterval(this.timer2);
                this.stop();
            }

            this.timeFlag += 100;
            if (this.timeFlag >= 10000 && !this.prizeName) {
                clearInterval(this.timer1);
                clearInterval(this.timer2);
                // Toast({
                //   message: '当前抽奖人数过多，稍后再来',
                //   position: 'middle',
                //   duration: 1500
                // })
                this.clickFlage = true; // 能点击
                setTimeout(() => {
                    // 刷新后重新加载
                    location.reload();
                }, 1500);
            }
        },
        // 停止
        stop() {
            this.clickFlage = false; // 不能点击
            this.prizeInfo(); // 弹出是否中奖
        },
        // 降速
        lowSpeed() {
            clearInterval(this.timer1);
            this.clickFlage = false; // 不能点击
            this.timer2 = setInterval(this.move, 300);
            setTimeout(() => {
                // 顺序打乱
                if (this.prozeLevel == 2) {
                    this.s2 = 7;
                } else if (this.prozeLevel == 3) {
                    this.s2 = 4;
                } else if (this.prozeLevel == 4) {
                    this.s2 = 3;
                } else if (this.prozeLevel == 7) {
                    this.s2 = 2;
                } else {
                    this.s2 = this.prozeLevel;
                }
            }, 900);
        },
        // 获奖名单滚动
        prizerListScroll() {
            this.$nextTick(() => {
                var prizerList2 = document.getElementById("prizerList2");
                var prizerList1 = document.getElementById("prizerList1");
                var prizerList = document.getElementById("prizerList");
                prizerList2.innerHTML = prizerList1.innerHTML;
                setInterval(() => {
                    // if (this.prizerList.scrollTop >= (this.prizerList1.offsetHeight - this.prizerList.offsetHeight)) {
                    if (prizerList.scrollTop >= prizerList1.offsetHeight) {
                        prizerList.scrollTop = 0;
                    } else {
                        prizerList.scrollTop++;
                    }
                }, 30);
            });
        },
        prizeZhuan() {
            this.$nextTick(() => {
                this.$refs.pice[4].onclick = () => {
                    if (this.remainingTimes > 0) {
                        // 判断剩余抽奖次数
                        // console.log(this.$refs.pice)
                        if (this.clickFlage) {
                            if (this.startStatus === 1) {
                                // 活动开始
                                this.clickFlage = false; // 不能点击
                                this.timer1 = setInterval(this.move, 100);
                                this.$http
                                    .get("../../../static/data/prizeInfo.json")
                                    .then(
                                        myData => {
                                            let res = myData.data;
                                            //   console.log(res)
                                            if (res.success) {
                                                this.prozeLevel =
                                                    res.data.level;
                                                this.prizeName =
                                                    res.data.commodityName;
                                                this.prizeUrl =
                                                    res.data.picUrlWinning;
                                                // console.log(this.prozeLevel)
                                                setTimeout(() => {
                                                    clearInterval(this.timer1);
                                                    this.lowSpeed();
                                                }, 1200);
                                            } else {
                                                // Toast({
                                                //   message: res.bizMessage,
                                                //   position: 'middle',
                                                //   duration: 1500
                                                // })
                                                this.clickFlage = false; // 不能点击
                                                clearInterval(this.timer1);
                                                clearInterval(this.timer2);
                                                // setTimeout(() => { // 刷新后重新加载
                                                //   location.reload()
                                                // }, 1500)
                                            }
                                        },
                                        false,
                                        true
                                    );
                                // this.timer1 = setInterval(this.move, 100)
                                // 请求，返回后给s定值
                            } else if (this.startStatus === 0) {
                                // 没开始
                                // Toast({
                                //   message: '活动尚未开始',
                                //   position: 'middle',
                                //   duration: 1500
                                // })
                            } else if (this.startStatus === 2) {
                                // 已经结束
                                // Toast({
                                //   message: '活动已经结束',
                                //   position: 'middle',
                                //   duration: 1500
                                // })
                            }
                        }
                    } else {
                        // 没有抽奖机会了
                        this.prizeInfoShow = true;
                        this.haveLottery = true;
                    }
                };
            });
        },
        touchMove(e) {
            e.preventDefault(); // 禁止滚动
            e.stopPropagation();
        },
        prizeInfo() {
            setTimeout(() => {
                this.prizeInfoShow = true;
                this.havePrizeShow = true;
            }, 800);
        },
        close() {
            // 关闭没中奖
            this.prizeInfoShow = false;
            this.noPrizeShow = false;
            this.haveLottery = false;
        },
        goIndex() {
            //   this.$router.push({ name: 'preferIndex' })
            this.prizeInfoShow = false; // 显示中奖信息的遮罩层
            this.noPrizeShow = false; // 没中奖
        },
        lotteryRecord() {
            this.$router.push({
                name: "lotteryRecord",
                query: {
                    lotteryDefineId: this.lotteryDefineId
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.wap {
    background: linear-gradient(#337cf6, #49a6f8); // background: #439AF7;
    overflow: auto !important;
    .banner {
        width: 100%;
        height: auto;
        position: relative;
        .bannerImg {
            width: 100%;
            height: 100%;
        }
        .prizeInfoBtn {
            width: 4rem;
            height: 2.54rem;
            position: absolute;
            top: 0;
            right: 0;
            .prizeInfoBtnImg {
                width: 4rem;
                height: auto;
            }
        }
        .priceChanceBtn {
            //   width: 6.2rem;
            height: 1.2rem;
            border-radius: 0.6rem;
            background-color: #ff7a00;
            position: absolute;
            bottom: -0.3rem;
            left: 50%;
            transform: translateX(-50%);
            line-height: 0.6rem;
            font-size: 0.68rem;
            color: #fff;
            font-weight: 500;
            text-align: center;
            padding: 0.12rem 0.8rem;
            line-height: 1.2rem;
        }
        .whiteBar {
            position: absolute;
            z-index: 0;
            transform: rotate(-30deg);
            img {
                width: 100%;
                height: 100%;
                display: block;
            }
        }
        .whiteBar1 {
            top: 8rem;
            left: -6rem;
            width: 15.8rem;
            height: 3.6rem;
        }
        .whiteBar2 {
            top: 8.4rem;
            right: -4rem;
            width: 15.8rem;
            height: 4.6rem;
        }
        .whiteBar3 {
            top: 18.6rem;
            left: -3.6rem;
            width: 15.8rem;
            height: 3.5rem;
        }
        .whiteBar4 {
            top: 18.4rem;
            left: 5rem;
            width: 15.8rem;
            height: 2.72rem;
        }
    }
    overflow: hidden;
    .box {
        margin: 1.9rem auto;
        width: 13.8rem;
        height: 13.8rem;
        padding: 0.7rem;
        background-color: red;
        border: 0.15rem solid transparent;
        border-radius: 0.2rem;
        box-sizing: border-box;
        position: relative;
        background: linear-gradient(white, white) padding-box,
            repeating-linear-gradient(
                    45deg,
                    #ffde00 0%,
                    #ffde00 4.6%,
                    #3eaaff 0,
                    #3eaaff 10%
                )
                0 / 13.8rem 13.8rem;
        div {
            // background: url('../../assets/images/lottery/border.png') no-repeat;
            background-size: 100%;
            float: left;
            width: 3.6rem;
            height: 3.6rem;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
            position: relative;
            &:nth-child(3n) {
                margin-right: 0;
            } // &:nth-child(5) {
            //   background: url('../../assets/images/lottery/prizeBtn.png') no-repeat!important;
            //   background-size: 100%!important;
            // }
            &:nth-child(7),
            &:nth-child(8),
            &:nth-child(9) {
                margin-bottom: 0;
            } // padding:.29rem .33rem;
            box-sizing: border-box;
            img {
                width: 3.4rem;
                height: 3.4rem;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
    .prizers {
        height: 9.6rem;
        width: 13.8rem;
        position: relative;
        margin: 2rem auto 1rem;
        .prizeBar {
            height: 0.6rem;
            width: 13.8rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .prizer {
            width: 12.5rem;
            height: 9rem;
            background-color: #fff;
            position: absolute;
            top: 0.32rem;
            left: 0.7rem;
            right: 0.7rem;
            padding: 0.5rem 0.4rem 0.9rem;
            overflow: hidden;
            box-sizing: border-box;
            .prizeIcon {
                width: 11.6rem;
                height: 1.2rem;
                margin-bottom: 0.6rem;
                img {
                    width: 100%;
                    height: 100%;
                }
            } // .swiper-container {
            .prizerList {
                z-index: 0;
                height: 6.2rem;
                overflow: hidden; // .swiper-slide {
                li {
                    line-height: 1.24rem;
                    font-size: 0.6rem;
                    color: #232323; // margin-bottom: .2rem;
                    overflow: hidden;
                    span {
                        &:first-child {
                            display: block;
                            float: left;
                            margin-right: 1.26rem;
                            width: 2rem;
                            text-align: justify; //两端对齐
                            text-align-last: justify;
                        }
                        &:nth-child(2) {
                            float: left;
                            width: 3.5rem;
                        }
                        &:last-child {
                            float: right; // display: inline-block;
                            text-align: right;
                            display: -webkit-box;
                            word-break: break-all;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            -webkit-line-clamp: 1;
                            -webkit-box-orient: vertical;
                            width: 4.2rem;
                        }
                    }
                }
            }
        }
    }
    .info {
        // width:6.9rem;
        // margin: 0 auto;
        .title {
            width: 5rem;
            height: 0.96rem;
            position: relative;
            overflow: hidden;
            margin-left: 50%;
            transform: translateX(-50%);
            vertical-align: middle;
            .squire1 {
                float: left;
            }
            .squire2 {
                float: right;
            }
            .squire {
                width: 0.74rem;
                height: 0.96rem;
                img {
                    display: inline-block;
                    line-height: 0.96rem;
                    width: 0.74rem;
                    height: 0.16rem;
                    vertical-align: middle;
                }
            }
            span {
                display: blcok;
                position: absolute;
                text-align: justify; //两端对齐
                text-align-last: justify;
                width: 2.8rem;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.68rem;
                color: #fff;
                font-weight: 700;
                float: left;
                line-height: 0.96rem;
            }
        }
        .infoContent {
            width: 13.8rem;
            height: auto;
            margin: 0.6rem;
            background-color: #62abff;
            padding: 0.6rem 0.4rem;
            box-sizing: border-box;
            ul {
                margin-left: 0.6rem;
                li {
                    //  list-style-image: url('../../assets/images/lottery/point.png');
                    list-style-type: disc;
                    list-style-position: outside;
                    font-size: 0.54rem;
                    color: #fff;
                    text-align: left;
                    margin-bottom: 1rem;
                    position: relative;

                    img {
                        position: absolute;
                        top: 0.3rem;
                        left: 0.2rem;
                        width: 0.2rem;
                        height: 0.2rem;
                        float: left;
                        margin-right: 0.2rem;
                        vertical-align: middle;
                    }
                }
            }
        }
    }

    .massage {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        .noPrize {
            width: 10.6rem;
            height: 8.8rem;
            background-color: #fff;
            position: absolute;
            top: 6.4rem;
            left: 2.2rem;
            border-radius: 0.8rem;
            .close {
                position: absolute;
                width: 1.02rem;
                height: 1.02rem;
                top: -1.6rem;
                right: 0;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            p {
                font-size: 0.6rem;
                color: #707070;
                margin: 0.76rem auto 0.4rem;
                text-align: center;
            }
            .xiaofu {
                width: 3.4rem;
                height: 3.4rem;
                border-radius: 100%;
                margin: 0 auto 0.6rem;
                img {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            }
            .btn {
                width: 7.4rem;
                height: 1.8rem;
                margin: 0 auto;
                background: url("../../../assets/images/activity/lottery/btn.png")
                    no-repeat;
                background-size: 100%;
                font-size: 0.72rem;
                color: #fff;
                line-height: 1.8rem;
                text-align: center;
                font-weight: 600;
            }
        }
        .haveLottery {
            width: 10.6rem;
            height: 8.8rem;
            background-color: #fff;
            position: absolute;
            top: 6.4rem;
            left: 2.2rem;
            border-radius: 0.8rem;
            .close {
                position: absolute;
                width: 1.02rem;
                height: 1.02rem;
                top: -1.6rem;
                right: 0;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .xiaofu {
                width: 3.4rem;
                height: 3.4rem;
                margin: 0.6rem auto 0.4rem;
                img {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            }
            p {
                font-size: 0.6rem;
                color: #707070;
                margin: 0.42rem auto 0.74rem;
                text-align: center;
            }
            .btn {
                width: 7.4rem;
                height: 1.8rem;
                margin: 0 auto;
                background: url("../../../assets/images/activity/lottery/btn.png")
                    no-repeat;
                background-size: 100%;

                font-size: 0.72rem;
                color: #fff;
                line-height: 1.8rem;
                text-align: center;
                font-weight: 600;
            }
        }
        .circleLight {
            width: 18.44rem;
            height: 18.44rem;
            position: absolute;
            top: 1.6rem;
            left: 50%;
            margin-left: -9.22rem;
            -webkit-animation: rotate 20s infinite linear;
            animation: rotate 20s infinite linear;
            transform-origin: 50% 50%;
        }
        @-webkit-keyframes rotate {
            0% {
                -webkit-transform: rotate(0deg);
            }
            100% {
                -webkit-transform: rotate(360deg);
            }
        }
        @keyframes rotate {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        .havePrize {
            width: 10.6rem; // height: 6.1rem;
            padding-bottom: 1rem;
            border-radius: 0.8rem;
            position: absolute;
            top: 4.84rem;
            left: 2.2rem;
            background: #fff
                url("../../../assets/images/activity/lottery/prizinig.png")
                no-repeat;
            background-position: top center;
            background-size: 10.6rem 2.84rem;
            .oneBar {
                width: 2.36rem;
                height: 0.92rem;
                position: absolute;
                top: -0.2rem;
                right: 2.2rem;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            p {
                padding: 0 0.2rem;
                font-size: 0.6rem;
                color: #707070;
                font-weight: 600;
                margin: 3.44rem auto 0.4rem;
                text-align: center;
            }
            .proImg {
                width: 8.2rem;
                height: 4rem;
                margin: 0 auto 0.72rem;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .btn {
                width: 7.4rem;
                height: 1.8rem;
                margin: 0 auto;
                background: url("../../../assets/images/activity/lottery/btn.png")
                    no-repeat;
                background-size: 100%;
                text-align: center;
                a {
                    font-size: 0.72rem;
                    color: #fff;
                    line-height: 1.8rem;
                    text-align: center;
                    font-weight: 600;
                }
            }
        }
    }
}
</style>
