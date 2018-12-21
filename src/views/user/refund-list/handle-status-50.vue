<template>
	<div slot="footer" class="order_list--footer_btn">
		<van-button size="small" class="btn" @click="$emit('handle', 'refund')">立即退货</van-button>
	</div>	
</template>

<script>
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/_var.scss";
.order_list--footer_btn {
    .btn {
        background: $main-color;
        color: #fff;
        border-radius: 3px;
    }
}
</style>
