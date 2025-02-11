const categoryModel = require('../../models/categoryModel')
const productModel = require('../../models/productModel')
const queryProducts = require('../../utiles/queryProduct')
const reviewModel = require('../../models/reviewModel')
const moment = require('moment')
const {mongo: {ObjectId}} = require('mongoose')
const {responseReturn} = require('../../utiles/response')
class homeControllers {
    get_categories = async (req, res) => {
        try {
            const categories = await categoryModel.find({})
            responseReturn(res, 200, {categories})
        } catch (error) {
            console.log(error.message)
        }
    }
    formateProduct = (products) => {
        const productArray = [];
        let i = 0;
        while (i < products.length) {
            let temp = []
            let j = i
            while (j < i + 3) {
                if (products[j]) {
                    temp.push(products[j])
                }
                j++
            }
            productArray.push([...temp])
            i = j
        }
        return productArray
    }
    get_products = async (req, res) => {
        try {
            const products = await productModel.find({}).limit(16).sort({createdAt: -1})
        
            const allProduct1 = await productModel.find({}).limit(9).sort({
                createdAt: -1
            })
            const latest_product = this.formateProduct(allProduct1);
            const allProduct2 = await productModel.find({}).limit(9).sort({
                rating: -1
            })
            const topRated_product = this.formateProduct(allProduct2);
            const allProduct3 = await productModel.find({ discount: { $gt: 0 } }) // Lọc những sản phẩm có discount > 0
                .limit(9)
                .sort({ discount: -1 })
            const discount_product = this.formateProduct(allProduct3);

            responseReturn(res, 200, {
                products,
                latest_product,
                topRated_product,
                discount_product
            })
        } catch (error) {
            console.log(error.message)
        }
    }
    get_product = async (req, res) => {
    const { slug } = req.params;
    try {
        const product = await productModel.findOne({ slug });
        const relatedProducts = await productModel.find({
            $and: [
                { _id: { $ne: product.id } },
                { category: { $eq: product.category } }
            ]
        }).limit(20);
        const moreProducts = await productModel.find({
            $and: [
                { _id: { $ne: product.id } },
                { sellerId: { $eq: product.sellerId } }
            ]
        }).limit(3);
        responseReturn(res, 200, {
            product,
            relatedProducts,
            moreProducts
        });
    } catch (error) {
        console.log(error.message);
    }
};

    price_range_product = async (req, res) => {
        try {
            const priceRange = {
                low: 0,
                high: 0
            }
            const products = await productModel.find({}).limit(9).sort({
                createdAt: -1
            })
            const latest_product = this.formateProduct(products);
            const getForPrice = await productModel.find({}).sort({
                'price': 1
            })
            if (getForPrice.length > 0) {
                priceRange.high = getForPrice[getForPrice.length - 1].price
                priceRange.low = getForPrice[0].price
            }
            responseReturn(res, 200, {
                latest_product,
                priceRange
            })
        } catch (error) {
            console.log(error.message)
        }
    }
    query_products = async (req, res) => {
        const parPage = 9
        req.query.parPage = parPage
        try {
            const products = await productModel.find({}).sort({
                createdAt: -1
            })
            const totalProduct = new queryProducts(products, req.query).categoryQuery().searchQuery().priceQuery().ratingQuery().sortByPrice().countProducts();
            
            const result = new queryProducts(products, req.query).categoryQuery().searchQuery().ratingQuery().priceQuery().sortByPrice().skip().limit().getProducts();
            responseReturn(res, 200, {
                products: result,
                totalProduct,
                parPage
            })

        } catch (error) {
            console.log(error.message)
        }
    }
    submit_review = async (req, res) => {
        const { name, rating, review, productId } = req.body;
        try {
            await reviewModel.create({
                productId,
                name,
                rating,
                review,
                date: moment(Date.now()).format('LL')
            });
    
            const reviews = await reviewModel.find({ productId });
            const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
            const productRating = reviews.length ? (totalRating / reviews.length).toFixed(1) : 0;
    
            await productModel.findByIdAndUpdate(productId, { rating: productRating });
            responseReturn(res, 201, { message: "Review Success" });
        } catch (error) {
            console.log(error);
        }
    }
    
    get_reviews = async (req, res) => {
        const { productId } = req.params;
        let pageNo = parseInt(req.query.pageNo);
        const limit = 5;
        const skipPage = limit * (pageNo - 1);
    
        try {
            const getRating = await reviewModel.aggregate([
                { $match: { productId: new ObjectId(productId), rating: { $not: { $size: 0 } } } },
                { $unwind: "$rating" },
                { $group: { _id: "$rating", count: { $sum: 1 } } }
            ]);
    
            const rating_review = Array.from({ length: 5 }, (_, i) => ({ rating: 5 - i, sum: 0 }));
            getRating.forEach(({ _id, count }) => {
                const index = rating_review.findIndex(r => r.rating === _id);
                if (index !== -1) rating_review[index].sum = count;
            });
    
            const reviews = await reviewModel.find({ productId }).skip(skipPage).limit(limit).sort({ createdAt: -1 });
            const totalReview = await reviewModel.countDocuments({ productId });
    
            responseReturn(res, 200, { reviews, totalReview, rating_review });
        } catch (error) {
            console.log(error);
        }
    }
    
}
module.exports = new homeControllers()