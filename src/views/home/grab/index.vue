<template>
    <div class="seckill_list">
        <div class="fixedTop">
            <nav-bar title="秒杀专区" @back="backTo" />
        </div>

        <div ref="scroll_view" class="scroll_view">
            <van-tabs sticky offset-top="46" v-model="activeTab" @click="getTabContent">
                <!-- 秒杀专区 -->
                <van-tab title="秒杀专区">
                    <van-pull-refresh @refresh="onRefresh"
                                      v-model="isLoading">
                        <section v-if="!isEmpty" class="seckill_list_banner">
                            <img src="../../../assets/images/grab_banner.jpg"
                                 alt="秒杀专区顶部图片"
                                 class="seckill_list_banner_image"
                            />
                        </section>

                        <!-- 单活动商品秒杀正在进行 -->
                        <div class="seckill_list_text"
                             v-if='group === 1 && date_activity === 1 && getCountDown(items,stamp)'>
                            <span>抢购中 先下单先得</span>
                            <span>距结束：
                                <countdown :time="getCountDown(items,stamp)" class="seckill_list_text_countdown">
                                    <template slot-scope="props">
                                        {{ props.days * 24 + parseInt(props.hours) }} : {{ props.minutes }} : {{ props.seconds }}
                                    </template>
                                </countdown>
                            </span>
                        </div>

                        <!-- 单活动商品秒杀还未开始 -->
                        <div class="seckill_list_ready"
                             v-if='group === 1 && date_activity === 0 && getCountDown(items,stamp)'>
                            <span>距秒杀开始：
                                <countdown :time="getCountDown(items,stamp)" class="seckill_list_text_countdown">
                                    <template slot-scope="props">
                                        {{ props.days*24 + parseInt(props.hours) }}:{{ props.minutes }}:{{ props.seconds }}
                                    </template>
                                </countdown>
                            </span>
                        </div>

                        <!-- 限时秒杀列内容 -->
                        <div class="limitSecList" v-if="group === 1 && items">
                            <item-group v-for="(item, index) in items" :key="item.id">
                                <item-card-hori
                                    v-for="(good, i) in (items[index] ? items[index].prolist : [])"
                                    :key="i"
                                    :goods="good"
                                    @click="itemClick(good.pro_pid)"
                                >
                                </item-card-hori>
                            </item-group>
                        </div>

                        <!-- 多活动数秒杀 -->
                        <div class="seckill_list_tab" v-if='group > 1'>
                            <van-tabs v-model="active" v-if="!isEmpty">
                                <van-tab v-for="(item,index) in items" :key="index">
                                    <div slot="title" class="seckill_list_tab_title">
                                        <span>{{item.tag}}</span>
                                        <span>{{getTabText(item,stamp)}}</span>
                                        <!-- 三角标 -->
                                        <span class="seckill_list_tab_title_arrow" v-if="active === index"></span>
                                    </div>
                                    <div class="seckill_list_tab_content">
                                        <item-group v-for="item in items[index].prolist" :key="item.id">
                                            <item-card-hori
                                                v-for="(good, i) in (items[index] ? items[index].prolist : [])"
                                                :key="i"
                                                :goods="good"
                                                @click="itemClick(good.pro_pid)"
                                            >
                                                {{ good }}
                                            </item-card-hori>
                                        </item-group>
                                    </div>
                                </van-tab>
                            </van-tabs>
                        </div>

                        <!-- <van-list
                                  v-model="loading"
                                  :finished="finished"
                                :immediate-check="false"
                                  :offset="100"
                                  @load="loadMore"
                            >
                                <item-group>
                                    <item-card-hori
                                        v-for="(item, i) in items"
                                        :key="i"
                                        :goods="item"
                                        @click="itemClick(item.id)"
                                     />
                                </item-group>
                            </van-list> -->

                        <!-- 时间段早上中午晚上 -->
                        <div class="seckill_list_tab seckill_list_sundial" v-if='group === 0'>
                            <van-tabs v-model="active" v-if="!isEmpty">
                                <van-tab v-for="(item,index) in sundial" :key="index">
                                    <div slot="title" class="seckill_list_tab_title">
                                        <span>{{item.title}}</span>
                                        <span>{{items[index] && (items[index]['start'] <= stamp) && (items[index]['end'] >= stamp)?'正在进行中':item.desc}}</span>
                                    </div>
                                    <div class="seckill_list_tab_content">
                                        <item-group v-for="item in items[index]" :key="item.id">
                                            <br />
                                            <item-card-doub
                                                v-for="(good, i) in (items[index] ? items[index].pro_list : [])"
                                                :key="i"
                                                :goods="good"
                                                @click="itemClick(good.pro_pid)"
                                            >
                                                {{ good }}
                                            </item-card-doub>
                                        </item-group>
                                    </div>
                                </van-tab>
                            </van-tabs>

                            <!-- 分时段早中晚, 无活动显示的空白页 -->
                            <is-empty v-else>很抱歉,该活动已结束</is-empty>
                        </div>
                    </van-pull-refresh>
                </van-tab>

                <!-- 限时抢购 -->
                <van-tab class="limit-time-buy" title="限时抢购">
                    <van-pull-refresh @refresh="onRefresh"
                                      v-model="isLoading">
                        <section v-if="!isEmpty" class="seckill_list_banner">
                            <img src="../../../assets/images/limittime_banner.png"
                                 alt="限时抢购顶部图片"
                                 class="seckill_list_banner_image"
                            />
                        </section>
                        <!--<img src="https://m.naifenpifa168.com/src/m/view/themes/css/images/miaosha_banner_m.jpg"-->
                        <!--alt="限时抢购顶部图片"-->
                        <!--class="seckill_list_banner"-->
                        <!--/>-->

                        <!-- 单活动商品秒杀正在进行 -->
                        <!--<div class="seckill_list_text" v-if='group === 1 && date_activity === 1 && getCountDown(items,stamp)'>-->
                        <!--<span>抢购中 先下单先得</span>-->
                        <!--<span>距结束：-->
                        <!--<countdown :time="getCountDown(items,stamp)" class="seckill_list_text_countdown">-->
                        <!--<template slot-scope="props">-->
                        <!--{{ props.days*24 + parseInt(props.hours) }}:{{ props.minutes }}:{{ props.seconds }}-->
                        <!--</template>-->
                        <!--</countdown>-->
                        <!--</span>-->
                        <!--</div>-->

                        <!-- 单活动商品秒杀还未开始 -->
                        <!--<div class="seckill_list_ready" v-if='group === 1 && date_activity === 0 && getCountDown(items,stamp)'>-->
                        <!--<span>距秒杀开始：-->
                        <!--<countdown :time="getCountDown(items,stamp)" class="seckill_list_text_countdown">-->
                        <!--<template slot-scope="props">-->
                        <!--{{ props.days*24 + parseInt(props.hours) }}:{{ props.minutes }}:{{ props.seconds }}-->
                        <!--</template>-->
                        <!--</countdown>-->
                        <!--</span>-->
                        <!--</div>-->

                        <div v-if="itemsLimit">
                            <item-group :key="item.key" v-for="item in itemsLimit">
                                <item-card-hori
                                    v-for="(good, i) in item.plist"
                                    :key="i"
                                    :goods="good"
                                    @click="itemClick(good.pro_pid)"
                                >
                                </item-card-hori>
                            </item-group>
                        </div>

                        <!-- 限时抢购单列 -->
                        <!--<div>-->
                        <!--<item-group v-for="item in items">-->
                        <!--{{ item }}-->
                        <!--<item-card-hori-->
                        <!--v-for="(good, i) in item.plist"-->
                        <!--:key="i"-->
                        <!--:goods="good"-->
                        <!--@click="itemClick(good.pro_pid)"-->
                        <!--&gt;-->
                        <!--{{ good }}-->
                        <!--</item-card-hori>-->
                        <!--</item-group>-->
                        <!--</div>-->

                        <!-- 多活动数秒杀 -->
                        <!--<div class="seckill_list_tab" v-if='group > 1'>-->
                        <!--<van-tabs v-model="active">-->
                        <!--<van-tab v-for="(item,index) in items" :key="index">-->
                        <!--<div slot="title" class="seckill_list_tab_title">-->
                        <!--<span>{{item.tag}}</span>-->
                        <!--<span>{{getTabText(item,stamp)}}</span>-->
                        <!--&lt;!&ndash; 三角标 &ndash;&gt;-->
                        <!--<span class="seckill_list_tab_title_arrow" v-if="active === index"></span>-->
                        <!--</div>-->
                        <!--<div class="seckill_list_tab_content">-->
                        <!--<item-group v-for="item in items[0]" :key="item.id">-->
                        <!--<item-card-hori-->
                        <!--v-for="(good, i) in items[0].plist"-->
                        <!--:key="i"-->
                        <!--:goods="good"-->
                        <!--@click="itemClick(good.pro_pid)"-->
                        <!--&gt;-->
                        <!--{{// good}}-->
                        <!--</item-card-hori>-->
                        <!--</item-group>-->
                        <!--</div>-->
                        <!--</van-tab>-->
                        <!--</van-tabs>-->
                        <!--</div>-->

                        <!-- <van-list
                                  v-model="loading"
                                  :finished="finished"
                                :immediate-check="false"
                                  :offset="100"
                                  @load="loadMore"
                            >
                                <item-group>
    =======
                            <section class="seckill_list_banner">
                                <img src="../../../assets/images/grab_banner.jpg"
                                     alt="顶部图片"
                                     class="seckill_list_banner_image"
                                />
                            </section> -->
                        <!--<img src="https://m.naifenpifa168.com/src/m/view/themes/css/images/miaosha_banner_m.jpg"-->
                        <!--alt="限时抢购顶部图片"-->
                        <!--class="seckill_list_banner"-->
                        <!--/>-->

                        <!-- 单活动商品秒杀正在进行 -->
                        <!--<div class="seckill_list_text" v-if='group === 1 && date_activity === 1 && getCountDown(items,stamp)'>-->
                        <!--<span>抢购中 先下单先得</span>-->
                        <!--<span>距结束：-->
                        <!--<countdown :time="getCountDown(items,stamp)" class="seckill_list_text_countdown">-->
                        <!--<template slot-scope="props">-->
                        <!--{{ props.days*24 + parseInt(props.hours) }}:{{ props.minutes }}:{{ props.seconds }}-->
                        <!--</template>-->
                        <!--</countdown>-->
                        <!--</span>-->
                        <!--</div>-->

                        <!-- 单活动商品秒杀还未开始 -->
                        <!--<div class="seckill_list_ready" v-if='group === 1 && date_activity === 0 && getCountDown(items,stamp)'>-->
                        <!--<span>距秒杀开始：-->
                        <!--<countdown :time="getCountDown(items,stamp)" class="seckill_list_text_countdown">-->
                        <!--<template slot-scope="props">-->
                        <!--{{ props.days*24 + parseInt(props.hours) }}:{{ props.minutes }}:{{ props.seconds }}-->
                        <!--</template>-->
                        <!--</countdown>-->
                        <!--</span>-->
                        <!--</div>-->

                        <!--<van-list v-if="itemsLimit">-->
                        <!--<item-group :key="item.key" v-for="item in itemsLimit">-->
                        <!--&gt;>>>>>> dev-->
                        <!--<item-card-hori-->
                        <!--v-for="(item, i) in items"-->
                        <!--:key="i"-->
                        <!--:goods="item"-->
                        <!--@click="itemClick(item.id)"-->
                        <!--/>-->
                        <!--</item-group>-->
                        <!--</van-list>-->
                        <!-- 时间段早上中午晚上 -->
                        <!--<div class="seckill_list_tab seckill_list_sundial" v-if='group === 0'>-->
                        <!--<van-tabs v-model="active">-->
                        <!--<van-tab v-for="(item,index) in sundial" :key="index">-->
                        <!--<div slot="title" class="seckill_list_tab_title">-->
                        <!--<span>{{item.title}}</span>-->
                        <!--<span>{{items[index] && (items[index]['start'] <= stamp) && (items[index]['end'] >= stamp)?'正在进行中':item.desc}}</span>-->
                        <!--</div>-->
                        <!--<div class="seckill_list_tab_content" >-->
                        <!--&lt;!&ndash; <item-group v-for="item in items.prolist" :key="item.id"> &ndash;&gt;-->
                        <!--<br/>-->
                        <!--<item-card-doub-->
                        <!--v-for="(good, i) in (items[index]?items[index]['pro_list']:[])"-->
                        <!--:key="i"-->
                        <!--:goods="good"-->
                        <!--@click="itemClick(good.pro_pid)"-->
                        <!--&gt;-->
                        <!--{{good}}-->
                        <!--</item-card-doub>-->
                        <!--&lt;!&ndash; </item-group> &ndash;&gt;-->
                        <!--</div>-->

                        <!--</van-tab>-->
                        <!--</van-tabs>-->
                        <!--</div>-->
                    </van-pull-refresh>
                </van-tab>
            </van-tabs>

            <is-empty v-if="isEmpty">很抱歉,该活动已结束</is-empty>

            <!-- 返回顶部 -->
            <transition name="fade">
                <!-- <van-icon
                          name="arrowupcircle"
                          class="backTop"
                          @click.native="backTop"
                          v-show="showArrow"
                      /> -->
                <img src="../../../assets/images/topup.png"
                     alt="返回顶部"
                     class="yqn-backToTop"
                     @click="backTop"
                     v-show="show_arrow"
                />
            </transition>
        </div>
    </div>
</template>

<script>
    // 引入秒杀活动和限时活动接口拉取
    import {PROMOTE_SECKILL_LIST, PROMOTE_LIMITTIME_LIST} from '@/api/activity';

    import ItemGroup from "@/vue/components/item-group/";
    import IsEmpty from "@/vue/components/is-empty/";
    import ItemCardHori from '@/vue/components/item-card-hori/grab_index.vue';
    import ItemCardDoub from '@/vue/components/item-card-doub/grab_index.vue';
    import NavBar from '@/vue/components/NavBar/';

    import {Tab, Tabs, PullRefresh} from 'vant';

    import {HOT_TAB} from '@/config.js';

    import loadMore from '@/vue/mixin/list-load-more';
    import scrollFixed from '@/vue/mixin/scroll-fixed';

    export default {
        name: "Item-list",

        props: {
            itemClass: {
                type: [String, Number],
                default: ""
            },
        },

        mixins: [loadMore, scrollFixed],

        data() {
            let date, group, id = '';
            if (this.$route.params['itemClass'].indexOf('+') !== -1) {
                //如果是分组的
                const params = this.$route.params['itemClass'].split('+');
                date = params[0];
                group = Number(params[1]);
            } else {
                id = this.$route.params['itemClass'];
                group = 1;
            }

            return {
                sundial: HOT_TAB,               //凌晨，上午，中午和晚上
                sortVal: "",
                show_arrow: false, // 显示返回顶部按钮
                stamp: '',               //当前服务器时间
                active: 0,                   //tab的动态标识
                date,
                group,                  //要显示的活动数 0为分上午中午下午 1,2,3,4...为整点显示的个数
                id,                         //秒杀活动id
                date_activity: 0,             //活动是否已经结束  0未开始  1开始  2.结束
                activeTab: 0, // 顶部 tab 激活
                isLoading: false, // 下拉刷新是否在加载中
                items: [], // 秒杀类
                itemsLimit: [], // 限时类
            }
        },

        watch: {
            itemClass(val) {
                this.scrollTop = 0;
                this.resetInit();
            }
        },

        activated() {
            this.eventListen(true);
        },

        deactivated() {
            this.eventListen(false);
        },

        created() {
            // this.resetInit();
            this.initData();
            this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);
        },

        methods: {
            initData() {
                if (this.activeTab === 0) {
                    // 秒杀专区
                    let {date, group, id} = this;
                    this.$reqGet(PROMOTE_SECKILL_LIST, {date, group, id}).then(res => {
                        const {list, page} = res.data;

                        // list 为空数组时, 显示空白页
                        if (list.length === 0) {
                            this.isEmpty = true;
                        } else {
                            this.isEmpty = false;
                        }

                        // if (list instanceof Array) this.isEmpty = true;
                        this.items.push(...this.$util.objectToArray(list));
                        // console.log(this.items);
                        this.stamp = res.data.servertime;
                        this.itemsLimit = [];

                        this.isLoading = false;
                        // return page;
                    });
                } else if (this.activeTab === 1) {
                    // 限时抢购
                    // console.log(this.$route.params);
                    this.$reqGet(PROMOTE_LIMITTIME_LIST, {
                        id: this.$route.params.itemClass
                    }).then(res => {
                        const {list, page} = res.data;

                        if (list.length === 0) {
                            this.isEmpty = true;
                        } else {
                            this.isEmpty = false;
                        }

                        // if (list instanceof Array) this.isEmpty = false;

                        this.itemsLimit.push(...this.$util.objectToArray(list));
                        // console.log(this.itemsLimit);
                        this.stamp = res.data.servertime;
                        this.items = [];

                        this.isLoading = false;
                        // return page;
                    });
                }
            },
            getTabContent() {
                this.initData();
            },
            //   eventListen(isBind = true) {
            //     if (isBind) {
            //       this.$el.addEventListener("scroll", this.scrollShowArrow)
            //     }
            //     else {
            //       this.$el.removeEventListener("scroll", this.scrollShowArrow)
            //     }
            //   },
            //   scrollShowArrow() {
            //     this.showArrow = this.$el.scrollTop > 120;
            //   },
            // backTop() {
            //     this.$el.scrollTop = 0;
            // },
            backTo() {
                this.$router.back(-1);
            },
            itemClick(id) {
                this.$router.push({name: "detail", params: {itemId: id}});
            },
            getCountDown(list, stamp) {
                //测算倒计时时间
                //根据group显示不同的组件
                let time;
                switch (this.group) {
                    case 1:
                        //只显示一个
                        Object.keys(list).map((item, index) => {
                            if (index === 0) {
                                //每次取第一个
                                if (stamp > list[item]['startdate'] && stamp < list[item]['enddate']) {
                                    //活动已经开始且未结束
                                    time = list[item]['enddate'] - stamp;
                                    this.date_activity = 1;
                                } else if (stamp < list[item]['startdate']) {
                                    //活动未开始
                                    time = stamp - list[item]['startdate'];
                                    this.date_activity = 0;
                                } else {
                                    //活动已经结束
                                    this.date_activity = 2;
                                }
                            }
                        });
                        break;
                }

                return time * 1000;

                // let time = list || list[0]['enddate'] - stamp;

                // return 300000000;
            },
            getTabText(item, stamp) {
                //判断多活动条目时下方的文字
                let text;
                if (item.zero <= stamp) {
                    //当日内文字
                    //抢购进行时
                    if (stamp >= item.startdate && stamp <= item.enddate) {
                        text = '抢购进行时';
                    } else if (stamp < item.startdate) {
                        //即将开始
                        text = '即将开始';
                    }
                } else {
                    //隔日的文字
                    text = this.$util.transformGrabTime(item.zero);
                }
                return text;
            },

            // 下拉刷新
            onRefresh() {
                this.refresh();
            },

            async refresh() {
                // this.pages.currPage = 1;
                const result = await this.initData();
                this.isLoading = true;
                this.$toast({
                    message: '刷新成功',
                });
            },
        },

        components: {
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            [ItemGroup.name]: ItemGroup,
            [ItemCardHori.name]: ItemCardHori,
            [ItemCardDoub.name]: ItemCardDoub,
            [NavBar.name]: NavBar,
            [IsEmpty.name]: IsEmpty,
            [PullRefresh.name]: PullRefresh,
        },

        beforeRouteLeave(to, from, next) {
            if (to.name === 'home') {
                this.$destroy();
            }

            next();
        }
    }
</script>

<style lang="scss" scoped>
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all .5s;
    }

    .seckill_list {
        /* height: 30px; */
        background-color: #fff;
        padding-top: 2rem;
        box-sizing: border-box;
        /*position: relative;*/

        > div {
            &:nth-child(2) {
                height: 100%;
                overflow-y: auto;
            }
        }

        &_banner {
            position: relative;
            left: 0;
            top: .4rem;
            height: 5.52rem;
            /*display: block;*/
            /*z-index: 999;*/

            &_image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: auto;
            }
        }

        &_text {
            padding: 0 .32rem;
            height: 1.2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: $main-color;
            color: #fff;

            span {
                &:nth-child(1) {
                    font-size: $params-title-size;
                }

                &:nth-child(2) {
                    font-size: $extra-size;

                    &_countdown {
                        font-size: $product-title-size;
                    }
                }
            }
        }

        &_ready {
            padding: 0 .32rem;
            height: 1.2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fbae7b;
            color: #fff;

            span {
                &:nth-child(1) {
                    font-size: $extra-size;
                }

                span {
                    &:nth-child(1) {
                        font-size: $product-title-size;
                    }
                }
            }
        }

        &_tab {
            &_title {
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                span {
                    &:nth-child(1) {
                        font-size: $sub-title-size;
                        line-height: 1.04rem;
                    }

                    &:nth-child(2) {
                        font-size: $extra-size;
                        line-height: .52rem;
                    }
                }

                &_arrow {
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-width: .4rem .4rem 0;
                    border-style: solid;
                    border-color: $main-color transparent transparent; /* 灰 透明 透明 */
                    margin: 1.72rem auto;
                    z-index: 2000;
                    left: 50%;
                    transform: translate(-50%, 0);
                }
            }

            &_content {
                padding-top: .2rem;

                .item_card_D_wrap {
                    flex: 0 0 50%;
                }

                /*.item_card_H_wrap*/
                /*{*/
                /*height: 6rem;*/

                /*&_inner*/
                /*{*/
                /*height: 6rem;*/

                /*.item_card_image*/
                /*{*/
                /*width: 5.6rem;*/
                /*height: 5.6rem;*/
                /*}*/
                /*}*/
                /*}*/
            }
        }

        &_sundial {
            /*margin-top: 5.6rem;*/

            .seckill_list_tab_title {
                justify-content: flex-start;

                span {
                    &:nth-child(1) {
                        margin-top: .2rem;
                        font-size: $params-title-size;
                        line-height: 1.04rem;
                    }

                    &:nth-child(2) {
                        font-size: $params-title-size;
                        line-height: .52rem;
                    }
                }
            }
        }
    }

    /*.is-empty-other {*/
    /*margin-top: 4rem;*/
    /*}*/

    .fixedTop {
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 1500;
    }

    .items_loading {
        margin: 0 auto;
    }

    .backTop {
        position: fixed;
        right: .8rem;
        bottom: .8rem;
        font-size: .96rem;
    }
</style>

<style lang="scss">
    .seckill_list {
        padding-bottom: 0;

        /*.van-tabs__line {*/
        /*background: transparent;*/
        /*}*/
        .scroll_view {
            > div {
                > div {
                    z-index: 1000;
                }
            }
        }

        .limitSecList {
            .van-button--small {
                padding: 0;
            }
        }

        &_tab {
            .van-tab {
                background: #fbae7b;
                color: #fff !important;
                width: 3rem;
            }

            .van-tab--active {
                position: relative;
                display: flex;
                justify-content: center;
                /*align-items: center;*/
                background: $main-color;
            }

            .van-tabs__nav {
                background: $background-color;
            }

            .van-tabs__nav--line {
                padding-bottom: .4rem;
            }

            .van-tabs__line {
                background: transparent;
            }
        }


        &_sundial {
            .van-tabs__wrap {
                height: 2.25rem;
                padding-top: .08rem;
                background-color: rgba(255, 232, 36, 1);
            }

            .van-tabs__line {

            }

            .van-tab {
                height: 2.25rem;
                background: #ffc424;
                color: #000 !important;
                width: 3rem;
                // box-shadow:0px 3px 1px 0px rgba(255,232,36,1) inset, 0px -3px 1px 0px rgba(173,112,23,0.59) inset;
                box-shadow: 0 -.12rem 1px 0 rgba(173, 112, 23, .59) inset;

                div {
                    &:nth-child(1) {
                        height: 100%;
                    }
                }
            }

            .van-tabs__nav--line {
                padding-bottom: .4rem;
            }

            .van-tab--active {
                background-color: #cc6f15;
                position: relative;
                color: #fff !important;
                box-shadow: 0 .12rem 1px 0 rgba(150, 82, 15, .5) inset, 0 -.12rem 1px 0 rgba(255, 255, 255, .59) inset;
            }
        }

        .seckill_list_tab {
            .item_card_H_wrap {
                width: 100%;
                height: 6rem;

                &_inner {
                    height: 6rem;

                    .item_card_image {
                        width: 5.6rem;
                        height: 5.6rem;
                    }

                    .item_card_info {
                        margin-left: 5.8rem;
                    }
                }
            }
        }

        /* 调整当 group = 2 时的样式 */
        .van-tabs__content {
            .seckill_list_tab_content {
                .items_group {
                    .item_card_normal {
                        .item_card_H_wrap {
                            width: 100%;

                            &_inner {
                                height: 5.6rem;

                                .item_card_image {
                                    width: 5.6rem;
                                    height: 5.6rem;
                                }

                                .item_card_info {
                                    margin-left: 5.9rem;

                                    .item_card_footer {
                                        &_left {
                                            .footer_price_ {
                                                /*margin-top: .1rem;*/
                                            }

                                            .vm-progress--text-inside {
                                                margin-top: .15rem;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        /* 调整当 group = 1 时的样式 */
        .van-tabs__content {
            .van-tab__pane {
                .limitSecList {
                    .items_group {
                        .item_card_normal {
                            .item_card_H_wrap {
                                width: 100%;

                                &_inner {
                                    height: 5.6rem;

                                    .item_card_image {
                                        width: 5.6rem;
                                        height: 5.6rem;
                                    }

                                    .item_card_info {
                                        margin-left: 5.9rem;

                                        .item_card_footer {
                                            &_left {
                                                .footer_price_ {
                                                    /* margin-top: .1rem; */
                                                }

                                                .vm-progress--text-inside {
                                                    margin-top: .15rem;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        /* 限时抢购样式调整 */
        .limit-time-buy {
            .grab_public_style {
                .item_card_H_wrap_inner {
                    .item_card_info {
                        .item_card_name {
                            line-height: .7rem;
                        }

                        .item_card_info_tags {
                            span {
                                margin-left: 0;
                            }
                        }

                        .item_card_footer {
                            &_left {
                                .vm-progress--text-inside {
                                    margin-top: .15rem;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
