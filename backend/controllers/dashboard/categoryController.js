const categoryModel = require('../../models/categoryModel');
const { responseReturn } = require('../../utiles/response');
const cloudinary = require('cloudinary').v2;
const { formidable } = require('formidable');

class categoryController {

    add_category = async (req, res) => {
        const form = formidable();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 400, { error: 'Error parsing the form' });
            }
    
            console.log('Fields:', fields); // In ra toàn bộ fields
            console.log('Files:', files);
    
            // Truy cập giá trị đầu tiên trong mảng
            let name = String(fields.name[0]).trim(); // Lấy giá trị đầu tiên trong mảng name
            let image = files.image[0]; // Lấy giá trị đầu tiên trong mảng image
    
            // Kiểm tra tệp hình ảnh
            if (!image || !image.filepath) {
                return responseReturn(res, 400, { error: 'Missing required parameter - file' });
            }
    
            const slug = name.split(' ').join('-');
    
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });
    
            try {
                const result = await cloudinary.uploader.upload(image.filepath, { folder: 'categories' });
    
                if (result) {
                    const category = await categoryModel.create({
                        name,
                        slug,
                        image: result.url // Sử dụng URL an toàn
                    });
                    return responseReturn(res, 201, { category, message: 'Category added successfully' });
                } else {
                    return responseReturn(res, 404, { error: 'Image upload failed' });
                }
            } catch (error) {
                console.error(error);
                return responseReturn(res, 500, { error: 'Internal server error' });
            }
        });
    }
    get_category = async (req, res) => {
        const { page, searchValue, parPage } = req.query
        try {
            let skipPage = ''
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1)
            }
            if (searchValue && page && parPage) {
                const categories = await categoryModel.find({
                    $text: { $search: searchValue }
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalCategory = await categoryModel.find({
                    $text: { $search: searchValue }
                }).countDocuments()
                responseReturn(res, 200, { totalCategory, categories })
            }
            else if (searchValue === '' && page && parPage) {
                const categories = await categoryModel.find({}).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalCategory = await categoryModel.find({}).countDocuments()
                responseReturn(res, 200, { totalCategory, categories })
            }
            else {
                const categories = await categoryModel.find({}).sort({ createdAt: -1 })
                const totalCategory = await categoryModel.find({}).countDocuments()
                responseReturn(res, 200, { totalCategory, categories })
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    
}

module.exports = new categoryController();
