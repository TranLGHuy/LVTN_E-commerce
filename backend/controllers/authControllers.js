const adminModel = require('../models/admin')
const sellerModel = require('../models/seller')
const sellerCustomerModel = require('../models/chat/sellerCustomerModel')
const bcrypt = require('bcrypt')
const {formidable} = require('formidable')
const cloudinary = require('cloudinary').v2
const { responseReturn } = require('../utiles/response')
const { createToken } = require('../utiles/tokenCreate')
class authControllers {
    admin_login = async (req, res) => {
        const { email, password } = req.body
        try {
            const admin = await adminModel.findOne({ email }).select('+password')
            if (admin) {
                const match = await bcrypt.compare(password, admin.password)
                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role
                    })
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    responseReturn(res, 200, { token, message: 'Login success' })
                } else {
                    responseReturn(res, 404, { error: "Password wrong" })
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" })
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    seller_login = async (req, res) => {
        const { email, password } = req.body
        try {
            const seller = await sellerModel.findOne({ email }).select('+password')
            if (seller) {
                const match = await bcrypt.compare(password, seller.password)
                if (match) {
                    const token = await createToken({
                        id: seller.id,
                        role: seller.role
                    })
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    responseReturn(res, 200, { token, message: 'Login success' })
                } else {
                    responseReturn(res, 404, { error: "Password wrong" })
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" })
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    seller_register = async (req, res) => {
        const { email, name, password } = req.body
        try {
            const getUser = await sellerModel.findOne({ email })
            if (getUser) {
                responseReturn(res, 404, { error: 'Email alrady exit' })
            } else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    method: 'manually',
                    shopInfo: {}
                })
                await sellerCustomerModel.create({
                    myId: seller.id
                })
                const token = await createToken({ id: seller.id, role: seller.role })
                res.cookie('accessToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })
                responseReturn(res, 201, { token, message: 'register success' })
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' })
        }
    }

    getUser = async (req, res) => {
        const { id, role } = req;

        try {
            if (role === 'admin') {
                const user = await adminModel.findById(id)
                responseReturn(res, 200, { userInfo: user })
            } else {
                const seller = await sellerModel.findById(id)
                responseReturn(res, 200, { userInfo: seller })
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' })
        }
    }

    profile_image_upload = async (req, res) => {
        const { id } = req;
        const form = formidable({ multiples: true });
        form.parse(req, async (err, _, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                return responseReturn(res, 500, { error: 'Error parsing form data' });
            }
    
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });
    
            const image = files.image[0];
            if (!image || !image.filepath) {
                console.error('No image file provided');
                return responseReturn(res, 400, { error: 'No image file provided' });
            }
    
            try {
    
                // Tải hình ảnh mới lên Cloudinary
                const result = await cloudinary.uploader.upload(image.filepath, { folder: 'profile' });
                if (result) {
                    // Cập nhật URL của hình ảnh mới vào cơ sở dữ liệu
                    await sellerModel.findByIdAndUpdate(id, { image: result.url });
                    const updatedUserInfo = await sellerModel.findById(id);
                    return responseReturn(res, 201, { message: 'Image upload success', userInfo: updatedUserInfo });
                } else {
                    return responseReturn(res, 404, { error: 'Image upload failed' });
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                return responseReturn(res, 500, { error: error.message });
            }
        });
    };
    profile_info_add = async (req, res) => {
        const { city, address, shopName, phoneNumber } = req.body;
        const { id } = req;

        try {
            await sellerModel.findByIdAndUpdate(id, {
                shopInfo: {
                    shopName,
                    phoneNumber,
                    address,
                    city
                }
            })
            const userInfo = await sellerModel.findById(id)
            responseReturn(res, 201, { message: 'Profile info add success', userInfo })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
}
module.exports = new authControllers()