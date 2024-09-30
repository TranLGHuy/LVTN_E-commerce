const router = require('express').Router()
const {authMiddlewares} = require ('../middlewares/authMiddlewares')
const authClrs = require ('../controllers/authControllers')

router.post('/admin-login', authClrs.admin_login)
router.post('/get-user', authMiddlewares ,authClrs.getUser)

module.exports = router