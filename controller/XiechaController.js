const BaseController = require('./BaseController');
const XiechaModel = require('../model/XiechaData');
const log4js = require('../utils/log4j');
const util = require('../utils/util');
const { Op } = require('sequelize');
class XiechaController extends BaseController {
  static async getXiechaData(ctx) {
    const { personID, personName } = ctx.request.body;
    const where = {};
    if (personID) {
      where.personID = personID;
    }
    if (personName) {
        where.personName = personName;
      }
    const { page, skipIndex } = util.pager(ctx.request.body);
    log4js.debug(`page:${page.current},skipindex:${skipIndex}`);
    try {
      const { count, rows } = await XiechaModel.findAndCountAll({
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
  static async addXiechaData(ctx) {
    log4js.debug(ctx.request.body);
    try {
      await XiechaModel.create(ctx.request.body);
    } catch (e) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
  }
  // TODO
  static async deleteXiechaData(ctx) {
    log4js.debug(ctx.request.body);
    const { id } = ctx.request.body;
    try {
      await XiechaModel.update(
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
  static async updateXiechaData(ctx) {
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
    try {
      await XiechaModel.update(
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
module.exports = XiechaController;
