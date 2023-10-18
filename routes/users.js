const router = require('koa-router')()
const UserController = require('../controller/UserController')
router.prefix('/users')

router.get('/', UserController.getUser)
router.post('/addUser', UserController.addUser)

module.exports = router
