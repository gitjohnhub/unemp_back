const BaseController = require('./BaseController');
const ZhuanyiModel = require('../model/ZhuanyiData');
const log4js = require('../utils/log4js');
const util = require('../utils/util');
const { Op,Sequelize } = require('sequelize');
class ZhuanyiController extends BaseController {
  static async getZhuanyiData(ctx) {
    const {
      personID,
      personName,
      fromArea,
      status,
      isDeleted,
      payDate,
      isOnlyTransferRelation,
      checkoperator,
      noindex,
      searchValue,
      payMonth,
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
    if (payMonth) {
      where.payMonth = payMonth;
    }
    if (searchValue) {
      console.log('searchValue==>', searchValue);
      where.personID = { [Op.substring]: searchValue };
    }
    if (personID) {
      where.personID = personID;
    }
    if (payDate) {
      where.payDate = payDate;
    }
    if (isDeleted) {
      where.isDeleted = isDeleted;
    }
    if (personName) {
      where.personName = personName;
    }
    if (fromArea) {
      where.fromArea = fromArea;
    }
    if (status != null) {
      where.status = status;
    }
    if (isOnlyTransferRelation) {
      where.isOnlyTransferRelation = isOnlyTransferRelation;
    }
    if (checkoperator) {
      where.checkoperator = checkoperator;
    }
    try {
      const { count, rows } = await ZhuanyiModel.findAndCountAll({
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
  static async addZhuanyiData(ctx) {
    log4js.debug('add====>', ctx.request.body);
    try {
      await ZhuanyiModel.create(ctx.request.body);
    } catch (e) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
  }
  static async getZhuanyiDataCal(ctx) {
    let total = 0
    await ZhuanyiModel.findAll({
      where:{
        isDeleted: '1'},
      attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
      group: ['status'],
    })
      .then((results) => {

        results.forEach((result) => {
          total += result.getDataValue('count');
        });
        results.push({
          status: '8',
          count: total
        })
        ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '获得数据',results);

      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // TODO
  static async deleteZhuanyiData(ctx) {
    // log4js.debug(ctx.request.body);
    const { id } = ctx.request.body;
    try {
      await ZhuanyiModel.update(
        { isDeleted: 1 },
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
  static async updateZhuanyiData(ctx) {
    const {
      id,
      personName,
      personID,
      fromArea,
      status,
      reviewoperator,
      payDate,
      isOnlyTransferRelation,
      note,
      isDeleted,
      payMonth,
    } = ctx.request.body;
    log4js.debug('update====>', ctx.request.body);
    const params = {};
    if (personID) {
      params.personID = personID;
    }
    if (payMonth) {
      where.payMonth = payMonth;
    }
    if (personName) {
      params.personName = personName;
    }
    if (fromArea) {
      params.fromArea = fromArea;
    }
    if (reviewoperator) {
      params.reviewoperator = reviewoperator;
    }
    if (status) {
      params.status = status;
    }
    if (payDate) {
      params.payDate = payDate;
    }
    if (isOnlyTransferRelation) {
      params.isOnlyTransferRelation = isOnlyTransferRelation;
    }
    if (note) {
      params.note = note;
    }
    if (isDeleted !== null) {
      params.isDeleted = isDeleted;
    }
    try {
      await ZhuanyiModel.update(params, {
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
module.exports = ZhuanyiController;
