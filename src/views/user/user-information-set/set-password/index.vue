<template>
    <div class="user_password_edit">
        <nav-bar
            title="密码修改"
            @back="backTo"/>
        <van-cell-group>
            <van-field
                label="旧密码"
                v-model="password"
                type="password"
                placeholder="请输入旧密码"
                :error="!!$vuelidation.error('password')"/>

            <van-field
                label="新密码"
                v-model="new_password"
                type="password"
                placeholder="请输入新密码"
                :error="!!$vuelidation.error('new_password')"/>

            <van-field
                label="确认密码"
                v-model="repeat_password"
                type="password"
                placeholder="请再次输入密码"
                :error="!!$vuelidation.error('repeat_password')"/>
        </van-cell-group>

        <div class="bottom_btn">
            <van-button type="danger" @click="modifypassword" class="user_password_edit_btn">修改密码</van-button>
        </div>
    </div>
</template>


<script>
    import {USER_PSWD_EDIT} from '@/api/user';
    import NavBar from "@/vue/components/NavBar/"

    export default {
        data: () => ({
            password: "",
            new_password: "",
            repeat_password: ""
        }),

        vuelidation: {
            data: {
                password: {
                    required: true,
                    msg() {
                        return "请输入密码"
                    }
                },
                new_password: {
                    alpha: true,
                    required: true,
                    betweenLength: {
                        min: 6,
                        max: 12,
                    },
                    msg() {
                        return '请输入正确密码格式, 密码必须大于6位, 小于12位, 且只能包含数字和字母'
                    }
                },
                repeat_password: {
                    alpha: true,
                    required: true,
                    betweenLength: {
                        min: 6,
                        max: 12,
                    },
                    msg() {
                        return '请输入正确密码格式, 密码必须大于6位, 小于12位, 且只能包含数字和字母'
                    }
                }
            },
        },

        methods: {
            modifypassword() {
                if (this.mixValid() && this.passwordValid()) {
                    this.$reqPost(USER_PSWD_EDIT, {
                        oldpwd: this.password,
                        newpwd: this.new_password,
                        repwd: this.repeat_password
                    }).then(res => {
                        //  return this.$dialog.alert({message: '保存成功, 请重新登录.'})
                        this.$toast('密码修改成功');
                        // localStorage.setItem('Authorization', res.data.authorization)
                        // this.$util.setLocalStorage({
                        //     Authorization: res.data.authorization
                        // });
                        setTimeout(() => {
                            this.$router.back(-1)
                        }, 1500);
                    })
                    // .then(() => {
                    // 	return this.$reqGet(USER_LOGOUT)
                    // }).then(()=>{
                    // 	this.$util.removeLocalStorage('Authorization', 'user_id', 'avatar', 'background_image', 'nick_name');
                    // 	this.$router.replace({name: "login"});
                    // })
                }
            },
            passwordValid() {
                if (this.new_password != this.repeat_password) {
                    this.$toast("密码不一致, 请再次确认密码");
                    return false;
                }
                return true;
            },
            backTo() {
                this.$router.back(-1)
            }
        },
        components: {
            [NavBar.name]: NavBar
        },
        beforeRouteLeave(to, from, next) {
            //因为将所有的组件进行了缓存，所以退出的时候要将其组件销毁
            this.$destroy();
            // ...
            next();
        }
    }

</script>

<style lang="scss" scoped>
    .user_password_edit {
        padding-top: 46px;

        .bottom_btn {
            width: 100%;
            padding-top: 1.6rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        &_btn {
            width: 13.76rem;
            background: linear-gradient(to right, #fe5d28, #fe8246) !important;
        }
    }

</style>
