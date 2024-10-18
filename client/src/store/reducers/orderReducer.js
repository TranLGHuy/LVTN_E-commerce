import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const place_order = createAsyncThunk(
    'order/place_order',
    async ({ price, products, shipping_fee, shippingInfo, userId, navigate, items }) => {
        try {
            const { data } = await api.post('/home/order/place-order', {
                price,
                products,
                shipping_fee,
                shippingInfo,
                userId,
                items,
                delivery_status: 'pending'
            });
            navigate('/payment', {
                state: {
                    price: price + shipping_fee,
                    items,
                    orderId: data.orderId,
                },
            });
            console.log(data);
            return true;
        } catch (error) {
            console.log(error.response);
        }
    }
);

export const get_orders = createAsyncThunk(
    'order/get_orders',
    async ({ customerId, status }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/get-orders/${customerId}/${status}`);
            return data;
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response);
        }
    }
);

export const get_order = createAsyncThunk(
    'order/get_order',
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/get-order/${orderId}`);
            return data;
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response);
        }
    }
);

export const orderReducer = createSlice({
    name: 'order',
    initialState: {
        myOrders: [],
        errorMessage: '',
        successMessage: '',
        myOrder: {},
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_orders.fulfilled, (state, { payload }) => {
                state.myOrders = payload.orders;
            })
            .addCase(get_order.fulfilled, (state, { payload }) => {
                state.myOrder = payload.order;
            })
            .addCase(get_orders.rejected, (state, { payload }) => {
                state.errorMessage = payload?.message || 'Failed to load orders';
            })
            .addCase(get_order.rejected, (state, { payload }) => {
                state.errorMessage = payload?.message || 'Failed to load order';
            });
    },
});

export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;
