<template>
	<div slot="footer" class="order_list--footer_btn">
		<van-button class="yqn-btn-normal">查看物流</van-button>
		<van-button class="yqn-btn-normal" type="danger" @click="$emit('handle', 'reminderOrder')" :disabled="!reminder">提醒发货</van-button>
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