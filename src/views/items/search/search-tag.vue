<template>
	<span class="search_tag" @click="OnClick">
		<slot></slot>
	</span>
</template>

<script>
	export default{
		name: "word-tag",
		methods:{
			OnClick(){
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search_tag{
		display: inline-block;
		font-size: $extra-size;
		background-color: #EDEDED;
		padding: .18rem .32rem;
		border-radius: 3px;
        min-width: .8rem;
        text-align: center;
        color: $sub-title-color;
	}
</style>