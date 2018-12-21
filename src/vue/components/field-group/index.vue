<template>
	<div class="field_group">
		<slot></slot>
	</div>
</template>


<script>
	export default {
		name: 'md-field-group'
	}
</script>

<style lang="scss" scoped>
	.field_group {
		padding-left:  15px;
		padding-right: 15px;
		
		> div{
			//margin-bottom: 15px;
			// &:nth-child(3){
			// 	margin: 15px;
			// }
		}
	}
</style>