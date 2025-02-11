const router = require('express').Router()
const { authMiddleware } = require('../middlewares/authMiddleware')
const authControllers = require('../controllers/authControllers')
router.post('/admin-login', authControllers.admin_login)
router.get('/get-user', authMiddleware, authControllers.getUser)
router.post('/seller-register', authControllers.seller_register)

router.post('/seller-login', authControllers.seller_login)
router.post('/profile-image-upload',authMiddleware, authControllers.profile_image_upload)
router.post('/profile-info-add',authMiddleware, authControllers.profile_info_add)


router.post('/upload-id-card', authMiddleware, authControllers.upload_id_card);
router.post('/upload-face-image', authMiddleware, authControllers.upload_face_image);
router.get('/logout',authMiddleware,authControllers.logout)
router.post('/change-password', authMiddleware,authControllers.change_password)

module.exports = router