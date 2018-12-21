/**
 * 测试接口 促销活动前台接口
 * @param   获取促销分类
 * @param   获取促销详情&商品 带分类
 * @param   根据活动ID获取促销专区的专题页 不带分类
 * @param   获取秒杀活动
 * @param   获取限时活动
 * @param   获取抽奖活动的详情
 * @param   获取最近中奖名单列表
 * @param   获取用户的抽奖记录
 * @param   根据订单号获取中奖信息的详情
 * @param   抽奖前检查用户信息
 * @param   开始抽奖接口
 */

// 获取促销分类
export const PROMOTE_PROM_LIST = "/promote/prom_list"
// 获取促销详情&商品 带分类
export const PROMOTE_PROM_INFO = "/promote/prom_info"
//根据活动ID获取促销专区的专题页 不带分类
export const PROMOTE_AREA_LIST = "/promote/promarea_list"
// 获取秒杀活动
export const PROMOTE_SECKILL_LIST = "/promote/seckill_list"
// 获取限时活动
export const PROMOTE_LIMITTIME_LIST = "/promote/limittime_list"
// 获取抽奖活动的详情
export const PROMOTE_PRIZE_INFO = "/promote/prize_info"
// 获取最近中奖名单列表
export const PROMOTE_PRIZELOG_LIST = "/promote/prizelog_list"
// 获取用户的抽奖记录
export const PROMOTE_PRIZEUSER_LIST = "/promote/prizeuser_list"
// 根据订单号获取中奖信息的详情
export const PROMOTE_PRIZEUSER_GET = "/promote/prizeuser_get"
// 抽奖前检查用户信息
export const PRIZE_BEFORE_INFO = "/promote/prizebefore_info"
// 开始抽奖接口
export const START_PRIZE_INFO = "/promote/startprize_info"