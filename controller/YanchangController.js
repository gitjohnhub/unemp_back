const BaseController = require('./BaseController');
const YanchangModel = require('../model/YanchangData');
const log4js = require('../utils/log4js');
const util = require('../utils/util');
const { Op,Sequelize } = require('sequelize');
class YanchangController extends BaseController {
  static async getYanchangData(ctx) {
    const {
      personID,
      status,
      jiezhen,
      checkoperator,
      monthSelect,
      searchValue,
      noindex
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
    if (jiezhen) {
      where.jiezhen = jiezhen;
    }
    if (monthSelect){
      console.log(monthSelect)
      where.createtime = { [Op.between]: [monthSelect[0].slice(0,10),monthSelect[1].slice(0,10)] };
    }
    if (searchValue) {
      if (searchValue.length == 18){
        where.personID = searchValue;
      }else if (/[\u4e00-\u9fa5]/.test(searchValue)) {
        where.personName = { [Op.substring]: searchValue };
      }else{
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
  static async addYanchangData(ctx) {
    console.log(ctx.request.body)
    try {
      await YanchangModel.create(ctx.request.body);
    } catch (e) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
  }
  static async getYanchangDataCal(ctx) {
    let total = 0
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
          count: total
        })
        ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '获得数据',results);

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
      status,
      checkoperator,
      reviewoperator,
      startDate,
      endDate,
      note,
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
    if (checkoperator) {
      params.checkoperator = checkoperator;
    }
    if (reviewoperator) {
      params.reviewoperator = reviewoperator;
    }
    if (status) {
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
