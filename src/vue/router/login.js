const login = () => import(/* webpackChunkName: "login" */ '@/views/login/login');
const registered = () => import(/* webpackChunkName: "registered" */ '@/views/login/registered/')
const agreement = () => import(/* webpackChunkName: "registered" */ '@/views/login/registered/agreement')
const registerGetCode = () => import(/* webpackChunkName: "register-getCode" */ '@/views/login/register-getCode/');
const registerSubmit = () => import(/* webpackChunkName: "register-submit" */ '@/views/login/register-submit/');
const registerStatus = () => import(/* webpackChunkName: "register-status" */ '@/views/login/register-status/');
const forget = () => import(/* webpackChunkName: "forget" */ '@/views/login/forget/');
const forgetReset = () => import(/* webpackChunkName: "forget-reset" */ '@/views/login/forget-reset/');
const forgetStatus = () => import(/* webpackChunkName: "forget-status" */ '@/views/login/forget-status/');


export default [
	{
		path: "/login",
		name: "login",
		meta: {
            level: 0,
            title: '登录'
		},
		component: login
	},
	{
		path: "/login/registered",
		name: "registered",
		meta: {
            level: 1,
            title: '注册'
		},
		component: registered
    },
    {
        path: "/login/registered/agreement",
        name: "agreement",
        meta: {
            level: 2,
            title: '协议'
        },
        component: agreement
    },
	{
		path: "/login/registerGetCode",
		name: "registerGetCode",
		meta: {
            level: 1,
            title: ''
		},
		component: registerGetCode
	},
	{
		path: "/login/registerSubmit",
		name: "registerSubmit",
		meta: {
            level: 1,
            title: ''
		},
		component: registerSubmit
	},
	{
		path: "/login/registerStatus/:status",
		name: "registerStatus",
		props: true,
		meta: {
            level: 2,
            title: ''
		},
		component: registerStatus
	},
	{
		path: "/login/forget",
		name: "forget",
		meta: {
            level: 1,
            title: ''
		},
		component: forget
	},{
		path: "/login/forget/reset",
		name: "forgetReset",
		meta: {
            level: 2,
            title: ''
		},
		component: forgetReset
	},
	{
		path: "/login/forget/reset/:status",
		name: "forgetStatus",
		props: true,
		meta: {
            level: 3,
            title: ''
		},
		component: forgetStatus
	}]