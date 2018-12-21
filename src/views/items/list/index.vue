<template>
    <div class="item_list">

        <!--<form action="/search">-->
        <!--<van-search-->
        <!--placeholder="请输入商品名称"-->
        <!--v-model="searchVal"-->
        <!--@search="resetInit" />-->
        <!--</form>-->

        <div class="item_list_header">
            <search-bar
                :click="true"
                @to="toSearch"
                :placeholder="placeholder" />
        </div>

        <!-- <is-empty v-if="isEmpty" type="pro_list">抱歉,没有找到符合条件商品</is-empty> -->


        <div class="item_list_search" v-show="show_search_compo">
            <!-- 搜索显示层 -->
            <search-compo
                :show="show_search_compo"
                :popup="true"
                @SearchKeyword="searchKeyword"
                @closePopup="closeSearch"
            >

            </search-compo>
        </div>


        <van-tabs @click="handleTabClick" @disabled="handleTabClick" class="item_list_tabs">
            <van-tab
                v-for="(tab,index) in tabsItem"
                :key="index"
                :disabled="tab.sort === false">
                <div slot="title" class="item_list_tab_title">
                    <div>{{tab.name}}</div>
                    <div v-if="index === 1 || index === 3">
                        <van-icon
                            name="yqn_sortUp"
                            v-if="index === 1"
                            :class="'item_list_tab_title_sort1' + (list_form.st === 4?' grey':'')" />
                        <van-icon
                            name="yqn_sortDown"
                            v-if="index === 1"
                            :class="'item_list_tab_title_sort2' + (list_form.st === 3?' grey':'')" />
                        <van-icon name="yqn_filter" v-if="index === 3" />
                    </div>
                </div>
            </van-tab>
        </van-tabs>

        <div ref="scroll_view" class="scroll_view">
            <van-pull-refresh v-model="isLoading"
                              @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    :immediate-check="false"
                    :offset="100"
                    @load="loadMore"
                    class="item_list_items"
                >
                    <item-group
                        background="#fff">
                        <item-card-hori
                            v-for="(item, i) in items"
                            :key="i"
                            :goods="item"
                            @click="itemClick(item.pro_pid)"
                        />
                    </item-group>
                </van-list>

                <is-empty v-if="isEmpty" type="pro_list">没有找到你想要的商品哦~</is-empty>
            </van-pull-refresh>
        </div>

        <!-- 筛选弹出框 -->

        <van-popup
            class="filterItem"
            v-model="filterItemShow"
            position="right"
        >
            <div class="filterItem_inner">
                <!-- <nav-bar
                    title="筛选"
                    :left_arrow="false" /> -->

                <van-collapse v-model="activeNames">

                    <van-collapse-item title="分类" name="1">
                        <div slot="value" class="filterItem_inner_value">{{className}}</div>
                        <div class="filterItem_inner_classTags">
                            <van-tag plain v-for="(item,index) in filterItem" :key="index" :type="item.type"
                                     :class="item.type === 'danger'?'filterItem_inner_classTags_item van-tag--danger':'filterItem_inner_classTags_item'"
                                     @click.native="clickClassTag(item.id)">{{item.title}}
                                                                            <!-- 三角形 -->
                                <span class="filterItem_inner_classTags_item_click"></span>
                                                                            <!-- X号 -->
                                <span class="filterItem_inner_classTags_item_text">x</span>
                            </van-tag>
                        </div>
                    </van-collapse-item>
                    <van-collapse-item title="子分类" name="2" v-if="filterItemChild.length">
                        <div slot="value" class="filterItem_inner_value">{{childClassName}}</div>
                        <div class="filterItem_inner_classTags">
                            <van-tag plain v-for="(item,index) in filterItemChild" :key="index" :type="item.type"
                                     :class="item.type === 'danger'?'filterItem_inner_classTags_item filterItem_inner_classTags_big van-tag--danger': 'filterItem_inner_classTags_item filterItem_inner_classTags_big'"
                                     @click.native="clickClassTagchild(item.id)">{{item.title}}
                                                                                 <!-- 三角形 -->
                                <span class="filterItem_inner_classTags_item_click"></span>
                                                                                 <!-- X号 -->
                                <span class="filterItem_inner_classTags_item_text">x</span>
                            </van-tag>
                        </div>
                    </van-collapse-item>
                    <van-collapse-item title="品牌" name="3" v-if="filterItemBrands.length">
                        <div slot="value" class="filterItem_inner_value">{{brands}}</div>
                        <div class="filterItem_inner_classTags">
                            <van-tag plain v-for="(item,index) in filterItemBrands" :key="index" :type="item.type"
                                     :class="item.type === 'danger'?'filterItem_inner_classTags_item filterItem_inner_classTags_big van-tag--danger': 'filterItem_inner_classTags_item filterItem_inner_classTags_big'"
                                     @click.native="clickClassTagBrands(item.id)">{{item.title}}
                                                                                  <!-- 三角形 -->
                                <span class="filterItem_inner_classTags_item_click"></span>
                                                                                  <!-- X号 -->
                                <span class="filterItem_inner_classTags_item_text">x</span>
                            </van-tag>
                        </div>
                    </van-collapse-item>

                    <div class="filterItem_inner_slot"></div>
                </van-collapse>

                <!-- <ul>
                    <li
                        v-for="(li, i) in filterItem"
                        :key="i"
                        @click="filterMethod(i)"
                        :class="{filter_active: li.isActive}">
                            {{li.name}}
                        <van-icon name="success" v-show="li.isActive" class="float-r" />
                    </li>
                </ul> -->

                <div class="filterItem_inner_btns">
                    <van-button type="default" class="filterItem_inner_btns_reset" @click="resetAll">重置</van-button>
                    <van-button type="default" class="filterItem_inner_btns_enter" @click="enterParams">确定</van-button>
                </div>
            </div>

        </van-popup>

        <transition name="fade">
            <!-- <van-icon
                      name="arrowupcircle"
                      class="backTop"
                      @click.native="backTop"
                      v-show="showArrow"
                  /> -->
            <img
                src="../../../assets/images/topup.png"
                alt=""
                class="yqn-backToTop"
                @click="backTop"
                v-show="show_arrow" />
        </transition>
    </div>
</template>

<script>
    import {PRO_LIST, CLASS_BRAND_LIST} from '@/api/product';

    import ItemGroup from "@/vue/components/item-group/";
    import IsEmpty from "@/vue/components/is-empty/";
    import ItemCardHori from '@/vue/components/item-card-hori/';
    import {Search, Tab, Tabs, Collapse, CollapseItem, Tag, PullRefresh} from 'vant';
    import NavBar from '@/vue/components/NavBar/'
    import SearchBar from '@/vue/components/NavBar/search.vue'
    import SearchCompo from '@/vue/components/Search/'

    import loadMore from '@/vue/mixin/list-load-more';
    import scrollFixed from '@/vue/mixin/scroll-fixed';

    export default {
        name: "Item-list",
        props: {
            keyword: {
                type: String,
                default: ""
            },
            itemBid: {
                type: [String, Number],
                default: ""
            },
            itemPcid: {
                type: [String, Number],
                default: ""
            },
            itemCid: {
                type: [String, Number],
                default: ""
            },
            cou_id: {
                type: String,
                default: ""
            },
            st: {
                type: [Number, String],
                default: ""
            }
        },

        mixins: [loadMore, scrollFixed],

        data() {
            const shop_id = this.$util.getLocationParam("shop_id");
            const placeholder = this.keyword;
            return {
                shop_id,
                tabsItem: [
                    {name: "默认", sort: ""},
                    {name: "价格", sort: "price"},
                    {name: "销量", sort: "sell_quality"},
                    {name: "筛选", sort: false}
                ],
                first_in: true,                 //是否为第一次进入路由
                sortVal: "",
                is_haitao: 0,
                filterItem: [],                 //分类的数组
                filterItemChild: [],           //子分类的数组
                filterItemBrands: [],              //品牌的数组
                className: '不限',              //分类右边的值
                childClassName: '不限',             //子分类右边的值
                brands: '不限',                 //品牌右边的值
                placeholder,                    //搜索框的值
                show_search_compo: false,           //是否显示搜索弹出层
                isHaitao: 2,
                searchVal: '',
                filterItemShow: false,           //筛选弹出框
                show_arrow: false,
                activeNames: ['1', '2', '3'], //筛选的下拉扩展动态值
                filter_form: {
                    pcid: '',
                    cid: '',
                    bid: ''
                },                            //删选的pcid和cid
                list_form: {
                    pcid: '',
                    cid: '',
                    bid: '',
                    cou_id: '',               // 通过上一个页面选择优惠券后跳转过来需要带此参数
                    st: ''                    // 排序（1:创建时间(新品),2:销量倒序，3：价格低到高,4:价格高到低）
                },                            // 拉取列表要传递的参数
                isLoading: false,             // 下拉刷新加载
            }
        },

        watch: {
            itemClass(val) {
                this.scrollTop = 0;
                this.resetInit();
            }
        },

        activated() {
            // this.searchVal = this.keyword;
            this.eventListen(true);
        },

        deactivated() {
            this.eventListen(false);
        },

        created() {
            //判断上一个页面是通过分类，子分类，品牌进入此页面的
            if (!this.itemBid && !this.itemCid && this.itemPcid) {
                //通过全部进入的
                this.list_form.pcid = this.itemPcid;
                this.filter_form.pcid = this.itemPcid;
            } else if (this.itemCid && this.itemBid) {
                //从首页进入，有cid和bid
                this.list_form.cid = this.itemCid;
                this.list_form.bid = this.itemBid;
            } else if (this.itemCid) {
                //通过子分类进入
                this.list_form.cid = this.itemCid;
                // this.list_form.pcid = this.itemPcid;        //列表参数
                // this.filter_form.pcid = this.itemPcid;
            } else if (this.itemBid) {
                //通过品牌进入
                this.list_form.bid = this.itemBid;
                // this.list_form.pcid = this.itemPcid;        //列表参数
                // this.filter_form.pcid = this.itemPcid;
            }
            // switch (this.type) {
            //     case 'all':
            //         //通过全部进入的
            //         this.list_form.pcid = this.itemPcid;
            //         this.filter_form.pcid = this.itemPcid;
            //         break;
            //     case 'children':
            //         //通过子分类进入的
            //         this.list_form.cid = this.itemClass;
            //         this.list_form.pcid = this.itemPcid;        //列表参数
            //         this.filter_form.pcid = this.itemPcid;
            //         break;
            //     case 'brand':
            //         //通过品牌进入
            //         this.list_form.bid = this.itemClass;
            //         this.list_form.pcid = this.itemPcid;        //列表参数
            //         this.filter_form.pcid = this.itemPcid;
            //         break;
            // }
            console.log(this.keyword)
            this.searchVal = this.keyword;
            this.list_form.cou_id = this.cou_id;
            this.list_form.st = this.st;
            //拉取数据
            if (!this.keyword && !this.cou_id) {
                this.resetInit();
                this.initClass();
            }

            this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);

            if (!this.keyword) {
                //先从本地拿出默认关键词
                this.placeholder = sessionStorage.getItem('search_default') || '请输入搜索关键词';
                //否则监听从tabbar过来的关键词
                this.$bus.$on('search_default', keyword => {
                    this.placeholder = keyword;
                    this.keyword = this.placeholder;
                });
            }
        },

        methods: {
            initData(loadMore = false) {
                // 获取商品列表
                return this.$reqGet(PRO_LIST, {
                    pcid: this.list_form.pcid,
                    cid: this.list_form.cid,
                    bid: this.list_form.bid,
                    cou_id: this.list_form.cou_id,
                    st: this.list_form.st,
                    keyword: this.searchVal,
                    pagesize: this.pages.perPage,
                    page: this.pages.currPage,
                }, {
                    hideLoading: true
                }).then(res => {
                    const {list, hasmore} = res.data;
                    this.items.push(...list);
                    if (list.length === 0) {
                        this.isEmpty = true;
                    }
                    this.has_more = hasmore;
                    return hasmore;
                })
            },
            initClass() {
                //获取筛选分类
                this.$reqGet(CLASS_BRAND_LIST, this.filter_form, {
                    hideLoading: true
                }).then(res => {
                    // let arr = this.$util.objectToArray(res.data.pclass) || [];
                    // arr.map((item)=>{
                    //     item.type = "";
                    //     this.filterItem.push(item);
                    // })
                    //分配分类并渲染颜色
                    if (this.first_in) {
                        res.data.pclass.map((item) => {
                            if (item.id === this.itemPcid) {
                                item.type = 'danger';
                                this.className = item.title;
                            } else {
                                item.type = '';
                            }
                            this.filterItem.push(item);
                        })
                        //分配子分类并渲染颜色
                        res.data.children.map((item) => {
                            if (item.id === this.itemClass) {
                                item.type = 'danger';
                                this.childClassName = item.title;
                            } else {
                                item.type = '';
                            }
                            this.filterItemChild.push(item);
                        })
                        //分配品牌并渲染颜色
                        res.data.brand.map((item) => {
                            if (item.id === this.itemClass) {
                                item.type = 'danger';
                                this.brands = item.title;
                            } else {
                                item.type = '';
                            }
                            this.filterItemBrands.push(item);
                        })
                        this.first_in = false;
                    } else {
                        //分配子分类并渲染颜色
                        res.data.children.map((item) => {
                            item.type = '';
                            this.filterItemChild.push(item);
                        })
                        //分配品牌并渲染颜色
                        res.data.brand.map((item) => {
                            item.type = '';
                            this.filterItemBrands.push(item);
                        })
                    }


                })
            },
            // eventListen(isBind = true){
            // 	if(isBind){
            // 		this.$el.addEventListener("scroll", this.scrollShowArrow)
            // 	}else{
            // 		this.$el.removeEventListener("scroll", this.scrollShowArrow)
            // 	}
            // },
            // scrollShowArrow(){
            // 	this.showArrow = this.$el.scrollTop > 120;
            // },
            handleTabClick(index) {
                if (index === 3) {
                    //点击筛选
                    this.filterItemShow = true;
                } else {
                    const sortVal = this.tabsItem[index].sort;
                    if (sortVal !== this.sortVal || sortVal === 'price') {
                        this.sortVal = sortVal;
                        switch (sortVal) {
                            case 'sell_quality':
                                this.list_form.st = 2;
                                break;
                            case 'price':
                                //价格先从低到高
                                if (this.list_form.st === 3) {
                                    this.list_form.st = 4;
                                } else {
                                    this.list_form.st = 3;
                                }
                                break;
                            default:
                                this.list_form.st = '';
                                break;
                        }
                        this.pages.currPage = 1;
                        this.change_route = true;
                        this.resetInit();
                    }
                }
            },
            filterMethod(i) {
                this.filterItem.forEach((item, index) => {
                    item.isActive = i === index
                })
                const filterType = this.filterItem[i].filterType;
                this.filterItemShow = false;
                if (this.isHaitao !== filterType) {
                    this.isHaitao = filterType;
                    this.resetInit();
                }
            },
            clickClassTag(id) {
                //点击分类
                this.filterItem.map((item, index) => {
                    if (id === item.id) {
                        if (this.filterItem[index].type === '') {
                            //清空数组
                            // this.filterItem.splice(0,this.filterItem.length);
                            //未被选中
                            this.$set(this.filterItem[index], 'type', 'danger');
                            this.className = this.filterItem[index]['title'];

                            //清空数组
                            this.filterItemChild.splice(0, this.filterItemChild.length);
                            this.filterItemBrands.splice(0, this.filterItemBrands.length);

                            //拉取数据
                            this.filter_form.pcid = id;
                            this.filter_form.cid = '';
                            this.filter_form.bid = '';
                            this.initClass();

                            // this.filterItem[index].children.map((i)=>{
                            //     i.type = '';
                            //     this.filterItemChild.push(i);
                            // })
                            // this.filterItem[index].blist.map((i)=>{
                            //     i.type = '';
                            //     this.filterItemBrands.push(i);
                            // })

                            //子分类，品牌归位
                            this.childClassName = '不限';
                            this.brands = '不限';

                        } else {
                            //已被选中
                            this.$set(this.filterItem[index], 'type', '');
                            this.className = '不限';

                            //清空数组
                            this.filterItemChild.splice(0, this.filterItemChild.length);
                            this.filterItemBrands.splice(0, this.filterItemBrands.length);

                            //清空要传的数据
                            this.filter_form.pcid = '';
                            this.filter_form.cid = '';
                            this.filter_form.bid = '';

                            //子分类，品牌归位
                            this.childClassName = '不限';
                            this.brands = '不限';

                        }

                    } else {
                        //将其他按钮归回默认状态
                        this.$set(this.filterItem[index], 'type', '');
                    }
                })
            },
            clickClassTagchild(id) {
                //点击子分类
                this.filterItemChild.map((item, index) => {
                    if (id === item.id) {
                        if (this.filterItemChild[index].type === '') {
                            //未被选中
                            this.$set(this.filterItemChild[index], 'type', 'danger');
                            this.childClassName = this.filterItemChild[index]['title'];
                            //清空品牌数组
                            this.filterItemBrands.splice(0, this.filterItemBrands.length);
                            //选中子分类后，拉取品牌数据
                            this.filter_form.cid = id;
                            this.initClass();
                        } else {
                            //已被选中
                            this.$set(this.filterItemChild[index], 'type', '');
                            this.childClassName = '不限';
                            //清空品牌数组
                            this.filterItemChild.splice(0, this.filterItemChild.length);
                            this.filterItemBrands.splice(0, this.filterItemBrands.length);
                            //取消选中子分类后，拉取品牌数据
                            this.filter_form.cid = '';
                            this.initClass();
                        }

                    } else {
                        //将其他按钮归回默认状态
                        this.$set(this.filterItemChild[index], 'type', '');
                    }
                })
            },
            clickClassTagBrands(id) {
                //点击品牌
                this.filterItemBrands.map((item, index) => {
                    if (id === item.id) {
                        if (this.filterItemBrands[index].type === '') {
                            //未被选中
                            this.$set(this.filterItemBrands[index], 'type', 'danger');
                            this.brands = this.filterItemBrands[index]['title'];
                            this.filter_form.bid = id;
                        } else {
                            //已被选中
                            this.$set(this.filterItemBrands[index], 'type', '');
                            this.brands = '不限';
                            this.filter_form.bid = '';
                        }


                    } else {
                        //将其他按钮归回默认状态
                        this.$set(this.filterItemBrands[index], 'type', '');
                    }
                })
            },
            resetAll() {
                //重置所有选项
                this.className = '不限';
                this.childClassName = '不限';
                this.brands = '不限';

                //重置要传递的id
                this.filter_form.pcid = '';
                this.filter_form.cid = '';

                //重置样式
                this.filterItem.map((item, index) => {
                    this.$set(this.filterItem[index], 'type', '');
                })
                this.filterItemChild.map((item, index) => {
                    this.$set(this.filterItemChild[index], 'type', '');
                })
                this.filterItemBrands.map((item, index) => {
                    this.$set(this.filterItemBrands[index], 'type', '');
                })

            },
            enterParams() {
                //确认筛选条件并查询
                //清空商品列表
                this.items.splice(0, this.items.length);
                // 传递新的参数
                this.pages.currPage = 1;
                this.list_form.st = '';
                this.list_form.cou_id = '';
                this.searchVal = '';
                this.list_form = Object.assign({}, this.list_form, this.filter_form);
                // 拉取数据
                this.initData();
                //关闭弹出框
                this.filterItemShow = false;
            },
            toSearch() {
                //跳转到搜索页
                // this.$router.push({path: '/home/search'})
                //开启弹出层
                this.show_search_compo = !this.show_search_compo;
            },
            closeSearch() {
                //关闭弹出层
                this.show_search_compo = !this.show_search_compo;
            },
            searchKeyword(word) {
                //开始搜索
                //重置数据
                this.list_form.pcid = '',
                    this.list_form.cid = '',
                    this.list_form.bid = '',
                    this.list_form.cou_id = '',
                    this.list_form.st = '',

                    this.pages.currPage = 1;
                this.placeholder = word;
                this.searchVal = word;
                this.resetInit();
                this.show_search_compo = !this.show_search_compo;
            },
            // backTop(){
            // 	this.$el.scrollTop = 0;
            // },
            itemClick(id) {
                this.$router.push({name: "detail", params: {itemId: id}});
            },

            // 下拉刷新
            onRefresh() {
                this.refresh();
            },

            async refresh() {
                this.pages.currPage = 1;
                const result = await this.resetInit();
                this.isLoading = false;
                this.$toast({
                    message: '刷新成功',
                });
            },
        },

        components: {
            [ItemGroup.name]: ItemGroup,
            [ItemCardHori.name]: ItemCardHori,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            [Tag.name]: Tag,
            [Search.name]: Search,
            [IsEmpty.name]: IsEmpty,
            [NavBar.name]: NavBar,
            [SearchBar.name]: SearchBar,
            [SearchCompo.name]: SearchCompo,
            [PullRefresh .name]: PullRefresh,
        },

        // 路由进入之前, 如果是从 search 过来的, 并且带有 keyword 或 cou_id, 销毁组件, 并重新拉取数据
        beforeRouteEnter(to, from, next) {
            next(
                vm => {
                    if (vm.keyword || vm.cou_id) {
                        vm.pages.currPage = 1;
                        if (vm.keyword) {
                            //如果是搜索过来的关键字
                            vm.placeholder = to.query['keyword'];
                            vm.searchVal = to.query['keyword'];
                        }
                        vm.resetInit();
                    }
                }
            )
        },

        // 在路由离开之前不销毁组件
        beforeRouteLeave(to, from, next) {
            //因为将所有的组件进行了缓存，所以退出的时候要将其组件销毁
            if (to.name === 'class' || to.name === 'home' || to.name === 'recommend') {
                this.$destroy();
            }
            // this.$destroy();
            // ...
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
    .fade-leave-active, {
        transition: all .5s;
    }

    .grey {
        color: $sub-title-color;
    }


    .item_list {
        padding-top: 88px;
        background-color: #fff;
        padding-bottom: 0;

        &_header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1999;
        }

        &_search {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 2000;
        }

        &_tabs {
            position: fixed;
            top: 44px;
            left: 0;
            width: 100%;
        }

        .scroll_view {
            height: 100%;
            overflow-y: auto;
        }


        &_tab_title {
            position: relative;

            > div {
                &:nth-child(2) {
                    position: absolute;
                    top: 0;
                    height: 100%;
                    width: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    right: .6rem;
                }
            }

            &_sort1 {
                position: relative;
                top: 7px;
            }

            &_sort2 {
                position: relative;
                bottom: 7px;
            }
        }

        &_items {
            background-color: #fff;
        }
    }

    .fixedTop {
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 999;
    }

    .items_loading {
        margin: 0 auto;
    }

    .filterItem {
        width: 11.6rem;
        height: 100%;

        &_inner {
            // padding-top: 46px;
            position: relative;
            height: 100%;
            overflow: hidden;

            &_slot {
                width: 100%;
                height: 44px;
            }

            &_value {
                color: $main-color;
                font-size: $params-title-size;
            }

            &_classTags {
                font-size: 14px;
                display: flex;
                flex-wrap: wrap;

                &_item {
                    width: 3.3rem;
                    height: 1.2rem;
                    margin-right: .2rem;
                    margin-bottom: .2rem;
                    font-size: $extra-size;
                    text-align: center;
                    border-radius: 3px;
                    background-color: #ededed;
                    color: #333 !important;
                    line-height: 1.2rem;
                    position: relative;

                    &_click {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        display: none;
                        width: 0;
                        height: 0;
                        border-bottom: .6rem solid $main-color;
                        border-left: .8rem solid transparent;
                    }

                    &_text {
                        width: .4rem;
                        height: .5rem;
                        color: #fff;
                        font-size: 10px;
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        line-height: .6rem;
                        display: none;
                    }
                }

                &_big {
                    height: 1.76rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    line-height: normal;
                }
            }

            &_btns {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 44px;
                display: flex;

                &_reset {
                    width: 50%;
                    height: 100%;
                }

                &_enter {
                    width: 50%;
                    height: 100%;
                    background: #ff5a00;
                    color: #fff;
                }
            }
        }

        li {
            padding: 10px;

            &.filter_active {
                color: $red;
            }
        }
    }

    .backTop {
        position: fixed;
        right: 20px;
        bottom: 20px;
        font-size: 24px;
    }
</style>
<style lang="scss">
    .item_list {
        i.van-cell__right-icon {
            position: relative;
        }

        .van-cell {
            // background: #F8F8F8;
            &:not(:last-child)::after {
                border-bottom-width: 0;
            }
        }

        .van-tag {
            padding: 0;
        }

        .van-collapse {
            height: 100%;
            overflow-y: auto;
        }

        .van-collapse-item__content {
            padding: .48rem;
            background-color: #fff;
        }

        .van-hairline--surround::after {
            border-width: 0;
        }

        .van-tag--danger {
            color: $main-color !important;
            background: #ffd9bf;

            .filterItem_inner_classTags_item_click {
                display: block;
            }

            .filterItem_inner_classTags_item_text {
                display: block;
            }
        }
    }
</style>

