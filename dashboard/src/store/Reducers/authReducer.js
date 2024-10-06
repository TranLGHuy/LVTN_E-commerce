import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async (info,{rejectWithValue,fulfillWithValue}) => {
        try {
            const{data} = await api.post('/admin-login',info,{withCredentials: true })
            localStorage.setItem('accessToken',data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const seller_register = createAsyncThunk(
    'auth/seller_register',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            console.log(info)
            const { data } = await api.post('/seller-register', info, { withCredentials: true })
            
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const seller_login = createAsyncThunk(
    'auth/seller_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/seller-login', info, { withCredentials: true })
            console.log(data)
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const authReducer =  createSlice({
    name : 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInfo: ''
    },
    reducers : {
        messageClear: (state,_) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: (builder) => {
        builder.addCase(admin_login.pending, (state,_) => {
          state.loader = true;
        });
        builder.addCase(admin_login.rejected, (state, {payload}) => {
            state.loader = false
            state.errorMessage = payload.error
        });
        builder.addCase(admin_login.fulfilled, (state, {payload}) => {
            state.loader = false
            state.successMessage = payload.message
        });
        builder.addCase(seller_register.pending, (state,_) => {
            state.loader = true;
        });
        builder.addCase(seller_register.rejected, (state, {payload}) => {
            state.loader = false
            state.errorMessage = payload.error
        });
        builder.addCase(seller_register.fulfilled, (state, {payload}) => {
            state.loader = false
            state.successMessage = payload.message
        });
        builder.addCase(seller_login.pending, (state, _) => {
            state.loader = true;
        });
        builder.addCase(seller_login.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload?.error || 'Login failed'; // Kiểm tra payload error
        });
        builder.addCase(seller_login.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            state.token = payload.token;
            // state.role = returnRole(payload.token); // Giải mã role từ token nếu có
        });
        
    }
      
      
})
export const {messageClear} = authReducer.actions
export default authReducer.reducer