const getLocalStorage = (...args) => {
	let storage = {};
	for (let arg of args) {
		storage[arg] = window.localStorage.getItem(arg) || "";
	}
	return storage;
}

const setLocalStorage = (data) => {
	for (let prop in data) {
		window.localStorage.setItem(prop, data[prop]);
	}
}

const removeLocalStorage = (...args) => {
	for (let arg of args) {
		window.localStorage.removeItem(arg);
	}
}

const debounce = (func, wait, immediate) => {
	let timeout, args, context, timestamp, result;
	return function () {
		context = this;
		args = arguments;
		timestamp = new Date();
		const later = () => {
			const last = (new Date()) - timestamp;
			if (last < wait) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				result = func.apply(context, args);
			}
		};
		if (!timeout) {
			timeout = setTimeout(later, wait);
		}
		return result;
	};
}
const throttle = (func, wait, options) => {
	var timeout, context, args, result;
	var previous = 0;
	if (!options) options = {};

	var later = function () {
		previous = options.leading === false ? 0 : new Date();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null; //显示地释放内存，防止内存泄漏
	};

	var throttled = function () {
		var now = new Date();
		if (!previous && options.leading === false) previous = now;
		var remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};

	throttled.cancel = function () {
		clearTimeout(timeout);
		previous = 0;
		timeout = context = args = null;
	};

	return throttled;
}

const getLocationParam = function(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURIComponent(r[2]); return "";
}

//转化时间戳为日期 
const transformTime = function(timestamp) {
	var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	var D = date.getDate() + ' ';
	var h = date.getHours() + ':';
	var m = date.getMinutes() + ':';
	var s = date.getSeconds();

	return Y + M + D + h + m + s;
}

//秒杀，将时间戳转换为 XX月XX日
const transformGrabTime = function(timestamp) {
    let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
    let D = date.getDate() + '日';

    return M + D;
}

//遍历对象,转化对象为数组
const objectToArray = function(obj) {
    let arr = [];
    Object.keys(obj).map((item)=> {
        arr.push(obj[item]);
    })
    return arr
}

//判断设备终端
const checkTheTerminal = function() {
    let version = window.navigator.userAgent;
    if(version.toLowerCase().indexOf('micromessenger') !== -1) {
        //微信内核
        return 'WeChat';
    }else if(version.indexOf("yiqiniuios") > -1) {
        //IOS APP
        return 'IOS';
    }else if(version.indexOf("YIQINIU ANDROID") > -1 || version.indexOf("yiqiniuandroid") > -1) {
        //Android APP
        return 'android'
    }else {
        //其他
        return ''
    }
}


//判断源生函数是否存在
const checkPrimalFunc = function(name) {
    //先判断是什么APP
    let version = checkTheTerminal();
    if(version === 'IOS') {
        //判断IOS函数是否存在
        if (window.hasOwnProperty("webkit")) {
            var yqnobj = window.webkit.messageHandlers;
            if (yqnobj != null && typeof yqnobj !== "undefined") {
                return yqnobj.hasOwnProperty(name);
            }
        }
    }else if(version === 'android') {
        //判断安卓函数是否存在
        if (typeof  yqnjs != "undefined") {
            return yqnjs.hasOwnProperty(name);
        }
    }

}


//在APP中打开
const openInApp = function() {
    let href = window.location.href;
    let openurl = href.replace(/^h[a-z]+:/,'yiqiniu:');
    // alert(openurl)
    let iosurl = "https://itunes.apple.com/cn/app/%E4%B8%80%E8%B5%B7%E7%89%9B%E6%AF%8D%E5%A9%B4%E5%B9%B3%E5%8F%B0/id1358273824?mt=8";
    let androidurl = "https://m.naifenpifa168.com/m/users/download_update";
    let version = checkTheTerminal();
    if (version && version !== 'WeChat') {
        let loadDateTime = new Date(); // 设置时间阈值，在规定时间里面没有打开对应App的话，直接去App store进行下载。
        window.setTimeout(function () {
            let timeOutDateTime = new Date();
            if (timeOutDateTime - loadDateTime < 4000) {

                if (window.navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                    console.log("11-1");
                    window.location = iosurl;
                } else if (window.navigator.userAgent.match(/android/i)) {
                    console.log("11-2");
                    window.location = androidurl;
                }
            } else {
                window.close();
            }

        }, 50);
        window.location = openurl; // iOS端URL Schema
    } else {
        if (window.navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            window.location = iosurl;
        } else {
            window.location = androidurl;
        }
    }
}


/**
 *  调用IOS源生函数
 * @param   loginAction 登录
 * @param   autoLoginAction 自动登录
 * @param   appPayAction    支付
 * @param   reloadAction    重载
 * @param   showversion     显示版本
 * @param   logoutAction    登出
 * @param   shareImgAction  共享图片
 * @param   clearCacheAction    清除缓存
 * @param   qynsharelink    共享链接
 * @param   checkUpgrade    检测升级
 */
const iosFunc = function(name,data) {
    switch(name) {      
        case 'loginAction': 
            //登录
            let logininfo = {'userid': data.username, 'password': data.password};
            window.webkit.messageHandlers.loginAction.postMessage(logininfo);
            break;
        case 'autoLoginAction':
            //自动登录
            window.webkit.messageHandlers.autoLoginAction.postMessage({});
            break;
        case 'logoutAction': 
            //退出
            window.webkit.messageHandlers.logoutAction.postMessage({});
            break;
        case 'showversion':
            window.webkit.messageHandlers.showversion.postMessage({});
            //显示版本
            // function showversion_callback(ver) {
            //     return '版本号:' + ver;
            // }
            break;
        case 'reloadAction': 
            //重载，刷新
            window.webkit.messageHandlers.reloadAction.postMessage({});
            break;
        case 'shareImgAction':
            //分享图片
            //参数
            // let data = {
            //     title:"标题内容",
            //     imglist: ['https://*******','https://*******','https://*******']
            // };
            window.webkit.messageHandlers.shareImgAction.postMessage(data);
            break;
        case 'qynsharelink': 
            //分享链接
            //参数
            // let data = {
            //     title: "标题",
            //     description: "描述",
            //     images: 图片路径,
            //     url: "完整链接地址"
            // };
            window.webkit.messageHandlers.qynsharelink.postMessage(data);
            break;
        case 'appPayAction':
            //支付
            window.webkit.messageHandlers.appPayAction.postMessage(data);
            // 回调
            // function appPayAction_callback(response) {
            //     let rt = JSON.parse(response);
            //     switch (rt.status) {
            //         case 1:
            //             Spp.dialog.alert('支付成功!', function () {
            //                 payOkCallback();
            //             });
            //             break;
            //         case 4:
            //             Spp.dialog.alert('没有安装微信客户端!')
            //             break;
            //         case 5:
            //             Spp.dialog.alert('支付验证失败!')
            //             break;
            //         default:
            //             Spp.dialog.close();
            //             break;
            //     }
            // }
            break;
        case 'clearCacheAction': 
            //清除缓存
            window.webkit.messageHandlers.clearCacheAction.postMessage({});
            break;
        case 'checkUpgrade':
            //检测升级
            window.webkit.messageHandlers.checkUpgrade.postMessage({});
            break;
        default:
            break;
    }   
}


/**
 * 调用Android  
 * @param   loginAction 登录
 * @param   autoLoginAction 自动登录
 * @param   logoutAction    登出
 * @param   reloadHomePage  重载
 * @param   showVersion     显示版本
 * @param   checkUpgrade    检查升级
 * @param   shareImgAction  共享图片
 * @param   shareLinkAction 共享链接
 * @param   appPayAction    支付
 */
const androidFunc = function(name,data) {
    switch(name) {
        case 'shareImgAction':
            //多图分享
            // var data = {
            //     title:"标题内容",
            //     imglist: ['https://*******','https://*******','https://*******']
            // };
            yqnjs.shareImgAction(JSON.stringify(data));
            break;
        case 'autoLoginAction':
            yqnjs.autoLoginAction();
            break;
        case 'shareLinkAction':
            //分享链接
            // var data = {
            //     title: "标题",
            //     description: "描述",
            //     images: 图片路径,
            //     url: "完整链接地址"
            // };
            yqnjs.shareLinkAction(JSON.stringify(data));
            break;
        case 'reloadHomePage':
            //刷新,重载
            yqnjs.reloadHomePage();
            break;
        case 'loginAction':
            //登录
            let logininfo = {'userid': data.username, 'password': data.password};
            yqnjs.loginAction(JSON.stringify(logininfo));
            break;
        case 'logoutAction':
            //登出
            yqnjs.logoutAction();
            break;
        case 'appPayAction': 
            //支付
            yqnjs.appPayAction(JSON.stringify(data));
            //回调
            // case "9000": // 支付成功
            //     nret = 1;
            // break;
            // case "8000":     //正在处理中
            // case "6002":     //网络连接出错
            //     nret = 4;
            //     break;
            // case "6001":     //用户中途取消
            // case "4000":     //订单支付失败
            //     nret = 5;
            //     break;
            // case "5000":     //重复请求
            //     nret = 6;
            //     break;
            // default:
            //     nret = 0;
            //     break;
                                
            // /*标识支付状态，含义如下：
            //     9000——订单支付成功
            //     8000——正在处理中
            //     4000——订单支付失败
            //     5000——重复请求
            //     6001——用户中途取消
            //     6002——网络连接出错
            // */                                

            // 回调函数:
            // function appPayAction_callback(response) {
            //         var rt = JSON.parse(response);
            //         switch (rt.status) {
            //             case 1:
            //                 Spp.dialog.alert('支付成功!', function () {
            //                     payOkCallback();
            //                 });
            //                 break;
            //             case 4:
            //                 Spp.dialog.alert('没有安装微信客户端!')
            //                 break;
            //             case 5:
            //                 Spp.dialog.alert('支付验证失败!')
            //                 break;
            //             default:
            //                 Spp.dialog.close();
            //                 break;
            //         }
            //     }
            break;
        case 'showVersion':
            //获取版本
            let code = yqnjs.showVersion(1);
            return code;
            
        case 'checkUpgrade':
            //检测升级
            yqnjs.checkUpgrade();
            break;
        default:
            break;
    }
}

//判断容器的navigator
const checkTheTerminalHeader = function() {
    let version = window.navigator.userAgent;
    if(version.toLowerCase().indexOf('micromessenger') !== -1) {
        //微信内核
        return '2';
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


export {
	getLocalStorage,
    setLocalStorage,
	removeLocalStorage,
	getLocationParam,
	debounce,
	throttle,
    transformTime,
    transformGrabTime,
    objectToArray,
    checkTheTerminal,
    checkPrimalFunc,
    openInApp,
    iosFunc,
    androidFunc,
    checkTheTerminalHeader
}

export default {
	install(Vue) {
		Object.defineProperties(Vue.prototype, {
			$util: {
				value: {
						getLocalStorage,
						setLocalStorage,
						removeLocalStorage,
						getLocationParam,
						debounce,
						throttle,
                        transformTime,
                        transformGrabTime,
                        objectToArray,
                        checkTheTerminal,
                        checkPrimalFunc,
                        openInApp,
                        iosFunc,
                        androidFunc,
                        checkTheTerminalHeader
				}
			}
		})
	}
}
