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
                    console.error(err)
                    return responseReturn(res, 404, { error: 'Image upload failed' });
                    
                }
            } catch (error) {
                ;
                return responseReturn(res, 500, { error: 'Internal server error' });
            }
        });
    }

    get_category = async (req, res) => {
        const { page, searchValue, parPage } = req.query;
        try {
            // Xác định số trang cần bỏ qua
            let skipPage = '';
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1);
            }
    
            // Tạo query để tìm kiếm
            let query = {};
            if (searchValue) {
                // Sử dụng `regex` để tìm kiếm từ khoá xuất hiện ở bất kỳ vị trí nào
                query = { name: { $regex: searchValue, $options: 'i' } };
            }
    
            // Thực hiện truy vấn dựa trên các điều kiện đã xác định
            const categories = await categoryModel.find(query)
                .skip(skipPage)
                .limit(parseInt(parPage) || 0)
                .sort({ createdAt: -1 });
    
            const totalCategory = await categoryModel.countDocuments(query);
    
            // Trả về kết quả
            responseReturn(res, 200, { totalCategory, categories });
        } catch (error) {
            console.log(error.message);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    };
    
}

module.exports = new categoryController();
