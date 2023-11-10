const router = require('koa-router')()
const UnempVeriController = require("../controller/UnempVeriController");
const XiechaController = require('../controller/XiechaController');
const ZhuanyiController = require('../controller/ZhuanyiController');
const ProvinceController = require('../controller/ProvinceController');
router.prefix('/api')

// 失业金
router.post('/unempVeriAll',UnempVeriController.getUnempVeriData )
router.post('/addUnempVeriData',UnempVeriController.addUnempVeriData )
router.post('/deleteUnempVeriData',UnempVeriController.deleteUnempVeriData )
router.post('/updateUnempVeriData',UnempVeriController.updateUnempVeriData )

// 外省市协查
router.post('/getXiechaData',XiechaController.getXiechaData )
router.post('/addXiechaData',XiechaController.addXiechaData )
router.post('/updateXiechaData',XiechaController.updateXiechaData )

// 转移
router.post('/getZhuanyiData',ZhuanyiController.getZhuanyiData )
router.post('/addZhuanyiData',ZhuanyiController.addZhuanyiData )
router.post('/updateZhuanyiData',ZhuanyiController.updateZhuanyiData )
router.post('/getZhuanyiDataCal',ZhuanyiController.getZhuanyiDataCal )
//地区数据
router.post('/getProvinceData',ProvinceController.getProvinceData )

module.exports = router
