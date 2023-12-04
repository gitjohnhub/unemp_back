const BaseController = require('./BaseController');
const YanchangModel = require('../model/YanchangData');
const log4js = require('../utils/log4js');
const { getFirstAndLastDayOfMonth, getFirstAndLastDayOfMonthFromArray } = require('../utils/tools');

const util = require('../utils/util');
const { Op, Sequelize } = require('sequelize');
class YanchangController extends BaseController {
  static async getYanchangData(ctx) {
    const {
      personID,
      status,
      jiezhen,
      checkoperator,
      monthSelect,
      monthRangeSelect,
      searchValue,
      noindex,
      originalFile,
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
    if (jiezhen) {
      where.jiezhen = {
        [Op.or]: jiezhen,
      };
    }
    if (originalFile) {
      where.originalFile = originalFile;
    }
    if (monthSelect) {
      where.createtime = {
        [Op.between]: [
          getFirstAndLastDayOfMonth(monthSelect)[0],
          getFirstAndLastDayOfMonth(monthSelect)[1],
        ],
      };
    }
    if (monthRangeSelect) {
      where.createtime = {
        [Op.between]: getFirstAndLastDayOfMonthFromArray(monthRangeSelect),
      };
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
      where.status = status;
    }
    if (checkoperator) {
      where.checkoperator = checkoperator;
    }
    try {
      const { count, rows } = await YanchangModel.findAndCountAll({
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
  static async addYanchangData(ctx) {
    console.log(ctx.request.body);
    try {
      await YanchangModel.create(ctx.request.body);
    } catch (e) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
  }
  static async getYanchangDataCal(ctx) {
    let total = 0;
    await YanchangModel.findAll({
      attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
      group: ['status'],
    })
      .then((results) => {
        results.forEach((result) => {
          total += result.getDataValue('count');
        });
        results.push({
          status: '5',
          count: total,
        });
        ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '获得数据', results);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  static async getYanchangAllDate(ctx) {
    let months = [];
    await YanchangModel.findAll({
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
  static async getYanchangCalByMonthAndJiezhen(ctx) {
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
      const result = await YanchangModel.findAll({
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
  static async getYanchangByJiezhen(ctx) {
    const { monthSelect, status } = ctx.request.body;
    const where = {};
    if (monthSelect) {
      console.log('monthSelect==>,', monthSelect);
      where.createtime = {
        [Op.between]: getFirstAndLastDayOfMonth(monthSelect),
      };
    }
    if (status != null) {
      where.status = status;
    }
    let total = 0;
    await YanchangModel.findAll({
      where,
      attributes: ['jiezhen', [Sequelize.fn('COUNT', Sequelize.col('jiezhen')), 'count']],
      group: ['jiezhen'],
    })
      .then((results) => {
        results.forEach((result) => {
          total += result.getDataValue('count');
        });
        results.push({
          jiezhen: '全部',
          count: total,
        });
        ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '获得数据', results);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // TODO
  static async deleteYanchangData(ctx) {
    const { id } = ctx.request.body;
    try {
      await YanchangModel.update(
        { status: 1 },
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
  static async updateYanchangData(ctx) {
    const {
      id,
      personName,
      personID,
      payMonth,
      jiezhen,
      status,
      checkoperator,
      reviewoperator,
      startDate,
      endDate,
      note,
      originalFile,
      wrongTag,
    } = ctx.request.body;
    console.log('update====>', ctx.request.body);
    const params = {};
    if (personID) {
      params.personID = personID;
    }
    if (wrongTag != null) {
      params.wrongTag = wrongTag;
    }
    if (jiezhen) {
      params.jiezhen = jiezhen;
    }
    if (originalFile != null) {
      params.originalFile = originalFile;
    }
    if (payMonth) {
      params.payMonth = payMonth;
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
    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = endDate;
    }
    if (note) {
      params.note = note;
    }
    try {
      await YanchangModel.update(params, {
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
module.exports = YanchangController;
