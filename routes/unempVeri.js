const router = require('koa-router')()
const UnempVeriController = require("../controller/UnempVeriController");
const XiechaController = require('../controller/XiechaController');
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

module.exports = router
