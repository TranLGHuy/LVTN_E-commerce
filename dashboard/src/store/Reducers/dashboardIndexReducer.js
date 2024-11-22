import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'

export const get_seller_dashboard_index_data = createAsyncThunk(
    'dashboardIndex/get_seller_dashboard_index_data',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/seller/get-dashboard-index-data`, { withCredentials: true })
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_admin_dashboard_index_data = createAsyncThunk(
    'dashboardIndex/get_admin_dashboard_index_data',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/admin/get-dashboard-index-data`, { withCredentials: true })
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const dashboardIndexReducer = createSlice({
    name: 'dashboardIndex',
    initialState: {
        totalSale: 0,
        totalOrder: 0,
        totalProduct: 0,
        totalPendingOrder: 0,
        totalSeller: 0,
        recentOrders: [],
        recentMessage: [],
        dailyRevenueData: [],
        revenueString: "",
        ordersString: '',
        ordersByMonth: {},
        ordersByProvinceString: "", 
        orderStatusString: '', 
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [get_seller_dashboard_index_data.fulfilled] : (state,{payload})=>{
            state.totalSale = payload.totalSale
            state.totalOrder = payload.totalOrder
            state.totalProduct = payload.totalProduct
            state.totalPendingOrder = payload.totalPendingOrder
            state.recentOrders = payload.recentOrders
            state.recentMessage = payload.messages
        },
        [get_admin_dashboard_index_data.fulfilled] : (state,{payload})=>{
            state.totalSale = payload.totalSale
            state.totalOrder = payload.totalOrder
            state.totalProduct = payload.totalProduct
            state.totalSeller = payload.totalSeller
            state.recentOrders = payload.recentOrders
            state.recentMessage = payload.messages
            state.dailyRevenueData = payload.revenueLast10Days
            state.revenueString = payload.revenueString
            if (payload.ordersString) {
                const monthOrders = payload.ordersString
                  .split(', ') // Tách chuỗi thành mảng từng tháng
                  .reduce((acc, monthString) => {
                    const [monthName, orderCount] = monthString.split(': ');
                    const monthNumber = parseInt(monthName.replace('Tháng ', '').trim());
                    const orders = parseInt(orderCount.replace(' đơn', '').trim());
                    acc[monthNumber] = orders; 
                    return acc;
                  }, {});
        
                state.ordersByMonth = monthOrders;
                console.log(monthOrders)
            }
            if (payload.ordersByProvinceString) {
                state.ordersByProvinceString = payload.ordersByProvinceString;
                console.log(payload.ordersByProvinceString); // Hiển thị chuỗi đơn hàng theo tỉnh thành
            }
            if (payload.orderStatusString) {
                state.orderStatusString = payload.orderStatusString;  // Lưu trữ chuỗi trạng thái đơn hàng
                console.log(payload.orderStatusString);  // In ra orderStatusString
            }
        },
        
    }

})
export const { messageClear } = dashboardIndexReducer.actions
export default dashboardIndexReducer.reducer