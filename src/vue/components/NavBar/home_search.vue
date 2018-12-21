<template>
	<div class="home_title">
        <div class="home_title_background" :style="'opacity: ' + search_opacity"></div>
		<van-search :placeholder="placeholder"  v-model="value" class="search_title" background="inherit" @click.native="search_link" disabled/>
	</div>
</template>


<script>
	import { Search } from 'vant';
	export default {
        name: "home-search",
        props: {
            search_opacity: {
                type: [Number, String],
                default: 0
            }
        },
		data() {
			return {
				value: '',
				placeholder: "请输入搜索关键词"
			}
		},
		
		watch:{
			'$route': 'changeDefaultKeyword'
		},
		
		created(){
            const toName = this.$route.name;
            //先从本地拿出默认关键词
            this.placeholder = sessionStorage.getItem('search_default') || '请输入搜索关键词';
            //否则监听从tabbar过来的关键词
            this.$bus.$on('search_default', keyword => {
                this.placeholder = keyword;
            })
			// this.setActive(toName)
		},
		
		methods: {
            changeDefaultKeyword() {
                //改变搜索框文字
                this.placeholder = sessionStorage.getItem('search_default') || '';
            },
			search_link () {
				this.$router.push({path:'/home/search'});
			}
		},
		
		components:{
			[Search.name]: Search
		}
	}

</script>
<style lang="scss">
.home_title {
	width: 100%;
	height: 44px;
	display: inline-block;
	z-index: 1000;
	position: fixed;
	top: 0;
	left: 0;
    &_background {
        background: #eee;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 44px;
        z-index: -1;
    }
    .van-cell {
        background-color: rgba(255, 255, 255, 0.8);
    }
}
</style>
