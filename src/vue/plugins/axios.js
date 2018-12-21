import axios from 'axios';
import qs from 'Qs';
import { Dialog, Toast } from 'vant';

let ver = 2;
let checkTinySys = function() {
    wx.miniProgram.getEnv(function (res) {
        if(res.miniprogram) {
            // 小程序的webview
            ver = '9'
        }else {
            ver = '2'
        }
    })
}

let checkTheTerminal = function() {
    let version = window.navigator.userAgent;
    if(version.toLowerCase().indexOf('micromessenger') !== -1) {
        //微信内核
        checkTinySys();
        return ver

    }else if(version.indexOf("yiqiniuios") > -1) {
        //IOS终端
        return '1';
    }else if(version.indexOf("YIQINIU ANDROID") > -1 || version.indexOf("yiqiniuandroid") > -1) {
        //Android终端
        return '0'
    }else {
        return '9'
    }
}
 

const API_ROOT = () => {
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
        // return '//api.yqn.com/shop'
        return 'https://api.yqnmy.com/shop'
    }
}



let instance = axios.create({
	timeout: 5000,
	// baseURL: process.env.NODE_ENV === "development" ? '/api' : ""
    // baseURL: 'http://api.yqn.cc/shop'
    baseURL: API_ROOT()
});

instance.interceptors.request.use( (config) => {
	!config.hideLoading && Toast.loading({mask: true, duration: 0, position: 'middle'});
	if (config.method === 'post' || config.method === 'put') {
		config.data = qs.stringify(config.data);
    }
    if (config.headers['Content-Type']) {
        onfig.headers['Content-Type'] = 'multipart/form-data';
    }
	if (!config.headers.Authorization) {
		config.headers.Authorization = window.localStorage.getItem('Authorization') || '';
    }
    if (!config.headers.app) {
        //来源(0 => 'android', 1 => 'ios', 2 => 'weixin', 3 => 'pc', 9 => '其它');

        // config.headers.App = window.localStorage.getItem('origin') || '';
        config.headers.App = checkTheTerminal();
        
    }
	return config;
}, (err) => {
	return Promise.reject(err);
});

instance.interceptors.response.use( (res) => {
    Toast.clear();
    // alert(JSON.stringify(res))
	if (res.data.code !== 200 && res.data.code !== 402) {
		switch (res.data.code) {
            case 0: 
                //系统错误
                // Toast.fail({
                //     duration: '10000',
                //     position: 'middle',
                //     message: res.data.msg
                // });
                break;
            case 400: 
                //表单验证提交失败
                
                if(res.config.method === 'get') {
                    //若get返回400，则返回上一级
                    Dialog.alert({
                        message: res.data.msg
                    })
                    setTimeout(()=>{
                        window.history.go(-1);
                    },1500) 
                }else {
                    Toast(res.data.msg);
                }
                return res.data;
                break;
            case 401:
                //令牌失效,返回登录
                if(localStorage.getItem('Authorization')) {
                    //如果token存在但是无效
                    Toast(res.data.msg);
                }
                location.href = "/#/login";
				break;
			case 404:
                break;
            case 422:
				var flag = Array.isArray(res.data.data) && res.data.data.length;
				Dialog.alert({message: flag ? res.data.data[0].message : res.data.message})
                break;
            default: 
                break;
        }

		return Promise.reject(res);
	}
	return res.data;
}, (error) => {
	Toast.clear();
	// Dialog.alert({
	//   title: '警告',
	//   message: error.message
	// })
	return Promise.reject(error);
});

const post = (url, data, config = {}) => {
	return instance.post(url, data, config)
}

const put = (url, data, config = {}) => {
	return instance.put(url, data, config)
}

const get = (url, params, config = {}) => {
	return instance.get(url, {
		params: params,
		...config
	})
}

const deleteMethod = (url, config = {}) => {
	return instance({
		url: url,
		method: 'delete',
		...config
	})
}

export default {
	install(Vue) {
		Object.defineProperties(Vue.prototype, {
			$reqGet: {
				value: get
			},
			$reqPost: {
				value: post
			},
			$reqPut: {
				value: put
			},
			$reqDel: {
				value: deleteMethod
			},
		})
	}
}
