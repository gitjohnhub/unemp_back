const BaseController = require('./BaseController');
const UnempVeriModel = require('../model/UnempVeriData');
const log4js = require('../utils/log4j');
const util = require('../utils/util');
const { Op } = require('sequelize');
class UnempVeriController extends BaseController {
  static async getUnempVeriData(ctx) {
    const { personID, personName, startDate, endDate, monthSelect, checkoperators } =
      ctx.request.body;
    console.log('ctx====>>', monthSelect);
    const where = {};
    if (personID) {
      where.personID = personID;
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
    const { page, skipIndex } = util.pager(ctx.request.body);
    log4js.debug(`page:${page.current},skipindex:${skipIndex}`);
    try {
      const { count, rows } = await UnempVeriModel.findAndCountAll({
        where,
        order: [['createtime', 'DESC']],
        offset: skipIndex,
        limit: page.pageSize,
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
    log4js.debug(ctx.request.body);
    try {
      await UnempVeriModel.create(ctx.request.body);
    } catch (e) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
  }
  // TODO
  static async deleteUnempVeriData(ctx) {
    log4js.debug(ctx.request.body);
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
    const { id, jiezhen,checknote,verification, reviewoperator, reviewnote ,alreadydelete} = ctx.request.body;
    log4js.debug(ctx.request.body)
    let params = {
        alreadydelete: alreadydelete || null,
        verification: verification || null,
        reviewnote:reviewnote || null,
        jiezhen:jiezhen || null,
        checknote:checknote || null,
        reviewoperator:reviewoperator || null,
        // ...
      }
    // const params = {};
    // if (alreadydelete) {
    //   params.alreadydelete = alreadydelete;
    // }
    // if (verification) {
    //     params.verification = verification;
    //   }
    // if (reviewoperator) {
    //     params.reviewoperator = reviewoperator;
    // }
    // if (jiezhen) {
    //     params.jiezhen = jiezhen;
    // }
    // if (checknote) {
    //     params.checknote = checknote;
    // }
    // if (reviewnote) {
    //     params.reviewnote = reviewnote;
    // }
    try {
      await UnempVeriModel.update(
        params,
        {
          where: {
            id: id,
          },
        }
      );
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `更新数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, `ID:${id},更新成功`);
  }
}
module.exports = UnempVeriController;
