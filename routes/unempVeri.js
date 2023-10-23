const router = require('koa-router')()
const UnempVeriController = require("../controller/UnempVeriController");
router.prefix('/api')

router.get('/unempVeriAll',UnempVeriController.getUnempVeriData )
router.post('/addUnempVeriData',UnempVeriController.addUnempVeriData )
router.post('/deleteUnempVeriData',UnempVeriController.deleteUnempVeriData )
module.exports = router
