// 定一个公共类，类里有一个renderJsonSuccess方法，方便返回数据

class BaseController {
  static renderJsonSuccess(code = 200, msg = '', data = []) {
      return {
          'code': code,
          'msg': msg,
          'data': data
      }
  }
  static renderJsonFail(code = 40001, msg = '', data = []) {
    return {
        'code': code,
        'msg': msg,
        'data': data
    }
}
}

module.exports = BaseController