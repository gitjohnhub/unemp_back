const BaseController = require('./BaseController');
const NongbuModel = require('../model/NongbuData');
const log4js = require('../utils/log4js');
const { getFirstAndLastDayOfMonth, getFirstAndLastDayOfMonthFromArray } = require('../utils/tools');
const util = require('../utils/util');
const { Op, Sequelize } = require('sequelize');
class NongbuController extends BaseController {
  static async getNongbuData(ctx) {
    const {
      personID,
      status,
      jiezhen,
      checkoperator,
      monthRangeSelect,
      monthSelect,
      searchValue,
      noindex,
      originalFile,
      customOrder,
      cancelUnemp,
      showRepeat,
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
    const order = [['createtime', 'DESC']];
    if (customOrder) {
      order.unshift([customOrder.sortColumn, customOrder.sortRule]);
    }
    console.log('order===>', order);

    const where = {};
    if (monthSelect && monthSelect.length) {
      where.createtime = {
        [Op.between]: getFirstAndLastDayOfMonth(monthSelect),
      };
    }
    console.log(where.createtime);
    if (showRepeat) {
      where.repeatTimes = {
        [Op.gte]: 1,
      };
    }

    if (jiezhen) {
      where.jiezhen = {
        [Op.or]: jiezhen,
      };
    }
    if (cancelUnemp) {
      where.cancelUnemp = cancelUnemp;
    }
    if (monthRangeSelect && monthRangeSelect.length) {
      where.createtime = {
        [Op.between]: getFirstAndLastDayOfMonthFromArray(monthRangeSelect),
      };
      console.log(where);
    }
    if (searchValue) {
      if (searchValue.length == 18) {
        where.personID = searchValue;
      } else if (/[\u4e00-\u9fa5]/.test(searchValue)) {
        where.personName = { [Op.substring]: searchValue };
      } else {
        console.log('searchValue==>', searchValue);
      }
    }
    if (personID) {
      where.personID = personID;
    }
    if (status != null) {
      where.status = {
        [Op.or]: status,
      };
    }
    if (originalFile != null) {
      where.originalFile = originalFile;
    }
    if (checkoperator) {
      where.checkoperator = checkoperator;
    }
    try {
      const { count, rows } = await NongbuModel.findAndCountAll({
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
  static async addNongbuData(ctx) {
    console.log(ctx.request.body);
    try {
      await NongbuModel.create(ctx.request.body);
    } catch (e) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
  }
  static async getNongbuDataCal(ctx) {
    const { monthRangeSelect, monthSelect, jiezhen, searchValue } = ctx.request.body;
    const where = {};
    if (searchValue) {
      if (searchValue.length == 18) {
        where.personID = searchValue;
      } else if (/[\u4e00-\u9fa5]/.test(searchValue)) {
        where.personName = { [Op.substring]: searchValue };
      } else {
        console.log('searchValue==>', searchValue);
      }
    }
    if (jiezhen) {
      where.jiezhen = {
        [Op.or]: jiezhen,
      };
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
    let total = 0;
    await NongbuModel.findAll({
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
  static async getNongbuAllDate(ctx) {
    let months = [];
    await NongbuModel.findAll({
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
  static async getNongbuByJiezhen(ctx) {
    const { monthSelect, monthRangeSelect, status, searchValue } = ctx.request.body;
    const where = {};
    if (monthSelect && monthSelect.length) {
      where.createtime = {
        [Op.between]: [
          getFirstAndLastDayOfMonth(monthSelect)[0],
          getFirstAndLastDayOfMonth(monthSelect)[1],
        ],
      };
    }
    if (monthRangeSelect && monthRangeSelect.length) {
      where.createtime = {
        [Op.between]: getFirstAndLastDayOfMonthFromArray(monthRangeSelect),
      };
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
    if (searchValue) {
      if (searchValue.length == 18) {
        where.personID = searchValue;
      } else if (/[\u4e00-\u9fa5]/.test(searchValue)) {
        where.personName = { [Op.substring]: searchValue };
      } else {
        console.log('searchValue==>', searchValue);
      }
    }
    let total = 0;
    await NongbuModel.findAll({
      where,
      attributes: ['jiezhen', [Sequelize.fn('COUNT', Sequelize.col('jiezhen')), 'count']],
      group: ['jiezhen'],
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
  static async getNongbuCalByMonthAndJiezhen(ctx) {
    const { year, wrongTag, status } = ctx.request.body;
    const where = {};
    if (wrongTag) {
      where.wrongTag = wrongTag;
    }
    if (status) {
      where.status = status;
    }
    if (year) {
      const startDate = new Date(Number(year), 0, 1);
      const endDate = new Date(Number(year) + 1, 0, 1);
      where.createtime = {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      };
    }
    console.log('where====>', where);
    try {
      const result = await NongbuModel.findAll({
        where,
        attributes: [
          [Sequelize.fn('MONTH', Sequelize.col('createtime')), 'month'], // 提取月份
          [Sequelize.fn('COUNT', Sequelize.col('jiezhen')), 'count'], // 统计街镇数量
          'jiezhen', // 包含街镇名称的字段
        ],
        group: [Sequelize.fn('MONTH', Sequelize.col('createtime')), 'jiezhen'], // 按月份和街镇分组
      });

      console.log(result);
      ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '获得数据', result);
    } catch (error) {
      console.error('统计查询失败:', error);
    }
  }

  // update
  static async updateNongbuData(ctx) {
    const {
      id,
      personName,
      personID,
      jiezhen,
      status,
      checkoperator,
      reviewoperator,
      chengPayMonth,
      zhenPayMonth,
      note,
      wrongTag,
      repeatTimes,
      originalFile,
      cancelUnemp,
      applyDate,
    } = ctx.request.body;
    const params = {};
    if (personID) {
      params.personID = personID;
    }
    if (repeatTimes != null) {
      params.repeatTimes = repeatTimes;
    }
    if (applyDate != null) {
      params.applyDate = applyDate;
    }
    if (cancelUnemp != null) {
      params.cancelUnemp = cancelUnemp;
    }
    if (originalFile != null) {
      params.originalFile = originalFile;
    }
    if (wrongTag) {
      params.wrongTag = wrongTag;
    }
    if (chengPayMonth) {
      params.chengPayMonth = chengPayMonth;
    }
    if (zhenPayMonth) {
      params.zhenPayMonth = zhenPayMonth;
    }
    if (personName) {
      params.personName = personName;
    }
    if (checkoperator) {
      params.checkoperator = checkoperator;
    }
    if (reviewoperator) {
      params.reviewoperator = reviewoperator;
    }
    if (status != null) {
      params.status = status;
    }
    if (status != null) {
      params.note = note;
    }
    if (jiezhen) {
      params.jiezhen = jiezhen;
    }

    try {
      await NongbuModel.update(params, {
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
module.exports = NongbuController;
