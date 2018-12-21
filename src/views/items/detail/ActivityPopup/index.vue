<template>
    <!-- 商品详情活动弹出框 -->
	<div class="item_detail_activity">
        <!-- 折 -->
        <div class="item_detail_activity_per item_detail_activity_item" v-if="prom_item.typeid === 1">
            <div class="item_detail_activity_item_title">
                <span>{{prom_item.tag}}</span>
            </div>
            <span class="item_detail_activity_item_content">{{prom_item.ms}}</span>
        </div>
        <!-- 满减 -->
        <div class="item_detail_activity_des item_detail_activity_item" v-else-if="prom_item.typeid === 3">
            <div class="item_detail_activity_item_title">
                <span>{{prom_item.tag}}</span>
            </div>
            <div class="item_detail_activity_item_content">
                {{prom_item.ms}}
            </div>
            <div class="item_detail_activity_item_btn" @click="jumpToProm(prom_item.prom_id)">
                去凑单
            </div>
        </div>
        <!-- 满赠 -->
        <div class="item_detail_activity_fullgift item_detail_activity_item" v-else-if="prom_item.typeid === 4">
            <div class="item_detail_activity_item_title">
                <span>{{prom_item.tag}}</span>
            </div>
            <div class="item_detail_activity_item_content">
                {{prom_item.ms}}
            </div>
            <div class="item_detail_activity_item_list">
                <span v-for="(item,index) in prom_item.mzplist" :key="index" class="item_detail_activity_item_list_item" @click="jumpToGoods(item.pro_pid)">
                    <span class="item_detail_activity_item_list_item_title">{{item.title + ' ' + item.subtitle + ' ' + item.spec_title}}</span>
                    <span class="item_detail_activity_item_list_item_num">{{'x' + item.num}}</span>
                    <van-icon name="rightIcon" class="item_detail_activity_item_list_item_icon"/>
                </span>
            </div>
        </div>
        <!-- 赠 -->
        <div class="item_detail_activity_gift item_detail_activity_item" v-else-if="prom_item.typeid === 2">
            <div class="item_detail_activity_item_title">
                <span>{{prom_item.tag}}</span>
            </div>
            <div class="item_detail_activity_item_content">
                <!-- {{ prom_item.ms }} -->
                购买此商品可获得以下赠品
            </div>
             <div class="item_detail_activity_item_list">
                <span v-for="(item,index) in prom_item.zplist" :key="index" class="item_detail_activity_item_list_item" @click="jumpToGoods(item.pro_pid)">
                    <span class="item_detail_activity_item_list_item_title">{{item.title + ' ' + item.subtitle + ' ' + item.spec_title}}</span>
                    <span class="item_detail_activity_item_list_item_num">{{'x' + item.num}}</span>
                    <van-icon name="rightIcon" class="item_detail_activity_item_list_item_icon"/>
                </span>
            </div>
        </div>
	</div>
</template>


<script>

	export default {
        name: "item-detail-activity",
        props: {
            prom_item: {
                type: Object,
                default: ()=>{}
            }
        },
        data() {
            return {

            }
        },
        methods: {
            jumpToProm(id) {
                //满减跳到不带分类的促销页面
                this.$router.push({ name: 'prom_area_list', params: { itemClass: id } });
            },
            jumpToGoods(id) {
                this.$emit('hidePopUp');
                this.$toast.loading({
                  mask: true,
                  position: 'middle'
                });
                //跳到商品详情页
                this.$router.replace({ name: 'detail', params: { itemId: id } });
            }
        },
		components: {

		}
	}

</script>

<style lang="scss" scoped>
	.item_detail_activity {
        margin-top: .5rem;
        &_item {
            // display: flex;
            // align-items: flex-start;
            position: relative;
            vertical-align: top;
            &_title {
                position: absolute;
                display: inline-block;
                display: flex;
                span {
                    margin-top: .1rem;
                    height: .48rem;
                    line-height: .48rem;
                    border: 1px solid $main-color;
                    font-size: $tag-size;
                    padding: 0 .12rem;
                    border-radius: .2rem;
                    color: $main-color;
                }
            }
            &_content {
                padding-left: 1.6rem;
                display: inline-block;
                font-size: $params-title-size;
                color: $main-title-color;
                width: 8.74rem;
            }
            &_btn {
                display: inline-block;
                position: absolute;
                top: 0;
                right: 0;
                width: 2.64rem;
                height: .88rem;
                border: 1px solid $main-color;
                color: $main-color;
                line-height: .88rem;
                text-align: center;
                border-radius: 6px;
                font-size: $extra-size;
            }
            &_list {
                padding: 0 0 0 1.52rem;
                color: $main-title-color;
                font-size: $extra-size;
                &_item {
                    display: inline-block;
                    margin-top: .24rem;
                    position: relative;
                    width: 100%;
                    &_title {
                        display: inline-block;
                        width: 8.74rem;
                    }
                    &_num {
                        display: block;
                    }
                    &_icon {
                        position: absolute;
                        top: 35%;
                        right: .2rem;

                    }
                }

            }
        }
    }


</style>
