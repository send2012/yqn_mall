<template>
	<div class="about_us">
        <nav-bar 
            title="关于我们"
            @back="backTo"/>
		<img :src="about_us" alt="">
        <van-button type="default" @click="checkUpGrade" v-show="show_up_grade">检测升级</van-button>
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
                about_us: AboutUs,
                show_up_grade: false            //检测升级按钮
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
            let device = this.$util.checkTheTerminal();
            if(device === 'IOS' || device === 'android') {
                this.show_up_grade = true;
            }
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
            checkUpGrade() {
                //检测升级
                let device = this.$util.checkTheTerminal();
                let flag = this.$util.checkPrimalFunc('checkUpgrade');
                if(flag) {
                    switch(device) {
                        case 'IOS': 
                            this.$util.iosFunc('checkUpgrade');
                            break;
                        case 'android':
                            this.$util.androidFunc('checkUpgrade');
                            break;
                        default:
                            break;
                    }
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