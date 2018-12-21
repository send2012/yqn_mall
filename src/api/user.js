/**
 * 本地 mock
 *
 */

//登录
// export const USER_LOGIN = "/user-login"
// export const USER_LOGOUT = ""

//用户信息
export const USER_PROFILE = "/user-profile"
export const USER_MODIFY_PASSWORD = ""
export const USER_CHANGE_MOBILE = ""

//验证码
export const USER_SENDCODE = ""

//地址
export const ADDRESS = "/address"
export const ADDRESS_DEFAULT = "/address-default"

//收藏
export const GOODS_COLLECT_LIST = "/moreGoods"

//积分
export const USER_POINT = "/point-list"


/**
 * 测试接口 会员中心接口
 * @param   用户-微信自动登录
 * @param   用户-账号注册
 * @param   用户-账号注册-一级分类拉取
 * @param   用户-登陆   USER_LOGIN
 * @param   用户-重新设置缓存的openid
 * @param   用户-重置用户登录的openid
 * @param   用户-获取积分、客服、购物车信息 USER_BASE_INFO
 * @param   用户-首页信息   USER_INDEX_INFO
 * @param   用户-基本资料获取   USER_BASIC_INFO
 * @param   用户-基本资料修改   USER_BASIC_INFO
 * @param   用户-密码修改   USER_PSWD_EDIT
 * @param   用户-退出登陆   USER_LOGOUT
 * @param   签到-获取签到信息
 * @param   签到-签到领取积分
 * @param   收货地址-列表   USER_ADDRESS_LIST
 * @param   收货地址-详情   USER_ADDRESS_INFO
 * @param   收货地址-添加   USER_ADDRESS_ADD
 * @param   收货地址-修改   USER_ADDRESS_EDIT
 * @param   收货地址-设为默认   USER_ADDRESS_DEFAULT
 * @param   收货地址-删除   USER_ADDRESS_DEL
 * @param   用户-购买优惠券列表
 * @param   用户-购买优惠券详情
 * @param   用户-购买优惠券订单
 */


 //用户-微信自动登录
 export const USER_LOGIN_WECHAT = "/users/auto_login"
 //用户-账号注册
 export const USER_REG = "/users/reg"
 //用户-登陆
 export const USER_LOGIN = "/users/login"
 //用户-重新设置缓存的openid（需要登录后才能操作）
 export const USER_OPENID_SET = "/users/openid_set"
 //用户-重置用户自动登陆openid或unionid
 export const USER_BIND_EDIT = "/users/bind_edit"
 //用户-获取积分、客服、购物车信息
 export const USER_BASE_INFO = "/users/base_info"
 //用户-首页信息
 export const USER_INDEX_INFO = "/users/index_info"
 //用户-基本资料获取
 export const USER_BASIC_INFO = "/users/basic_info"
 //用户-基本资料修改
 export const USER_BASIC_EDIT = "/users/basic_edit"
 //用户-密码修改
 export const USER_PSWD_EDIT = "/users/pswd_edit"
 //用户-退出登陆
 export const USER_LOGOUT = "/users/logout"
 //签到-获取签到信息
 export const USER_SIGNED_INFO = "/users/signed_info"
 //签到-签到领积分
 export const USER_SIGNED_SUB = "/users/signed_sub"
 //收货地址-列表
 export const USER_ADDRESS_LIST = "/users/address_page"
 //收货地址-详情
 export const USER_ADDRESS_INFO  = "/users/address_info"
 //收货地址-添加
 export const USER_ADDRESS_ADD = "/users/address_add"
 //收货地址-修改
 export const USER_ADDRESS_EDIT = "/users/address_edit"
 //收货地址-设为默认
 export const USER_ADDRESS_DEFAULT = "/users/address_editmr"
 //收货地址-删除
 export const USER_ADDRESS_DEL = "/users/address_del"
 //购买优惠券列表
 export const USER_BUY_COUPON_LIST = "/coupon/salecoupon_list"
 //购买优惠券详情
 export const USER_BUY_COUPON_DETAIL = "/coupon/coupon_info"
 //购买优惠券
 export const USER_BUY_COUPON_SUB = "/coupon/coupon_sub";
