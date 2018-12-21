<template>
	<div id="app">
        
        
		<!-- <router-view name="navBar"></router-view> -->

		<!-- 
			<keep-alive>
				<router-view class="view-router"  v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
			<router-view class="view-router" v-if="!$route.meta.keepAlive"></router-view>
		-->

		<!-- 此处会创建4个路由 -->
		<!-- <transition :name="transitionName">
			<keep-alive>
				<router-view class="view-router"></router-view>
			</keep-alive>
		</transition>
		<transition :name="transitionName">
			<router-view class="view-router"></router-view>
		</transition> -->

		<!-- 全缓存并分别在组件内进行销毁 -->
		<transition :name="transitionName">
			<keep-alive>
				<router-view class="view-router"></router-view>
			</keep-alive>
		</transition>
		<!-- <router-view name="tabbar"></router-view> -->
		<transition name="slide-fade">
			<yqn-tabbar 
                v-show="hadTabbar" />
		</transition>

        <van-dialog
            v-model="show_ads"
            :show-confirm-button="false"
            :close-on-click-overlay="true"
            class="app_popup"
            >
            <div v-if="ads_src" class="popup_window">
                <img :src="ads_src" alt="每日弹窗" @click="clickAds" />
                <van-icon name="yqn_clearFull" @click="closeWindow"></van-icon>
            </div>
           
        </van-dialog>

	</div>
</template>

<script>
    import Tabbar from '@/vue/components/Tabbar/';
    import { USER_OPENID_SET } from '@/api/user';
    import { SYS_ADV_GET } from '@/api/system';

    export default {
        name: 'app',
        data(){
            return {
				transitionName:'',			//路由左右滑动
				transitionDownName: 'slide-down',		//底部Tabber消失出现
                hadTabbar: true,			//是否有底部Tabbar
                show_ads: false,             //展示每日弹窗
                ads_src: null,               //弹窗的图片地址
                ads_link_url: ''                //弹窗的链接地址
                // router_name: ''         //传递路由名字
            }
        },
        create(){

            
        },
        mounted(){

        },
        methods: {
            resetRedisOpenID(code) {
                //用户点击登录按钮后，setopenid为1
                this.$reqPost(USER_OPENID_SET,{code}).then(res => {
                    return true
                })
            },
            getAds() {
                //获取弹窗广告
                let date = localStorage.getItem('day');
                if(!date) {
                    let tamp = new Date();
                    let now_day = tamp.getDate();
                    //如果不存在
                    this.$reqGet(SYS_ADV_GET,{},{
                        hideLoading: true
                    }).then(res => {
                        localStorage.setItem('day',now_day);
                        if(!(res.data.adv instanceof Array)) {
                            const { picpath, linkurl } = res.data.adv;
                            this.ads_src = picpath;
                            this.ads_link_url = linkurl;
                            this.show_ads = true;
                        }
                        
                    })
                }else {
                    //存在,则获取当前时间
                    let tamp = new Date();
                    let now_day = tamp.getDate();
                    let pre_day = localStorage.getItem('day');
                    if(now_day != pre_day) {
                        //当前保存的天数和之前的不一样
                        this.$reqGet(SYS_ADV_GET,{},{
                            hideLoading: true
                        }).then(res => {
                            localStorage.setItem('day',now_day);
                            if(!(res.data.adv instanceof Array)) {
                                const { picpath, linkurl } = res.data.adv;
                                this.ads_src = picpath;
                                this.ads_link_url = linkurl;
                                this.show_ads = true;
                            }
                        })
                    }
                }
            },
            clickAds() {
                //点击广告
                this.show_ads = false;
                this.$router.push({path: this.ads_link_url})
            },
            closeWindow() {
                //关闭每日弹窗
                this.show_ads = false;
            }
        },
        watch: {
			//使用watch 监听$router的变化
            $route(to, from) {
				console.log(to)
                console.log(from)
                //默认不禁用路由跳转动画
                let ban_transition = false;

                //获取弹窗广告
                if(localStorage.getItem('Authorization')) {
                    this.getAds();
                }
                

                //通过是否为IOS以及微信来禁用动画
                if(!!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    //是IOS设备
                    let device = this.$util.checkTheTerminal();
                    if(device !== 'WeChat') {
                        //且不是微信则禁用动画
                        ban_transition = true;
                    }
                }


                // //调用源生方法,记住登录名和密码
                // if(to.name !== 'registered' && from.name === 'login') {
                //     //从登陆而来，也不是去往注册
                //     let loginData = JSON.parse(window.yqn_login);
                //     setTimeout(()=>{
                //         let device = this.$util.checkTheTerminal();
                //         if (device === 'IOS' || device === 'android') {
                //             //如果在APP中
                //             let flag = this.$util.checkPrimalFunc('loginAction');
                //             if (flag) {
                //                 //函数若存在
                //                 switch (device) {
                //                     case 'IOS':
                //                         alert(loginData)
                //                         this.$util.iosFunc('loginAction', loginData);
                //                         break;
                //                     case 'android':
                //                         this.$util.androidFunc('loginAction', loginData);
                //                         break;
                //                     default:
                //                         break;
                //                 }
                //             }
                //         }
                //     },1000)
                    
                // }

                
                // this.router_name = to.name;

                //登陆后重新获取code进行传递
                if(to.query['after?code']) {
                    this.resetRedisOpenID(to.query['after?code']);
                }

                //如果to的索引值为0，不添加任何动画；如果to索引大于from索引,判断为前进状态,反之则为后退状态
                if(to.meta && to.meta.level > 0){
					//没有指向根目录
                    if( to.meta.level < from.meta.level){
						//返回上级路由
						console.log('back');
						this.transitionName = ban_transition?'':'slide-right';
                    }else{
						//进入下级路由
						console.log('next');
						this.transitionName = ban_transition?'':'slide-left';
						this.hadTabbar = false;
					}
                }else if(to.meta && to.meta.level == 0 && from.meta.level > 0){
					//回到根目录 ‘/’
					console.log('back to /');
					this.transitionName = ban_transition?'':'slide-right';
					this.hadTabbar = true;
                }else if(to.meta && to.meta.level == 0 && from.meta.level == 0) {
					//TAb间的切换
					console.log('tab change')
                    this.transitionName = '';
                    this.hadTabbar = true;
				}

				//跳转到登录页面时不显示标题栏
				if(to.name === 'login') {
					this.hadTabbar = false;
                }
                
                //暂时先通过登录进入页面出现tabbar
                // if(from.name === 'login') {
				// 	this.hadTabbar = true;
                // }

                //当然，如果你没有需要设置索引值为0的页面可以直接用着一段
                /*if( to.meta.index < from.meta.index){
                      this.transitionName = 'slide-right';
                }else{
                      this.transitionName = 'slide-left';
				}*/
				

            }
        },
        
		components: {
			[Tabbar.name]: Tabbar
        }
		
		
    }
</script>

<style lang="scss" scoped>
.popup_window {
    position: relative;
    padding-bottom: 3rem;
    img {
        display: block;
        width: 100%;
        height: auto;
    }
    i {
        position: absolute;
        z-index: 3000;
        bottom: 1rem;
        font-size: .8rem; 
        left: 45%;
        color: #fff;
    }
}
</style>
<style lang="scss">
.app_popup {
    background: transparent;
}
</style>


<style lang="scss" src="./assets/scss/global.scss" />
