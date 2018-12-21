<template>
        <van-nav-bar
            left-text="返回"
            right-text="按钮"
            left-arrow
            @click-left="onClickLeft"
            @click-right="onClickRight"
            style="z-index: 1999"
        >
		<span slot="title">标题</span>
        </van-nav-bar>
</template>


<script>
	import { NavBar } from 'vant';
	export default {
        name: 'class-search',
		data() {
			return {
				
			}
		},
		
		watch:{
			'$route': 'changeActive'
		},
		
		created(){
			const toName = this.$route.name
			this.setActive(toName)
		},
		
		methods: {
			changeActive({ name }){
				this.setActive(name)
			},
			setActive(name){
				this.tabbar.forEach((tab, i) => {
					if(tab.pathName == name){
						this.active = i;
						return false;
					}
				})
            },
            onClickLeft() {
                // this.$toast('返回');
                if(window.history.length <= 1) {
                    location.href = '/#/'
                }else {
                    this.$router.back(-1)
                }
            },
            onClickRight() {
                // this.$toast('按钮');
            }
		},
		
		components:{
			 [NavBar.name]: NavBar
		}
	}

</script>
