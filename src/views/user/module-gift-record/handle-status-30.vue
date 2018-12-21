<template>
	<div slot="footer" class="order_list--footer_btn prize_list_btns">
		<van-button size="small" @click="$emit('handle', 'logistics')">查看物流</van-button>
		<van-button size="small" type="danger" @click="$emit('handle', 'receiptOrder')">确认收货</van-button>
	</div>	
</template>

<script>
export default {
    name: 'status3'
}

</script>

<style lang="scss">
.prize_list_btns {
    .van-button--small {
        width: 3.12rem !important;
        height: 1.32rem !important;
    }
    button {
        &:nth-child(2) {
            margin-left: 15px;
        }
    }
}
</style>
