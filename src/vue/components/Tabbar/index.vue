<template>
	<van-tabbar v-model="active" style="z-index: 1000" class="tabbar">
		<van-tabbar-item 
			v-for="(tab, index) in tabbar" 
			:icon="tab.icon" 
			:to="tab.path"
			:dot="tab.dot"
			:info="tab.info | greater"
			:key="index">
			{{tab.name}}
		</van-tabbar-item>
	</van-tabbar>	
</template>


<script>
    import { USER_BASE_INFO } from '@/api/user';
	import { Tabbar, TabbarItem } from 'vant';
	export default {
        name: "yqn-tabbar",
        props: {
            router_name: {
                type: String,
                default: ''
            }
        },
		data() {
			return {
                active: 0,
				tabbar: [{
						name: "首页",
						path: "/",
						pathName: "home",
						icon: "yqn_index",
						dot: false,
						info: ""
					},
					{
						name: "分类",
						path: "/items",
						pathName: "class",
						icon: "yqn_cate",
						dot: false,
						info: ""
					},
					{
						name: "推荐",
						path: "/recommend",
						pathName: "recommend",
						icon: "yqn_recommend",
						dot: false,
						info: ""
					},
					{
						name: "进货单",
						path: "/order",
						pathName: "cart",
						icon: "yqn_cart",
						dot: false,
						info: ""
					},
					{
						name: "我的",
						path: "/user",
						pathName: "user",
						icon: "yqn_mine",
						dot: false,
						info: ""
					}
				]
			}
		},
		
		watch:{
            $route(to, from) {
                
                this.changeActive(to, from);
                
            }
			// '$route': 'changeActive'
		},
		
		created(){
			const toName = this.$route.name;
            this.setActive(toName);
            this.$bus.$on('cart_num',num => {
                this.$set(this.tabbar[3],'info',num?num:'');
            })
		},
		
		methods: {
			changeActive({ name }, from){
                this.setActive(name);
                //登陆后渲染tabbar订货单商品数量
                if(name && name !== 'login' && name !== 'registered' && name !== 'agreement') {
                    this.$reqGet(USER_BASE_INFO).then((res)=>{
                        //设置title
                        document.title = res.data.web.webname;
                        this.$set(this.tabbar[3],'info',res.data.cart_num?res.data.cart_num:'');
                        this.$bus.$emit('cart_num', res.data.cart_num);
                        this.$bus.$emit('search_default', res.data.web.searchmr);
                        //将购物车数量存储到本地
                        sessionStorage.setItem('cart_num', res.data.cart_num);
                        //将客服电话存储到本地
                        sessionStorage.setItem('yg_mobile', res.data.yg_mobile);
                        //存储热词到本地
                        sessionStorage.setItem('search_hot', JSON.stringify(res.data.web.searchhot));
                        //存储默认词到本地
                        sessionStorage.setItem('search_default', res.data.web.searchmr);
                        //存储员工二维码至本地
                        sessionStorage.setItem('yg_qrcode', res.data.yg_qrcode);
                    })
                }
                
			},
			setActive(name){
				this.tabbar.forEach((tab, i) => {
					if(tab.pathName == name){
						this.active = i;
						return false;
					}
				})
			}
		},
		
		components:{
			 [Tabbar.name]: Tabbar,
			 [TabbarItem.name]: TabbarItem,
        }
	}

</script>

<style lang="scss">
.tabbar {
    .van-info {
        top: -.2em;
    }
}
</style>

