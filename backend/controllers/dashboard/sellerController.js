const sellerModel = require('../../models/seller')
const { responseReturn } = require('../../utiles/response')

class sellerController {
    
    get_seller_request = async (req, res) => {
        const { page, searchValue, parPage } = req.query
        const skipPage = parseInt(parPage) * (parseInt(page) - 1)
        try {
            if (searchValue) {
            } else {
                const sellers = await sellerModel.find({ status: 'pending' }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalSeller = await sellerModel.find({ status: 'pending' }).countDocuments()
                responseReturn(res, 200, { totalSeller, sellers })
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
    get_seller = async (req, res) => {
        const { sellerId } = req.params

        try {
            const seller = await sellerModel.findById(sellerId)
            responseReturn(res, 200, { seller })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    seller_status_update = async (req, res) => {
        const { sellerId, status } = req.body
        try {
            await sellerModel.findByIdAndUpdate(sellerId, {
                status
            })
            const seller = await sellerModel.findById(sellerId)
            responseReturn(res, 200, { seller, message: 'seller status update success' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    

    get_active_sellers = async (req, res) => {
        let { page, searchValue, parPage } = req.query;
        page = parseInt(page) || 1;
        parPage = parseInt(parPage) || 10;
    
        const skipPage = parPage * (page - 1);
    
        try {
            // Initialize the query object with 'active' status
            let query = { status: 'active' };
    
            // If searchValue exists, split it into words and create regex patterns
            if (searchValue) {
                const searchWords = searchValue.trim().split(/\s+/);
                query.$and = searchWords.map(word => ({
                    $or: [
                        { name: { $regex: word, $options: 'i' } },
                        { email: { $regex: word, $options: 'i' } },
                        { 'shopInfo.phoneNumber': { $regex: word, $options: 'i' } },
                        { 'shopInfo.address': { $regex: word, $options: 'i' } },
                    ]
                }));
            }
    
            // Query sellers with pagination and sorting
            const sellers = await sellerModel.find(query)
                .skip(skipPage)
                .limit(parPage)
                .sort({ createdAt: -1 });
    
            // Count the total number of matching active sellers
            const totalSeller = await sellerModel.countDocuments(query);
    
            // Return the paginated and filtered result
            responseReturn(res, 200, { totalSeller, sellers });
        } catch (error) {
            console.log('Error in get_active_sellers: ' + error.message);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    };
    
    get_deactive_sellers = async (req, res) => {
        let { page, searchValue, parPage } = req.query;
        page = parseInt(page) || 1;
        parPage = parseInt(parPage) || 10;
    
        const skipPage = parPage * (page - 1);
    
        try {
            // Initialize the query object with 'active' status
            let query = { status: 'deactive' };
    
            // If searchValue exists, split it into words and create regex patterns
            if (searchValue) {
                const searchWords = searchValue.trim().split(/\s+/);
                query.$and = searchWords.map(word => ({
                    $or: [
                        { name: { $regex: word, $options: 'i' } },
                        { email: { $regex: word, $options: 'i' } },
                        { 'shopInfo.phoneNumber': { $regex: word, $options: 'i' } },
                        { 'shopInfo.address': { $regex: word, $options: 'i' } },
                    ]
                }));
            }
    
            // Query sellers with pagination and sorting
            const sellers = await sellerModel.find(query)
                .skip(skipPage)
                .limit(parPage)
                .sort({ createdAt: -1 });
    
            // Count the total number of matching active sellers
            const totalSeller = await sellerModel.countDocuments(query);
    
            // Return the paginated and filtered result
            responseReturn(res, 200, { totalSeller, sellers });
        } catch (error) {
            console.log('Error in get_deactive_sellers: ' + error.message);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    };
 
}

module.exports = new sellerController()