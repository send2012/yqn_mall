<template>
	<div class="about_us">
        <nav-bar 
            title="关于我们"
            @back="backTo"/>
		<img :src="about_us" alt="">
	</div>
</template>


<script>
	import { USER_PROFILE } from '@/api/user';
    import valid from '@/api/user';
    import NavBar from "@/vue/components/NavBar/";
    import AboutUs from "@/assets/images/user/user_index_aboutus.png";
	
	export default {
		data(){
			return {
                nickName: "",
                about_us: AboutUs
			}
		},
		
		vuelidation: {
			data: {
				nickName: {
					required: {
						msg(){
							return "请填写昵称"
						}
					}
				}
			}
		},
		
		created(){
			this.getNick();
		},
		
		methods: {
			getNick(){
				this.nickName = localStorage.getItem('nick_name') || '';
			},
			saveNick(){
				if(this.mixValid()){
					this.$reqPut(USER_PROFILE, {nick_name: this.nickName}).then(res => {
						localStorage.setItem('nick_name', res.data.data.nick_name);
						 return this.$dialog.alert({message: '保存成功'})
					}).then(() => {
						this.$router.go(-1);
					})
				}
            },
            backTo() {
                this.$router.back(-1)
            }
        },
        components: {
            [NavBar.name]: NavBar
        }
	}
</script>


<style lang="scss" scoped>
    .about_us {
        padding-top: 46px;
        padding-bottom: 0;
        img {
            width: 100%;
            height: auto;
        }
    }
	
</style>