import Vue from 'vue';
import {Toast} from 'vant';
import Router from 'vue-router';

import home from './home';
import items from './items';
import user from './user';
import order from './order';
import login from './login';
import recommend from './recommend';

Vue.use(Router);

let RouterModel = new Router({
	routes:[...home, ...items, ...user, ...order, ...login, ...recommend]
})


RouterModel.beforeEach((to, from, next) => {
    // const { Authorization, user_id} = Vue.prototype.$util.getLocalStorage('Authorization', 'user_id');
    let Authorization = localStorage.getItem('Authorization');
	if(!Authorization){
		if(to.meta.login){
			RouterModel.push({name: 'login', query: {redirect: to.name}});
			return;
		}
	}
	next();
})


RouterModel.afterEach((to, from) => {
})

export default RouterModel;