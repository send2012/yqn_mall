<template>
	<div slot="footer" class="order_list--footer_btn">
		<van-button size="small" @click="$emit('handle', 'toOrderDetail')">查看详情</van-button>
        <van-button size="small" type="danger" @click="$emit('handle', 'orderOneMore')">再来一单</van-button>
	</div>	
</template>

<script>
</script>