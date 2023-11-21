const BaseController = require('./BaseController');
const BlacklistModel = require('../model/BlacklistData');
const log4js = require('../utils/log4js');
const util = require('../utils/util');
const { Op, Sequelize } = require('sequelize');
function getFirstAndLastDayOfMonth(dateString) {
  const [year, month] = dateString.split('-');
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  return [firstDay.toISOString().slice(0, 10), lastDay.toISOString().slice(0, 10)];
}
class BlacklistController extends BaseController {
  static async getBlacklistData(ctx) {
    const {
      personID,
      personName,
      source,
      status,
      checkoperator,
      isDeleted,
      pay,
      payMonth,
      noindex,
      searchValue,
      searchDate,
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
    if (pay) {
      where.pay = pay;
    }
    if (payMonth) {
      where.payMonth = payMonth;
    }
    if (searchDate) {
      // pageOptions = {};
      where.createtime = {
        [Op.between]: [
          getFirstAndLastDayOfMonth(searchDate)[0],
          getFirstAndLastDayOfMonth(searchDate)[1],
        ],
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
    if (isDeleted) {
      where.isDeleted = isDeleted;
    }
    if (personName) {
      where.personName = personName;
    }

    if (status != null) {
      where.status = status;
    }

    if (checkoperator) {
      where.checkoperator = checkoperator;
    }
    try {
      const { count, rows } = await BlacklistModel.findAndCountAll({
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
  static async addBlacklistData(ctx) {
    try {
      await BlacklistModel.create(ctx.request.body);
      ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
    } catch (e) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
  }

  static async getBlacklistAllDate(ctx) {
    let months = [];
    await BlacklistModel.findAll({
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
  static async getBlacklistDataCal(ctx) {
    let total = 0;
    await BlacklistModel.findAll({
      where: {
        isDeleted: '1',
      },
      attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
      group: ['status'],
    })
      .then((results) => {
        results.forEach((result) => {
          total += result.getDataValue('count');
        });
        results.push({
          status: '8',
          count: total,
        });
        ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '获得数据', results);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // TODO

  static async deleteBlacklistData(ctx) {
    // log4js.debug(ctx.request.body);
    const { id } = ctx.request.body;
    try {
      await BlacklistModel.update(
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
  static async updateBlacklistData(ctx) {
    const {
      id,
      personName,
      personID,
      source,
      status,
      note,
      checkoperator,
      reviewoperator,
      isDeleted,
      pay,
      payMonth,
    } = ctx.request.body;
    const params = {
      personName,
      personID,
      source,
      status,
      note,
      checkoperator,
      reviewoperator,
      isDeleted:isDeleted !== null ? isDeleted : undefined,
      pay,
      payMonth,
    };
    try {
      await BlacklistModel.update(params, {
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
module.exports = BlacklistController;
