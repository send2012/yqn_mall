<template>
	<div slot="footer" class="order_list--footer_btn">
		<van-button size="small" class="reason" @click="$emit('handle', 'showReason')">查看原因</van-button>
		<van-button size="small" type="default" @click="$emit('handle', 'serviceshow')" :disabled="!reminder" class="btn_server">联系客服</van-button>
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
    .reason {
        background: linear-gradient(to right ,#fe5d28 , #fe8246);
        color: #fff;
        border-radius: 3px;
    }
    .delete {
        margin-left: 15px;
        background: #fff;
        color: #ff6600;
        border: 1px solid #f60;
    }
    .btn_server{
        margin-left: 15px;
        background: #fff;
        color: #fe5d28;
        border: 1px solid #fe5d28;         
    }
}
</style>
