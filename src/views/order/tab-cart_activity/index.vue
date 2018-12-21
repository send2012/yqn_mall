<template>
	<div class="tab-cart_inner_tag">
        <div class="tab-cart_inner_tag_left">
            <span>{{tag_name}}</span>
            <span>{{tag_text}}</span>
        </div>
        <div class="tab-cart_inner_tag_right" @click="clickToJump">
            <span>去凑单</span>
            <van-icon name="yqn_rightIcon" />
        </div>
    </div>
</template>

<script>

    //满赠满减标题
    const TAG_ACTIVITY = {
        '3': '满减',
        '4': '满赠'
    }

	export default {
        name: 'cart-tag',
		props: {
            tag_type: {
                type: Number,
                default: 3
            },                          //tag的值，满减3满赠4
            tag_text: {
                type: String,
                default: ''             //tag的说明文字
            },
            prom_id: {
                type: [Number, String],
                default: 0                  //去凑单跳转页面的id
            }
        },
        data() {
            const tag_type = this.tag_type;
            return {
                tag_name: TAG_ACTIVITY[tag_type]           //标签的文字
            }
        },
        methods: {
            clickToJump() {
                //跳转：全场prom_id为0则跳至全部分类，部分商品则跳至促销不带分类页
                if(this.prom_id == 0) {
                    //跳至全部分类
                    this.$router.push({name: 'class'})
                }else {
                    //跳至促销不带分类页
                    this.$router.push({name: 'prom_area_list', params: {itemClass: this.prom_id}})
                }
            }
        }
	}
</script>
<style lang="scss" scoped>
.tab-cart_inner_tag {
    padding: .46rem 8px 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    &_left {
        display: flex;
        span {
            &:nth-child(1) {
                height: .62rem;
                line-height: .62rem;
                padding: 0 4px;
                border: 1px solid $price-color;
                color: #fff;
                background: $price-color;
                font-size: $tag-size;
                border-radius: 3px;
            }
            &:nth-child(2) {
                margin-left: 5px;
                display: inline-block;
                font-size: $extra-size;
                color: $main-title-color;
                max-width: 9.72rem;
            }
        }
    }
    &_right {
        display: flex;
        align-items: center;
        span {
            color: $price-color;
            font-size: $extra-size;
        }
        i {
            margin-left: 5px;
            color: $price-color;
            font-size: $extra-size;
        }
    }
}
</style>
