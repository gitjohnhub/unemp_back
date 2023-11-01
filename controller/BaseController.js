// 定一个公共类，类里有一个renderJsonSuccess方法，方便返回数据
const log4js = require('../utils/log4js');

class BaseController {
  static renderJsonSuccess(code = 200, msg = '', data = []) {
    return {
      code,
      msg,
      data,
    };
  }
  static renderJsonFail(code = 40001, msg = '', data = []) {
    log4js.debug(`${msg}`)
    return {
      code,
      msg,
      data,
    };
  }
}

module.exports = BaseController;
