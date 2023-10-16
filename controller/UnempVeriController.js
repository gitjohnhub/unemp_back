const BaseController = require("./BaseController");
const UnempVeriModel = require('../model/UnempVeriData')
const log4js = require('../utils/log4j');
const util = require('../utils/util');
const { Op } = require("sequelize");
// const { query } = require("../database/dbquery");
class UnempVeriController extends BaseController {
    static async getUnempVeriData(ctx) {
        log4js.debug(ctx.request.query)
        const {personID,personName,startDate}  = ctx.request.query
        const where = {}
        if (personID){
            where.personID = personID;
        }
        if (personName){
            where.personName = personName;
        }
        if(startDate){
            where.createtime= {[Op.gte] :startDate}
        }
        const {page,skipIndex} = util.pager(ctx.request.query)
        // log4js.debug(`page:${page.pageNum},skipindex:${skipIndex}`);
        try{
            const {count,rows} = await UnempVeriModel.findAndCountAll({
                where,
                order: [['createtime', 'DESC']],
                offset: skipIndex,
                limit: page.pageSize
            })
            ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS,'查询成功', {
                page:{
                    ...page,
                    count
                },
                rows
            })
        }catch(err){
            ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR,`查询异常:${err}`)
        }

    }
}
module.exports = UnempVeriController
