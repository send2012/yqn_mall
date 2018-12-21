<template>
	<div slot="footer" class="order_list--footer_btn">
        <van-button class="yqn-btn-normal" type="danger" @click="$emit('handle', 'orderOneMore')">再来一单</van-button>
	</div>	
</template>

<script>
</script>

<style lang="scss">
	.yqn-btn-normal{
		font-size: $params-title-size;
		padding: 0;
		line-height:  1.32rem;
	}
</style>