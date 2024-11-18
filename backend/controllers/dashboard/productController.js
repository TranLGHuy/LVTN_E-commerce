const {formidable} = require('formidable')
const cloudinary = require('cloudinary').v2
const productModel = require('../../models/productModel');
const { responseReturn } = require('../../utiles/response');
class productController {
    add_product = async (req, res) => {
        const { id } = req;
        const form = formidable({ multiples: true });

        form.parse(req, async (err, field, files) => {
            // Ép kiểu các trường thành chuỗi và loại bỏ khoảng trắng thừa
            let name = String(field.name[0]).trim();
            let category = String(field.category[0]).trim();
            let description = String(field.description[0]).trim();
            let brand = String(field.brand[0]).trim();
            let { stock, price, discount } = field;
            let shopName = String(field.shopName[0]).trim();
            const { images } = files;

            const slug = name.split(' ').join('-');

            // Kiểm tra xem tất cả dữ liệu cần thiết có hợp lệ không
            if (!name || !category || !description || !brand || !stock || !price || !discount || !shopName || !images || images.length === 0) {
                return responseReturn(res, 400, { error: 'All fields are required, including at least one image.' });
            }

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            try {
                let allImageUrl = [];

                // Chỉ tải lên hình ảnh khi có hình ảnh
                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.uploader.upload(images[i].filepath, { folder: 'products' });
                    allImageUrl.push(result.url); // Thêm URL hình ảnh vào mảng
                }

                // Tạo sản phẩm mới
                await productModel.create({
                    sellerId: id,
                    name,
                    slug,
                    category,
                    shopName,
                    description,
                    stock: parseInt(stock), // Chuyển đổi stock sang số nguyên
                    price: parseInt(price),  // Chuyển đổi price sang số nguyên
                    discount: parseInt(discount), // Chuyển đổi discount sang số nguyên
                    images: allImageUrl,
                    brand
                });
                responseReturn(res, 201, { message: "Product added successfully" });
            } catch (error) {
                responseReturn(res, 500, { error: error.message });
                console.log(error.message);
            }
        });
    }
    products_get = async (req, res) => {
        const { page, searchValue, parPage } = req.query;
        const { id } = req;
    
        try {
            // Xác định số trang cần bỏ qua
            const skipPage = parPage ? parseInt(parPage) * (parseInt(page) - 1) : 0;
    
            // Tạo query để tìm kiếm
            let query = { sellerId: id }; // Đảm bảo rằng sellerId được sử dụng
    
            if (searchValue) {
                // Sử dụng `regex` để tìm kiếm từ khoá xuất hiện ở bất kỳ vị trí nào
                query = {
                    ...query,
                    $or: [
                        { name: { $regex: searchValue, $options: 'i' } },
                        { category: { $regex: searchValue, $options: 'i' } },
                        { brand: { $regex: searchValue, $options: 'i' } },
                        { description: { $regex: searchValue, $options: 'i' } }
                    ]
                };
            }
    
            // Thực hiện truy vấn dựa trên các điều kiện đã xác định
            const products = await productModel.find(query)
                .skip(skipPage)
                .limit(parseInt(parPage) || 0)
                .sort({ createdAt: -1 });
    
            // Tính tổng số sản phẩm
            const totalProduct = await productModel.countDocuments(query);
    
            // Trả về kết quả
            responseReturn(res, 200, { totalProduct, products });
        } catch (error) {
            console.log(error.message);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    };
    

    product_get = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await productModel.findById(productId)
            responseReturn(res, 200, { product })
        } catch (error) {
            console.log(error.message)
        }
    }
    product_update = async (req, res) => {
        let { name, description, discount, price, brand, productId, stock } = req.body;
        name = name.trim()
        const slug = name.split(' ').join('-')
        try {
            await productModel.findByIdAndUpdate(productId, {
                name, description, discount, price, brand, productId, stock, slug
            })
            const product = await productModel.findById(productId)
            responseReturn(res, 200, { product, message: 'product update success' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
            console.log(error.message)
        }
    }
    product_details_get = async (req, res) => {
        try {
            const productId = req.params.productId;
            console.log(productId)
            const product = await productModel.findById(productId); 
            console.log(product)
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            return res.status(200).json(product);
        } catch (error) {
            console.error('Error fetching product details:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
    product_image_update = async (req, res) => {
        const form = formidable({ multiples: true });
        form.parse(req, async (err, field, files) => {   
            if (err) {
                console.error('Form parsing error:', err);
                return responseReturn(res, 500, { error: 'Error parsing form data' });
            }
            const productId = field.productId;
            const oldImage = Array.isArray(field.oldImage) ? field.oldImage[0] : field.oldImage;
            const newImage = files.newImage[0]; 
            if (!newImage || !newImage.filepath) {
                console.error('No image file provided');
                return responseReturn(res, 400, { error: 'No image file provided' });
            }

            if (!productId || !oldImage || !newImage) {
                console.error('Missing required fields:', { productId, oldImage, newImage });
                return responseReturn(res, 400, { error: 'Missing required fields' });
            }
            try {
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                });
    
                console.log('Uploading image to Cloudinary...');
                const result = await cloudinary.uploader.upload(newImage.filepath, { folder: 'products' });
                
                if (result && result.url) {
                    console.log('Cloudinary upload successful:', result.url);
                    
                    let product = await productModel.findById(productId);
                    if (!product) {
                        console.error('Product not found:', productId);
                        return responseReturn(res, 404, { error: 'Product not found' });
                    }
    
                    const index = product.images.findIndex(img => img === oldImage);
                    if (index === -1) {
                        console.error('Old image not found in product images:', oldImage);
                        return responseReturn(res, 404, { error: 'Old image not found in product images' });
                    }
                    const publicId = oldImage.split('/').pop().split('.')[0]; // Lấy public ID từ URL
                    await cloudinary.uploader.destroy(`products/${publicId}`); // Xóa hình ảnh cũ
                    
                    product.images[index] = result.url;
                    await product.save();
    
                    console.log('Product image updated successfully');
                    responseReturn(res, 200, { product, message: 'Product image updated successfully' });
                } else {
                    console.error('Cloudinary upload failed');
                    responseReturn(res, 500, { error: 'Image upload to Cloudinary failed' });
                }
    
            } catch (error) {
                console.error('Error updating product image:', error);
                responseReturn(res, 500, { error: `Error updating product image: ${error.message}` });
            }
        });
    };
    
}

module.exports = new productController()