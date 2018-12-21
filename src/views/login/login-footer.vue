<template>
	<div class="text-desc text-center bottom_positon">
		我已经阅读并理解和同意<span class="protocol">《一起牛平台协议》服务商协议</span>
	</div>
</template>

<script>
	export default {
		name: "login-footer"
	}
</script>


<style lang="scss" scoped>
	.bottom_positon{
		position: absolute;
		bottom: 30px;
		width: 100%;
		.protocol {
            color: #FDA969;
		}
	}
</style>