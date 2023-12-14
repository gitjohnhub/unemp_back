const BaseController = require('./BaseController');
const UnempVeriModel = require('../model/UnempVeriData');
const log4js = require('../utils/log4js');
const util = require('../utils/util');
const { Op, Sequelize } = require('sequelize');
const { getFirstAndLastDayOfMonthFromArray, getFirstAndLastDayOfMonth } = require('../utils/tools');
const { months } = require('moment');
class UnempVeriController extends BaseController {
  static async getUnempVeriData(ctx) {
    const {
      personID,
      personName,
      startDate,
      endDate,
      monthRangeSelect,
      checkoperators,
      status,
      noindex,
      jiezhen,
      searchValue,
      monthSelect,
      customOrder,
    } = ctx.request.body;
    const order = [['createtime', 'DESC']];
    const { page, skipIndex } = util.pager(ctx.request.body);
    let pageOptions = {};
    if (!noindex) {
      // 进行分页
      pageOptions = {
        offset: skipIndex,
        limit: page.pageSize,
      };
    }
    console.log('monthSelect===>', monthSelect);
    console.log('monthRangeSele===>', monthRangeSelect);
    const where = {};
    if (customOrder) {
      order.unshift([customOrder.sortColumn, customOrder.sortRule]);
    }
    if (monthSelect && monthSelect.length) {
      // pageOptions = {};
      where.createtime = {
        [Op.between]: getFirstAndLastDayOfMonth(monthSelect),
      };
    }
    if (jiezhen) {
      where.jiezhen = {
        [Op.or]: jiezhen,
      };
    }
    if (searchValue) {
      where.personID = { [Op.substring]: searchValue };
    }
    if (personID) {
      where.personID = personID;
    }
    if (status != null) {
      where.status = {
        [Op.or]: status,
      };
    }
    if (monthRangeSelect && monthRangeSelect.length) {
      const dateArray = getFirstAndLastDayOfMonthFromArray(monthRangeSelect);
      where.createtime = {
        [Op.between]: [dateArray[0], dateArray[1]],
      };
    }
    if (personName) {
      where.personName = personName;
    }
    if (endDate) {
      where.createtime = { [Op.between]: [startDate, endDate] };
    }
    if (checkoperators) {
      where.checkoperator = { [Op.or]: checkoperators };
    }
    console.log('where===>', where);
    try {
      const { count, rows } = await UnempVeriModel.findAndCountAll({
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
  static async addUnempVeriData(ctx) {
    log4js.debug('add====>', ctx.request.body);
    try {
      await UnempVeriModel.create(ctx.request.body);
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
  }
  static async getUnempVeriAllDate(ctx) {
    let months = [];
    await UnempVeriModel.findAll({
      attributes: [
        [Sequelize.fn('date_format', Sequelize.col('createtime'), '%Y-%m'), 'formattedDate'],
      ],
      group: 'formattedDate',
    })
      .then((results) => {
        results.forEach((result) => {
          months.push(result.getDataValue('formattedDate'));
        });
        ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '获得数据', months);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // update
  static async updateUnempVeriData(ctx) {
    const {
      id,
      personName,
      personID,
      jiezhen,
      checknote,
      status,
      reviewoperator,
      reviewnote,
      checkoperator,
    } = ctx.request.body;
    const params = {
      personName,
      personID,
      jiezhen,
      checknote: checknote !== null ? checknote : '',
      status,
      reviewoperator,
      reviewnote: reviewnote !== null ? reviewnote : '',
      checkoperator,
    };
    console.log('params===>', params);
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
