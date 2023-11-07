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
      alreadydelete,
      verification,
      noindex,
      searchValue,
    } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    console.log(ctx.request.body)
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
      console.log('searchValue==>',searchValue)
      where.personID = {[Op.substring]: searchValue}
    }
    if (personID) {
      where.personID = personID;
    }
    if (alreadydelete) {
      where.alreadydelete = alreadydelete;
    }
    if (verification) {
      where.verification = verification;
    }
    if (monthSelect) {
      where.createtime = { [Op.between]: monthSelect };
    }
    if (personName) {
      where.personName = personName;
    }
    if (startDate) {
      where.createtime = { [Op.gte]: startDate };
    }
    if (endDate) {
      where.createtime = { [Op.lte]: endDate };
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
      console.log('rows==========>',rows)
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
    } catch (e) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
  }
  // TODO
  static async deleteUnempVeriData(ctx) {
    // log4js.debug(ctx.request.body);
    const { id } = ctx.request.body;
    try {
      await UnempVeriModel.update(
        { alreadydelete: 2 },
        {
          where: {
            id: id,
          },
        }
      );
    } catch (e) {
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
      alreadydelete,
      checkoperator,
    } = ctx.request.body;
    log4js.debug('update====>',ctx.request.body);
    const params = {};
    if (personID) {
      params.personID = personID;
    }
    if (personName) {
      params.personName = personName;
    }
    if (alreadydelete) {
      params.alreadydelete = alreadydelete;
    }
    if (checkoperator) {
      params.checkoperator = checkoperator;
    }
    if (verification) {
      params.verification = verification;
    }
    if (reviewoperator) {
      params.reviewoperator = reviewoperator;
    }
    if (jiezhen) {
      params.jiezhen = jiezhen;
    }
    if (checknote !== null) {
      params.checknote = checknote;
    }
    if (reviewnote !== null) {
      params.reviewnote = reviewnote;
    }
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
