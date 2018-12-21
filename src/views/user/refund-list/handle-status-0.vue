<template>
	<div slot="footer" class="order_list--footer_btn">
        <van-button size="small" type="danger" @click="$emit('handle', 'serviceshow')"  :disabled="!reminder" class="btn_server">联系客服</van-button>
		<van-button size="small" type="danger" @click="$emit('handle', 'applyRefund')" :disabled="!reminder" class="btn">申请退货</van-button>
	</div>	
</template>

<script>
	export default {
		props: {
			reminder: {
                type: Boolean,
                default: true
            }
		}
	}
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
        color: #333333;
        border: 1px solid #333333; 
    }
}
</style>
