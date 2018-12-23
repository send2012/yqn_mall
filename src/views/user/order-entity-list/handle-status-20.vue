<template>
	<div slot="footer" class="order_list--footer_btn">
		<van-button class="yqn-btn-normal"  @click="$emit('handle', 'cancelOrder')" >取消订单</van-button>
	</div>	
</template>

<script>
	export default {
		props: {
			reminder: Boolean
		}
	}
</script>

<style lang="scss">
	.yqn-btn-normal{
		font-size: $params-title-size;
		padding: 0;
		line-height:  1.32rem;
	}
</style>