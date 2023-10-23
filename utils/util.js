/**
 * 通用函数封装
 *
 */
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001, //参数错误
  USER_ACCOUNT_ERROR: 20001, //账户或密码错误
  USER_LOGIN_ERROR: 30001, //用户未登录
  BUSINESS_ERROR: 40001, //业务请求失败
  AUTH_ERROR: 50001, // 认证失败或TOKEN过期
}


module.exports = {
  /**
   * 分页结构封装
   * @param {number} current
   * @param {number} pageSize
   */
  pager({current=1,pageSize=10}){
    current*=1;
    pageSize*=1;
    const skipIndex = (current-1)*pageSize;
    return {
      page:{
        current,
        pageSize
      },
      skipIndex
    }
  },
  CODE
}