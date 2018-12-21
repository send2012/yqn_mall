<template>
    <div class="_home_title">
        <h3 :class="color === 'white'?'white_color title':'title'">{{title}}</h3>
		<span v-if="sub_title" class="sub_title">
			<span :class="color === 'white'?'white_color sub_title_ver':'sub_title_ver'">|</span>
			<span :class="color === 'white'?'white_color sub_title_text':'sub_title_text'">{{sub_title}}</span>
		</span>
		<span v-if="count_down" class="count_down">
			<!-- <van-icon name="upgrade" class="count_down_icon"/> -->
			<span>{{count_down}}点开抢</span>
		</span>
		<span v-if="more" class="more" >
			<router-link :to="more">
				<span :class="color === 'white'?'white_color more_text':'more_text'">更多</span>
				<van-icon name="yqn_more" :class="color === 'white'?'white_color more_icon':'more_icon'"/>
			</router-link>
		</span>
    </div>
</template>


<script>
	
	export default {
		name: 'home-title',
		props: {
			title: {
				type: String,
				default: ''
			},					//标题
			sub_title: {
				type: String,
				default: ''
			},					//副标题
			count_down: {
				type: String,
				default: ''
			},					//倒计时
			more: {
				type: String,
				default: ''
			},					//更多（跳转）
			color: {
				type: String,
				default: ''		//字体颜色
			}
		},
		data() {
			return {
                
			}
		},
		
		watch:{
			
		},
		
		created(){
			
		},
		
		methods: {
			// more_goods() {
			// 	this.$router.push(this.more);
			// }
		},
		
		components:{
             
		}
	}

</script>
<style lang="scss" scoped>

@import '../../../assets/scss/_var.scss';

.white_color {
	color: #fff !important;
}
._home_title {
	position: relative;
	height: 1.68rem;
	display: flex;
	align-items: center;
	h3 {
		margin: 0;
		display: inline-block;
		font-size: $sub-title-size;
		color: $main-title-color;
        margin-right: 7px;
        font-weight: 400;
        line-height: 1.4rem;
	}
	.sub_title {
		.sub_title_ver {
            color: $sub-title-color;
            font-size: $extra-size;
		}
		.sub_title_text {
			margin-left: 7px;
			font-size: $extra-size;
			color: $sub-title-color;
		}
	}
	.count_down {
		font-size: 12px;
		margin-left: 15px;
		height: 20px;
		line-height: 20px;
		background: linear-gradient(to right,#ff934a,#f60);
		color: #fff;
		border-radius: 8px;
		padding: 0 8px;
		.count_down_icon {
			font-size: 10px;
		}
	}
	.more {
		position: absolute;
		top: 26%;
		right: .2rem;
		font-size: $extra-size;
		.more_text {
			color: $explain-text-color;
            font-size: $extra-size;
		}
		.more_icon {
            font-size: $params-title-size;
			color: $explain-text-color;
		}
	}
	
}


</style>
