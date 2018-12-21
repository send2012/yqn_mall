<template>
	<div class="user_information">
        <nav-bar 
            title="系统设置"
            @back="backTo"/>
    
		<van-cell-group>
			<van-cell title="个人资料" class="cell_middle" to="/user/information/setUserInfo" isLink>
				<!-- <van-uploader :afterRead="avatarAfterRead">
					<div class="user_avatar_upload">
						<img :src="avatar + '?x-oss-process=image/resize,m_fill,h_50,w_50'" alt="你的头像" v-if="avatar">
						<van-icon name="camera_full" v-else></van-icon>
					</div>
				</van-uploader> -->
			</van-cell>
			<van-cell title="收货地址" to="/user/address" isLink></van-cell>
			<!-- <van-cell title="昵称" to="/user/information/setNickname" :value="nick_name" isLink />
			<van-cell title="性别" :value="genderText" @click="showSex = true" isLink /> -->
			<van-cell title="修改密码" to="/user/information/setPassword" isLink />
			<!-- <van-cell title="手机号" to="/user/information/setMobile" :value="mobile" isLink></van-cell> -->
            <van-cell title="关于我们" to="/user/information/aboutUs" isLink />
		</van-cell-group>


        <div class="logout_area">
            <van-button type="default" class="logout" @click="logout">退出登录</van-button>
            <span class="logout_area_version" v-show="app_version">当前版本：{{app_version}}</span>
        </div>

       
		
		<!-- <van-popup v-model="showSex" position="bottom">
			<van-picker 
				showToolbar
				:columns="sexColumns"
				title="选择性别"
				@cancel="showSex = false"
				@confirm="onSexConfirm"/>
		</van-popup> -->



	</div>
</template>

<script>
    import { Uploader, Picker, Button } from 'vant';
	
    import { USER_LOGOUT } from '@/api/user'
    
    import NavBar from "@/vue/components/NavBar/";
	
	export default {
		
		data(){

			const browsertype=this.$util.checkTheTerminal()
			return {
				sexColumns: [{
					values: ["保密", "男", "女"],
					defaultIndex: 0
				}],
				browsertype,
				showSex: false,
				avatar: "",
				nick_name: "",
				gender: -1,
                mobile: "",
                app_version: ''             //app版本
			}
		},
		
		computed: {
			genderText(){
				const text = ["保密", "男", "女"];
				return text[this.gender] || '';
			}
		},
		
		created(){
            this.getUserInfo();
            let version = this.$util.checkTheTerminal();
            //判断APP版本从而显示版本号
            if(version === 'IOS') {
                window.showversion_callback = this.showversion_callback;
                let flag = this.$util.checkPrimalFunc('showversion');
                if(flag) {
                    this.$util.iosFunc('showversion');
                }
            }else if(version === 'android') {
                let flag = this.$util.checkPrimalFunc('showVersion');
                if(flag) {
                    this.app_version = this.$util.androidFunc('showVersion');
                }
            }
		}, 
		
		methods: {
            showversion_callback(ver) {
                //IOS判断版本号
                this.app_version = ver;
            },
			avatarAfterRead(file){
				console.log(file);
			},
			onSexConfirm(value, index){
				// this.$reqPut(USER_PROFILE, {
				// 	gender: index[0]
				// }).then(res => {
				// 	this.gender = res.data.data.gender;
				// 	this.showSex = false;
				// })
			},
			getUserInfo(){
				// this.$reqGet(USER_PROFILE).then(res => {
				// 	const data = res.data.data;
				// 	this.avatar = data.avatar;
				// 	this.nick_name = data.nick_name;
				// 	this.gender = data.gender;
				// 	this.mobile = data.mobile;
				// })
            },
            logout() {
                this.$dialog.confirm({
                    message: '确认退出登录？'
                }).then(()=>{
					//确认
					if(this.browsertype === 'android'){
						if(this.$util.checkPrimalFunc){
							this.$util.androidFunc('logoutAction')
						// 	this.$reqPost(USER_LOGOUT).then((res)=>{
						// 	setTimeout(()=>{
							
						// 	},1000)
						// })
							this.$toast('退出登录成功，请等候跳转。。。');
							this.$router.push({name: 'login'})
						}
					}else if(this.browsertype === 'IOS'){
						if(this.$util.checkPrimalFunc){
							this.$util.iosFunc('logoutAction')
						// 	this.$reqPost(USER_LOGOUT).then((res)=>{
						// 	this.$toast('退出登录成功，请等候跳转。。。');
						// 	setTimeout(()=>{
						// 		this.$router.push({name: 'login'})
						// 	},1000)
						// })
							this.$toast('退出登录成功，请等候跳转。。。');
							this.$router.push({name: 'login'})
						}
					}else{
						// this.$reqPost(USER_LOGOUT).then((res)=>{
						// 	this.$toast('退出登录成功，请等候跳转。。。');
						// 	setTimeout(()=>{
						// 		this.$router.push({name: 'login'})
						// 	},1000)
						// })
						this.$toast('退出登录成功，请等候跳转。。。');
						this.$router.push({name: 'login'})
					}

                    
                }).catch(()=>{
                    //取消

                })
                
            },
            backTo() {
                this.$router.back(-1)
            }
		},
		
		components: {
			[Uploader.name]: Uploader,
            [Picker.name]: Picker,
            [Button.name]: Button,
            [NavBar.name]:  NavBar
        },
        
        beforeRouteLeave (to, from, next) {
            // ...
            this.$destroy();
            next();
        }
	}
</script>


<style lang="scss" scoped>
	@import "../../../assets/scss/_var.scss";
	.user_information{
        padding-top: 46px;
		.user_avatar_upload{
			position: relative;
			width: 50px;
			height: 50px;
			border: 1px solid $border-color;
			img{
				max-width: 100%;
				max-height: 100%;
			}
			i{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 20px;
				color: $border-color;
			}
        }
        .logout_area {
            padding: 0 16px;
            margin-top: 50%; 
            .logout {
                width: 100%;
                height: 44px;
                border-radius: 5px;
                background: linear-gradient(to right ,#fe5d28 , #fe8246)!important;
                font-size: 14px;
                color: #fff;
            }
            &_version {
                display: inline-block;
                width: 100%;
                line-height: 1.44rem;
                text-align: center;
                color: $explain-text-color;
                font-size: $extra-size;
            }
        }
        
	}
</style>
<style lang="scss">
@import "../../../assets/scss/_var.scss";
.user_information {
    i.van-cell__right-icon {
        position: relative;
    }
}
</style>
