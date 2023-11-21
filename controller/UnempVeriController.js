const BaseController = require('./BaseController');
const UnempVeriModel = require('../model/UnempVeriData');
const log4js = require('../utils/log4js');
const util = require('../utils/util');
const { Op } = require('sequelize');
class UnempVeriController extends BaseController {
  static async getUnempVeriData(ctx) {
    const {
      personID,
      personName,
      startDate,
      endDate,
      monthSelect,
      checkoperators,
      verification,
      noindex,
      searchValue,
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
    if (searchValue){
      where.personID = {[Op.substring]: searchValue}
    }
    if (personID) {
      where.personID = personID;
    }
    if (verification) {
      where.verification = verification;
    }
    if (monthSelect) {
      console.log(monthSelect)
      where.createtime = { [Op.between]: [monthSelect[0].slice(0,10),monthSelect[1].slice(0,10)] };
    }
    if (personName) {
      where.personName = personName;
    }
    if (endDate) {
      where.createtime = { [Op.between]: [startDate,endDate] };
    }
    if (checkoperators) {
      where.checkoperator = { [Op.or]: checkoperators };
    }
    try {
      const { count, rows } = await UnempVeriModel.findAndCountAll({
        where,
        order: [['createtime', 'DESC']],
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
  /**
   * add data
   * @param {*} ctx
   */
  static async addUnempVeriData(ctx) {
    log4js.debug('add====>',ctx.request.body);
    try {
      await UnempVeriModel.create(ctx.request.body);
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
  }

  // update
  static async updateUnempVeriData(ctx) {
    const {
      id,
      personName,
      personID,
      jiezhen,
      checknote,
      verification,
      reviewoperator,
      reviewnote,
      checkoperator,
    } = ctx.request.body;
    const params = {
      personName,
      personID,
      jiezhen,
      checknote:checknote !== null ? checknote : '',
      verification,
      reviewoperator,
      reviewnote:reviewnote!== null? reviewnote : '',
      checkoperator,
    };
    console.log('params===>',params)
    try {
      await UnempVeriModel.update(params, {
        where: {
          id: id,
        },
      });
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `更新数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, `ID:${id},更新成功`);
  }
}
module.exports = UnempVeriController;
