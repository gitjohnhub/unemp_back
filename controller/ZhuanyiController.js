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
      chosenOnlyRelation,
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
    let where = {};
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
    if (personID) {
      where.personID = personID;
    }
    if (payDate) {
      where.payDate = {
        [Op.substring]: payDate,
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
    if (chosenOnlyRelation) {
      where.isOnlyTransferRelation = {
        [Op.or]: chosenOnlyRelation,
      };
    }
    if (isOnlyTransferRelation) {
      where.isOnlyTransferRelation = isOnlyTransferRelation;
    }
    if (checkoperator) {
      where.checkoperator = checkoperator;
    }
    if (searchValue && searchValue.length > 0) {
      where = {};
      if (searchValue.length == 18) {
        where.personID = searchValue;
      } else if (searchValue.length !== 18 && /^[0-9]+$/.test(searchValue)) {
        console.log('pay==>', searchValue);
        where.pay = { [Op.substring]: searchValue };
      } else if (/[\u4e00-\u9fa5]/.test(searchValue)) {
        where.personName = { [Op.substring]: searchValue };
      } else {
        where.personName = '不存在';
      }
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
  static async payAllDataInPayProgress(ctx) {
    log4js.debug('payAll====>', ctx.request.body);
    try {
      // 找出所有 status 值为 2 的记录
      const recordsToUpdate = await ZhuanyiModel.findAll({
        where: {
          status: 2,
        },
      });

      // 更新记录的 status 值为 3
      const updatedRecords = await Promise.all(
        recordsToUpdate.map((record) => {
          record.status = 3;
          return record.save();
        })
      );
      console.log(`成功更新 ${updatedRecords.length} 条记录的状态为 3`);
      ctx.body = BaseController.renderJsonSuccess(
        util.CODE.SUCCESS,
        `成功更新 ${updatedRecords.length} 条记录的状态为 3`,
        `${updatedRecords.length}`
      );
    } catch (error) {
      ctx.body = BaseController.renderJsonFail(
        util.CODE.BUSINESS_ERROR,
        `更新状态时出现错误:${err}`
      );
      console.error('更新状态时出现错误:', error);
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
  static async getZhuanyiAllPayDate(ctx) {
    let months = [];
    await ZhuanyiModel.findAll({
      attributes: [
        [Sequelize.fn('date_format', Sequelize.col('payDate'), '%Y-%m'), 'formattedDate'],
      ],
      group: 'formattedDate',
    })
      .then((results) => {
        results.forEach((result) => {
          months.push(result.getDataValue('formattedDate'));
        });
        console.log('months======>', months);
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
  static async updateZhuanyiArrayData(ctx) {
    const { ZhuanyiToPush } = ctx.request.body;
    const existingUsers = [];
    const updatedUsers = [];
    const unsuccessfulUsers = [];
    for (const zhuanyiData of ZhuanyiToPush) {
      try {
        const existingUser = await ZhuanyiModel.findOne({
          where: {
            personID: zhuanyiData.personID,
            status: {
              [Op.or]: ['0', '1'],
            },
          },
        });
        console.log(`existingUser===>${zhuanyiData.personID}==>${existingUser}`);

        if (existingUser) {
          // 更新已存在的用户
          console.log('existingUser===>', existingUser.pay);
          if (existingUser.pay !== zhuanyiData.pay || existingUser.status !== zhuanyiData.status) {
            await existingUser.update(zhuanyiData);
            console.log('updating===>!!!');

            updatedUsers.push(existingUser);
          } else {
            existingUsers.push(existingUser);
          }
        }
      } catch (err) {
        unsuccessfulUsers.push(zhuanyiData);
        ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `更新数据异常:${err}`);
      }
    }
    try {
      const rows = await ZhuanyiModel.findAll({
        where: {
          status: {
            [Op.or]: ['0', '1'],
          },
          payMonth: '0',
        },
      });
      console.log('rows==>', rows);
      unsuccessfulUsers.push(...rows);
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `查询异常:${err}`);
    }

    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '更新成功', {
      existingUsers,
      updatedUsers,
      unsuccessfulUsers,
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
