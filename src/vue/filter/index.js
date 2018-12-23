import moment from 'moment';
moment.locale('zh-cn');

export const dateFormat = (value, format = 'YYYY-MM-DD') => {
	return value ? moment(value * 1000).format(format) : '';
}

export const yuan = (value) => {
	return !isNaN(value) ? '¥' + (value / 100).toFixed(2) : value;
}

export const greater = (value) => {
    //99+
    return Number(value) > 99 ? '99+' : value;
}

export const show_price = (min, max) => {
    //比对商品价格
    if(min === max) {
        return Number(max).toFixed(2)
    }else {
        return Number(min).toFixed(2) + '~' + Number(max).toFixed(2);
    }
}

export const show_date = (date) => {
    //过滤年月日时分秒，只显示年月日
    if(date.indexOf(':')) {
        //如果有时分秒
        let arr = date.split(' ');
        return arr[0]
    }else {
        return date
    }
}

export default {
	install(Vue) {
		Vue.filter('yuan', yuan)
        Vue.filter('dateFormat', dateFormat)
        Vue.filter('greater',greater)
        Vue.filter('show_price',show_price)
        Vue.filter('show_date',show_date)
	},
}
