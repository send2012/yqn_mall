<template>
    <div class="md_field" :class="{md_field_hasIcon: !!icon, md_field_isError: isError}">
        <label>{{label}}<span class="little_label">{{little_label}}</span></label>
        <span class="required" v-if="required">*</span>
        <van-icon v-if="icon" :name="icon" class="md_feld_icon" />
        <div class="md_field_control">
            <!-- 输入框 -->
            <input
                v-if="formType === 'input'"
                :type="type"
                v-on="listeners"
                v-bind="$attrs"
                :value="value"
                :placeholder="placeholder" />
            <!-- 下拉框 -->
            <input
                v-if="formType === 'select'"
                :type="type"
                v-on="listeners"
                v-bind="$attrs"
                :value="value"
                readonly
                :placeholder="placeholder"
                @click="()=>{show = !show}" />

            <van-popup
                v-model="show"
                position="bottom">
                <van-area :area-list="areaList" @confirm="selectEvent" @cancel="()=>{show = !show}" />
            </van-popup>

            <!-- 多选框 -->
            <van-checkbox-group v-model="result" class="checkGroup" @change="checkEvent"
                                v-if="formType === 'checkGroup'">
                <van-checkbox
                    v-for="(item, index) in list"
                    :key="item.id"
                    :name="item.id"
                    shape="square"
                    class="checkItem"
                >
                    {{ item.title }}
                </van-checkbox>
            </van-checkbox-group>

            <!-- 文本域 -->
            <textarea
                v-if="formType === 'textarea'"
                row="3"
                v-on="listeners"
                v-bind="$attrs"
                :value="value"
                :placeholder="placeholder"
                class="textarea" />

            <!-- 上传图片 -->
            <div class="uploadGroup" v-if="formType === 'uploadGroup'">
                <div class="uploadItem" v-for="(item, index) in uploadGroupText" :key="index">
                    <!--<van-uploader :after-read="onRead.bind(this,index)" class="upload">-->
                    <!--&lt;!&ndash; <van-icon name="add" /> &ndash;&gt;-->
                    <!--<span></span>-->
                    <!--<span></span>-->
                    <!--</van-uploader>-->

                    <section class="user_yqn_uploader">
                        <section class="user_yqn_uploader_image">
                            <img v-show="src[index]"
                                 :src="src[index]"
                                 class="user_yqn_uploader_image_img_yes"
                            />

                            <!-- <img v-else
                                 class="user_yqn_uploader_image_img_no"
                                 :src="src"
                            /> -->
                        </section>

                        <vue-core-image-upload
                            class="user_yqn_uploader_upload"
                            text=""
                            :crop="false"
                            :maxWidth="200"
                            inputOfFile="file"
                            @imageuploading="imageuploading"
                            @imageuploaded="imageuploaded"
                            :credentials="false"
                            :data="data"
                            :headers="headers"
                            :url="url"
                            @click.native="uploadImages(index)">
                        </vue-core-image-upload>

                        <!--<span v-if="src === ''" class="user_yqn_uploader_C"></span>-->

                        <span class="user_yqn_uploader_H" v-show="!src[index]"></span>

                        <span class="user_yqn_uploader_V" v-show="!src[index]"></span>

                        <span class="user_yqn_uploader_T">
                            {{ item }}
                        </span>
                    </section>
                </div>
            </div>
        </div>
        <div class="rightIcon">
            <slot name="rightIcon">
                <van-icon :name="rightIcon" @click="rightClick" v-show="value" />
            </slot>
        </div>

        <div v-if="sendMsg" class="send_msg">
            <slot name="sendMsg">
                <van-button :name="sendMsg" slot="button" size="small" type="warning" plain
                            class="sendMsg_btn"></van-button>
                <span class="send_msg_text" @click="countDown">{{sendMsg_text}}</span>
            </slot>
        </div>

        <div v-if="extra_text" class="extra_text">
            {{extra_text}}
        </div>
    </div>
</template>

<script>
    import area_list from '../../../../mock/area-list.js'
    import {Area, Checkbox, CheckboxGroup, Uploader} from 'vant';

    import VueCoreImageUpload from 'vue-core-image-upload';

    import {USER_PROFILE} from "@/api/user";
    import {SYS_UPFILE} from "@/api/system";
    // import avatar_default from "@/assets/images/user/user_index_avatar.png";
    // import bg_default from "@/assets/images/user/user_index_bg.png";

    export default {
        name: 'res-field',

        props: {
            required: {
                type: String,
                default: ''
            },
            label: String,
            value: {},
            type: {
                type: String,
                default: "text"
            },
            little_label: String,
            rightIcon: String,
            sendMsg: String,
            icon: String,
            isError: Boolean,
            placeholder: String,
            formType: {
                type: String,
                default: 'input'
            },
            mobile: {
                type: [String, Number],
                default: ''
            },
            //多选框选项
            list: Array,
            //上传文件组下面的文字
            uploadGroupText: Array,
            //额外文字
            extra_text: String,
        },

        data() {
            let Authorization = localStorage.getItem('Authorization');
            let basic_url = this.getApi();

            return {
                sendMsg_text: '获取验证码',
                disabled: false,           // 发送验证码按钮是否可用
                show: false,               // 省市区下拉框
                areaList: area_list || {}, // 省市区数据
                result: [],

                // 上传图片相关
                headers: {
                    Authorization,
                    app,
                },
                url: basic_url + '/sys/upfile',
                data: {
                    path: 'reg',
                    auth: 'no',
                    back_size: 'small'
                },
                src: ['', '', ''],
                current_num: 0,             // 当前默认选中的图片序列
                uploadFileStatus: false,
            }
        },

        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    input: this.onInput,
                };
            }
        },

        methods: {
            onInput(event) {
                this.$emit('input', event.target.value);
            },
            rightClick(name, event) {
                this.$emit('right-click', name);
            },
            countDown() {
                if (this.mobile) {
                    if (this.sendMsg_text === '获取验证码') {
                        // 调用发送验证码
                        this.$emit('mobileCode');
                        this.sendMsg_text = '59秒';
                        let num = 59;
                        let time = setInterval(() => {
                            num--;
                            this.sendMsg_text = num + '秒';
                            if (num === 0) {
                                clearInterval(time);
                                this.sendMsg_text = '获取验证码';
                                this.disabled = false;
                            }
                        }, 1000);
                    } else {
                        this.$toast("请勿频繁获取验证码");
                    }
                } else {
                    this.$emit('mobileCode');
                }
            },

            clearTimer() {
                //清除计时器
                clearInterval(this.timer);
                this.sendMsg_text = '获取验证码';
                this.disabled = false;
            },

            selectEvent(value) {
                this.$emit("selectEvent", value);
                this.show = !(this.show);
            },
            checkEvent(value) {
                this.$emit("checkEvent", value);
            },

            getApi() {
                let local_pro = window.location.href;
                if (local_pro.match(/newmobile.yqn.com/g)) {
                    //本地服务器
                    return '//api.yqn.com/shop';
                } else if (local_pro.match(/m.yqnmy.com/g)) {
                    //外网测试服务器
                    return '//api.yqnmy.com/shop'
                } else if (local_pro.match(/m.naifenpifa168.com/g)) {
                    return '//api.naifenpifa168.com/shop';
                } else {
                    // return 'http://lhl.service.heyzhima.com'
                    return '//api.yqn.com/shop';
                }
            },

            // 用户上传门店照片
            onRead(index, file) {
                console.log(file.file);
                this.$reqPost(SYS_UPFILE, file.file, {
                    header: 'Content-Type: multipart/form-data'
                }).then((res) => {
                    if (res.data.code === 200)
                        this.$set(index, 'reg', res.data.url);
                });
            },

            // 当图片上传过程中触发
            imageuploading() {
                this.$toast.loading({
                    mask: true,
                    duration: 0,
                    position: 'middle'
                });
            },

            // 上传图片插件(压缩型)
            imageuploaded(res) {
                // this.src.push(res.data.url);
                // 清除上传图片遮罩层
                this.$toast.clear();

                this.src.splice(this.current_num, 1, res.data.url);

                let imgObj = {
                    key: this.current_num,
                    url: res.data.url,
                };

                this.$emit('uploadImage', imgObj);
            },


            uploadImages(index) {
                this.current_num = index;
                // console.log(index);
            }
        },

        components: {
            [Area.name]: Area,
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
            [Uploader.name]: Uploader,
            'vue-core-image-upload': VueCoreImageUpload
        }
    }
</script>

<style lang="scss" scoped>
    .md_field {
        position: relative;
        border-bottom: 1px solid $border-color;
        border-radius: .2rem;
        padding: .4rem;
        display: table;
        width: 100%;
        box-sizing: border-box;
        background-color: #fff;

        .little_label {
            margin-left: .2rem;
            font-size: $extra-size;
        }

        span.required {
            color: $price-color;
            font-size: 150%;
        }

        > div {
            display: table-cell;
        }

        > .md_field_control {
            display: block;
            padding-right: .4rem;
            box-sizing: border-box;

            input {
                border: 0;
                line-height: 1.8rem;
                font-size: $params-title-size;
                width: 100%;
            }

            .checkGroup {
                margin-top: .4rem;
                display: flex;
                flex-wrap: wrap;

                .checkItem {
                    display: inline-block;
                    font-size: $extra-size;
                    width: 25%;
                    margin-bottom: .2rem;

                    @media screen and (max-width: 350px) {
                        width: 33.333%;
                    }
                }
            }

            .textarea {
                width: 100%;
                height: 2.4rem;
                resize: none;
                margin-top: .4rem !important;
                background: $background-color;
                font-size: $params-title-size;
                border: 0;
            }

            .uploadGroup {
                display: flex;
                justify-content: space-between;
                margin-top: .4rem;

                .uploadItem {
                    width: 25%;
                    height: 4rem;

                    .user_yqn_uploader {
                        position: relative;
                        height: 100%;
                        border: 0;

                        &_image {
                            position: absolute;
                            top: 0;
                            width: 3.3rem;
                            height: 3.3rem;
                            border: 1px dashed #ccc;


                            &_img_yes {
                                width: 100%;
                                height: 100%;
                            }


                            /*&_img {*/
                            /*width: 100%;*/
                            /*height: 100%;*/
                            /*border: 1px dashed #666;*/
                            /*!*display: none;*!*/
                            /*}*/
                        }

                        &_upload {
                            position: absolute;
                            left: 0;
                            right: 0;
                            width: 100%;
                            height: 80%;
                            /*border: 1px dashed #cecece;*/
                            z-index: 100;
                        }

                        /*&_C {*/
                        /*position: absolute;*/
                        /*top: .06rem;*/
                        /*left: .06rem;*/
                        /*width: 3.1rem;*/
                        /*height: 3.1rem;*/
                        /*border: 1px dashed #cecece;*/
                        /*border-radius: 100%;*/
                        /*}*/

                        &_H {
                            position: absolute;
                            left: 30%;
                            top: 41%;
                            width: 1.4rem;
                            height: 0;
                            /* border: 1px dashed rgba(0,0,0,.4); */
                            border: 1px dashed #cecece;
                            /* background-color: #000; */
                        }

                        &_V {
                            position: absolute;
                            left: 30%;
                            top: 40%;
                            width: 1.4rem;
                            height: 0;
                            /*border: 1px dashed rgba(0,0,0,.4);*/
                            border: 1px dashed #cecece;
                            transform: rotate(90deg);
                        }

                        &_T {
                            position: absolute;
                            left: .1rem;
                            bottom: -.3rem;
                            display: inline-block;
                            width: 100%;
                            text-align: center;
                            font-size: $extra-size;
                            color: $explain-text-color;
                        }
                    }

                    /*.upload {*/
                    /*width: 100%;*/
                    /*height: 80%;*/
                    /*border: 1px dashed #CECECE;*/
                    /*text-align: center;*/
                    /*position: relative;*/

                    /*i {*/
                    /*font-size: 40px;*/
                    /*line-height: 3.2rem;*/
                    /*}*/

                    /*span {*/
                    /*margin: 0;*/
                    /*position: absolute;*/
                    /*background: #C2C2C2;*/

                    /*&:nth-child(1) {*/
                    /*width: 50%;*/
                    /*height: 1px;*/
                    /*left: 25%;*/
                    /*top: 50%;*/
                    /*}*/

                    /*&:nth-child(2) {*/
                    /*top: 25%;*/
                    /*left: 50%;*/
                    /*width: 1px;*/
                    /*height: 50%;*/
                    /*}*/
                    /*}*/
                    /*}*/
                }
            }
        }

        .md_feld_icon {
            position: absolute;
            top: 50%;
            left: .4rem;
            transform: translate(0, -50%);
        }

        .rightIcon {
            position: absolute;
            bottom: .8rem;
            right: .8rem;
        }

        .send_msg {
            position: absolute;
            bottom: .8rem;
            right: .8rem;

            .sendMsg_btn {
                width: 3.8rem;
                border: 0;
                background: linear-gradient(-45deg, rgba(255, 51, 0, 1) 0%, rgba(255, 102, 0, 1) 100%);
                border-radius: .44rem;
            }

            &_text {
                display: inline-block;
                width: 3.8rem;
                height: 1rem;
                line-height: 1rem;
                text-align: center;
                position: absolute;
                top: 0;
                right: 0;
                color: #fff;
            }
        }

        .extra_text {
            display: block !important;
            line-height: .8rem;
            width: 100%;
            word-break: break-all;
            margin-top: .9rem;
            font-size: $tag-size;
            color: #b2b2b2;
        }

    }

    .md_field_hasIcon {
        padding-left: 1.6rem;
    }

    .md_field_isError {
        color: $red;
        background-color: #fcf5f5;
        border: 1px solid $red;

        input {
            color: $red;
            background-color: #fcf5f5;
        }

        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0 1000px #fcf5f5 inset !important;
        }
    }
</style>


<style lang="scss">
    //全局样式覆盖
    .md_field_control {
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
</style>

