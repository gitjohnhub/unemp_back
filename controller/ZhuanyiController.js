const BaseController = require('./BaseController');
const ZhuanyiModel = require('../model/ZhuanyiData');
const log4js = require('../utils/log4js');
const util = require('../utils/util');
const { Op, Sequelize } = require('sequelize');
const { getFirstAndLastDayOfMonth, getFirstAndLastDayOfMonthFromArray } = require('../utils/tools');
class ZhuanyiController extends BaseController {
  static async getZhuanyiData(ctx) {
    const {
      personID,
      personName,
      fromArea,
      status,
      payDate,
      isOnlyTransferRelation,
      checkoperator,
      noindex,
      searchValue,
      payMonth,
      monthSelect,
      monthRangeSelect,
      customOrder,
    } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    let pageOptions = {};
    const order = [['createtime', 'DESC']];
    if (customOrder) {
      order.unshift([customOrder.sortColumn, customOrder.sortRule]);
    }
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
    if (monthRangeSelect && monthRangeSelect.length) {
      where.createtime = {
        [Op.between]: getFirstAndLastDayOfMonthFromArray(monthRangeSelect),
      };
    }
    if (monthSelect && monthSelect.length) {
      // pageOptions = {};
      where.createtime = {
        [Op.between]: getFirstAndLastDayOfMonth(monthSelect),
      };
    }
    if (searchValue) {
      if (searchValue.length == 18) {
        where.personID = searchValue;
      } else if (searchValue.length !== 18 && /^[0-9]+$/.test(searchValue)) {
        console.log('pay==>', searchValue);
        where.pay = { [Op.substring]: searchValue };
        console.log('where==>', where);
      } else if (/[\u4e00-\u9fa5]/.test(searchValue)) {
        where.personName = { [Op.substring]: searchValue };
      } else {
        console.log('searchValue==>', searchValue);
      }
    }
    if (personID) {
      where.personID = personID;
    }
    if (payDate) {
      where.payDate = {
        [Op.between]: getFirstAndLastDayOfMonth(payDate),
      };
    }
    if (personName) {
      where.personName = personName;
    }
    if (fromArea) {
      where.fromArea = fromArea;
    }
    if (status != null) {
      if (typeof status === 'string') {
        where.status = status;
      } else {
        where.status = {
          [Op.or]: status,
        };
      }
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
        order,
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
      ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
  }

  static async getZhuanyiAllDate(ctx) {
    let months = [];
    await ZhuanyiModel.findAll({
      attributes: [
        [Sequelize.fn('date_format', Sequelize.col('createtime'), '%Y-%m'), 'formattedDate'],
      ],
      group: 'formattedDate',
    })
      .then((results) => {
        results.forEach((result) => {
          months.push(result.getDataValue('formattedDate'));
        });
        console.log(months);
        ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '获得数据', months);
        console.log(ctx.body);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  static async getZhuanyiDataCal(ctx) {
    const { monthRangeSelect, monthSelect, searchValue } = ctx.request.body;
    const where = {};
    if (monthRangeSelect && monthRangeSelect.length) {
      where.createtime = {
        [Op.between]: getFirstAndLastDayOfMonthFromArray(monthRangeSelect),
      };
    }
    if (searchValue) {
      if (searchValue.length == 18) {
        where.personID = searchValue;
      } else if (searchValue.length !== 18 && /^[0-9]+$/.test(searchValue)) {
        console.log('pay==>', searchValue);
        where.pay = { [Op.substring]: searchValue };
        console.log('where==>', where);
      } else if (/[\u4e00-\u9fa5]/.test(searchValue)) {
        where.personName = { [Op.substring]: searchValue };
      } else {
        console.log('searchValue==>', searchValue);
      }
    }
    if (monthSelect && monthSelect.length) {
      // pageOptions = {};
      where.createtime = {
        [Op.between]: getFirstAndLastDayOfMonth(monthSelect),
      };
    }
    let total = 0;
    await ZhuanyiModel.findAll({
      where,
      attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
      group: ['status'],
    })
      .then((results) => {
        results.forEach((result) => {
          total += result.getDataValue('count');
        });
        ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '获得数据', results);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  // update
  static async updateZhuanyiData(ctx) {
    const {
      id,
      personName,
      personID,
      fromArea,
      status,
      pay,
      reviewoperator,
      payDate,
      isOnlyTransferRelation,
      note,
      payMonth,
    } = ctx.request.body;
    const params = {};
    if (personID) {
      params.personID = personID;
    }
    if (payMonth) {
      params.payMonth = payMonth;
    }
    if (pay) {
      params.pay = pay;
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
