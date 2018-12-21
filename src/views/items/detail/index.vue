<template>
    <div class="item_detail">
        <!-- 头部搜索 -->
        <div class="item_list_header">
            <search-bar
                name="item_detail"
                :click="true"
                @to="toSearch"
                @share="shareLink" />
        </div>

        <!-- 结果为空页 -->
        <is-empty v-if="isEmpty">抱歉,没有找到符合条件商品</is-empty>

        <div class="item_list_search" v-if="show_search_compo">
            <!-- 搜索显示层 -->
            <search-compo
                :show="show_search_compo"
                :popup="popup"
                @SearchKeyword="searchKeyword"
                @closePopup="closeSearch"
            >

            </search-compo>
        </div>

        <div class="item_detail_content">
            <div class="item_detail_banner">
                <!-- 右上角大促狂欢购 -->
                <img :src="goods.prom_large && goods.prom_large.picsm"
                     alt="右上角大促狂欢购图片"
                     class="item_detail_banner_proTag"
                     v-if="goods && !(goods.prom_large instanceof Array)"
                />
                <!-- 左下角直发代发 -->
                <div v-if="goods && (goods.owner === 1 || goods.owner === 2)" class="item_detail_banner_icon">
                    <van-icon name="yqn_replace" v-if="goods && goods.owner === 1" />
                    <van-icon name="yqn_straight" v-if="goods && goods.owner === 2" />
                </div>

                <!-- 轮播图 -->
                <van-swipe class="item_detail_banner_yqn_swipe"
                           :autoplay="2500"
                           v-if="goods">
                    <van-swipe-item v-for="(image, index) in goods.pics" :key="index">
                        <img v-lazy="image" />
                    </van-swipe-item>
                </van-swipe>
            </div>

            <!-- 秒杀直降图片上的窄图 -->
            <!-- 大促期间没有满减满赠 -->
            <!--<img src="http://imgs.yqn.com/upfile/nadmin/image/test_imgs/picbgtrue.jpg"-->
            <!--alt=""-->
            <!--class="item_detail_proLong"-->
            <!--v-if="goods && !(goods.prom_large instanceof Array)"-->
            <!--/>-->

            <!-- 大促期间没有满减满赠 -->
            <img :src="!(goods.prom_large instanceof Array) && goods.prom_large.picbgtrue"
                 alt=""
                 class="item_detail_proLong"
                 v-if="goods && !(goods.prom instanceof Array) && prom_large_has_param"
            />
            <!-- 大促期间有满减满赠 -->
            <img :src="!(goods.prom_large instanceof Array) && goods.prom_large.picbgfalse"
                 alt=""
                 class="item_detail_proLong"
                 v-if="goods && !(goods.prom instanceof Array) && prom_large_has_param"
            />
            <!-- <img src="http://imgs.yqn.com/upfile/nadmin/image/test_imgs/picbgfalse.jpg"
            alt="大促狂购图"
            /> -->
            <!-- < img v-else :src="goods.prom_large.picbgfalse" alt="" /> -->

            <!-- 出现秒杀时 -->
            <div style="height: auto;" class="item_detail_onSale"
                 v-if="goods && !(goods.prom_limit instanceof Array) && goods.prom_limit.nowdate >= goods.prom_limit.startdate">
                <div class="item_detail_onSale_price">
                    <span class="item_detail_onSale_price_symbol">整点秒杀</span>
                    <span class="item_detail_onSale_price_past">
                    <span>￥<span class="item_detail_onSale_price_price">{{goods.prom_limit.max_price === goods.prom_limit.min_price?goods.prom_limit.max_price:goods.prom_limit.min_price + '~' + goods.prom_limit.max_price}}</span>
                    </span>
                    <span class="item_detail_onSale_price_past_price">￥{{goods.max_price === goods.min_price?goods.max_price:goods.min_price + '~' + goods.max_price}}</span>
                        <!-- <span class="item_detail_onSale_price_past_count">{{goods.sum_sale}}件已售</span> -->
                </span>
                </div>

                <div class="item_detail_onSale_countDown" v-if="getCountDown()">
                <span class="item_detail_onSale_countDown_time">距离结束：
                    <countdown :time="getCountDown()*1000">
                        <template slot-scope="props">
                            {{ props.days*24 + parseInt(props.hours) }}:{{ props.minutes }}:{{ props.seconds }}
                        </template>
                    </countdown>
                </span>
                    <vm-progress :percentage="70" :text-inside="true" :stroke-width="18" status="exception" striped
                                 class="progress item_detail_onSale_countDown_count" stroke-color="#FF6600"
                                 track-color="#CF4814">
                        已抢 70%
                    </vm-progress>
                </div>
            </div>

            <van-cell-group class="item_cell_group" v-if="goods">
                <van-cell class="item_info">
                    <div class="item-title">
                        <!-- <van-tag plain type="danger" v-if="goods.is_haitao">海淘</van-tag> -->
                        <span class="goods_title_tag" v-if="goods && goods.owner === 0">自营</span>
                        {{ goods.title }}
                    </div>
                    <div class="item-advice">
            <span class="item-advice-payType" v-if="goods.owner !== 3">
              {{ goods && goods.owner === 0 ? '支持物流到付' : '' }}
              {{ goods && (goods.owner === 1 || goods.owner === 2) ? '需要线上付款' : '' }}
            </span>

                        <span class="item-advice-line" v-if="goods.owner !== 3"></span>

                        <span class="item-advice-price">建议零售价：{{goods.sug_price}}</span>
                        <span class="item-advice-line"></span>
                        <span class="item-advice-hot">热度： {{goods.sum_sale}}</span>
                    </div>
                    <div class="item_info_price">
                        ￥
                        <!-- 直降秒杀 -->
                        <span class="item_info_price_salePrice" v-if="goods && !(goods.prom_limit instanceof Array)">{{goods.prom_limit.max_price === goods.prom_limit.min_price?goods.prom_limit.max_price:goods.prom_limit.min_price + '~' + goods.prom_limit.max_price}}</span>
                        <span class="item_info_price_default" v-if="!(goods.prom_limit instanceof Array)">￥{{goods.max_price === goods.min_price?goods.max_price:goods.min_price + '~' + goods.max_price}}</span>
                        <!-- 非直降秒杀 -->
                        <span class="item_info_price_salePrice" v-if="goods && (goods.prom_limit instanceof Array)">{{goods.max_price === goods.min_price?goods.max_price:goods.min_price + '~' + goods.max_price}}</span>
                    </div>

                    <div class="item_info_advance"
                         v-if="goods && !(goods.prom_limit instanceof Array) && goods.prom_limit.nowdate < goods.prom_limit.startdate">
                        <span>秒杀预告</span>
                        <span>预计{{transformDate(goods.prom_limit.startdate)}}开始</span>
                    </div>
                    <!-- <div>
                                <span class="item_price">{{ goods.sales_price | yuan }}</span>
                                <span class="item_market_price">{{goods.market_price | yuan}}</span>
                            </div> -->
                    <div class="item_intro">{{goods && goods.sell_point}}</div>
                    <!-- <div class="item_dispatch">发货地: {{goods || goods.ship_address.city}}</div> -->
                    <!-- <div class="item_info_params">
                        <h5>商品参数</h5>
                        <span class="item_info_params_item">
                            <span class="item_info_params_item_title">品牌：</span>
                            <span class="item_info_params_item_desc">长白仙子</span>
                        </span>
                    </div> -->
                </van-cell>
            </van-cell-group>

            <!-- 全球购重要提示 -->
            <div class="item_detail_globalNotice" v-if="goods && goods.owner === 3">
                <img :src="notice_img" alt="全球购重要通知" class="item_detail_spec_img" />
            </div>

            <!-- 优惠券 -->
            <van-cell-group class="item_cell_group item_detail_coupon"
                            v-if="goods && goods.coupon && goods.coupon.length !== 0">
                <van-cell is-link @click="changeCouponState">
                    <template slot="title">
                        <span class="item_cell_group_title">领券：</span>
                        <div class="item_detail_coupon_desc">
                            <span v-for="(item,index) in goods.coupon" :key="index">{{item.title}}</span>
                            <!-- <span>满300减40</span>
                            <span>满300减40</span> -->
                        </div>
                    </template>
                </van-cell>
            </van-cell-group>

            <!-- 活动 -->
            <van-cell-group class="item_cell_group item_detail_activity" v-if="goods && goods.prom.length !== 0">
                <van-cell is-link @click="changeActivityState">
                    <div slot="title" class="item_detail_slot_title">
                        <span class="item_cell_group_title item_detail_activity_title">活动：</span>
                        <span class="item_detail_activity_desc">
                    <div class="item_detail_activity_desc_line" v-for="(item,index) in goods.prom" :key="index">
                        <span class="item_detail_activity_desc_line_title">{{ item.tag }}</span>

                        <span v-if="item.tag !== '赠'"
                              class="item_detail_activity_desc_line_desc">
                            {{ item.ms }}
                        </span>

                        <span class="item_detail_activity_desc_line_gift" v-else>购买此商品可获得赠品</span>
                    </div>
                            <!-- <div class="item_detail_activity_desc_line">
                                <span class="item_detail_activity_desc_line_title">满减</span>
                                <span class="item_detail_activity_desc_line_desc">每减1000元减10元</span>
                            </div>
                            <div class="item_detail_activity_desc_line">
                                <span class="item_detail_activity_desc_line_title">满赠</span>
                                <span class="item_detail_activity_desc_line_desc">每满1039元可获得赠品</span>
                            </div> -->
                    </span>
                    </div>
                </van-cell>
            </van-cell-group>

            <!-- 售后提示 -->
            <van-cell-group class="item_cell_group item_detail_service" v-if="goods && goods.owner !== 3">
                <van-cell is-link @click="changeServiceState">
                    <div slot="title" class="item_detail_service_title">
                        <div v-for="(item,index) in cate_service" :key="index">
                            <van-icon name="yqn_success" class="item_detail_service_title_icon" />
                            <span>{{item.title}}</span>
                        </div>
                    </div>
                </van-cell>
            </van-cell-group>

            <!-- 通知 -->
            <van-cell-group class="item_cell_group item_detail_notice" v-if="goods && goods.owner === 3">
                <van-cell @click="showGlobalNotice" is-link>
                    <template slot="title">
                        <span class="item_cell_group_title">通知：</span>
                        <span class="item_detail_notice_desc">【紧急】 保税区订单海关抽检通知</span>
                    </template>
                </van-cell>
            </van-cell-group>

            <!-- 客服，进群 -->
            <van-cell-group class="item_cell_group item_detail_kefu">
                <!-- <van-cell is-link>
                    <template slot="title">
                        <van-icon name="success" class="item_detail_kefu_icon"/>
                        <span class="item_detail_kefu_person">您的专属客服({{user_base_info && user_base_info.yg_name}})：{{user_base_info && user_base_info.yg_mobile}}</span>
                    </template>
                </van-cell> -->
                <van-cell v-if="isShowing">
                    <div slot="title" class="item_detail_kefu_wechat" v-if="isLoading">
                        <section class="item_detail_kefu_wechat_image">
                            <img :src="require('../../../assets/images/yqn_download_ewm.png')"
                                 alt="微信二维码"
                                 class="item_detail_kefu_wechat_img"
                            />
                        </section>

                        <div class="item_detail_kefu_wechat_desc">
                            <span>加微信拉你进群</span>
                            <span>了解更多活动和福利</span>
                        </div>

                        <span class="item_detail_kefu_wechat_btn" @click="showQRCode">点我加入</span>
                    </div>
                </van-cell>
            </van-cell-group>

            <!-- 规格 -->
            <div v-if="isLoading"
                 class="item_detail_spec">
                <span class="item_detail_spec_line">规格：<span>{{goods && goods.spec}}</span></span>
                <span class="item_detail_spec_line">备注：<span>{{goods && goods.bz}}</span></span>
            </div>

            <!-- 商品描述 -->
            <div class="item_cell_group item_detail_describe" v-if="goods && goods.abstract">
                <span>商品描述</span>
                <span>{{goods.abstract}}</span>
                <!-- <span>0.1元为意向金不退，新日期诚招全国区域代理0.1为意向金，拍下后当地业务经理会联系您0.1元为意向金不退，新日期诚招全国区域代理0.1为意向金，拍下后当地业务经理会联系您0.1元为意向金不退，新日期诚招全国区域代理0.1为意向金，拍下后当地业务经理会联系您0.1元为意向金不退，新日期诚招全国区域代理0.1为意向金，拍下后当地业务经理会联系您0.1元为意向金不退，新日期诚招全国区域代理0.1为意向金，拍下后当地业务经理会联系您</span> -->
            </div>
            <!-- <component
                     v-if="goods"
                     ref="goodAction"
                    v-bind:is="goods.is_virtual ? 'virtual-group'  : 'entity-group'"
                    :selectSku.sync="selectSku"
                    :addressVal.sync="addressVal"
                    :mobile="mobile"
                    :goods-info="goods"
                    @skuBuy="doBuyNow"
                    /> -->

            <!-- 商品详情区 -->
            <div class="item_desc" v-if="goods && goods_detail">
                <div class="item_desc_title">
                <span class="item_desc_title_left">
                    <span class="item_desc_title_left_slot"></span>
                    商品详情
                </span>

                    <span @click="shareImg"
                          class="item_desc_title_target">
                    <van-icon :name="item_desc_icon" />
                        <!-- <span>下载APP</span> -->
                </span>
                </div>
                <span class="item_desc_text">（点击分享按钮，手动分享到朋友圈，轻松卖货）</span>
                <div class="item_desc_content">
                    <img :src="desc_global_img"
                         alt=""
                         v-if="goods && goods.owner === 3"
                    />

                    <div class="item_desc_wrap" v-html="goods.content"></div>

                    <!-- 商品详情里的图片 -->
                    <section class="img_content_image">
                        <img class="img_content_image_item"
                             v-for="item in imgContent"
                             key="i"
                             :src="item"
                             alt="商品详情里的图片"
                        />
                    </section>
                </div>
            </div>
        </div>

        <van-goods-action v-if="goods">
            <!-- <van-goods-action-mini-btn @click="toHome" icon="wangwang" iconClass="red afterTag" text="更多"/> -->
            <van-goods-action-mini-btn @click="toHome"
                                       icon="yqn_index"
                                       text="主页"
            />
            <van-goods-action-mini-btn @click="toCart"
                                       icon="yqn_cart"
                                       :info="cartInfo | greater"
                                       text="进货单"
            />
            <van-goods-action-mini-btn @click="callTheService"
                                       icon="yqn_service"
                                       text="客服"
            />
            <van-goods-action-big-btn @click="addCart"
                                      :text="getInCartText(goods.sh)"
                                      :class="'item_detail_addCart ' + (goods.sh !== 1?'disabled':'') "
            />
            <van-goods-action-big-btn primary
                                      @click="doBuyNow"
                                      text="立即订购"
                                      :class="'item_detail_buy ' + (goods.sh !== 1?'disabled':'') "
            />
        </van-goods-action>

        <van-popup v-model="showContact" position="bottom">
            <md-kefu mobile="16454193338" />
        </van-popup>

        <div :class="showMoreIcon ? 'item_detail_moreIcon transiton_height' : 'item_detail_moreIcon'">
          <span v-for="(item, index) in moreIcon"
                :key="index"
                class="item_detail_moreIcon_icon"
                @click="iconJumpTo(item)">
            <van-icon :name="item.icon" class="item_detail_moreIcon_icon_icon" />
            <span class="item_detail_moreIcon_icon_name">{{item.name}}</span>
          </span>
        </div>

        <!-- 立即订购，加入购物车 -->
        <van-sku v-model="showSku"
                 :sku="sku"
                 :goods="goods"
                 :goods-id="goodsId"
                 :close-on-click-overlay="closeOnClickOverlay"
                 @buy-clicked="onBuyClicked"
                 @add-cart="onAddCartClicked"
                 class="item_sku"
                 v-if="goods">
            <template slot="sku-header-price">
                <div class="item_sku_header">
                    <!-- <span class="item_sku_header_title">{{ goods && goods.title }}</span> -->
                    <span class="item_sku_header_price">
                        <span class="item_sku_header_price_count">
                            <span class="item_sku_header_price_count_price">
                                箱价：￥
                            <span>{{ goods && goods.box_price }}</span>
                        </span>
                            <!--<span class="item_sku_header_price_count_point">-->
                            <!--<span>送</span>-->
                            <!--<span>{{sum_point || '-'}}</span>-->
                            <!--<span>积分</span>-->
                            <!--</span>-->
                    </span>
                    <span class="item_sku_header_price_unit">单价：￥{{goods && goods.market_price}}</span>
                    <span class="item_sku_header_price_freight" v-if="show_freight_text">
                        <span>运费到付</span>
                        <span>（仅支持线上支付）</span>
                    </span>
                    <span class="item_sku_header_price_freight" v-else>
                        <span>运费：￥{{goods && goods.quantity}}</span>
                        <span>（仅支持线上支付）</span>
                    </span>
                  </span>
                </div>
            </template>

            <template slot="sku-group">
                <van-cell-group>
                    <van-cell is-link @click="showAddress">
                        <template slot="title" class="item_sku_group">
                            <span>送至：</span>
                            <van-icon name="yqn_location" />
                            <span>{{address_info}}</span>
                        </template>
                    </van-cell>
                    <van-cell>
                        <div slot="title" class="item_sku_freight">
                            <span>配送方式</span>
                            <span class="item_sku_freight_btns">
                                <span
                                    :style="(goods.ship_type === 0 || goods.ship_type === 1)?'':{color: '#999', border: '1px solid #999'}"
                                    :class="checked_freight_btn === 1 ? 'checked_freight' : ''"
                                    @click="checked_freight(1)">
                                    快递配送
                                </span>

                                <span
                                    :style="(goods.ship_type === 0 || goods.ship_type === 2) ? '' : {color: '#999', border: '1px solid #999'}"
                                    :class="checked_freight_btn === 2 ? 'checked_freight' : ''"
                                    @click="checked_freight(2)">
                                    物流配送
                                </span>
                            </span>
                        </div>
                    </van-cell>
                </van-cell-group>
            </template>

            <div slot="sku-stepper" class="item_sku_desc">
                <!-- 判断规格是否为两项以上 -->
                <div class="item_sku_desc_title" v-if="sku_tab.length > 0">
                    <span>{{sku1_tab}}</span>
                    <span class="item_sku_desc_title_center">
                        <span v-for="(item,index) in sku_tab" :key="index">{{item.title}}</span>
                    </span>
                    <span>数量</span>
                </div>
                <!-- 规格为两项以上 -->
                <div class="item_sku_desc_content" v-if="sku_tab.length > 0">
                    <ul class="item_sku_desc_content_sku1">
                        <li v-for="(item,index) in sku_detail" :key="item.id"
                            :class="checked_sku1_btn === item.id?'checked_sku1':''"
                            @click="checked_sku1(item.id,index)">
                            {{item.value}}
                            <!-- 占位小方框 -->
                            <!-- <span></span> -->
                            <!-- 左上角选中的角标 -->
                            <img :src="checked_icon"
                                 class="item_sku_desc_content_sku1_checked"
                                 v-if="checked_sku1_btn !== item.id && item.has_num"
                            />
                        </li>
                    </ul>
                    <div class="item_sku_desc_content_right">
                        <ul class="item_sku_desc_content_sku2">
                            <li v-for="item in sku2"
                                :key="item.pro_id"
                                :class="checked_sku2_btn === item.pro_id?'checked_sku2':''"
                                @click="checked_sku2(item.pro_id)">
                                <span>{{item.spec_title_1}}</span>
                                <span v-if="item.spec_title_2">{{item.spec_title_2}}</span>
                            </li>
                        </ul>
                        <ul class="item_sku_desc_content_num">
                            <li class="item_sku_desc_content_num_content"
                                v-for="item in sku2"
                                :key="item.pro_id"
                                :class="checked_sku2_btn === item.pro_id?'checked_sku2':''"
                                @click="checked_sku2(item.pro_id)">
                                <van-stepper style="border: none;"
                                             v-model="item.checknum"
                                             :min="0"
                                             :max="item.num"
                                             @change="buyNumEdit(item.pro_id)"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 规格为一项 -->
                <div class="item_sku_desc_oneSkuContent" v-if="sku_tab.length === 0">
                    <div v-for="item in sku_detail" :key="item.pro_id"
                         :class="'item_sku_desc_oneSkuContent_item ' + (checked_sku1_simple_btn === item.pro_id?'checked_sku2':'')"
                         @click="checked_sku1_simple(item.pro_id)">
                        <span v-if="sku1_tab">{{item.spec_title}}</span>
                        <span>库存：{{item.num}}件</span>
                        <span v-if="!sku1_tab"></span>
                        <span>
                            <van-stepper v-model="item.checknum"
                                         :min="0"
                                         :max="item.num"
                                         @change="buyNumEditSimple(item.pro_id)"
                            />
                        </span>
                    </div>
                </div>
            </div>

            <div slot="sku-messages" class="item_sku_msg">
                <span class="item_sku_msg_quota" v-if="goods.maxnum">
                  <span class="item_sku_msg_quota_text">
                    限购：
                    <span class="item_sku_msg_quota_text_num">{{goods.maxnum}}件</span>
                  </span>
                </span>
                <span v-if="goods.minnum">
                  起订量：
                  <span class="item_sku_msg_minnum">{{goods.minnum}}件</span>
                </span>
                <span v-if="!goods.maxnum && !goods.minnum"></span>
                <span class="item_sku_msg_checked">
                  已选：
                  <span class="item_sku_msg_checked_num">{{check_num}}件</span>
                </span>
            </div>

            <!-- 合计送积分改到这 -->
            <section slot="sku-actions" class="item_sku_bottom_price">
                <span class="item_sku_bottom_price_count">
                  <span class="item_sku_bottom_price_count_price">
                    <span class="item_sku_bottom_price_count_price_detail">
                      合计：
                      <span class="item_sku_bottom_price_count_price_detail_content">
                        <span class="item_sku_bottom_price_count_price_detail_symbol">￥</span>

                        <span>{{ sum_price || '-' }}</span>
                      </span>
                    </span>

                    <span v-if="show_freight_text" class="item_sku_bottom_price_count_price_freight">
                      运费到付
                    </span>

                    <span class="item_sku_bottom_price_count_price_freight" v-else>
                      另需运费：￥{{ sum_freight || '-' }}
                    </span>
                  </span>

                  <span class="item_sku_bottom_price_count_point">
                      <span>送</span>
                      <span>{{sum_point || '-'}}</span>
                      <span>积分</span>
                  </span>

                  <div class="item_sku_bottom_price_count_ok"
                       slot="sku-actions"
                       :class="'item_sku_actions ' + (able_add ? '' : 'disabled')"
                       @click="buyNow">
                    确 定
                  </div>
                </span>
            </section>
        </van-sku>

        <!-- 规格弹出框的收货地址 -->
        <van-popup v-model="show_address" position="bottom">
            <div class="item_detail_address">
                <div class="item_detail_address_title">
                    <span class="item_detail_address_title_text">配送至</span>

                    <span @click="newAddress"
                          class="item_detail_address_title_address">
                        新增地址
                    </span>

                    <van-icon name="yqn_close"
                              @click="showAddress"
                    />
                </div>
                <van-radio-group v-model="radio_address">
                    <van-cell-group class="item_detail_address_list">
                        <van-cell v-for="item in address_list"
                                  :key="item.address_id"
                                  class="item_detail_address_list_cell"
                                  clickable
                                  @click="checkAddress(item.address_id)">
                            <div slot="title" class="item_detail_address_list_cell_title">
                                <div>
                                    <span v-if="item.mr" class="item_detail_address_list_cell_title_default">默认</span>
                                    <span>{{item.truename}}</span>
                                    <span>{{item.mobile}}</span>
                                </div>
                                <div>{{item.province + ' ' + item.city + ' ' + item.county + ' ' + item.address}}</div>
                            </div>

                            <div></div>

                            <van-radio :name="item.address_id" />
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
        </van-popup>

        <!-- 优惠券 -->
        <van-popup v-model="show_coupon" position="bottom">
            <div class="item_detail_popup_title">
                <span>优惠券</span>
                <van-icon name="close"
                          class="item_detail_popup_title_close"
                          @click="changeCouponState"
                />
            </div>
            <div class="item_detail_popup_coupon_content">
                <div v-if="coupon_list.get.length !== 0">
                    <span class="item_detail_popup_coupon_content_title">可领取优惠券</span>
                    <div>
                        <yqn-coupon v-for="(item,index) in coupon_list.get"
                                    :key="index"
                                    :data="item"
                                    :img_src="getImgBg(item)"
                                    @toGetCoupon="getCoupon"
                        />
                    </div>
                </div>

                <div v-if="coupon_list.use.length !== 0">
                    <span class="item_detail_popup_coupon_content_title">可使用优惠券</span>
                    <yqn-coupon v-for="(item,index) in coupon_list.use"
                                :key="index"
                                :data="item"
                                :img_src="getImgBg(item)"
                    />
                </div>
            </div>
        </van-popup>

        <!-- 活动，满减，满赠 -->
        <van-popup v-model="show_activity" position="bottom" v-if="goods && goods.prom">
            <div class="item_detail_popup_title">
                <span>活动</span>
                <van-icon name="close" class="item_detail_popup_title_close" @click="changeActivityState" />
            </div>
            <div class="item_detail_popup_activity_content">
                <div>
                    <item-detail-activity v-for="(item,index) in goods.prom"
                                          :key="index"
                                          :prom_item="item"
                                          @hidePopUp="changeActivityState"
                    />
                </div>
            </div>
        </van-popup>

        <!-- 售后保障 -->
        <van-popup v-model="show_service" position="bottom">
            <div class="item_detail_popup_title">
                <span>售后保障</span>
                <van-icon name="close" class="item_detail_popup_title_close" @click="changeServiceState" />
            </div>
            <div class="item_detail_popup_service_content">
                <div v-for="(item,index) in cate_service" :key="index">
                    <div class="item_detail_popup_service_content_title">
                        <van-icon name="yqn_success" class="item_detail_popup_service_content_title_icon" />
                        <span class="item_detail_popup_service_content_title_text">{{item.title}}</span>
                    </div>
                    <div class="item_detail_popup_service_content_desc">{{item.desc}}</div>
                </div>
                <van-button type="danger" @click="changeServiceState">确定</van-button>
            </div>
        </van-popup>

        <!-- 二维码 -->
        <section class="showQR_content">
            <van-dialog v-model="show_QRCode">
                <div class="item_detail_QR">
                    <span class="item_detail_QR_title">加微信拉你进群</span>

                    <img src="../../../assets/images/yqn_download_ewm.png"
                         alt="二维码图片"
                    />

                    <span class="item_detail_QR_press">长按识别二维码</span>

                    <section @click="closeShowQRContent"
                             class="item_detail_QR_done">
                        完成
                    </section>
                </div>
            </van-dialog>
        </section>

        <!-- 全球购通知 -->
        <van-dialog v-model="show_global_notice">
            <div class="item_global_notice">
                <img src="../../../assets/images/customs_notice.png"
                     alt="全球购通知图片"
                />
            </div>
        </van-dialog>

        <!-- 拨打客服热线 -->
        <van-popup v-model="show_service_call" position="bottom">
            <div class="item_detail_show_service_call" v-if="user_base_info">
                <a class="item_detail_show_service_call_hot_line" href="tel: 400-801-5562">热线电话：400-801-5562</a>
                <span>专属客服：{{user_base_info.yg_name}}（{{user_base_info.yg_mobile}}）</span>
                <span @click="callTheService">取消</span>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import {PRO_INFO, PRO_SPECLIST, BUY_NUM_EDIT} from '@/api/product';
    import {USER_BASE_INFO} from '@/api/system';
    import {USER_ADDRESS_LIST, USER_ADDRESS_INFO} from '@/api/user';
    import {COUPON_ADD} from "@/api/coupon";
    import {PRO_ADD} from '@/api/cart';
    import {
        Swipe,
        SwipeItem,
        Stepper,
        GoodsAction,
        GoodsActionBigBtn,
        GoodsActionMiniBtn,
        RadioGroup,
        Radio,
        Search, Tab, Tabs, Collapse, CollapseItem, Tag
    } from 'vant';

    import {CATESERVICE} from '@/config.js'

    import NOTICE_IMG from '@/assets/images/category/cate_global_notice.png';
    import DESC_NOTICE_IMG from '@/assets/images/category/cate_global_desc_notice.png';
    import CHECKED from '@/assets/images/category/cate_checked.png';
    //引入底层图片
    import FREIGHT_IMG from "@/assets/images/user/mine_icon_Ticket_freight.png";
    import DEFAULT_IMG from "@/assets/images/user/mine_icon_Ticket_default.png";

    import actionSku from './sku.js';
    import Coupon from '@/vue/components/coupon/item_detail_coupon.vue';
    import ActivityPopup from './ActivityPopup/';

    import NavBar from '@/vue/components/NavBar/search.vue'
    import md_kefu from '@/vue/components/md-kefu/';

    // 搜索组件相关
    import IsEmpty from "@/vue/components/is-empty/";
    import SearchBar from '@/vue/components/NavBar/search.vue'
    import SearchCompo from '@/vue/components/Search/'

    export default {
        props: {
            keyword: {
                type: String,
                default: "",
            }
        },
        mixins: [actionSku],
        data() {
            const isLogin = !!localStorage.getItem('Authorization');
            const placeholder = this.keyword;
            return {
                isLogin,
                isLoading: false,
                isShowing: true, // 设备为 Android 和 IOS 时, 不显示关注我们
                showContact: false,
                placeholder,                    //搜索框的值
                show_search_compo: false,           //是否显示搜索弹出层
                // only_has_right: false, // 仅仅只有两项
                checked_icon: CHECKED,              //选中的对号图标
                cate_service: CATESERVICE,              //售后提示
                address_info: '请添加收货地址',                  //规格项中的省市区
                able_add: true,                         //允许添加至购物车或者订单
                hidden_freight: false,                  //选中物流，隐藏运费项
                show_freight_text: false, // 选中物流， 显示运费到付
                cartInfo: "",
                mobile: "13454193338",
                selectSku: {
                    selectedNum: 1,
                    selectedSkuComb: {}
                },
                addressVal: {
                    id: null,
                    area_name: "",
                    district: "",
                    city: "",
                    province: ""
                },
                moreIcon: [
                    {
                        icon: "wap-home",
                        name: "首页",
                        url: "/home"
                    },
                    {
                        icon: "phone",
                        name: "客服",
                        url: ""
                    },
                    {
                        icon: "clock",
                        name: "足迹",
                        url: ""
                    }
                ],
                showMoreIcon: false,
                showSku: false,
                sku1: [],
                sku2: [],
                sku_index: 0,           //选中的标签的key
                goods: null,
                freight_type_class: [],             //规格弹出框配送方式样式classname
                show_coupon: false,          //优惠券弹出层
                coupon_list: {
                    get: [],                //可领取优惠券
                    use: []                 //可使用优惠券
                },            //优惠券列表
                show_activity: false,            //活动弹出层，满减满赠
                show_global_notice: false, // 显示全球购通知
                show_QRCode: false,                 //二维码弹出层
                show_service: false,                //售后保障弹出层
                show_service_call: false,              //专属客服电话
                sku_tab: [],                //规格项tab
                sku_params: [],             //经过拼装的规格第一列，第二列。。。
                show_address: false,        //收货地址弹出层
                radio_address: '',              //收货地址单选按钮
                address_list: [],           //收货地址列表
                value: 0,                //规格步进器值
                checked_freight_btn: 0,             //选中物流项
                sku1_tab: '',                       //规格第一列
                sku_tab: [],                        //商品详情规格tab其他列
                sku_detail: [],                       //商品详情的sku
                checked_sku1_btn: 0,                 //选中规格项1
                checked_sku2_btn: 0,                    //选中规格项2
                checked_sku1_simple_btn: 0,             //选中单规格项,无规格项
                check_num: 0,                           //用户选中的件数
                sum_price: 0,                             //用户选中的所有商品的总价
                sum_point: 0,                            //用户能得到的所有积分
                sum_freight: 0,                           //用户需要支付的所有运费
                user_base_info: null,                   //用户信息
                notice_img: NOTICE_IMG,                  //全球购重要通知(规格)
                desc_global_img: DESC_NOTICE_IMG,            //全球购重要通知商品详情
                buytype: '',                                //购买方式，默认加入购物车，once立即购买
                prom: [
                    {
                        "typeid": 1,//促销类型ID(1: 折,2: 赠品,3: 满减,4: 满赠}
                        "tag": "折",//促销标签
                        "ms": "会员用户可享受9折",//促销描述
                        "zk": 0.90,//商品折扣,如果为0则无折扣（商品实际价格=商品价格*折扣）
                        "zplist": [],//赠品列表
                        "mzplist": [],//满赠品列表
                        "rule": []//优惠规则
                    },
                    {
                        "typeid": 2,//促销类型ID(1: 折,2: 赠品,3: 满减,4: 满赠}
                        "tag": "赠品",//促销标签
                        "ms": "购买此商品可获得赠品",//促销描述
                        "zk": 0,//商品折扣,如果为0则无折扣（商品实际价格=商品价格*折扣）
                        "zplist": [//赠品列表
                            {
                                "pro_pid": 8315,//赠品ID
                                "title": "珍纽倍羊奶粉100克听装1段",//赠品名称
                                "subtitle": "",//赠品副标题
                                "spec_title": "",//规格名称
                                "picpath": "https://img.naifenpifa168.com/upfile/admin/image/20181024/28c37a1236a777b96996cfbb4344570c.jpg!md",//赠品图片
                                "num": 1//赠品数量
                            }
                        ],
                        "mzplist": [],//满赠品列表
                        "rule": []//优惠规则
                    },
                    {
                        "typeid": 3,//促销类型ID(1: 折,2: 赠品,3: 满减,4: 满赠}
                        "tag": "满减",//促销标签
                        "ms": "满199元减20元,满299元减50元,满399元减80元,",//促销描述
                        "zk": 0,//商品折扣,如果为0则无折扣（商品实际价格=商品价格*折扣）
                        "zplist": [],//赠品列表
                        "mzplist": [],
                        "rule": { //优惠规则
                            "type": "1",//优惠方案（0:阶梯满减,1:每满减)
                            "mx": [
                                {
                                    "money": "199",//满足多少元
                                    "jian": "20",//减多少元
                                },
                                {
                                    "money": "299",//满足多少元
                                    "jian": "50",//减多少元
                                },
                                {
                                    "money": "399",//满足多少元
                                    "jian": "80",//减多少元
                                }
                            ]
                        }
                    },
                    {
                        "typeid": 4,//促销类型ID(1: 折,2: 赠品,3: 满减,4: 满赠}
                        "tag": "满赠",//促销标签
                        "ms": "每满199元可获以下每赠品1件",//促销描述
                        "zk": 0,//商品折扣,如果为0则无折扣（商品实际价格=商品价格*折扣）
                        "zplist": [],//赠品列表
                        "mzplist": [//满赠品列表
                            {
                                "pro_pid": 8315,//赠品ID
                                "title": "珍纽倍羊奶粉100克听装1段",//赠品名称
                                "subtitle": "",//赠品副标题
                                "spec_title": "",//规格名称
                                "picpath": "https://img.naifenpifa168.com/upfile/admin/image/20181024/28c37a1236a777b96996cfbb4344570c.jpg!md",//赠品图片
                                "num": 1//赠品数量
                            }
                        ],
                        "rule": { //优惠规则
                            "type": "1",//优惠方案（0:阶梯满赠,1:每满赠)
                            "mx": [
                                {
                                    "money": "199",//满足多少元
                                    "num": "1",//赠品数量
                                }
                            ]
                        }
                    }
                ],
                popup: true,
                item_desc_icon: 'yqn_downLoad', // 商品详情中 content 的图标
                goods_detail: true,           // 商品详情内容是否显示
                show_QR_code: true,           // 显示二维码
                imgContent: [],             // 图片内容数组
                // imgContentList: [],             // content 里面截取的图片
            }
        },

        created() {
            this.initData();
            this.initBaseInfo();
            this.initAddress();

            let _this = this;
            this.$bus.$on('cart_num', num => {
                console.log(num)
                _this.cartInfo = num || '';
            });

            //初始化多规格数据（第一列）
            // for(let i = 0;i < 5;i++){
            //     let obj = {};
            //     obj.id = i;
            //     obj.name = '蓝色小熊';
            //     this.sku1.push(obj);
            // }
            //初始化多规格数据（第二列）
            // for(let i = 0;i < 5;i++){
            //     let obj = {};
            //     obj.id = i;
            //     obj.name = '90码';
            //     this.sku2.push(obj);
            // }

            let name = this.$util.checkTheTerminal();

            if (name === 'IOS' || name === 'android') {
                this.isLoading = false;
                this.isShowing = false;
                this.item_desc_icon = 'yqn_share';
            } else {
                this.isLoading = true;
            }
        },

        methods: {
            initData() {
                // 获取商品详情
                this.$reqGet(PRO_INFO, {
                    // expand: "desc,skus,prop_imgs,item_imgs"
                    id: this.$route.params.itemId
                }).then(res => {
                    // console.log(res.data.content);
                    // let strUrl = res.data.content;
                    // let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                    // let listReg = strUrl.match(urlReg);
                    // console.log(listReg);

                    this.isLoading = true;

                    // 如果内容不存在, 则不显示商品描述
                    if (res.data.content === '') {
                        // this.goods_detail = true;
                        this.goods_detail = false;
                    } else {
                        let detailImgContent = res.data.content;

                        let findImgReg = /htt[:/a-zA-Z.0-9]+/g;

                        this.imgContent = detailImgContent.match(findImgReg);
                    }

                    if (res.code === 400) {
                        // 商品不存在或下架
                        setTimeout(() => {
                            this.$router.back(-1);
                        }, 3000);
                    } else {
                        this.goods = Object.assign({}, res.data);
                        console.log(this.goods);
                        // 获取该商品规格
                        this.initSku();

                        // 判断物流还是快递，若是物流，隐藏运费
                        if (res.data.ship_type === 2) {
                            // this.hidden_freight = true;
                            this.show_freight_text = true;
                            this.checked_freight_btn = 2;
                        }
                        // this.getSkuTabs(res.data);
                        // Object.keys(res.data.mx).map((item,index) => {
                        //     if(index === 0) {
                        //         this.$set(this.goods,'picture',res.data.mx[item].picpath);
                        //     }
                        // })
                        // 排列优惠券
                        this.editCouponList(res.data.coupon);
                    }
                });
            },
            initAddress() {
                this.$reqGet(USER_ADDRESS_INFO).then(res => {
                    //获取收货地址(默认)
                    if (!(res.data instanceof Array)) {
                        let {province, city, county, address_id} = res.data;
                        this.address_info = province + ' ' + city + ' ' + county;
                        //收货地址的radio标签选中
                        this.radio_address = address_id;
                    }
                });
            },
            initSku() {
                // 清空数组
                this.sku_detail.splice(0, this.sku_detail.length);
                // 获取商品详情中的规格
                this.$reqGet(PRO_SPECLIST, {
                    id: this.$route.params.itemId,
                    address_id: this.radio_address
                }, {
                    hideLoading: true
                }).then(res => {
                    if (res.data.spec_list.length > 1) {
                        //规格项大于1
                        this.sku1_tab = res.data.spec_list[0].title;
                        if (this.sku_tab.length === 0) {
                            //第一次进入sku
                            res.data.spec_list.map((item, index) => {
                                if (index !== 0) {
                                    this.sku_tab.push(item);
                                }
                            })
                        }

                        if (this.sku2.length === 0) {
                            //第一次进入规格弹出框
                            //将规格第一项添加参数Boolean(has_num)，来确定该第一列是否有左上角的角标
                            // res.data.list.map((item)=>{
                            //     item.has_num = false;
                            //     item.pros.map((i)=>{
                            //         if(i.buynum) {
                            //         item.has_num = true;
                            //         }
                            //     })
                            // })
                            this.sku_detail.push(...res.data.list);
                        } else {
                            //通过修改地址进入弹出框
                            //渲染数据前对数据进行处理
                            // res.data.list.map(item => {
                            //     // delete item.has_num;
                            //     item.pros.map(i => {
                            //         delete i.checknum;
                            //     })
                            // })
                            // console.log(res.data.list)
                            // console.log(sessionStorage.getItem('skuData'))
                            // let newData = Object.assign(res.data.list, JSON.parse(sessionStorage.getItem('skuData')));
                            // console.log(newData)
                            //Object.assign只能拷贝对象
                            const json = JSON.parse(sessionStorage.getItem('skuData'));
                            //备份一份JSON，用来覆盖内层pros,深拷贝
                            const temp_json = JSON.parse(JSON.stringify(json));
                            res.data.list.map((item, index) => {
                                //覆盖外层
                                let obj = Object.assign(json[index], item);
                                //覆盖内层pros
                                let arr = [];
                                item.pros.map((i, j) => {

                                    arr.push(Object.assign(temp_json[index]['pros'][j], i));
                                })
                                obj.pros = arr;
                                this.sku_detail.push(obj);
                            })

                            // console.log(JSON.parse(sessionStorage.getItem('skuData')))
                            // console.log(res.data.list)
                            // console.log(json)
                            // console.log(this.sku_detail)
                        }

                        //渲染默认的规格(第二三项)
                        this.checked_sku1_btn = res.data.list[0].id;
                        if (this.sku2.length === 0) {
                            //第一次进入规格弹出框
                            this.initSkuData();
                            this.sku2.push(...this.sku_detail[0].pros);
                        }

                        //复制一份sku2数据，并添加函数checknum，标识用户储存的选中数量
                        // res.data.list[0].pros.map((item) => {
                        //     item.checknum = item.buynum;
                        // })

                        this.checked_sku2_btn = res.data.list[0].pros[0].pro_id;
                        //渲染规格图片
                        this.$set(this.goods, 'picture', res.data.list[0].pros[0].picpath);
                        //渲染单价
                        this.$set(this.goods, 'market_price', (res.data.list[0].pros[0].price / res.data.list[0].pros[0].innum).toFixed(2));
                        // 渲染箱价
                        this.$set(this.goods, 'box_price', (res.data.list[0].pros[0].price));
                        //渲染运费
                        this.$set(this.goods, 'quantity', res.data.list[0].pros[0].ship_price);

                    } else {
                        //规格小于等于1
                        this.sku_detail.push(...res.data.list['pros']);
                        if (res.data.spec_list.length === 1) {
                            //规格等于1
                            this.sku1_tab = res.data.spec_list[0].title;
                        }
                        //初始化单规格、无规格商品数据
                        this.sku_detail.map(item => {
                            item.checknum = parseInt(item.buynum)
                        })
                        //计算单规格、无规格商品数据
                        this.simpleSkuCompute();
                        //渲染规格图片
                        this.$set(this.goods, 'picture', res.data.list['pros'][0].picpath);
                        //渲染单价
                        this.$set(this.goods, 'market_price', (res.data.list['pros'][0].price / res.data.list['pros'][0].innum).toFixed(2));
                        // 渲染箱价
                        // this.$set(this.goods, 'box_price', (res.data.list[0].pros[0].price));
                        this.$set(this.goods, 'box_price', (res.data.list['pros'][0].price));
                        //渲染运费
                        this.$set(this.goods, 'quantity', res.data.list['pros'][0].ship_price);
                    }
                })
            },
            initBaseInfo() {
                //获取用户基本信息
                this.$reqGet(USER_BASE_INFO).then(res => {
                    this.user_base_info = Object.assign({}, res.data);
                    this.cartInfo = res.data.cart_num || '';
                })
            },
            initSkuData() {
                //初始化Sku的数据,将已存在的数据添加参数check并赋值(多规格)
                this.sku_detail.map(item => {
                    item.has_num = false;
                    item.pros.map(i => {
                        i.checknum = parseInt(i.buynum);
                        if (i.buynum) {
                            //有值
                            item.has_num = true;
                        }
                    })
                })

                //计算值
                this.computeSum();
            },
            initAddressList() {
                // 获取收货地址列表
                // 清空数组
                this.address_list.splice(0, this.address_list.length);
                this.$reqGet(USER_ADDRESS_LIST).then(res => {
                    // 收货地址获取接口更新
                    this.address_list.push(...res.data.list.list);
                })
            },

            // 新增地址
            newAddress() {
                this.$router.push({name: 'address-edit', params: {addressId: -1}});
            },

            buyNumEdit(pro_id) {
                //点击规格加减的回调（多规格）
                //初始化参数
                let buynum, address_id = '';
                let index1, index2;
                this.sku_detail.map((item, index) => {
                    item.pros.map((i, j) => {
                        if (i.pro_id === pro_id) {
                            buynum = i.checknum;
                            index1 = index;
                            index2 = j;
                        }
                    })
                })
                address_id = this.radio_address;
                //点击规格加减的回调
                this.$reqPost(BUY_NUM_EDIT, {
                    pro_id,
                    buynum,
                    address_id,
                }, {
                    hideLoading: true
                }).then(res => {
                    Object.assign(this.sku_detail[index1]['pros'][index2], res.data);
                    this.computeSum();
                })
            },
            buyNumEditSimple(pro_id) {
                //单规格，无规格点击规格数量回调
                //初始化参数
                let i, buynum, address_id = '';
                this.sku_detail.map((item, index) => {

                    if (item.pro_id === pro_id) {
                        buynum = item.checknum;
                        i = index;
                    }

                })
                address_id = this.radio_address;
                //点击规格加减的回调
                this.$reqPost(BUY_NUM_EDIT, {
                    pro_id,
                    buynum,
                    address_id
                }, {
                    hideLoading: true
                }).then(res => {
                    Object.assign(this.sku_detail[i], res.data);
                    this.simpleSkuCompute();
                })
            },
            getShipTypeClass(ship_type) {
                //获取规格项配送方式的样式classname
                switch (ship_type) {
                    case 0:
                        //物流和快递
                        this.freight_type_class.push('')
                }

            },
            iconJumpTo(item) {
                //点击更多等按钮回调
                if (item.name === "首页") {
                    this.$router.push({name: "home"})
                }
            },
            editCouponList(coupon) {
                //将优惠券进行分组
                //清空可领取和可使用优惠券
                this.coupon_list.get.splice(0, this.coupon_list.get.length);
                this.coupon_list.use.splice(0, this.coupon_list.use.length);
                coupon.map(item => {
                    if (item.zt === 0) {
                        //可领取
                        this.coupon_list.get.push(item);
                    } else if (item.zt === 1) {
                        //已领取，可使用
                        this.coupon_list.use.push(item);
                    }
                })
            },
            getImgBg(el) {
                //根据优惠券类型对优惠券底板进行渲染
                if (el.type === 0) {
                    return DEFAULT_IMG
                } else {
                    return FREIGHT_IMG
                }

                // return IMGS[status] || '';
            },
            getCoupon(id) {
                //领取优惠券
                this.$reqPost(COUPON_ADD, {
                    cou_id: id
                }).then(res => {
                    if (res.code === 200) {
                        //成功领取优惠券
                        let index = '';
                        let obj = {};
                        this.coupon_list.get.map((item, i) => {
                            //从可领取删除，再在可使用添加
                            if (item.id === id) {
                                index = i;
                                item.zt = 1;
                                obj = Object.assign({}, item);
                            }
                        })
                        this.coupon_list.get.splice(index, 1);
                        this.coupon_list.use.push(obj);
                        this.$toast('领取成功');
                    }
                })
            },
            transformDate(timestamp) {
                //秒杀用（转化为月日）秒杀预告
                let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                let M = (date.getMonth() + 1 < 10 ? (date.getMonth() + 1) : date.getMonth() + 1);
                let D = date.getDate();

                return M + '月' + D + '日';
            },
            doBuyNow() {
                // 立即订购
                // if ((this.goods.has_sku && this.selectSku.sku_id) || !this.goods.has_sku) {
                //   this.$router.push({name: 'placeOrderEntity'})
                // } else {
                //   let goodAction = this.$refs.goodAction;
                //   goodAction.showSku = true;
                //   goodAction.isSkuBuy = true;
                // }

                // 如果状态为 0(已下架), 点击弹出已下架
                if (this.goods.sh === 0) {
                    this.$toast('该商品已下架');
                }
                // 如果状态为 2(缺货), 点击弹出商品缺货
                else if (this.goods.sh === 2) {
                    this.$toast('该商品暂时缺货');
                }
                // 其他情况打开立即订购
                else {
                    this.buytype = 'once';
                    this.showSku = true;
                }
            },
            addCart() {
                //添加购物车
                // if (this.goods.has_sku && this.selectSku.sku_id) {
                // 	this.$toast({
                // 		message: "已添加至购物车",
                // 		duration: 1500
                // 	});
                // 	this.cartInfo = String(parseInt(this.cartInfo) + 1);
                // }else{

                // }

                // 如果状态为 0(已下架), 点击弹出已下架
                if (this.goods.sh === 0) {
                    this.$toast('该商品已下架');
                }
                // 如果状态为 2(缺货), 点击弹出商品缺货
                else if (this.goods.sh === 2) {
                    this.$toast('该商品暂时缺货');
                }
                // 其他情况打开添加到购物车
                else {
                    this.buytype = '';
                    this.showSku = true;
                }
            },
            toHome() {
                // this.showContact = true;
                // this.showMoreIcon = !this.showMoreIcon;
                this.$router.push({name: 'home'});
            },
            toCart() {
                this.$router.push({
                    name: "cart"
                })
            },
            callTheService() {
                //呼叫客服弹出框
                this.show_service_call = !this.show_service_call;
            },

            // toSearch() {
            //     //跳转到搜索页
            //     this.$router.push({path: '/home/search'})
            // },

            // enterParams() {
            //     //确认筛选条件并查询
            //     //清空商品列表
            //     // this.items.splice(0, this.items.length);
            //     // 传递新的参数
            //     // this.pages.currPage = 1;
            //     // this.list_form.st = '';
            //     // this.list_form.cou_id = '';
            //     // this.list_form = Object.assign({}, this.list_form, this.filter_form);
            //     // 拉取数据
            //     // this.initData();
            //     //关闭弹出框
            //     // this.filterItemShow = false;
            // },

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
                // 开始搜索
                // 重置数据
                this.placeholder = word;
                this.show_search_compo = !this.show_search_compo;
                this.popup = false;
                this.$router.push({name: "list", query: {keyword: word.trim()}});
            },

            checked_freight(id) {
                //选中物流的回调
                if (this.goods.ship_type === 0) {
                    //可以选中物流或快递
                    this.checked_freight_btn = id;
                } else if (this.goods.ship_type === 1) {
                    //只能选中快递
                    if (id === 2) {
                        this.$toast('该商品不支持物流配送');
                    }
                    this.checked_freight_btn = 1;
                } else if (this.goods.ship_type === 2) {
                    //只能选中物流
                    if (id === 1) {
                        this.$toast('该商品不支持快递配送');
                    }
                    this.checked_freight_btn = 2;
                }

                //如果是物流则没有运费项
                if (id === 2) {
                    this.show_freight_text = true;
                } else {
                    this.show_freight_text = false;
                }
            },
            // changeStepper(index) {
            //     let value = this.$refs['stepper'+index][0].currentValue;
            //     let sku_detail = this.sku_detail;
            //     sku_detail.map((item,i) => {
            //         if(item.id === this.checked_sku1_btn) {
            //             console.log(this.sku_detail[i]['pros'][index]['checknum'])
            //             this.$set(this.sku_detail[i]['pros'][index],'checknum',value);
            //         }
            //     })
            //     console.log(this.sku_detail)
            // },
            checked_sku1(id, index) {
                //覆盖上次的第一列的id时，先取出来用于遍历总数据并覆盖相对应的数据
                const pid = this.checked_sku1_btn;
                //将修改过的对象赋值给总数据层
                this.assignData(pid);
                //选中规格项1的回调
                this.checked_sku1_btn = id;

                this.sku2.splice(0, this.sku2.length);
                this.sku_detail.map(item => {
                    if (item.id === id) {
                        //复制一份sku2数据，并添加函数checknum，标识用户储存的选中数量
                        item.pros.map((i) => {
                            if (!i.checknum) {
                                i.checknum = i.buynum;
                            }
                        })
                        this.sku2.push(...item.pros);
                        this.checked_sku2_btn = item.pros[0].pro_id;
                        this.$set(this.goods, 'picture', item.pros[0].picpath);
                        this.$set(this.goods, 'market_price', (item.pros[0].price / item.pros[0].innum).toFixed(2));
                        // 渲染箱价
                        this.$set(this.goods, 'box_price', (item.pros[0].price));
                        this.$set(this.goods, 'quantity', item.pros[0].ship_price);
                    }
                })
            },
            checked_sku2(pro_id) {
                //选中第二项的回调
                this.checked_sku2_btn = pro_id;
                this.sku2.map((item) => {
                    if (item.pro_id === pro_id) {
                        this.$set(this.goods, 'picture', item.picpath);
                        this.$set(this.goods, 'market_price', (item.price / item.innum).toFixed(2));
                        // 渲染箱价
                        this.$set(this.goods, 'box_price', (item.price));
                        this.$set(this.goods, 'quantity', item.ship_price);
                    }
                })
            },
            checked_sku1_simple(pro_id) {
                //单规格，无规格
                this.checked_sku1_simple_btn = pro_id;
                this.sku_detail.map((item) => {
                    if (item.pro_id === pro_id) {
                        this.$set(this.goods, 'picture', item.picpath);
                        this.$set(this.goods, 'market_price', (item.price / item.innum).toFixed(2));
                        // 渲染箱价
                        // this.$set(this.goods, 'box_price', (res.data.list['pros'][0].price));
                        this.$set(this.goods, 'box_price', (item.price));
                        this.$set(this.goods, 'quantity', item.ship_price);
                    }
                })
            },
            assignData(id) {
                //将第二三列的数据赋值给源数据层
                this.sku_detail.map((item, index) => {
                    if (item.id === id) {
                        Object.assign(item.pros, this.sku2);
                        //如果此列有数据，将此列的下标显示出来,m没有则不显示
                        if (item.has_num) {
                            //之前就有数据
                            let num = 0;
                            this.sku2.map(i => {
                                num += i.checknum;
                            })
                            if (num === 0) {
                                this.$set(this.sku_detail[index], 'has_num', false);
                            }
                        } else {
                            //之前没有数据
                            this.sku2.map(i => {
                                if (i.checknum) {
                                    this.$set(this.sku_detail[index], 'has_num', true);
                                }
                            })
                        }

                    }
                })
            },
            computeSum() {
                /**
                 * 每次改变计算总数和总价、积分、运费
                 */
                    //计算总数
                let check_num = 0;
                //计算总价
                let sum_price = 0;
                //计算总积分
                let sum_point = 0;
                //计算总运费
                let sum_freight = 0;
                this.sku_detail.map(item => {
                    item.pros.map(i => {
                        if (i.checknum) {
                            check_num += i.checknum;
                            sum_price += i.checknum * i.price;
                            sum_point += i.sendpoint * i.checknum;
                            sum_freight += i.ship_price * i.checknum;
                            item.has_num = true;
                        }
                    })
                })
                this.check_num = check_num;
                this.sum_price = sum_price.toFixed(2);
                this.sum_point = sum_point;
                this.sum_freight = sum_freight.toFixed(2);

                if (this.goods.maxnum && check_num > this.goods.maxnum) {
                    //总数大于限购数
                    this.able_add = false;
                } else if (this.goods.minnum && check_num < this.goods.minnum) {
                    //总数小于起订量
                    this.able_add = false;
                } else if (check_num == 0) {
                    //未选中任何一个
                    this.able_add = false;
                } else {
                    this.able_add = true;
                }

                // console.log(this.sku_detail)
            },
            simpleSkuCompute() {
                //单规格或无规格商品计算
                /**
                 * 每次改变计算总数和总价、积分、运费
                 */

                    //计算总数
                let check_num = 0;
                //计算总价
                let sum_price = 0;
                //计算总积分
                let sum_point = 0;
                //计算总运费
                let sum_freight = 0;
                this.sku_detail.map(item => {

                    if (item.checknum) {
                        check_num += item.checknum;
                        sum_price += item.checknum * item.price;
                        sum_point += item.sendpoint * item.checknum;
                        sum_freight += item.ship_price * item.checknum;
                    }

                })
                this.check_num = check_num;
                this.sum_price = sum_price.toFixed(2);
                this.sum_point = sum_point;
                this.sum_freight = sum_freight.toFixed(2);

                if (this.goods.maxnum && check_num > this.goods.maxnum) {
                    //总数大于限购数
                    this.able_add = false;
                } else if (this.goods.minnum && check_num < this.goods.minnum) {
                    //总数小于起订量
                    this.able_add = false;
                } else if (check_num == 0) {
                    this.able_add = false;
                } else {
                    this.able_add = true;
                }
            },
            buyNow() {
                //立即购买
                // this.$router.push({name: 'placeOrderEntity'});
                if (this.able_add) {
                    let arr = [];
                    this.sku_detail.map((item, index) => {
                        if (item.pros) {
                            //多规格
                            item.pros.map(i => {
                                let obj = {};
                                obj.pro_id = i.pro_id;
                                obj.buynum = i.checknum;

                                arr.push(obj);
                            });
                        } else {
                            //单规格，无规格

                            let obj = {};
                            obj.pro_id = item.pro_id;
                            obj.buynum = item.checknum;

                            arr.push(obj);
                        }
                    });

                    if (arr.length === 0) {
                        this.$toast('请选择购买商品详情');
                        return false;
                    } else if (this.checked_freight_btn === 0) {
                        this.$toast('请选择配送方式');
                        return false;
                    } else {
                        this.$reqPost(PRO_ADD, {
                            shiptype: this.checked_freight_btn,
                            pro: arr,
                            buytype: this.buytype
                        }).then(res => {
                            if (res.code === 200) {
                                if (this.buytype === 'once') {
                                    //跳转至订单确认页面
                                    this.showSku = false;
                                    this.$router.push({name: 'placeOrderEntity'})
                                } else {
                                    this.$toast.success({
                                        position: 'middle',
                                        message: '成功加入进货单'
                                    });
                                    this.showSku = false;
                                    this.$bus.$emit('cart_num', res.data.cart_sumnum)
                                }
                            }
                        });
                    }
                } else {
                    if (this.check_num == 0) {
                        // this.$toast('商品数量不能为0');
                        this.$toast('请选择商品数量');
                    } else if (this.goods.maxnum && this.check_num > this.goods.maxnum) {
                        //总数大于限购数
                        this.$dialog.alert({
                            title: '该商品限购' + this.goods.maxnum + '件'
                        })
                    } else if (this.goods.minnum && this.check_num < this.goods.minnum) {
                        //总数小于起订量
                        this.$dialog.alert({
                            title: '该商品起订量为' + this.goods.minnum + '件'
                        })
                    }
                    // this.$toast('超出限购量或不足于起订量，请核查后重试！')
                }

            },
            getCountDown() {
                //如果是直降和秒杀，获取倒计时时间
                if (this.goods.prom_limit.length !== 0) {
                    return (this.goods.prom_limit.enddate - this.goods.prom_limit.nowdate)
                } else {
                    return ''
                }
            },
            getInCartText(type) {
                // 正常，缺货，下架
                switch (type) {
                    case 0:
                        return '已下架';
                    case 1:
                        return '加入进货单';
                    case 2:
                        return '暂时缺货';
                    default:
                        return '加入进货单';
                }
            },
            changeCouponState() {
                //打开关闭优惠券的弹出框
                this.show_coupon = !this.show_coupon;
            },
            changeActivityState() {
                //关闭打开满减满赠活动弹出框
                this.show_activity = !this.show_activity;
            },
            changeServiceState() {
                //关闭打开售后保障弹出框
                this.show_service = !this.show_service;
            },
            showQRCode() {
                //弹出二维码弹出层
                this.show_QRCode = !this.show_QRCode;
            },
            showGlobalNotice() {
                // 弹出全球购通知弹出层
                this.show_global_notice = !this.show_global_notice;
            },
            showAddress() {
                //弹出收货地址
                //关闭sku，弹出收货地址
                console.log(this.address_info);
                if (this.address_info === '请添加收货地址') {
                    //如果地址是空的，则跳转至收货地址页面
                    this.$router.push({name: 'address'});
                } else {
                    sessionStorage.setItem('skuData', JSON.stringify(this.sku_detail));
                    if (!this.show_address) {
                        this.initAddressList();
                    }
                    this.showSku = !this.showSku;
                    this.show_address = !this.show_address;
                }

            },

            // show_new_address()
            // {
            //     this.show_address = true;
            // },

            checkAddress(id) {
                //选中收货地址
                this.radio_address = id;
                //重新拉取配置项
                this.address_list.map(item => {
                    if (id === item.address_id) {
                        let {province, city, county} = item;
                        this.address_info = province + ' ' + city + ' ' + county;
                    }
                })
                this.initSku();
                this.show_address = !this.show_address;
                this.showSku = !this.showSku;
            },
            getSkuTabs(goods) {
                //废弃，后端做了数据处理
                let arr = [];
                //分离并渲染规格参数
                if (this.sku_params.length === 0) {
                    // 第一次进入循环
                    //规格弹出框tab
                    this.sku_tab.push(...goods['spec_list']);
                    //第一列
                    Object.keys(goods['spec_items']).map((item) => {
                        //重组第一列及其他列的结构
                        if (goods['spec_items'][item].spec_id === goods['spec_list'][0].id) {
                            let obj = {};
                            obj.column_first_id = goods['spec_items'][item].id;
                            obj.column_first_title = goods['spec_items'][item].value;
                            obj.column_spec_id = goods['spec_items'][item].spec_id;
                            obj.children = [];
                            //组建第二列及其他
                            Object.keys(goods['mx']).map(i => {
                                //根据mx中的键名来判断是否为其子集1031_1035
                                if (i.indexOf(obj.column_first_id) !== -1) {
                                    //若存在1031
                                    //添加第二列或者多列的值和id
                                    //有两列
                                    if (goods['spec_list'].length === 2) {
                                        //将键名1031_1035变为数组
                                        let arr_temp = i.split('_');
                                        //取出第二列的id
                                        let column2_id;
                                        arr_temp.map((j, index) => {
                                            if (j !== obj.column_first_id) {
                                                column2_id = j;
                                            }
                                        });
                                        //将第二列的数据加入到children的参数中
                                        goods['mx'][i].column2_id = goods['spec_items'][column2_id].id;
                                        goods['mx'][i].column2_title = goods['spec_items'][column2_id].value;
                                        goods['mx'][i].column2_spec_id = goods['spec_items'][column2_id].spec_id;

                                    } else if (goods['spec_list'].length === 3) {
                                        //有三列
                                        //将键名1031_1035_1038
                                        let arr_temp = i.split('_');
                                        //分别取出第二列第三列的ID
                                        arr_temp.map((j, index) => {
                                            if (j !== obj.column_first_id) {
                                                //遍历判断分离出的键名是第几列
                                                goods['spec_list'].map((m, index) => {
                                                    if (m.id === goods['spec_items'][j].spec_id) {
                                                        //将第二列，第三列等等数据加入到children
                                                        goods['mx'][i]['column' + (index + 1) + '_id'] = goods['spec_items'][j].id;
                                                        goods['mx'][i]['column' + (index + 1) + '_title'] = goods['spec_items'][j].value;
                                                        goods['mx'][i]['column' + (index + 1) + '_spec_id'] = goods['spec_items'][j].spec_id;
                                                    }
                                                });
                                            }
                                        })
                                    }
                                    obj.children.push(goods['mx'][i]);
                                }
                            });
                            arr.push(obj);
                        }
                    });
                }
                console.log(arr);
            },

            // 图文分享
            shareImg() {
                // console.log('图文共享');

                // 判断设备终端信息
                let name = this.$util.checkTheTerminal();

                // 调用源生函数
                switch (name) {
                    case 'IOS':
                        // 判断源生函数是否存在, 存在返回 true
                        let iosInfo = this.$util.checkPrimalFunc('shareImgAction');

                        if (iosInfo) {
                            // 使用正则截取 contents 的图片 url
                            let strUrl = this.goods.content;
                            // let urlReg = /htt[a-z/:0-9.!]+/g;
                            let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                            let listReg = strUrl.match(urlReg);
                            // console.log(listReg);

                            // 如果是 android, 调用 android 共享链接源生函数
                            // this.$util.androidFunc('shareImgAction', {
                            //     title: this.goods.title,
                            //     imglist: listReg
                            // });

                            // 如果分享的图片为空, 则不调用源生函数
                            if (strUrl === '' || strUrl === null) {
                                return false;
                            } else {
                                // 如果是 ios, 调用 IOS 共享链接源生函数
                                this.$util.iosFunc('shareImgAction', {
                                    title: this.goods.title,
                                    imglist: listReg
                                });
                            }
                        }
                        break;

                    case 'android':
                        // 引用判断源生函数是否存在
                        let androidInfo = this.$util.checkPrimalFunc('shareImgAction');

                        if (androidInfo) {
                            // console.log(this.goods.content);

                            // 使用正则截取 content 的图片 url
                            let strUrl = this.goods.content;
                            let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                            let listReg = strUrl.match(urlReg);
                            // console.log(listReg);

                            // 如果分享的图片为空, 则不调用源生函数
                            if (strUrl === '' || strUrl === null) {
                                return false;
                            } else {
                                // 如果是 android, 调用 android 共享链接源生函数
                                this.$util.androidFunc('shareImgAction', {
                                    title: this.goods.title,
                                    imglist: listReg
                                });
                            }
                        }
                        break;

                    case 'WeChat':
                        this.$util.openInApp();
                        break;

                    default:
                        this.$util.openInApp();
                        break;
                }
            },

            // 共享链接
            shareLink() {
                // console.log('共享链接');

                // 引用判断设备终端信息
                let name = this.$util.checkTheTerminal();
                // console.log(name);

                // 调用源生函数
                switch (name) {
                    case 'IOS':
                        // console.log(name);
                        // 引用判断源生函数是否存在
                        let iosInfo = this.$util.checkPrimalFunc('qynsharelink');

                        if (iosInfo) {
                            // 使用正则截取 pics 的图片 url
                            let strUrl = this.goods.pics[0];
                            let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                            let listReg = strUrl.match(urlReg);
                            // console.log(listReg[0]);

                            if (strUrl === '' || this.goods.pics === '') {
                                return false;
                            } else {
                                // 如果是 ios, 调用 IOS 共享链接源生函数
                                this.$util.iosFunc('qynsharelink', {
                                    title: this.goods.title,
                                    description: this.goods.abstract,
                                    images: listReg[0],
                                    url: window.location.href
                                });
                            }
                        }
                        break;

                    case 'android':
                        // 引用判断源生函数是否存在
                        let androidInfo = this.$util.checkPrimalFunc('shareLinkAction');
                        // console.log(androidInfo);

                        if (androidInfo) {
                            // 使用正则截取 pics 的图片 url
                            let strUrl = this.goods.pics[0];
                            let urlReg = /htt[:/a-zA-Z.0-9]+/g;
                            let listReg = strUrl.match(urlReg);
                            // console.log(listReg[0]);

                            // 如果分享里的图片为空, 则不调用源生函数
                            if (strUrl === '' || this.goods.pics === '') {
                                return false;
                            } else {
                                // 如果是 android, 调用 android 共享链接源生函数
                                this.$util.androidFunc('shareLinkAction', {
                                    title: this.goods.title,
                                    description: this.goods.abstract,
                                    images: listReg[0],
                                    url: window.location.href
                                });
                            }
                        }
                        break;

                    default:
                        break;
                }
            },

            // 关闭加微信拉你进群弹出框
            closeShowQRContent() {
                this.show_QRCode = false;
            }
        },

        // new copy --> 使用 watch 监听 $router 的变化
        watch: {
            $route(to, from) {
                if (to.name === 'detail') {
                    this.initData();
                    this.initBaseInfo();
                    this.initAddress();
                }

                // console.log(to);
                // console.log(from);
            }
        },

        components: {
            [md_kefu.name]:
            md_kefu,
            [Coupon.name]:
            Coupon,
            [ActivityPopup.name]:
            ActivityPopup,
            [RadioGroup.name]:
            RadioGroup,
            [Radio.name]:
            Radio,
            [Swipe.name]:
            Swipe,
            [SwipeItem.name]:
            SwipeItem,
            [Stepper.name]:
            Stepper,
            [GoodsAction.name]:
            GoodsAction,
            [GoodsActionBigBtn.name]:
            GoodsActionBigBtn,
            [GoodsActionMiniBtn.name]:
            GoodsActionMiniBtn,
            [NavBar.name]:
            NavBar,
            [IsEmpty.name]:
            IsEmpty,
            // [NavBar.name]: NavBar,
            [SearchBar.name]:
            SearchBar,
            [SearchCompo.name]:
            SearchCompo,
            ["entity-group"]:
                () =>
                    import ( /* webpackChunkName: "EntityGroup" */ './EntityGroup/index'),
            ["virtual-group"]:
                () =>
                    import ( /* webpackChunkName: "VirtualGroup" */ './VirtualGroup/index.vue'),
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
                        }
                        vm.resetInit();
                    }
                }
            )
        },

        // 在路由离开之前不销毁组件
        beforeRouteLeave(to, from, next) {
            //因为将所有的组件进行了缓存，所以退出的时候要将其组件销毁
            // if(to.name === 'class') {
            //     this.$destroy();
            // }

            // if (to.name !== 'address-edit')
            // {
            //     this.$destroy();
            // }

            if (to.name !== 'address-edit') {
                this.$destroy();
            } else if (to.name === 'address-edit') {
                this.showAddress();
            }

            // ...
            next();
        },

        // beforeRouteLeave(to, from, next) {
        //     //因为将所有的组件进行了缓存，所以退出的时候要将其组件销毁
        //     this.$destroy();
        //     // ...
        //     next();
        // }
    }
</script>

<style lang="scss" scoped>
    @import "../../../assets/scss/mixin";

    .item_detail {
        width: 100%;

        .item_list_search {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 2000;
        }

        .van-hairline--top-bottom::after {
            border: none;
        }

        &_content {
            height: 100%;
            overflow-y: auto;
        }

        &_banner {
            position: relative;
            width: 100%;
            height: 15rem;

            &_yqn_swipe {
                width: auto;
                height: 15rem;
                background-color: #fff;

                .van-swipe-item {
                    display: flex;
                    justify-content: center; // x 轴对齐方式
                    align-items: center;     // y 轴对滴方式
                    height: 100%;
                }
            }

            &_proTag {
                position: absolute;
                top: .64rem;
                right: 0;
                width: 2.22rem;
                height: auto;
                z-index: 1997;
            }

            &_icon {
                position: absolute;
                left: .48rem;
                bottom: .48rem;
                width: 1.6rem;
                height: 1.6rem;
                z-index: 1998;
                color: rgba(0, 0, 0, .3);
            }
        }

        &_proLong {
            display: block;
            width: 100%;
            height: 2.2rem;
        }

        img {
            display: block;
            max-width: 100%;
        }

        &_moreIcon {
            overflow: hidden;
            position: fixed;
            bottom: 2rem;
            left: 0;
            height: 0;
            display: flex;
            flex-direction: column;
            background-color: #fff;
            padding: 0 .8rem;
            z-index: 250;
            border-radius: .12rem .12rem 0 0;
            box-shadow: 0 0 .24rem 0 #ccc;

            &_icon {
                display: block;
                display: flex;
                height: 2rem;
                flex-direction: row;
                align-items: center;
                border-bottom: 1px solid #f9f9f9;
                color: #666;

                &_icon {
                    margin-right: .4rem;
                    font-size: .64rem;
                }

                &_name {
                    color: $main-title-color;
                    font-size: $params-title-size;
                }
            }
        }

        &_onSale {
            display: flex;
            width: 100%;
            height: 2.12rem;

            &_price {
                /* display: inline-block; */
                display: flex;
                width: 60%;
                background-color: #fe6d35;

                &_symbol {
                    display: block;
                    max-width: 1.5rem;
                    padding: .32rem .48rem;
                    font-size: $main-title-size;
                    color: #fff;
                    /* line-height: 20px; */
                    line-height: .8rem;
                }

                &_price {
                    font-size: .88rem;
                    line-height: .96rem;
                }

                &_past {
                    display: flex;
                    flex-direction: column;
                    color: #fff;
                    padding-top: .32rem;

                    &_price {
                        margin-top: .08rem;
                        font-size: $extra-size;
                        line-height: .6rem;
                        text-decoration: line-through;
                    }

                    &_count {
                        width: 2.8rem;
                        font-size: $params-title-size;
                        line-height: .8rem;
                        background: #e15e25;
                        font-size: $product-title-size;
                        text-align: center;
                        margin-bottom: .28rem;
                    }
                }
            }

            &_countDown {
                width: 38%;
                background: #ff944d;
                padding: .2rem .4rem;

                &_count {
                    margin-top: .2rem;
                }

                &_time {
                    color: #fff;
                    font-size: $params-title-size;
                }
            }
        }

        .item_info {
            .item-title {
                font-size: $sub-title-size;
                color: $main-title-color;
            }

            &_price {
                margin-top: .64rem;
                color: $price-color;
                font-size: $product-title-size;

                &_salePrice {
                    font-size: $main-title-size;
                }

                &_default {
                    color: $explain-text-color;
                    font-size: $extra-size;
                    text-decoration: line-through;
                }
            }

            .item-advice {
                display: flex;
                align-items: center;
                /* height:.48rem; */
                margin-top: .32rem;
                font-size: $extra-size;
                color: $sub-title-color;

                &-payType {
                    /*padding-right: .52rem;*/
                    color: $main-color;

                    /*@media screen and (max-width: 330px) {*/
                    /*padding-right: .30rem;*/
                    /*}*/
                }

                &-line {
                    width: 1px;
                    margin: 0 .52rem;
                    height: $extra-size;
                    background: $sub-title-color;

                    @media screen and (max-width: 320px) {
                        margin: 0 .30rem;
                    }
                }

                &-price {
                    /*margin-left: .52rem;*/
                    /*padding-right: .52rem;*/

                    /*@media screen and (max-width: 330px) {*/
                    /*padding-left: .30rem;*/
                    /*padding-right: .30rem;*/
                    /*}*/
                }

                &-hot {
                    /*padding-left: .52rem;*/

                    /*@media screen and (max-width: 330px) {*/
                    /*padding-left: .30rem;*/
                    /*padding-right: .30rem;*/
                    /*}*/
                }
            }

            &_params {
                width: 100%;

                h5 {
                    margin: .4rem 0;
                    font-size: $sub-title-size;
                }

                &_item {
                    width: 100%;
                    color: $sub-title-color;

                    &_title {
                        display: inline-block;
                        width: 20%;
                        text-align: left;
                    }
                }
            }

            &_advance {
                display: flex;
                align-items: center;
                padding-top: .32rem;

                span {
                    &:nth-child(1) {
                        display: inline-block;
                        border: 1px solid $main-color;
                        width: 2.08rem;
                        height: .6rem;
                        color: $main-color;
                        font-size: $tag-size;
                        line-height: .6rem;
                        text-align: center;
                        border-radius: .12rem;
                    }

                    &:nth-child(2) {
                        margin-left: .28rem;
                        color: $main-color;
                        font-size: $extra-size;
                        display: inline-block;
                        line-height: .6rem;
                    }
                }
            }

        }

        &_globalNotice {
            background: #fff;
            padding: .32rem;
            margin-bottom: .2rem;
        }

        &_service {
            &_title {
                display: flex;
                align-items: center;
                font-size: $extra-size;
                color: $main-title-color;

                div {
                    margin-right: .52rem;
                }

                &_icon {
                    font-size: $sub-title-size;
                    color: $price-color;
                }
            }
        }

        &_spec {
            // height: 2.2rem;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-bottom: .2rem;
            padding: .4rem .32rem 1rem;
            background-color: #fff;

            img {
                margin-bottom: .24rem;
            }

            &_line {
                font-size: $params-title-size;
                color: $main-title-color;

                &:nth-child(1) {
                    margin-bottom: .24rem;
                }

                span {
                    color: $sub-title-color;
                    font-size: $extra-size;
                }
            }
        }

        &_notice {
            &_desc {
                color: $main-color;
                font-size: $extra-size;
            }
        }

        &_activity {
            .item_detail_slot_title {
                display: flex;
            }

            &_title {
                display: inline-block;
            }

            &_desc {
                width: 11rem;
                display: inline-block;
                margin-left: .32rem;

                &_line {
                    overflow: hidden;

                    &_title {
                        color: $main-color;
                        font-size: $tag-size;
                        padding: 1px 2px;
                        border: 1px solid $main-color;
                        border-radius: .12rem;
                    }

                    &_desc {
                        color: $sub-title-color;
                        font-size: $extra-size;
                        width: 86%;
                        float: right;
                        margin-top: .04rem;
                        overflow-wrap: break-word;
                    }

                    &_gift {
                        color: #666;
                        font-size: $font-size-small;
                    }
                }
            }
        }

        &_coupon {
            &_desc {
                display: inline-block;

                span {
                    margin-right: .2rem;
                    padding: 1px .16rem;
                    border: 1px solid $main-color;
                    border-radius: .32rem;
                    color: $main-color;
                    font-size: $tag-size;
                }
            }
        }

        &_kefu {
            &_icon {
                color: $main-color;
                font-size: .8rem;
            }

            &_person {
                margin-left: .62rem;
                color: $main-color;
                font-size: $params-title-size;
            }

            &_wechat {
                display: flex;
                position: relative;

                &_image {
                    width: 1.6rem;
                    height: 1.6rem;
                }

                &_img {
                    width: 100%;
                    height: 100%;
                    /*height: 1.6rem;*/
                }

                &_desc {
                    display: flex;
                    flex-direction: column;
                    margin-top: -.1rem;
                    margin-left: .16rem;
                    line-height: .92rem;

                    span {
                        &:nth-child(1) {
                            font-size: $extra-size;
                            color: $main-title-color;
                        }

                        &:nth-child(2) {
                            font-size: $tag-size;
                            color: $sub-title-color;
                        }
                    }
                }

                &_btn {
                    position: absolute;
                    top: .3rem;
                    right: .2rem;
                    width: 2.64rem;
                    height: .88rem;
                    /* padding: .2rem .4rem; */
                    background: linear-gradient(90deg, rgba(255, 102, 0, 1) 0%, rgba(254, 121, 56, 1) 100%);
                    border-radius: .12rem;
                    line-height: .88rem;
                    text-align: center;
                    color: #fff;
                    font-size: $extra-size;
                }
            }
        }

        &_describe {
            padding: 0 .32rem;
            background: #fff;

            span {
                &:nth-child(1) {
                    display: inline-block;
                    width: 100%;
                    height: 1.28rem;
                    line-height: 1.28rem;
                    font-size: $params-title-size;
                    color: $main-title-color;
                }

                &:nth-child(2) {
                    text-indent: 2em;
                    display: inline-block;
                    font-size: $extra-size;
                    color: $sub-title-color;
                    line-height: .72rem;
                }
            }
        }

        .item_sku {
            &_header {
                width: 100%;
                // &_title {

                // }
                &_price {
                    display: block;
                    display: flex;
                    margin-top: .6rem;
                    flex-direction: column;

                    &_count {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: $price-color;
                        font-size: $extra-size;

                        &_price {
                            font-weight: bold;

                            span {
                                font-size: $sub-title-size;
                            }
                        }

                        &_point {
                            color: $sub-title-color;

                            span:nth-child(1) {
                                /* width: .52rem; */
                                /* height: .52rem; */
                                /* display: inline-block; */
                                padding: .08rem;
                                line-height: .52rem;
                                text-align: center;
                                background: $price-color;
                                border-radius: .12rem;
                                color: #fff;
                                font-size: $tag-size;
                            }

                            span:nth-child(2) {
                                color: $price-color;
                            }
                        }
                    }

                    &_unit {
                        margin-top: .4rem;
                        font-size: $extra-size;
                        color: $sub-title-color;
                    }

                    &_freight {
                        font-size: $extra-size;
                        color: $sub-title-color;

                        span:nth-child(2) {
                            color: $main-color;
                        }
                    }
                }
            }

            &_group {
                display: flex;
                align-items: center;
            }

            &_freight {
                width: 100%;
                display: flex;
                justify-content: space-between;

                &_btns {
                    font-size: $extra-size;

                    span {
                        display: inline-block;
                        width: 2.88rem;
                        height: .96rem;
                        line-height: .96rem;
                        /*padding: 0 .2rem;*/
                        border-radius: .2rem;
                        border: 1px solid $sub-title-color;
                        text-align: center;

                        &:nth-child(2) {
                            margin-left: .32rem;
                        }
                    }
                }
            }

            &_desc {
                display: flex;
                flex-direction: column;
                height: 8.88rem;

                &_title {
                    display: flex;
                    justify-content: space-around;
                    line-height: 1.4rem;

                    &_center {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        text-align: center;

                        // 修正不加宽度时, 循环出来的 span 会挤在一起
                        span {
                            display: flex;
                            justify-content: space-evenly;
                            width: 2.5rem;
                            text-align: center;
                            /*&:nth-child(2n)*/
                            /*{*/
                            /*padding-left: 1rem;*/
                            /*box-sizing: border-box;*/
                            /*}*/
                        }
                    }
                }

                &_content {
                    display: flex;
                    overflow-x: scroll;
                    // justify-content: space-around;
                    ul {
                        width: 5rem;
                        text-align: center;

                        li {
                            line-height: 1.8rem;
                            width: 100%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            position: relative;

                            img {
                                width: .64rem;
                                height: auto;
                                position: absolute;
                                top: 0;
                                left: 0;
                            }
                        }
                    }

                    &_right {
                        display: flex;
                        max-height: 9rem;
                        overflow-y: auto;
                    }

                    &_sku2 {
                        li {
                            display: flex;
                            justify-content: space-around;
                            align-items: center;

                            span {
                                display: inline-block;
                                min-width: 50%;
                                max-width: 100%;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }
                    }

                    &_num {
                        &_content {
                            -webkit-box-sizing: border-box;
                            -moz-box-sizing: border-box;
                            box-sizing: border-box;
                            height: 1.8rem;
                            padding-top: .3rem;
                            line-height: 0 !important;
                        }

                        @media screen and (max-width: 345px) {
                            li {
                                padding: .2rem 0 .2rem 0;
                            }
                        }
                    }

                    &_sku1 {
                        box-shadow: 0 0 0 .1rem rgba(163, 72, 1, .19);
                        max-height: 9rem;
                        overflow-y: auto;
                        z-index: 1000;

                        li {
                            position: relative;

                            span {
                                position: absolute;
                                display: block;
                                background-color: #fff;
                                width: .16rem;
                                height: 60%;
                                left: 0;
                                top: 20%;
                            }
                        }
                    }
                }

                &_oneSkuContent {
                    width: 100%;
                    height: 9rem;
                    overflow: hidden;

                    &_item {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        padding: .4rem 0;

                        span {
                            flex: 1;
                            text-align: center;
                            color: $main-title-color;

                            &:nth-child(1),
                            &:nth-child(2) {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                        }
                    }
                }
            }

            &_msg {
                display: flex;
                justify-content: space-between;
                padding: 0 .4rem;
                line-height: 1.4rem;
                color: $sub-title-color;

                &_quota {
                    &_text {
                        font-size: $params-title-size;

                        &_num {
                            color: $main-color;
                        }
                    }
                }

                &_minnum {
                    color: $main-color;
                }

                &_checked {
                    &_num {
                        color: $main-color;
                    }
                }
            }

            .item_sku_bottom_price {
                display: flex;
                width: 100%;
                /* margin-top: .6rem; */
                flex-direction: column;

                &_count {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-left: .24rem;
                    color: $price-color;
                    font-size: $extra-size;

                    &_price {
                        font-weight: bold;

                        &_detail {
                            display: block;
                            color: $main-title-color;

                            &_content {
                                color: $price-color;
                                font-size: $main-title-size;
                            }

                            &_symbol {
                                font-size: $font-size-small !important;
                            }
                        }

                        &_freight {
                            display: block;
                            color: $sub-title-color;
                            font-size: $font-size-small;
                        }
                    }

                    &_point {
                        color: $sub-title-color;

                        span:nth-child(1) {
                            /*width: .52rem;*/
                            /*height: .52rem;*/
                            /*display: inline-block;*/
                            padding: .12rem;
                            line-height: .52rem;
                            text-align: center;
                            background: $price-color;
                            border-radius: .12rem;
                            color: #fff;
                            font-size: $tag-size;
                        }

                        span:nth-child(2) {
                            color: $price-color;
                        }
                    }

                    &_ok {
                        width: 5.2rem;
                        height: 1.76rem;
                        line-height: 1.76rem;
                    }
                }
            }

            &_actions {
                width: 100%;
                height: 1.76rem;
                line-height: 1.76rem;
                background: linear-gradient(to right, #fe5d28, #fe8246);
                color: #fff;
                text-align: center;
                font-size: $main-title-size;
            }
        }

        &_address {
            height: 15.2rem;
            overflow: hidden;
            overflow-y: auto;
            padding: 0 .32rem;

            &_title {
                @include one-border;
                line-height: 1.54rem;
                color: $main-title-color;
                font-size: $product-title-size;
                display: flex;
                justify-content: space-between;
                align-items: center;

                &_text {
                    padding-left: .32rem;
                }

                &_address {
                    padding-left: 8rem;
                    color: $main-color;
                    font-size: $params-title-size;
                }

                i {
                    padding-top: .1rem;
                    padding-right: .32rem;
                }
            }

            &_list {
                height: 13.64rem;
                overflow-y: auto;

                &_cell {
                    &_title {
                        color: $main-title-color;
                        font-size: $params-title-size;

                        div {
                            &:nth-child(1) {
                                .item_detail_address_list_cell_title_default {
                                    display: inline-block;
                                    width: 1.3rem;
                                    height: .6rem;
                                    border: 1px solid $price-color;
                                    line-height: .6rem;
                                    color: $price-color;
                                    font-size: $tag-size;
                                    text-align: center;
                                    border-radius: 3px;
                                }
                            }

                            &:nth-child(2) {
                                width: 100%;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }
                    }
                }
            }
        }

        &_addCart {
            background: linear-gradient(90deg, rgba(255, 199, 2, 1), rgba(255, 152, 3, 1));
            box-shadow: 0 -1px .16rem 0 rgba(221, 221, 221, 1);
            border: none;
        }

        &_buy {
            background: linear-gradient(90deg, rgba(255, 115, 2, 1), rgba(255, 76, 1, 1));
            box-shadow: 0 -1px .16rem 0 rgba(221, 221, 221, 1);
            border: none;
        }

        &_popup_title {
            width: 100%;
            height: 1.92rem;
            line-height: 1.92rem;
            text-align: center;
            position: relative;

            span {
                font-size: $sub-title-size;
                color: $main-title-color;
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
            }
        }

        &_popup_activity_content {
            padding: 0 .3rem;
            height: 14.26rem;
            overflow-y: auto;
        }

        &_popup_service_content {
            padding: 0 .3rem;
            height: 9.8rem;
            overflow-y: auto;
            position: relative;

            &_title {
                &_icon {
                    color: $price-color;
                }

                &_text {
                    font-size: $product-title-size;
                    color: $main-title-color;
                }
            }

            &_desc {
                margin: .2rem .68rem .6rem .8rem;
                color: $sub-title-color;
                font-size: $extra-size;
            }

            .van-button {
                position: absolute;
                width: 100%;
                bottom: 0;
                left: 0;
            }
        }

        &_QR {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            &_title {
                display: block;
                margin-top: .7rem;
                color: $main-title-color;
                font-size: $product-title-size;
            }

            img {
                width: 5.96rem;
                height: auto;
                margin: .24rem 0 .28rem;
            }

            &_press {
                color: $sub-title-color;
                font-size: $extra-size;
                padding-bottom: .92rem;
            }

            &_done {
                width: 100%;
                padding: .6rem 0;
                border-top: 1px solid #fbfbfb;
                color: #f60;
                text-align: center;
            }
        }

        &_show_service_call {
            width: 100%;
            height: 5.32rem;
            display: flex;
            flex-direction: column;

            &_hot_line {
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
                color: $sub-title-color;
            }

            span {
                @include one-border;
                flex: 1;
                color: $sub-title-color;
                display: inline-block;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: $sub-title-size;

                &:nth-child(3) {
                    color: $explain-text-color;
                }
            }
        }
    }

    .item_cell_group {
        margin-bottom: .2rem;

        &_title {
            font-size: $params-title-size;
            color: $main-title-color;
        }
    }

    .item_price {
        font-size: $main-title-size;
        color: $price-color;
        margin-right: .4rem;
    }

    .item_market_price {
        color: $explain-text-color;
        text-decoration: line-through;
        font-size: $extra-size;
    }

    .goods_title_tag {
        /*display: inline-block;*/
        /*width: 1.12rem;*/
        /*height: .6rem;*/
        padding: .08rem;
        background: $price-color;
        border-radius: 3px;
        color: #fff;
        font-size: $tag-size;
        line-height: .52rem;
        text-align: center;
        position: relative;
        bottom: 1px;
    }

    // .item_dispatch {
    // 	font-size: $font-size-small;
    // 	color: $font-color-gray;
    // }

    // .item_intro {
    // 	line-height: 18px;
    // 	margin: 5px 0;
    // 	font-size: $font-size-small;
    // 	color: $font-color-gray;
    // 	overflow: hidden;
    // 	text-overflow: ellipsis;
    // 	display: -webkit-box;
    // 	-webkit-box-orient: vertical;
    // 	-webkit-line-clamp: 3;
    // }

    .item_desc {
        box-sizing: border-box;
        background-color: #fff;
        color: $main-title-color;
        font-size: $sub-title-size;
        padding-bottom: 2rem;

        p {
            padding: 0 .4rem;
        }

        img {
            max-width: 100%;
        }

        &_text {
            color: $main-color;
            font-size: $params-title-size;
            display: inline-block;
            text-align: center;
            width: 100%;
            margin-bottom: .84rem;
        }

        &_content {
            padding: 0 .6rem;

            &_num {
                padding: 0;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
            }

            .img_content_image {
                &_item {
                    margin-bottom: .5rem;
                }
            }
        }

        &_title {
            // @include one-border;
            padding: .4rem .32rem .2rem;
            text-align: center;
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: $sub-title-size;

            &_left {
                display: flex;
                align-items: center;

                &_slot {
                    display: inline-block;
                    width: 2px;
                    height: 16px;
                    background: $main-color;
                    margin-right: 7px;
                }
            }

            &_target {
                display: flex;
                align-items: center;
                height: 100%;
                justify-content: space-around;
                font-size: 20px;

                i {
                    font-size: 15px;
                }

                span {
                    font-size: $product-title-size;
                    color: $main-title-color;
                }
            }
        }
    }

    .transiton_height {
        height: 6.12rem;
        transition: .5s all;
    }

    //选中物流的样式
    .checked_freight {
        border-color: $main-color !important;
        color: $main-color !important;
        background: #fef4ed !important;
    }

    //选中规格项1的样式
    .checked_sku1 {
        background: linear-gradient(157deg, rgba(255, 102, 51, 1) 0%, rgba(254, 121, 56, 1) 100%);
        box-shadow: 7px 0px 9px 1px rgba(163, 72, 1, 0.19);
        color: #fff;
    }

    //选中规格二三的样式
    .checked_sku2 {
        background: $background-color;
    }

    //缺货，下架
    .disabled {
        background: $explain-text-color !important;
        border: none; // 去掉缺货或下架按钮的边框
        box-shadow: none; // 去掉缺货或下架按钮的阴影

    }

    //禁用配送方式
    .disabled_ship_type {
        background: $explain-text-color !important;
        border: 1px solid $explain-text-color !important;
    }
</style>

<style lang="scss">
    // 覆盖原 vant 的默认样式
    .item_detail {
        &_banner {
            .van-swipe__track {
                width: 15rem;
                display: flex;
                align-items: center;
                justify-content: center;

                .van-swipe-item {
                    width: 100% !important;
                }
            }

            .van-swipe__indicators .van-swipe__indicator {
                width: .6rem;
                height: .12rem;
                border-radius: 0;
            }
        }

        .van-cell {
            padding-left: 8px;
            padding-right: 8px;
        }

        i.van-cell__right-icon {
            position: relative;
        }

        // .item_detail_activity {
        //     i.van-cell__right-icon {
        //         top: .48rem;
        //     }
        // }
        &_address {
            .van-cell {
                padding-right: 8px;
                justify-content: space-between;
            }

            .van-cell__title {
                width: 12.32rem;
            }

            .van-cell__value {
                width: 1rem;
            }
        }

        &_banner {
            .van-icon {
                font-size: 40px;
            }
        }

        div.van-sku__goods-name {
            width: 7.5rem;
            white-space: normal;
            height: 1.5rem;
        }

        .item_detail_popup_activity_content {
            .item_detail_activity_item_title {
                span {
                    padding: .1rem .1rem;
                }
            }

            .item_detail_activity_item_content {
                padding-top: .1rem;
            }
        }

        .item_desc {
            &_content {
                .item_desc_wrap {
                    table {
                        width: 100% !important;
                        font-size: 12px !important;
                        vertical-align: middle;

                        tr,
                        td {
                            width: 16.666%;

                            img {
                                display: none;
                            }
                        }
                    }
                }
            }
        }

        .showQR_content {
            .van-dialog {
                .van-hairline--top {
                    .van-dialog__confirm {
                        display: none;
                    }
                }
            }
        }

        @media screen and (max-width: 360px) {
            .item_sku {
                .van-sku-header {
                    margin-left: .3rem;
                }

                &_desc {
                    &_content {
                        &_right {
                            .item_sku_desc_content_num {
                                &_content {
                                    .van-stepper {
                                        .van-stepper__minus {
                                            width: 30px;
                                        }

                                        .van-stepper__input {
                                            width: 30px;
                                        }

                                        .van-stepper__plus {
                                            width: 30px;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    &_oneSkuContent {
                        .van-stepper {
                            .van-stepper__minus {
                                width: 30px;
                            }

                            .van-stepper__input {
                                width: 30px;
                            }

                            .van-stepper__plus {
                                width: 30px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
