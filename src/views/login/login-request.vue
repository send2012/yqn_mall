<template>
    <div class="login_request">
        <van-tabs v-model="active" class="login_tab">
            <van-tab title="手机快捷登录">
                <md-field-group>
                    <md-field
                        v-model="form.mobile"
                        type="number"
                        icon="yqn_login_user"
                        right-icon="yqn_clearFull"
                        @right-click="clearText('mobile')"
                        placeholder="请输入手机号"
                        :isError="!!$vuelidation.error('form.mobile')"
                    />

                    <md-field
                        v-model="form.mobile_code"
                        icon="yqn_login_pwd"
                        right-icon="yqn_clearFull"
                        @right-click="clearText('mobile_code')"
                        placeholder="请输入短信验证码"
                        sendMsg="sendMsg"
                        :mobile="form.mobile"
                        @mobileCode="sendMobileCode"
                        ref="mobile_code"
                        :isError="!!$vuelidation.error('form.mobile_code')"
                    />

                    <!-- <div class="clearfix">
                        <div class="float-l red">一起牛母婴账号登录</div>
                        <div class="float-r"><router-link to="/login/forget">忘记密码</router-link></div>
                    </div> -->


                </md-field-group>
            </van-tab>
            <van-tab title="账号密码登录">
                <md-field-group>
                    <md-field
                        v-model="form.username"
                        icon="yqn_login_user"
                        right-icon="yqn_clearFull"
                        @right-click="clearText('username')"
                        placeholder="请输入用户名/手机号"
                        :isError="!!$vuelidation.error('form.username')"
                    />

                    <md-field
                        v-model="form.password"
                        icon="yqn_login_pwd"
                        :type="visible_pass ? 'text' : 'password'"
                        :right-icon="visible_pass ? 'eye-open' : 'eye-close'"
                        @right-click="visible_pass = !visible_pass"
                        placeholder="请输入密码"
                        :isError="!!$vuelidation.error('form.password')"
                    />

                    <!-- <div class="clearfix">
                        <div class="float-l red">一起牛母婴账号登录</div>
                        <div class="float-r"><router-link to="/login/forget">忘记密码</router-link></div>
                    </div> -->


                </md-field-group>
            </van-tab>
        </van-tabs>


        <div class="login_btn_group clearfix">
            <van-button size="large" type="danger" :loading="is_logining" @click="loginSubmit">立即登录</van-button>

            <div class="login_register_text">
                <span></span>
                <span>
					<router-link to="/login/registered">立即注册</router-link>
				</span>
                <span></span>
            </div>
            <a href="tel: 400-801-5562">
                <van-button size="large" type="danger" class="login_register">
                    400热线电话
                </van-button>
            </a>

            <!-- <div class="forget_password">忘记密码？请联系<span class="forget_password_tel">15713717960</span></div> -->
        </div>


        <van-dialog
            v-model="show_dialog"
            show-cancel-button
            :before-close="beforeClose"
        >
            <div class="login_dialog">
                是否绑定微信登陆
            </div>

        </van-dialog>


        <!-- <div class="register clearfix">
            <div class="float-l connect">
                <span @click="show_kefu = true">联系客服</span>
            </div>
            <div class="float-r"><router-link to="/login/registerGetCode">免费注册</router-link></div>
        </div>

        <van-popup v-model="show_kefu">
            <md-kefu mobile="16454193338" />
        </van-popup> -->
    </div>
</template>

<script>
    import {Tab, Tabs} from 'vant';
    import field from '@/vue/components/field/';
    import fieldGroup from '@/vue/components/field-group/';
    import md_kefu from '@/vue/components/md-kefu/';

    import { phone } from "@/assets/js/regexp.js";

    // import {
    // 	USER_LOGIN,
    // 	USER_PROFILE
    // } from '@/api/user';

    import {USER_LOGIN, USER_BIND_EDIT} from '@/api/user'
    import { SYS_MOBILE_CODE } from '@/api/system'

    export default {
        name: "login-request",

        props: {
            code: {
                type: String,
                default: ''
            }
        },

        data() {
            // alert(this.code)
            return {
                // username: "",
                // password: "",
                // mobile: "",
                // mobile_code: "",
                visible_pass: false,
                show_kefu: false,
                is_logining: false,
                active: 0,
                show_dialog: false,
                form: {
                    mobile: '',
                    mobile_code: '',
                    username: '',
                    password: '',
                },
            }
        },

        // 表单验证
        vuelidation: {
            data: {
                form: {
                    mobile: {
                        required: true,
                        phone,
                        msg() {
                            return '请输入手机号码';
                        }
                    },

                    mobile_code: {
                        required: true,
                        betweenLength: {
                            min: 3,
                            max: 7
                        },
                        msg() {
                            return '请输入验证码';
                        }
                    },

                    username: {
                        required: true,
                        msg() {
                            return '请输入用户名';
                        }
                    },

                    password: {
                        required: true,
                        msg() {
                            return '请输入密码';
                        }
                    }
                },
            }
        },

        created() {

        },

        mounted() {
            //赋予源生调用的window方法
            window.registerAction = this.registerAction;
            //调用源生
            this.appAutoLogin();
        },

        methods: {
            loginInterface(loginData) {
                //登录
                //获取推荐人
                let key = 'user_id',
                    value = '';
                if(sessionStorage.getItem('groom')) {
                    //获取推荐人
                    let str = sessionStorage.getItem('groom');
                    key = str.split('=')[0];
                    value = str.split('=')[1];
                    loginData[key] = value;
                }
                this.$reqPost(USER_LOGIN, loginData).then((res) => {
                    console.log(res);

                    this.is_logining = false;

                    // this.$util.setLocalStorage({
                    // 	Authorization: res.data.authorization
                    // });

                    const redirect = this.$route.query.redirect || 'home';

                    if (res.code !== 400) {
                        localStorage.setItem('Authorization', res.data.authorization)
                        if (res.data.setopenid === 0) {
                            //不需要重新获取code
                            let _this = this;
                            if (res.data.bindopenid === 0) {
                                //提示绑定微信
                                this.show_dialog = !this.show_dialog;
                                // this.$dialog.confirm({
                                //     message: '是否绑定微信登陆'
                                // }).then(() => {
                                //     //是
                                //     _this.bindWechat()
                                // }).catch(() => {
                                //     //否
                                //     window.location.href = window.location.origin + "/#/";
                                // });
                            } else if (res.data.bindopenid === 1) {
                                //不提示绑定微信
                                //清除推荐人
                                if(sessionStorage.getItem('groom')) {
                                    sessionStorage.removeItem('groom');
                                }
                                window.location.href = window.location.origin + "/#/";
                            }
                        } else if (res.data.setopenid === 1) {
                            //需要重新获取code
                            //获取url
                            // let location = window.location.origin + "/#/?after";
                            //编码
                            // let encode_url = encodeURIComponent(location);
                            //清除推荐人
                            if(sessionStorage.getItem('groom')) {
                                sessionStorage.removeItem('groom');
                            }
                            //跳转验证
                            // window.location.href = "https://m.naifenpifa168.com/client/wx/get_code?backurl=" + encode_url;
                        }

                        if (navigator.userAgent.toLowerCase().indexOf('micromessenger') === -1) {
                            //开始源生调用方法
                            //如果是用户名登录
                            if (loginData.username) {
                                //window记录用户名及密码
                                // window.yqn_login = JSON.stringify(loginData);
                                let device = this.$util.checkTheTerminal();
                                if (device === 'IOS' || device === 'android') {
                                    //如果在APP中
                                    let flag = this.$util.checkPrimalFunc('loginAction');
                                    if (flag) {
                                        //函数若存在
                                        switch (device) {
                                            case 'IOS':
                                                this.$util.iosFunc('loginAction', loginData);
                                                break;

                                            case 'android':
                                                this.$util.androidFunc('loginAction', loginData);
                                                break;

                                            default:
                                                break;
                                        }
                                    }
                                }
                            }

                            //清除推荐人
                            if(sessionStorage.getItem('groom')) {
                                sessionStorage.removeItem('groom');
                            }

                            this.$router.replace({
                                name: redirect,
                                query: this.$route.query
                            })
                        }
                    }
                });
            },
            appAutoLogin() {
                let device = this.$util.checkTheTerminal();
                if (device === 'IOS' || device === 'android') {
                    //如果在APP中
                    let flag = this.$util.checkPrimalFunc('autoLoginAction');
                    if (flag) {
                        //函数若存在
                        switch (device) {
                            case 'IOS':
                                this.$util.iosFunc('autoLoginAction');
                                break;
                            case 'android':
                                this.$util.androidFunc('autoLoginAction');
                                break;
                            default:
                                break;
                        }
                    }
                }
            },
            registerAction(data) {
                //源生调用自动登录
                if (typeof data == 'string') {
                    data = JSON.parse(data);
                }
                console.info(data.userid);
                console.info(data.password);
                let login_data = {};
                login_data['username'] = data.userid;
                login_data['password'] = data.password;
                this.loginInterface(login_data);
                // window.registerAction = null;
            },
            bindWechat() {
                //用户绑定微信账号
                this.$reqPost(USER_BIND_EDIT).then(res => {
                    //清除推荐人
                    if(sessionStorage.getItem('groom')) {
                        sessionStorage.removeItem('groom');
                    }
                    const redirect = this.$route.query.redirect || 'home';
                    window.location.href = window.location.origin + "/#/";``
                })
            },
            sendCode() {
                //发送验证码
                this.$reqPost(SYS_MOBILE_CODE, { mobile: this.form.mobile, act: 'login' })
                    .then(res => {
                        // console.log(111);
                        if (res.code === 400) {
                            //手机号无效或不存在
                            this.$refs['mobile_code'].clearTimer();
                        }
                    }
                );
            },
            // 清空输入
            clearText(name) {
                // this[name] = "";
                this.form[name] = "";
            },
            beforeClose(action, done) {
                //是否绑定微信的回调
                if (action === 'confirm') {
                    this.bindWechat();
                    done();
                } else {
                    done();
                    //清除推荐人
                    if(sessionStorage.getItem('groom')) {
                        sessionStorage.removeItem('groom');
                    }
                    window.location.href = window.location.origin + "/#/";
                }
            },
            loginSubmit() {
                // 快捷登录
                if (this.active === 0)
                {
                    if (this.form.mobile === '') {
                        this.$toast('手机号不能为空');
                    } else if (this.form.mobile_code === '') {
                        this.$toast('验证码不能为空');
                    } else {
                        const loginData = this.getLoginData();
                        this.is_logining = true;

                        this.loginInterface(loginData);
                    }
                }
                // 账号登录
                else if (this.active === 1)
                {
                    if (this.form.username === '') {
                        this.$toast('用户名不能为空');
                    } else if (this.form.password === '') {
                        this.$toast('密码不能为空');
                    } else {
                        const loginData = this.getLoginData();
                        this.is_logining = true;

                        this.loginInterface(loginData);
                    }
                }

                // const loginData = this.getLoginData();
                // this.is_logining = true;
                //
                // this.loginInterface(loginData);

                // setTimeout(()=>{
                //     this.is_logining = false;
                // },5000)
                // this.$reqGet(USER_LOGIN).then(res => {
                // 	console.log(res);
                // 	this.$util.setLocalStorage({
                // 		Authorization: res.data.data.access_token
                // 	});

                // 	return this.$reqGet(USER_PROFILE);
                // }).then(res => {
                // 	this.is_logining = false;
                // 	const localData = this.getLocalData(res.data.data);
                // 	const redirect = this.$route.query.redirect || 'home';
                // 	this.$util.setLocalStorage(localData);
                // 	this.$router.replace({
                // 		name: redirect,
                // 		query: this.$route.query
                // 	})
                // }).catch((err) => {
                // 	this.is_logining = false;
                // })
            },
            getLoginData() {
                // 组装登录信息
                // const username = this.getUserType(this.username);
                const { username, password, mobile, mobile_code } = this.form;
                const { code, active } = this;

                if (active === 0) {
                    // 手机号码验证
                    return {
                        // typeid: 1,
                        mobile,
                        mobile_code,
                        code
                    }
                } else {
                    // 账号密码验证
                    return {
                        // typeid: 0,
                        username,
                        password,
                        code
                    }
                }
                // return {
                // 	[username]: this.username,
                // 	password,
                // 	mobile_code
                // }
            },
            getUserType: function (username) {
                //正则区别出邮箱还是手机号
                var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
                var mobileReg = /^1[0-9]{10}$/;
                var usernameType = "";
                usernameType = mobileReg.test(username) ? "mobile" :
                    emailReg.test(username) ? "email" :
                        "username";
                return usernameType
            },
            getLocalData(data) {
                if (!data) return {};
                return {
                    avatar: data.avatar,
                    user_id: data.user_id,
                    background_image: data.background_image,
                    nick_name: data.nick_name
                }
            },
            sendMobileCode() {
                //发送验证码
                if (this.form.mobile) {
                    this.sendCode();
                } else {
                    this.$toast('请输入手机号')
                }

            }
        },

        components: {
            [field.name]: field,
            [fieldGroup.name]: fieldGroup,
            [md_kefu.name]: md_kefu,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs
        }
    }

</script>

<style lang="scss" scoped>
    @import "../../assets/scss/mixin";

    .login_request {
        .login_dialog {
            padding: 25px 0;
            text-align: center;
        }
    }

    .login_btn_group {
        margin-top: 1rem;
        padding: 0 15px;

        .login_register_text {
            display: flex;
            justify-content: space-around;
            height: 1.6rem;
            margin-top: 10px;

            span {
                &:nth-child(1), &:nth-child(3) {
                    border-top: 1px solid #fda969;
                    height: 0;
                    width: 35%;
                    margin-top: .8rem;
                }

                &:nth-child(2) {
                    line-height: 1.6rem;

                    a {
                        color: $main-color;
                    }
                }
            }
        }

        .forget_password {
            width: 100%;
            text-align: center;
            margin-top: 10px;
            color: #fda969;
            font-size: 12px;

            .forget_password_tel {
                text-decoration: underline;
            }
        }

    }

    .register {
        padding-top: 40px;
        color: $font-color-gray;

        a {
            color: $font-color-gray;
        }

        > div {
            width: 50%;
            box-sizing: border-box;
            padding: 0 20px;
        }

        .connect {
            @include one-border(right);
            text-align: right;
        }
    }

</style>

<style lang="scss">
    //覆盖全局样式
    .login_request {
        .van-dialog {
            position: absolute;
        }
    }

    .login_tab {
        .van-tabs__wrap {
            left: 15px;
            right: 15px;

            &::after {
                border-top: 0;
            }
        }

        .van-tabs__line {
            background-color: $main-color;
        }

        .van-tab--active {
            font-size: $main-title-size !important;
        }
    }

    .login_register {
        margin-top: 30px;
        background: #fda969;
        border: 0;

        a {
            color: #fff;
        }

    }
</style>

