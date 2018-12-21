<template>
    <div class="registered">
        <nav-bar
            left_text=""
            right_text=""
            title="做母婴，就用一起牛！"
            @back="backTo" />
        <div class="registered_content">
            <img :src="reg_bg"
                 alt="背景图"
                 class="registered_content_img"
            />

            <div class="registered_content_imgs">
                <img v-for="(item,key) in images" :key="key" :src="item" alt="">
                <md-field-group class="field_group">
                    <span class="registered_title">注册一起牛</span>
                    <res-field
                        type="number"
                        label="手机号码"
                        onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )'
                        v-model="form.mobile"
                        right-icon="yqn_clearFull"
                        @right-click="clearText('mobile')"
                        required="required"
                        placeholder="请输入手机号码（该号码将作为您的登录手机号）"
                        :isError="!!$vuelidation.error('form.mobile')" />

                    <res-field
                        class="field_group_getCaptcha"
                        label="验证码"
                        v-model="form.mobile_code"
                        required="required"
                        placeholder="请输入手机验证码"
                        sendMsg="sendMsg"
                        :mobile="form.mobile"
                        @mobileCode="sendMobileCode"
                        ref="mobile_code"
                        :isError="!!$vuelidation.error('form.mobile_code')"
                    />

                    <res-field
                        type="password"
                        label="登录密码"
                        v-model="form.password"
                        right-icon="yqn_clearFull"
                        @right-click="clearText('password')"
                        required="required"
                        placeholder="请输入登录密码"
                        :isError="!!$vuelidation.error('form.password')"
                    />

                    <res-field
                        type="password"
                        label="重复密码"
                        v-model="form.repassword"
                        right-icon="yqn_clearFull"
                        @right-click="clearText('repassword')"
                        @change="checkThePassword"
                        required="required"
                        placeholder="请再次输入登录密码" />

                    <res-field
                        label="门店名称"
                        v-model="form.company"
                        right-icon="yqn_clearFull"
                        @right-click="clearText('company')"
                        required="required"
                        placeholder="请输入您的门店名称" />

                    <res-field
                        label="门店地址"
                        formType="select"
                        v-model="area"
                        required="required"
                        placeholder="请选择省市区"
                        @selectEvent="selectSSQ" />

                    <res-field
                        label="联系人"
                        v-model="form.truename"
                        right-icon="yqn_clearFull"
                        @right-click="clearText('truename')"
                        required="required"
                        placeholder="请输入联系人姓名"
                    />

                    <res-field
                        label="详细地址"
                        v-model="form.address"
                        right-icon="yqn_clearFull"
                        @right-click="clearText('address')"
                        required="required"
                        placeholder="请填写街道门牌号" />

                    <!-- <res-field
                        label="QQ号"
                        v-model="captcha"
                        right-icon="clear-full"
                        @right-click="clearText"
                        required="required"
                        placeholder="请填写您的QQ号" /> -->

                    <res-field
                        label="您希望从一起牛得到什么?"
                        little_label="(可多选)"
                        v-model="form.classid"
                        :list="checkList"
                        formType="checkGroup"
                        required="required"
                        @checkEvent="getFromYQN" />

                    <res-field
                        label="门店经营情况"
                        little_label="(必填)"
                        formType="textarea"
                        v-model="form.abstract"
                        required="required"
                        placeholder="请输入门店面积、月营业额等" />

                    <res-field
                        label="门店及证件照片"
                        little_label="(必选)"
                        formType="uploadGroup"
                        :uploadGroupText="uploadGroupText"
                        v-model="form.pics"
                        @uploadImage="imageuploaded"
                        required="required"
                        :extra_text="extra_text" />

                    <!-- <div class="clearfix">
                        <div class="float-l red">一起牛母婴账号登录</div>
                        <div class="float-r"><router-link to="/login/forget">忘记密码</router-link></div>
                    </div> -->

                    <van-checkbox v-model="checked" class="agree_service" shape="square">
                        我已阅读并同意
                        <span class="protocol">
                            <router-link to="/login/registered/agreement">
                                《法律协议》
                            </router-link>
                        </span>
                    </van-checkbox>
                </md-field-group>
            </div>
        </div>

        <div class="res_">
            <!--<van-button size="large" type="danger" :loading="isLogining" @click="loginSubmit" class="res_button">-->
            <!--注册完成 领取520元新人大礼包-->
            <!--</van-button>-->

            <van-button size="large" type="danger" :loading="isLogining" @click="registerSubmit" class="res_button">
                注册完成 领取520元新人大礼包
            </van-button>
        </div>
    </div>
</template>

<script>
    import {Tab, Tabs, Checkbox} from 'vant';
    import field from '@/vue/components/field/res_index.vue';
    import fieldGroup from '@/vue/components/field-group/';
    import md_kefu from '@/vue/components/md-kefu/';
    import NavBar from '@/vue/components/NavBar/';

    import REG_BG from '@/assets/images/reg_bg.png';
    import REG_1 from '@/assets/images/reg_1.png';
    import REG_2 from '@/assets/images/reg_2.png';
    import REG_3 from '@/assets/images/reg_3.png';
    import REG_4 from '@/assets/images/reg_4.png';

    import {CLASS_BRAND_LIST} from "@/api/product";
    import {USER_REG} from "@/api/user";

    // 引入正则验证
    // import regexp from '@/assets/js/regexp';
    import {phone, repassword} from "@/assets/js/regexp.js";

    // 导入发送手机验证码
    import {SYS_MOBILE_CODE} from "@/api/system";

    import {PROCLASS_BASELIST} from "@/api/system";

    // import {
    //     USER_LOGIN,
    //     USER_PROFILE
    // } from '@/api/user';

    export default {
        name: "registered",

        data() {
            return {
                reg_bg: REG_BG,
                images: [REG_1, REG_2, REG_3, REG_4],
                form: {                                            // 提交注册信息表单
                    mobile: "",                                    // 手机号码
                    mobile_code: "",                               // 验证码
                    password: "",                                  // 密码
                    repassword: "",                                // 重复密码
                    company: "",                                   // 门店名称
                    truename: "",                                  // 联系人
                    areacode: "",                                  // 门店地址 --> 区域编码
                    address: "",                                   // 门店详细地址
                    classid: [],                                   // 得到什么
                    abstract: "",                                  // 门店经营情况
                    pics: {
                        'shopw': '',                               // 门店正面照
                        'shopn': '',                               // 门店内部照
                        'yyzz': '',                                // 营业执照
                    },                                             // 门店证件
                },
                // account: "",
                // password: "",
                // captcha: "",
                area: "",                                           // 门店地址
                visiblePass: false,
                showKefu: false,
                isLogining: false,
                active: 2,
                checked: true,                                       // 默认同意协议
                checkList: [],                                       // 多选框选项
                uploadGroupText: ['门店正面照', '门店内部照', '营业执照'], // 上传图片底部文字
                extra_text: '*号为必传照片，请保证照片信息清晰显示，否则无法通过审核！一起牛承诺该照片仅为平台注册使用，不作其他用途，除审核员外，其他任何人均无法查看。'
            }
        },

        // 表单验证
        // mobile: this.form.mobile,
        // mobile_code: this.form.captcha,
        // password: this.form.password,
        // rePassword: this.form.rePassword,
        // company: this.form.storeName,
        // truename: this.form.contacts,
        // areacode: this.form.shopAdd,
        // address: this.form.detailAddress,
        // classid: this.form.getMore,
        // abstract: this.form.storeOperation,
        // pics: this.form.storePaperwork
        vuelidation: {
            data: {
                form: {
                    mobile: {
                        required: true,
                        phone,
                        msg() {
                            return '请输入手机号';
                        }
                    },

                    mobile_code: {
                        required: true,
                        // betweenLength: {
                        //     min: 5,
                        //     max: 7,
                        // },
                        msg() {
                            return '请输入验证码';
                        }
                    },

                    password: {
                        alpha: true,
                        required: true,
                        betweenLength: {
                            min: 6,
                            max: 12,
                        },
                        msg() {
                            return '请输入正确密码格式, 密码必须大于 6 位, 小于 12 位, 且只能包含数字和字母';
                        }
                    },

                    repassword: {
                        alpha: true,
                        required: true,
                        repassword,
                        betweenLength: {
                            min: 6,
                            max: 12,
                        },
                        msg() {
                            return '请输入正确密码格式, 密码必须大于 6 位, 小于 12 位, 且只能包含数字和字母';
                        },
                    },

                    company: {
                        required: true,
                        msg() {
                            return "请输入门店名称";
                        }
                    },

                    truename: {
                        required: true,
                        msg() {
                            return "请输入联系人";
                        }
                    },

                    address: {
                        required: true,
                        msg() {
                            return '请输入门店详细地址';
                        }
                    },

                    abstract: {
                        required: true,
                        msg() {
                            return '请输入门店经营情况';
                        }
                    },

                    pics: {
                        required: true,
                        msg() {
                            return '请上传门店证件照片';
                        }
                    },

                    // new_password: {
                    //   alpha: true,
                    //   required: true,
                    //   betweenLength: {
                    //     min: 6,
                    //     max: 12,
                    //   },
                    //   msg(){
                    //     return '请输入正确密码格式, 密码必须大于6位, 小于12位, 且只能包含数字和字母'
                    //   }
                    // },
                    // repeat_password: {
                    //   alpha: true,
                    //   required: true,
                    //   betweenLength: {
                    //     min: 6,
                    //     max: 12,
                    //   },
                    //   msg(){
                    //     return '请输入正确密码格式, 密码必须大于6位, 小于12位, 且只能包含数字和字母'
                    //   }
                    // }
                }
            },
        },

        created() {
            this.getPrimaryClassify();
        },

        methods: {
            // 注册选项输入清空
            clearText(name) {
                this.form[name] = "";
            },

            // 用户注册一级分类拉取
            getPrimaryClassify() {
                this.$reqGet(PROCLASS_BASELIST).then(
                    res => {
                        this.checkList.push(...res.data.list);
                    }
                )
            },

            checkThePassword() {
                if (this.form.password !== this.form.repassword) {
                    this.$toast('密码不一致');
                }
            },

            // 提交注册
            registerSubmit() {
                // let key = 'user_id',
                //     value = '';
                // if (sessionStorage.getItem('groom')) { // 获取推荐人
                //     let str = sessionStorage.getItem('groom');
                //     key = str.split('=')[0];
                //     value = str.split('=')[1];
                //     this.form[key] = value;
                // }

                let mobile = this.form.mobile,
                    mobile_code = this.form.mobile_code,
                    password = this.form.password,
                    repassword = this.form.repassword,
                    company = this.form.company,
                    classid = this.form.classid,
                    truename = this.form.truename,
                    areacode = this.form.areacode,
                    address = this.form.address,
                    pics = this.form.pics,
                    abstract = this.form.abstract;

                if (password !== repassword) {
                    this.$toast('密码不一致');
                } else if (mobile === '' || mobile_code === '' || password === '' || repassword === '' || company === '' || classid.length === 0 || truename === '' || areacode === '' || address === '' || pics.length === 0 || abstract === '') {
                    this.$toast('标星项均为必填项');

                    return false;
                } else if (this.checked === false) {
                    this.$toast('您必须同意法律协议');

                    return false;
                } else {
                    this.$reqPost(USER_REG, this.form).then(res => {
                        // console.log(res);

                        if (res.code !== 200)
                        {
                            return 0;
                        }
                        else
                        {
                            this.$router.push({name: "login"});
                        }

                        // if (res.code !== 200) {
                        //     this.$toast('友情提示, 输入有错误, 所有标星项目均为必填项');
                        //
                        //     return false;
                        // } else if (res.code === 200) {
                        //
                        // }

                        // if (this.form.mobile === '')
                        // {
                        //     alert('手机号码不能为空');
                        // }
                        // else if (this.form.captcha === '')
                        // {
                        //     console.log('验证码不能为空');
                        // }
                        // else if (this.form.storePaperwork === '')
                        // {
                        //     console.log('门店证件不能为空');
                        // }
                        // else
                        //     console.log('都不能为空');
                    });
                }
            },

            registeredSubmit() {
                const loginData = this.getLoginData();
                this.isLogining = true;
                this.$reqGet(USER_LOGIN).then(res => {
                    console.log(res);
                    localStorage.setItem('Authorization', res.data.data.access_token);
                    //   this.$util.setLocalStorage({
                    //     Authorization: res.data.data.access_token
                    //   });

                    return this.$reqGet(USER_PROFILE);
                }).then(res => {
                    this.isLogining = false;
                    const localData = this.getLocalData(res.data.data);
                    const redirect = this.$route.query.redirect || 'home';
                    localStorage.setItem('Authorization', localData);
                    //   this.$util.setLocalStorage(localData);
                    this.$router.replace({
                        name: redirect,
                        query: this.$route.query
                    });
                }).catch((err) => {
                    this.isLogining = false;
                });
            },
            getLoginData() {
                const password = this.password;
                const account = this.getUserType(this.account);
                const captcha = this.captcha;
                return {
                    [account]: this.account,
                    password,
                    captcha
                }
            },
            getUserType(account) {
                var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
                var mobileReg = /^1[0-9]{10}$/;
                var accountType = "";
                accountType = mobileReg.test(account) ? "mobile" :
                    emailReg.test(account) ? "email" :
                        "username";
                return accountType
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

            sendCode() {
                // 发送验证码
                this.$reqPost( SYS_MOBILE_CODE, { mobile: this.form.mobile, act: 'reg' } )
                    .then(res =>
                    {
                        if (res.code === 400)
                        {
                            // 手机号无效或不存在
                            this.$refs['mobile_code'].clearTimer();
                        }
                    }
                );
            },

            sendMobileCode() {
                // console.log(333);
                // 发送验证码
                if (this.form.mobile) {
                    this.sendCode();
                } else {
                    this.$toast('请输入手机号');
                }
            },
            selectSSQ(value) {
                //门店地址
                console.log(value)
                let address = [];
                value.map((item) => {
                    address.push(item.name);
                });
                this.area = address.join('，');
                this.form.areacode = value[value.length - 1].code;
                console.log(this.form.areacode);
            },
            getFromYQN(value) {
                this.form.classid = value;
            },

            // 注册发送门店证件图片信息
            imageuploaded(data) {
                switch (data.key) {
                    case 0:
                        this.form.pics['shopw'] = data.url;
                        break;
                    case 1:
                        this.form.pics['shopn'] = data.url;
                        break;
                    case 2:
                        this.form.pics['yyzz'] = data.url;
                        break;
                    default:
                        break
                }
            },

            backTo() {
                this.$router.back(-1);
            }
        },

        // 返回登录页面销毁组件
        beforeRouteLeave(to, from, next) {
            if (to.name === 'login')
            {
                this.$destroy();
            }

            next();
        },

        beforeRouteEnter(to, from, next) {
            // ...
            next(vm => {
                // 获取推荐业务员，员工，门店id
                let href = window.location.href;
                if (href.indexOf('_id') !== -1) {
//如果从推荐业务员，员工，门店而来
                    sessionStorage.setItem('groom', href.split('?')[1]);
                }

                // if (from.name === 'login') {
                //     vm.initViews();
                //     vm.resetInit();
                // }
            })
        },

        components: {
            [field.name]:
            field,
            [fieldGroup.name]:
            fieldGroup,
            [md_kefu.name]:
            md_kefu,
            [Tab.name]:
            Tab,
            [Tabs.name]:
            Tabs,
            [Checkbox.name]:
            Checkbox,
            [NavBar.name]:
            NavBar
        }
    }

</script>

<style lang="scss" scoped>
    @import "../../../assets/scss/mixin";

    .registered {
        padding-top: 1.84rem;
        padding-bottom: 0;

        &_content {
            width: 100%;
            position: relative;
            height: 113rem;
            background: linear-gradient(#d4351c, #ed513a);

            @media screen and (max-width: 349px) {
                height: 120.5rem;
            }

            @media screen and (min-width: 349px) and (max-width: 376px) {
                height: 115.5rem;
            }

            @media screen and (min-width: 376px) and (max-width: 700px) {
                height: 114rem;
            }

            &_img {
                display: block;
                width: 100%;
                height: auto;
            }

            &_imgs {
                position: absolute;
                top: 6rem;
                padding: 0 .6rem 0;
                /*background: linear-gradient(#D4351C, #ED513A);*/
                img {
                    display: block;
                    margin-top: .2rem;
                    width: 100%;
                    height: auto;

                    &:nth-child(1) {
                        margin-top: 0;
                    }
                }
            }

            .field_group {
                margin-top: .2rem;
                padding: 0;

                .md_field {
                    border-radius: 0;
                }
            }
        }

        &_title {
            display: inline-block;
            width: 99.9%;
            line-height: 2rem;
            font-size: $sub-title-size;
            color: $price-color;
            text-align: center;
            background: #fff;
            font-weight: bold;
        }

        .agree_service {
            width: 97%;
            font-size: $tag-size;
            padding-left: .4rem;
            padding-top: .4rem;
            padding-bottom: .4rem;
            /* padding: .4rem; */
            background-color: #fff;
            @media screen and (max-width: 350px) {
                display: flex;
            }

            .protocol {
                a {
                    color: $main-color;
                }
            }
        }

        .res_ {
            width: 100%;
            text-align: center;
            background-color: #fff;

            .res_button {
                height: 1.6rem;
                line-height: 1.6rem;
                margin: .6rem 0 1.48rem;
                width: 11.8rem;
                border-radius: .2rem;
            }
        }
    }
</style>

<style lang="scss">
    //全局样式覆盖
    .registered {
        &_content_imgs {
            .field_group {
                &_getCaptcha {
                    .send_msg {
                        right: 1.12rem !important;
                    }
                }
            }
        }

        .agree_service {
            .van-checkbox__icon {
                .van-icon {
                    width: auto;
                    height: auto;
                    line-height: normal;
                }
            }

            .van-checkbox__icon--checked {
                .van-icon {
                    color: #fff;
                    border-color: #ff6c19;
                    background-color: #ff6c19;
                }
            }
        }

        .van-button--danger {
            background: #f8462c;
            font-size: $main-title-size;
        }
    }

</style>



