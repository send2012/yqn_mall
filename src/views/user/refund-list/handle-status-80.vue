<template>
	<div slot="footer" class="order_list--footer_btn">
		<!-- <van-button size="small" @click="$emit('handle', 'toOrderDetail')">查看详情</van-button> -->
        <van-button size="small" type="default" @click="$emit('handle', 'serviceshow')" class="btn_server">联系客服</van-button>
	</div>	
</template>

<script>
</script>

<style lang="scss" scoped>
.order_list--footer_btn {
    .btn {
        margin-left: 15px;
        background: #fff;
        color: #ff6600;
        border: 1px solid #f60;
    }
    .btn_server{
        margin-left: 15px;
        background: #fff;
        color: #ff6600;
        border: 1px solid #ff6600;         
    }
}
</style>
