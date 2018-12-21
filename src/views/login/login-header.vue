<template>
	<div class="store_header">
		<div class="store_avatar">
			<img src="../../assets/images/yqn_logo.png" alt="头像" width="55" height="55">
		</div>
		<!-- <div class="store_name">一起牛母婴平台</div> -->
	</div>
</template>


<script>
	export default {
		name: "login-header"
	}
</script>

<style lang="scss" scoped>
	.store_header{
		text-align: center;
		padding: 2.08rem 0 1.36rem;
		.store_avatar img{
            width: 11.4rem;
            height: auto;
		}
		.store_name{
			padding-top: 5px;
			font-size: 16px;
		}
	}
</style>