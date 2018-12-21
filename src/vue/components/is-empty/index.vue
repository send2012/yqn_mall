<template>
	<div class="is_empty">
		<div>
            <!-- 商品列表 -->
            <img v-if="type === 'pro_list'" src="../../../assets/images/empty_pro_list.png" alt="无商品" width="20%">
            <!-- 其他 -->
			<img v-else src="../../../assets/images/is_empty.png" alt="无商品" width="20%">
		</div>
		<div>
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
        name: "is-empty",
        props: {
            type: {
                type: String,
                default: 'default'
            }
        },
        methods: {
            
        }
	}
</script>


<style lang="scss" scoped>
	
	.is_empty{
		text-align: center;
		color: $font-color-gray;
		padding-top: 100px;
		>div{
            margin-bottom: 15px;
            img {
                width: 3.86rem;
                height: auto;
            }
		}
	}
</style>