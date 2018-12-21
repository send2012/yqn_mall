import '@/assets/scss/iconfont/iconfont.css';
import { ROUTE_CHANGE } from '@/config.js';
import Vue from 'vue';
import App from './App.vue';
import VueCookies from 'vue-cookies';
import router from '@/vue/router/';
import Vuelidation from '@/vue/plugins/vuelidation';
import valid from '@/vue/mixin/valid';
import VueCountdown from '@/vue/plugins/vue-countdown';
import EventBus from '@/vue/event-bus/'
import Progress from 'vue-multiple-progress'
import Progress_Top from '@/vue/components/vue-progress/'
//import FastClick from 'fastclick';

//babel-polyfill
import 'babel-polyfill'
//import "core-js/es6/array";
//import "core-js/es6/object";
//import 'core-js/es6/promise';
//import 'core-js/es7/';

import {
	Waterfall,
	Lazyload,
	Toast,
	Tag,
	Dialog,
	Cell,
	CellGroup,
	Field,
	Icon,
	Button,
	Popup,
	loading,
	List
} from 'vant';

import axios from '@/vue/plugins/axios';
import util from '@/assets/js/util';
import filters from "@/vue/filter/";

// plugins
Vue.use(VueCountdown);
Vue.use(axios);
Vue.use(Vuelidation);
Vue.use(valid);
Vue.use(VueCookies);

// vue
Vue.use(filters);
Vue.use(util);
Vue.use(EventBus);

// vant
Vue.use(Waterfall);
Vue.use(Lazyload, {
	preLoad: 1.3,
	error: '../static/img/goods_default.png',
	loading: '../static/img/lazyLoad.gif',
	attempt: 1,
	listenEvents: ['scroll'],
	lazyComponent: true,
});

Vue.use(Tag);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Popup);
Vue.use(loading);
Vue.use(List);
Vue.use(Dialog);
Toast.setDefaultOptions({
    duration: 1500,
    position: 'bottom'
})




//FastClick.attach(document.body);

//progress
//Vue.component('vm-progress', Progress) # 可以指定组件名称
Vue.use(Progress) // 组件名称 `vm-progress`

//顶部进度条
Vue.use(Progress_Top)

// new 之前使用
Vue.prototype.$progress.start()  // 默认进度 80%

Vue.prototype.$progress.start(20) // 进度 20%

Vue.prototype.$progress.end() // 结束 100% ,然后消失

Vue.prototype.$progress.fail() // 进度停止，并显示红色

var ROUTER_ENTER_TIME = 0

// 页面加载效果
router.beforeEach((to, from, next) => {
    // document.title = to.meta.title || '附近优选'
    if (ROUTER_ENTER_TIME != 0) {
        // 避免 iOS 的 Safari 刷新页面出现两个进度条
        Vue.prototype.$progress.start(20)
    }
    ROUTER_ENTER_TIME ++;
    
    
    //判断是否为小程序
    let ver = false;
    wx.miniProgram.getEnv(function (res) {
        if(res.miniprogram) {
            ver = true;
        }
      })
    if(ver) {
        let arr = Object.keys(to.params);
        if(arr.length !== 0) {
            arr.map( item => {
                // console.log(to.params[item])
                //跳转出列表外的其他带参数页面
                wx.miniProgram.navigateTo({url: ROUTE_CHANGE[to.name]+to.params[item]})
            })
        }else if(to.name === 'list'){
            //跳转列表
            let itemPcid = to.query.itemPcid || '';
            let itemCid = to.query.itemCid || '';
            let itemBid = to.query.itemBid || '';
            let keyword = to.query.keyword || '';
            wx.miniProgram.navigateTo({url: ROUTE_CHANGE['list']+'?pcid='+itemPcid+'&cid='+itemCid+'&bid='+itemBid+'&keyword='+keyword})
        }else {
            //跳转其他
            wx.miniProgram.navigateTo({url: ROUTE_CHANGE[to.name]})
        }
    }else {
        //除了登录和注册，没有token的全部拦截
        if(!(to.name === 'login' || to.name === 'registered' || to.name === 'agreement')) {
            if(!localStorage.getItem('Authorization')) {
                location.href = "/#/login"
            }
            // if(!this.$util.getLocalStorage("Authorization")['Authorization']) {
            //     location.href = "/#/login";
            // }
        }
        next();
    }
    
})

router.afterEach((route) => {
    if (ROUTER_ENTER_TIME !== 1) {
        Vue.prototype.$progress.end()
    }
})


new Vue({
	el: '#app',
	router,
	render: h => h(App)
});
