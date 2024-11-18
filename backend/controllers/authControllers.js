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
        const { email, name, password } = req.body;
    
        // Kiểm tra tên không được rỗng
        if (!name || name.trim().length === 0) {
            return responseReturn(res, 400, { error: 'Name is required' });
        }
    
        // Kiểm tra định dạng email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return responseReturn(res, 400, { error: 'Invalid email format' });
        }
    
        // Kiểm tra độ dài mật khẩu
        if (!password || password.length < 6) {
            return responseReturn(res, 400, { error: 'Password must be at least 6 characters long' });
        }
    
        // Kiểm tra mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return responseReturn(res, 400, { 
                error: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
            });
        }
    
        try {
            const getUser = await sellerModel.findOne({ email });
            if (getUser) {
                return responseReturn(res, 404, { error: 'Email already exists' });
            } else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    method: 'manually',
                    shopInfo: {}
                });
                await sellerCustomerModel.create({
                    myId: seller.id
                });
                const token = await createToken({ id: seller.id, role: seller.role });
                res.cookie('accessToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
                responseReturn(res, 201, { token, message: 'Register success' });
            }
        } catch (error) {
            console.error(error);
            responseReturn(res, 500, { error: 'Internal server error' });
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
    logout = async (req, res) => {
        try {
            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true
            });
            responseReturn(res, 200, { message: 'logout success' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    upload_id_card = async (req, res) => {
        const { id } = req;
    
        const form = formidable({ multiples: true }); 
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                return responseReturn(res, 500, { error: 'Error parsing form data' });
            }
            console.log('Parsed files:', files);
    
            if (!files.id_image || !Array.isArray(files.id_image) || files.id_image.length !== 2) {
                return responseReturn(res, 400, { error: 'Two ID card images are required' });
            }
    
            const images = files.id_image; 
    
            // Cấu hình Cloudinary
            cloudinary.config({
                cloud_name: process.env.cloud_name, 
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });
    
            try {
                const uploadPromises = images.map(image =>
                    cloudinary.uploader.upload(image.filepath, { folder: 'id_cards' })
                );
    
                const uploadResults = await Promise.all(uploadPromises);
                const uploadedUrls = uploadResults.map(result => result.url);
                
                await sellerModel.findByIdAndUpdate(id, { idCardImages: uploadedUrls });
                const updatedUserInfo = await sellerModel.findById(id);
    

                if (!updatedUserInfo.idCardImages || updatedUserInfo.idCardImages.length !== 2) {
                    return responseReturn(res, 500, { error: 'Error updating ID card images' });
                }
    
                return responseReturn(res, 201, { message: 'ID card upload success', userInfo: updatedUserInfo });
    
            } catch (error) {
                console.error('Error uploading ID card images:', error);
                return responseReturn(res, 500, { error: error.message });
            }
        });
    };
    
    
    upload_face_image = async (req, res) => {
        const { id } = req;

        const form = formidable({ multiples: false });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                return responseReturn(res, 500, { error: 'Error parsing form data' });
            }

            // In ra để xác nhận các tệp đã nhận
            console.log('Files received:', files);

            if (!files.face_image || !files.face_image[0].filepath) {
                console.error('No face image provided');
                return responseReturn(res, 400, { error: 'No face image provided' });
            }

            const image = files.face_image[0];

            // Cấu hình Cloudinary
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            try {
                const result = await cloudinary.uploader.upload(image.filepath, { folder: 'face_image' });

                if (result) {
                    await sellerModel.findByIdAndUpdate(id, { faceImage: result.url });
                    const updatedUserInfo = await sellerModel.findById(id);
                    return responseReturn(res, 201, { message: 'face image upload success', userInfo: updatedUserInfo });
                } else {
                    return responseReturn(res, 404, { error: 'face image upload failed' });
                }
            } catch (error) {
                console.error('Error uploading face image:', error);
                return responseReturn(res, 500, { error: error.message });
            }
        })
       
    }
}
    

module.exports = new authControllers()