<template>
    <div class="user_header" :style="{backgroundImage: `url(${background_image})`}">
        <div class="user_header_compony">
            <span>{{index_info && index_info.company || '' }}</span>
            <van-icon name="yqn_setting" class="user_set" @click="toSetting" />
        </div>
        <div class="user_header_info">
            <div class="user_avatar">
                <img :src="index_info && index_info.logopic || avatar" @click="toLogin" alt="头像" width="55" height="55">
                <!-- <van-uploader :after-read="onRead" multiple class="user_avatar_uploader">
                    <van-icon name="photograph" />
                </van-uploader> -->
                <vue-core-image-upload
                    class="user_avatar_uploader"
                    text=""
                    :crop="false"
                    :maxWidth="200"
                    inputOfFile="file"
                    @imageuploaded="imageuploaded"
                    :credentials="false"
                    :data="data"
                    :headers="headers"
                    :url="url" >
                </vue-core-image-upload>
            </div>
            <div class="user_name">
                <span class="user_header_nick_name">
                    <span>{{index_info && index_info.truename || '' }}</span>
                    <img v-if="index_info && index_info.vip==1" src="../../assets/images/user/user_index_vip_1.png"  class="user_header_nick_name_vip"/>
                    <img v-if="index_info && index_info.vip==2" src="../../assets/images/user/user_index_vip_1.png"  class="user_header_nick_name_vip"/>
                    <img v-if="index_info && index_info.vip==3" src="../../assets/images/user/user_index_vip_1.png"  class="user_header_nick_name_vip"/>
                </span>
                <span class="user_header_msg" @click="toLevel">
                    <span class="user_header_msg_bg"></span>
                    <marquee  scrolldelay="100" scrollamount="5"  hspace="15" class="user_header_msg_text">
                         <span >{{index_info && index_info.vip_tag || ''}}  </span>
                    </marquee>
                    <span class="user_header_msg_icon"> > </span>
                </span>
            </div>
            <div class="user_btn">
                <span class="user_header_vip"></span>
                <span class="slot"></span>
                <span class="user_header_service" @click="callTheService">
                    <span class="user_header_service_slot"></span>
                    <span>专属客服</span>
                </span>
            </div>
        </div>

        
    </div>
</template>

<script>

import { Uploader } from 'vant';
import VueCoreImageUpload from 'vue-core-image-upload'

import { USER_PROFILE } from "@/api/user";
import { SYS_UPFILE }  from "@/api/system"
import avatar_default from "@/assets/images/user/user_index_avatar.png";
import bg_default from "@/assets/images/user/user_index_bg.png";


export default {
    name: "user-header",

    props: {
        isLogin: {
            type: Boolean,
            default: false
        },
        index_info: null
    },

    data() {
        let Authorization = localStorage.getItem('Authorization');
        let app = this.$util.checkTheTerminalHeader();
        let basic_url = this.getApi();
        return {
            nick_name: "昵称",
            avatar: avatar_default,
            background_image: bg_default,
            vip_img: '',
            headers: {
                Authorization,
                app
            },
            url: basic_url + '/sys/upfile',
            data: {
                act: 'logopic',
                path: 'logopic',
                back_size: 'small'
            }
        };
    },

    activated() {
        this.getUserInfo();
    },

    methods: {
        getUserInfo() {
            // const infoData = this.$util.getLocalStorage(
            //     "nick_name",
            //     "background_image",
            //     "avatar"
            // );
            // this.nick_name = infoData.nick_name || "昵称";
            // this.avatar = this.index_info && this.index_info.logopic || avatar_default;
            
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
                return 'https://api.yqnmy.com/shop'
            }
        },
        toSetting() {
            this.$router.push({ name: "user-information" });
        },
        toLogin() {
            // !this.isLogin &&
            //     this.$router.push({
            //         name: "login",
            //         query: { redirect: "user" }
            //     });
        },
        callTheService() {
            //呼叫客服弹出框
            this.$emit('showserver',11);
        },
        toLevel() {
            //跳转到会员成长值
            let str={vip:this.index_info.vip,score:this.index_info.score}
            this.$router.push({name: 'member-level',params:{level_point:JSON.stringify(str)}})
        },
        onRead(file){
            // 用户上传头像
            console.log(11111, file.file);
            this.$reqPost(SYS_UPFILE,file.file,{
                header: 'Content-Type: multipart/form-data'
            }).then((res)=>{
                this.$set(index_info,'logopic',res.data.url);
                console.log(res)
            })
        },
        imageuploaded(res) {
            //上传图片插件(压缩型)
            this.$set(this.index_info,'logopic',res.data.url);
        }
    },


    components: {
        [Uploader.name]: Uploader,
        'vue-core-image-upload': VueCoreImageUpload
    }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_var';
@import "../../assets/scss/mixin";

.user_header {
    position: relative;
    background-repeat: no-repeat;
    background-size: 100%;
    height: 7.04rem;
    box-sizing: border-box;
    text-align: center;
    color: #fff;
    marquee{
        margin-left: 5px !important;
    }
    &_compony {
        height: 2.24rem;
        line-height: 2.24rem;
        font-size: $main-title-size;
        font-weight: 500;
        position: relative;
        >span {
            display: inline-block;
            max-width: 5rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    &_info {
        position: relative;
        padding: 0 19px;
        height: 2.2rem;
        display: flex;
        align-items: center;
        .user_avatar {
            height: 2.2rem;
            overflow: hidden;
            position: relative;
            &_uploader {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }
        .user_name {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-left: .6rem;
            text-align: left;
            height: 100%;
            .user_header_nick_name {
                display: inline-block;
                font-size: $sub-title-size;
                line-height: 1rem;
                height: 1rem;
                position: relative;
                span {
                    display: inline-block;
                    max-width: 5rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                &_vip {
                    position: absolute;
                    top: 0;
                    right: 0;
                    // width: 2rem;
                    height: .9rem;
                }
            }
            .user_header_msg {
                display: inline-block;
                line-height: 1rem;
                // margin-top: .4rem;
                height: 1rem;
                width: 7.04rem;
                color: #fff;
                font-size: $extra-size;
                position: relative;
                &_bg {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    background:linear-gradient(90deg,rgba(252,175,118,1) 0%,rgba(254,155,110,1) 100%);
                    box-shadow:0px 0px 0px 0px rgba(145,6,62,0.35), 1px 1px 0px 0px rgba(133,2,42,0.35);
                    opacity:0.3;
                    border-radius:13px;
                }
                &_text {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: inline-block;
                    padding:0 10px 0 7px;
                    font-weight: 400;
                }
                &_icon{
                    position: absolute;
                    top: 0;
                    right: 3px;
                }
            }
        }
        .user_btn {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            margin-left: auto;
            .slot {
                display: inline-block;
                width: 1px;
                height: 40px;
            }
            .user_header_service {
                font-size: $extra-size;
                position: absolute;
                right: 0;
                width: 2.64rem;
                line-height: 23px;
                height: 23px;
                text-align: center;
                bottom: 0;
                z-index: 2000;
                &_slot {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg,rgba(252,175,118,1) 0%,rgba(254,155,110,1) 100%);
                    box-shadow: 0px 2px 20px 0px rgba(133, 2, 42, 0.35), 0px -1px 22px 0px rgba(145, 6, 62, 0.35);
                    opacity: 0.5;
                    border-radius: 13px 0 0 13px;
                    z-index: 1999;
                }
                span {
                    &:nth-child(2) {
                        position: absolute;
                        right: 0;
                        display: inline-block;
                        height: 100%;
                        padding: 1px .36rem;
                        z-index: 2000;
                        font-weight:400;
                    }
                }
            }
        }
    }
    &_show_service {
        width: 100%;
        height: 5.32rem;
        display: flex;
        flex-direction: column;
        span {
            @include one-border;
            flex: 1;
            color: $sub-title-color;
            display: inline-block;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: $sub-title-size;
            &:nth-child(3) {
                color: $explain-text-color;
            }
        }
    }
    // &_service_popup {
    //     left: 0;
    //     -webkit-transform:translateZ(3000px);
    //     -moz-transform:translateZ(3000px);
    //     -o-transform:translateZ(3000px);
    //     transform:translateZ(3000px);
    // }  
}
i.user_set {
    position: absolute;
    top: 25%;
    right: 10px;
    font-size: 24px;
}
.user_avatar {
    // margin-bottom: 10px;
    img {
        border: 0;
        border-radius: 50%;
    }
}
</style>
