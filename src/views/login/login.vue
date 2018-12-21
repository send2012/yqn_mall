<template>
    <div class="login">
        <login-header />
        <login-request
            :code="code" />
        <!-- <login-footer /> -->
    </div>
</template>

<script>
  import loginHeader from './login-header';
  import loginRequest from './login-request';
  import loginFooter from './login-footer';

  import { USER_LOGIN_WECHAT } from "@/api/user";

  export default {
    data() {
      return {
        code: ''
      }
    },

    created() {
      // 引用判断设备终端信息
      let name = this.$util.checkTheTerminal();

      // 引用判断源生函数是否存在
      let data = this.$util.checkPrimalFunc(name);

      let funcName = '';
      switch (funcName) {
        case 'IOS':
          this.$util.iosFunc({ funcName: 'loginAction' }, { 'userid': data.userid, 'password': data.password });
          break;

        case 'android':
          this.$util.androidFunc({ funcName: 'loginAction' }, {'userid': data.userid, 'password': data.password});
          break;

        default:
          break;
      }

        // toast测试
        //   this.$toast.loading({
        //       mask: true,
        //       duration: 0,
        //       position: 'middle'
        //   })
        // this.$toast.fail({
        //     position: 'middle',
        //     message: '看看字体xxxxxx',
        //     duration: 0
        // })

        // this.$toast({
        //     duration: 0,
        //     message: '看看字体xxxxxxxx'
        // })
    },

    methods: {
      loginAuto(code) {
        //微信自动登录
        let key = 'user_id',
            value = '';
        if(sessionStorage.getItem('groom')) {
            //获取推荐人
            let str = sessionStorage.getItem('groom');
            key = str.split('=')[0];
            value = str.split('=')[1];
        }
        this.$reqPost(USER_LOGIN_WECHAT, {
            code,
            key: value
            }).then(res => {
          if (res.data.authorization) {
            //允许自动登录
            localStorage.setItem('Authorization', res.data.authorization);
            // this.$util.setLocalStorage({
            //   Authorization: res.data.authorization
            // });
            const redirect = this.$route.query.redirect || 'home';
            //去掉连接中的?code=XXXXXXXX
            //清除推荐人
            if(sessionStorage.getItem('groom')) {
                sessionStorage.removeItem('groom');
            }
            window.location.href = window.location.origin + "/#/";
            // this.$router.replace({
            //     name: redirect,
            //     query: this.$route.query
            // })
          }
          else if (res.data.code) {
            //不允许自动登录，登录时传入该值
            this.code = res.data.code;
          }
        })
      }
    },

    components: {
      [loginHeader.name]: loginHeader,
      [loginRequest.name]: loginRequest,
      [loginFooter.name]: loginFooter,
    },

    beforeRouteEnter(to, from, next) {
      // ...
      let is_wechat = navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1;
      //获取推荐业务员，员工，门店id
        let href = window.location.href;
        if(href.indexOf('_id') !== -1) {
            //如果从推荐业务员，员工，门店而来
            sessionStorage.setItem('groom',href.split('?')[1]);
        }
        
      if (window.location.href.toLowerCase().indexOf('code') !== -1) {
        //获取链接上的code
        let location_arr = window.location.href.split('=');
        let code = location_arr[1];
        next(vm => {
          //微信自动登录
          if(from.name !== 'registered') {
              vm.loginAuto(code);
          }
        })

      }else {
        if (is_wechat && from.name !== 'user-information') {
          //获取url
          let location = window.location.href;
          //编码
          let encode_url = encodeURIComponent(location);
          //跳转验证
          window.location.href = "https://m.naifenpifa168.com/client/wx/get_code?backurl=" + encode_url;
        }else {
            next()
        }
        
      }
    }
}

</script>


<style lang="scss" scoped>
    .login {
        position: relative;
        background-color: #fff;
    }
</style>
