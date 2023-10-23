const router = require('koa-router')()
const UserController = require('../controller/UserController')
router.prefix('/api/users')

router.post('/login', UserController.login)
router.post('/addUser', UserController.addUser)
router.post('/getUsers', UserController.getUsers)

module.exports = router
