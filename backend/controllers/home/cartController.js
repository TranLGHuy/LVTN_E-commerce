const cartModel = require('../../models/cartModel');
const wishlistModel = require('../../models/wishlistModel');
const { responseReturn } = require('../../utiles/response');
const { ObjectId } = require('mongoose').Types;

class cartController {
    add_to_cart = async (req, res) => {
        const { userId, productId, quantity } = req.body;
        try {
            const product = await cartModel.findOne({
                $and: [
                    { productId: { $eq: productId } },
                    { userId: { $eq: userId } }
                ]
            });
            if (product) {
                responseReturn(res, 404, { error: 'Product already added to cart' });
            } else {
                const product = await cartModel.create({ userId, productId, quantity });
                responseReturn(res, 201, { message: 'Add to cart success', product });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    get_cart_products = async (req, res) => {
        const co = 5;
        const { userId } = req.params;
        try {
            const cart_products = await cartModel.aggregate([
                { $match: { userId: { $eq: ObjectId.createFromHexString(userId) } } },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: "_id",
                        as: 'products'
                    }
                },
            ]);
            
            let buy_product_item = 0;
            let calculatePrice = 0;
            let cart_product_count = 0;
    
            // Kiểm tra và lọc sản phẩm hết hàng
            const outOfStockProduct = cart_products.filter(p => p.products[0] && p.products[0].stock < p.quantity);
            for (let i = 0; i < outOfStockProduct.length; i++) {
                cart_product_count += outOfStockProduct[i].quantity;
            }
    
            // Kiểm tra và xử lý sản phẩm còn hàng
            const stockProduct = cart_products.filter(p => p.products[0] && p.products[0].stock >= p.quantity);
            for (let i = 0; i < stockProduct.length; i++) {
                const { quantity } = stockProduct[i];
                cart_product_count += quantity;
                buy_product_item += quantity;
                const product = stockProduct[i].products[0];
                if (product) {
                    const { price, discount } = product;
                    if (discount !== 0) {
                        calculatePrice += quantity * (price - Math.floor((price * discount) / 100));
                    } else {
                        calculatePrice += quantity * price;
                    }
                }
            }
    
            let p = [];
            let unique = [...new Set(stockProduct.map(p => p.products[0].sellerId.toString()))];
            for (let i = 0; i < unique.length; i++) {
                let price = 0;
                for (let j = 0; j < stockProduct.length; j++) {
                    const tempProduct = stockProduct[j].products[0];
                    if (unique[i] === tempProduct.sellerId.toString()) {
                        let pri = tempProduct.discount !== 0 
                            ? tempProduct.price - Math.floor((tempProduct.price * tempProduct.discount) / 100) 
                            : tempProduct.price;
                        pri -= Math.floor((pri * co) / 100);
                        price += pri * stockProduct[j].quantity;
                        p[i] = {
                            sellerId: unique[i],
                            shopName: tempProduct.shopName,
                            price,
                            products: p[i] 
                                ? [...p[i].products, { _id: stockProduct[j]._id, quantity: stockProduct[j].quantity, productInfo: tempProduct }]
                                : [{ _id: stockProduct[j]._id, quantity: stockProduct[j].quantity, productInfo: tempProduct }]
                        };
                    }
                }
            }
    
            responseReturn(res, 200, {
                cart_products: p,
                price: calculatePrice,
                cart_product_count,
                shipping_fee: 20 * p.length,
                outOfStockProduct,
                buy_product_item
            });
        } catch (error) {
            console.log(error.message);
        }
    };
    
    
    delete_cart_product = async (req, res) => {
        const { cart_id } = req.params;
        try {
            await cartModel.findByIdAndDelete(cart_id);
            responseReturn(res, 200, { message: 'Delete success' });
        } catch (error) {
            console.log(error.message);
        }
    };

    quantity_inc = async (req, res) => {
        const { cart_id } = req.params;
        try {
            const product = await cartModel.findById(cart_id);
            const { quantity } = product;
            await cartModel.findByIdAndUpdate(cart_id, { quantity: quantity + 1 });
            responseReturn(res, 200, { message: 'success' });
        } catch (error) {
            console.log(error.message);
        }
    };

    quantity_dec = async (req, res) => {
        const { cart_id } = req.params;
        try {
            const product = await cartModel.findById(cart_id);
            const { quantity } = product;
            await cartModel.findByIdAndUpdate(cart_id, { quantity: quantity - 1 });
            responseReturn(res, 200, { message: 'success' });
        } catch (error) {
            console.log(error.message);
        }
    };

    add_wishlist = async (req, res) => {
        const { slug } = req.body;
        try {
            const product = await wishlistModel.findOne({ slug });
            if (product) {
                responseReturn(res, 404, { error: 'Already added' });
            } else {
                await wishlistModel.create(req.body);
                responseReturn(res, 201, { message: 'Add to wishlist success' });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    get_wishlist = async (req, res) => {
        const { userId } = req.params;
        try {
            const wishlists = await wishlistModel.find({ userId });
            responseReturn(res, 200, { wishlistCount: wishlists.length, wishlists });
        } catch (error) {
            console.log(error.message);
        }
    };

    delete_wishlist = async (req, res) => {
        const { wishlistId } = req.params;
        try {
            const wishlist = await wishlistModel.findByIdAndDelete(wishlistId);
            responseReturn(res, 200, { message: 'Remove success', wishlistId });
        } catch (error) {
            console.log(error.message);
        }
    };
}

module.exports = new cartController();
