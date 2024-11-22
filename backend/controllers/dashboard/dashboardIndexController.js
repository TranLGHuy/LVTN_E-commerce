const authorOrder = require('../../models/authOrder')
const customerOrder = require('../../models/customerOrder')
const sellerWallet = require('../../models/sellerWallet')
const myShopWallet = require('../../models/myShopWallet')
const sellerModel = require('../../models/seller')

const adminSellerMessage = require('../../models/chat/adminSellerMessage')
const sellerCustomerMessage = require('../../models/chat/sellerCustomerMessage')
const productModel = require('../../models/productModel')
const moment = require('moment');

const { mongo: { ObjectId } } = require('mongoose')
const { responseReturn } = require('../../utiles/response')

module.exports.get_seller_dashboard_data = async (req, res) => {
    const { id } = req;

    try {
        const totalSale = await sellerWallet.aggregate([
            {
                $match: {
                    sellerId: {
                        $eq: id
                    }
                }
            }, {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ])

        const totalProduct = await productModel.find({
            sellerId: new ObjectId(id)
        }).countDocuments()

        const totalOrder = await authorOrder.find({
            sellerId: new ObjectId(id)
        }).countDocuments()

        const totalPendingOrder = await authorOrder.find({
            $and: [
                {
                    sellerId: {
                        $eq: new ObjectId(id)
                    }
                },
                {
                    delivery_status: {
                        $eq: 'pending'
                    }
                }
            ]
        }).countDocuments()

        const messages = await sellerCustomerMessage.find({
            $or: [
                {
                    senderId: {
                        $eq: id
                    }
                },
                {
                    receiverId: {
                        $eq: id
                    }
                }
            ]
        }).limit(3)

        const recentOrders = await authorOrder.find({
            sellerId: new ObjectId(id)
        }).limit(5)

        responseReturn(res, 200, {
            totalOrder,
            totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            totalPendingOrder,
            messages,
            recentOrders,
            totalProduct
        })
    } catch (error) {
        console.log('get seller dashboard data error ' + error.messages)
    }
}

module.exports.get_admin_dashboard_data = async (req, res) => {
    const { id } = req;

    try {
        // Tính doanh thu trong 10 ngày gần nhất
        const revenueLast10Days = await myShopWallet.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: moment().subtract(10, 'days').startOf('day').toDate(),
                        $lte: moment().endOf('day').toDate()
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    dailyRevenue: { $sum: '$amount' }
                }
            },
            {
                $sort: { _id: -1 }
            }
        ]);

        const revenueString = revenueLast10Days.map(day => `${day._id}: ${day.dailyRevenue}`).join(", ");
       

        // Tổng doanh thu từ myShopWallet
        const totalSale = await myShopWallet.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        // Tổng số sản phẩm
        const totalProduct = await productModel.find({}).countDocuments();

        // Tổng số đơn hàng
        const totalOrder = await customerOrder.find({}).countDocuments();

        // Tổng số người bán
        const totalSeller = await sellerModel.find({}).countDocuments();

        // Các tin nhắn
        const messages = await adminSellerMessage.find({}).limit(3);

        // Các đơn hàng gần đây
        const recentOrders = await customerOrder.find({}).limit(5);

        // Tính số đơn hàng trong tất cả các tháng của năm hiện tại
        const currentYear = moment().year(); // Lấy năm hiện tại
        const monthlyOrders = await customerOrder.aggregate([
            {
                $match: {
                    updatedAt: {
                        $gte: moment().startOf('year').toDate() // Lọc đơn hàng trong năm hiện tại theo trường `updatedAt`
                    }
                }
            },
            {
                $project: {
                    month: { $month: "$updatedAt" } // Lấy tháng từ trường `updatedAt`
                }
            },
            {
                $group: {
                    _id: "$month", // Nhóm theo tháng
                    totalOrders: { $sum: 1 } // Tính tổng số đơn hàng mỗi tháng
                }
            },
            {
                $sort: { _id: 1 } // Sắp xếp theo thứ tự tháng (1-12)
            }
        ]);

        // Chuẩn bị dữ liệu tháng từ 1 đến 12, nếu không có đơn hàng trong tháng thì đặt số 0
        const ordersPerMonth = Array.from({ length: 12 }, (_, index) => {
            const monthData = monthlyOrders.find(order => order._id === index + 1);
            return monthData ? monthData.totalOrders : 0;
        });

        // Tạo chuỗi theo định dạng "Tháng X: Y đơn"
        const ordersString = ordersPerMonth
            .map((orderCount, index) => `Tháng ${index + 1}: ${orderCount} đơn`)
            .join(", ");
        
        // Tính tổng đơn hàng theo province trong trường shippingInfo
        const ordersByProvince = await customerOrder.aggregate([
            {
                $match: {
                    "shippingInfo.province": { $ne: null } // Kiểm tra trường province không rỗng
                }
            },
            {
                $group: {
                    _id: "$shippingInfo.province", // Nhóm theo trường province
                    totalOrders: { $sum: 1 } // Tính tổng số đơn hàng theo mỗi tỉnh
                }
            },
            {
                $sort: { totalOrders: -1 } // Sắp xếp theo tổng số đơn hàng giảm dần
            }
        ]);

        // Tạo chuỗi thông tin đơn hàng theo từng tỉnh thành
        const ordersByProvinceString = ordersByProvince
            .map(order => `${order._id}: ${order.totalOrders} đơn`)
            .join(", ");

        const orderStatusCounts = await authorOrder.aggregate([
            {
                $group: {
                    _id: "$delivery_status",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id",
                    count: 1
                }
            },
            {
                $sort: { status: 1 }
            }
        ]);

        let orderStatusString = "Order Status Counts: ";
        orderStatusCounts.forEach(status => {
            orderStatusString += `${status.status}: ${status.count}, `;
        });
        console.log(orderStatusString)

        // Loại bỏ dấu phẩy thừa ở cuối
        orderStatusString = orderStatusString.slice(0, -2);
        responseReturn(res, 200, {
            totalOrder,
            totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            totalSeller,
            messages,
            recentOrders,
            totalProduct,
            revenueLast10Days,
            revenueString,
            ordersString ,
            ordersByProvinceString,
            orderStatusString
        });

    } catch (error) {
        console.log('get admin dashboard data error ' + error.message);
    } 
};
