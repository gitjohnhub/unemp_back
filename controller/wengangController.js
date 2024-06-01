const BaseController = require('./BaseController');
const wengangModel = require('../model/wengangData');
const log4js = require('../utils/log4js');
const util = require('../utils/util');
const { Op, Sequelize } = require('sequelize');
const { getFirstAndLastDayOfMonthFromArray, getFirstAndLastDayOfMonth } = require('../utils/tools');
const { months } = require('moment');
class wengangController extends BaseController {
  static async getwengangData(ctx) {
    const {
      companyName,
      canbaoCode,
      companyCode,
      companyOnlyCode,
      bankName,
      bankNumber,
      compangBankName,
      noindex,
      contactPerson,
      contactNumber,
      person1,
      person2,
      person3,
      person4,
      person5,
      jfmoney,
      sendPerson,
      searchValue,
      status,
      note,
      companyCategory,
      customOrder
    } = ctx.request.body;
    const order = [['btmoney', 'DESC']];
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
    if (customOrder) {
      order.unshift([customOrder.sortColumn, customOrder.sortRule]);
    }

    if (searchValue) {
      if (/[\u4e00-\u9fa5]/.test(searchValue)) {
        where.companyName = { [Op.substring]: searchValue };
      } else {
        console.log('searchValue==>', searchValue);
      }
    }
    if (sendPerson) {
      where.sendPerson = { [Op.or]: sendPerson };
    }
    if (status) {
      where.status = { [Op.or]: status };
    }
    console.log('where===>', where);
    try {
      const { count, rows } = await wengangModel.findAndCountAll({
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
  static async addwengangData(ctx) {
    log4js.debug('add====>', ctx.request.body);
    try {
      await wengangModel.create(ctx.request.body);
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
  }
  static async getwengangAllDate(ctx) {
    let months = [];
    await wengangModel
      .findAll({
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
  static async getwengangDateCal(ctx) {
    const { monthRangeSelect, monthSelect, searchValue, sendPerson } = ctx.request.body;
    const where = {};
    if (searchValue) {
      if (/[\u4e00-\u9fa5]/.test(searchValue)) {
        where.companyName = { [Op.substring]: searchValue };
      } else {
        console.log('searchValue==>', searchValue);
      }
    }
    let total = 0;
    console.log('wengang where==>', where);
    await wengangModel
      .findAll({
        where,
        attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
        group: ['status'],
      })
      .then((results) => {
        results.forEach((result) => {
          total += result.getDataValue('count');
        });
        results.push({ status: 'total', count: total });
        ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '获得数据', results);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  static async getUnempByJiezhen(ctx) {
    const { monthSelect, monthRangeSelect, status, searchValue, checkoperators } = ctx.request.body;
    const where = {};
    if (checkoperators) {
      where.checkoperator = { [Op.or]: checkoperators };
    }
    if (monthSelect && monthSelect.length) {
      where.createtime = {
        [Op.between]: [
          getFirstAndLastDayOfMonth(monthSelect)[0],
          getFirstAndLastDayOfMonth(monthSelect)[1],
        ],
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
    let total = 0;
    await wengangModel
      .findAll({
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

  // update
  static async updatewengangData(ctx) {
    const { id, contactNumber, contactPerson, note, status, companyToCheck } = ctx.request.body;
    if (companyToCheck != null && companyToCheck != undefined) {
      const updatedCompanies = [];
      const newCompanies = [];
      try {

        for (const companyData of companyToCheck) {
          // 尝试查找是否存在相同的 companyName
          const company = await wengangModel.findOne({
            where: {
              companyName: companyData.companyName
            }
          });

          if (company) {
            // 如果找到了,则更新相应的字段
            await company.update(companyData);
            console.log('wengangModel updated:', company.companyName);
            updatedCompanies.push(company);
          } else {
            // 如果没找到,则创建新的公司记录
            const newCompany = await wengangModel.create(companyData);
            newCompanies.push(newCompany);
          }
        }
      } catch (error) {
        console.error('Error creating/updating companies:', error);
        ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `更新数据异常:${error}`);
      }
      ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, `更新成功`,{
        updatedCompanies,
        newCompanies
      });
    } else {
      const params = {
        contactNumber,
        contactPerson,
        note,
        status,
      };
      console.log('params===>', params);
      try {
        await wengangModel.update(params, {
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

  static async getwengangDataCal(ctx) {
    const wengangData = []
    try {
      // 根据 companyCategory 分类统计数量和 btmoney 总和
      const companyStats = await wengangModel.findAll({
        attributes: [
          'companyCategory',
          [Sequelize.fn('COUNT', Sequelize.col('companyCategory')), 'count'],
          [Sequelize.fn('SUM', Sequelize.literal('CAST(btmoney AS DOUBLE)')), 'btmoneySum']
        ],
        group: ['companyCategory']
      });

      // 统计 status 数量
      const statusCounts = await wengangModel.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']
        ],
        group: ['status']
      });

      // 将结果整合成你要求的格式
      const result = companyStats.map(item => ({
        companyCategory: item.companyCategory,
        count: item.get('count'),
        btmoney: item.get('btmoneySum')
      }));

      wengangData.push({
        companyCategoryStats: result,
        statusCounts: statusCounts.map(item => ({
          status: item.status,
          count: item.get('count')
        }))
      });
    } catch (error) {
      console.error('Error getting company statistics:', error);
      wengangData.push( {
        companyCategoryStats: [],
        statusCounts: []
      });
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, `成功`,wengangData);

  };

}
module.exports = wengangController;
