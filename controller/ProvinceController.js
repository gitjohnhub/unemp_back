const BaseController = require('./BaseController');
const ProvinceModel = require('../model/Province');
const log4js = require('../utils/log4js');
const util = require('../utils/util');
const { Op } = require('sequelize');
class ProvinceController extends BaseController {
  static async getProvinceData(ctx) {
    const {
      code,
      name
    } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    let pageOptions = {};
    if (!noindex) {
      // 进行分页
      pageOptions = {
        offset: skipIndex,
        limit: page.pageSize,
      };
    }
    const where = {};
    if (code){
      where.code = code
    }
    if (name) {
      where.name = name;
    }
    try {
      const { count, rows } = await ProvinceModel.findAndCountAll({
        where,
        order: [['code', 'DESC']],
        ...pageOptions,
      });
      ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '查询成功', {
        page: {
          ...page,
          total: count,
        },
        rows,
      });
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `查询异常:${err}`);
    }
  }
}
module.exports = ProvinceController;
