import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'
import {jwtDecode} from 'jwt-decode'
export const customer_register = createAsyncThunk(
    'auth/customer_register',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/customer/customer-register', info)
            localStorage.setItem('customerToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const customer_login = createAsyncThunk(
    'auth/customer_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/customer/customer-login', info)
            localStorage.setItem('customerToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const change_password = createAsyncThunk(
    'auth/change_password',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/customer/change-password', info);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

// export const verifyOtp = createAsyncThunk(
//     'auth/verify_otp',
//     async (info, { rejectWithValue, fulfillWithValue }) => {
//         try {
//             const { data } = await api.post('/customer/verify-otp', info);
//             return fulfillWithValue(data);
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );
// export const resendOtp = createAsyncThunk(
//     'auth/resend_otp',
//     async (info, { rejectWithValue, fulfillWithValue }) => {
//         try {
//             const { data } = await api.post('/customer/resend-otp', info);
//             return fulfillWithValue(data);
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );

const decodeToken = (token) => {
    if (token) {
        const userInfo = jwtDecode(token)
        return userInfo
    } else {
        return ''
    }
}

export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        loader: false,
        userInfo: decodeToken(localStorage.getItem('customerToken')),
        errorMessage: '',
        successMessage: ''
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        },
        user_reset: (state, _) => {
           state.userInfo = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(customer_register.pending, (state) => {
                state.loader = true;
            })
            .addCase(customer_register.rejected, (state, { payload }) => {
                state.errorMessage = payload.error;
                state.loader = false;
            })
            .addCase(customer_register.fulfilled, (state, { payload }) => {
                const userInfo = decodeToken(payload.token);
                state.successMessage = payload.message;
                state.loader = false;
                state.userInfo = userInfo;
            })
            .addCase(customer_login.pending, (state) => {
                state.loader = true;
            })
            .addCase(customer_login.rejected, (state, { payload }) => {
                state.errorMessage = payload.error;
                state.loader = false;
            })
            .addCase(customer_login.fulfilled, (state, { payload }) => {
                const userInfo = decodeToken(payload.token);
                state.successMessage = payload.message;
                state.loader = false;
                state.userInfo = userInfo;
            })
            .addCase(change_password.pending, (state) => {
                state.loader = true;
            })
            .addCase(change_password.rejected, (state, { payload }) => {
                state.errorMessage = payload.error;
                state.loader = false;
            })
            .addCase(change_password.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.loader = false;
            })
            // .addCase(verifyOtp.pending, (state) => {
            //     state.loader = true;
            // })
            // .addCase(verifyOtp.rejected, (state, { payload }) => {
            //     state.errorMessage = payload.error;
            //     state.loader = false;
            // })
            // .addCase(verifyOtp.fulfilled, (state, { payload }) => {
            //     state.successMessage = payload.message;
            //     state.loader = false;
            // })
            // .addCase(resendOtp.pending, (state) => {
            //     state.loader = true;
            // })
            // .addCase(resendOtp.rejected, (state, { payload }) => {
            //     state.errorMessage = payload.error;
            //     state.loader = false;
            // })
            // .addCase(resendOtp.fulfilled, (state, { payload }) => {
            //     state.successMessage = payload.message;
            //     state.loader = false;
            // });
    }
    
})

export const { messageClear,user_reset } = authReducer.actions
export default authReducer.reducer