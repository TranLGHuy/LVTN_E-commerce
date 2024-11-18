import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import {jwtDecode} from 'jwt-decode';

export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/admin-login', info, { withCredentials: true })
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
            localStorage.setItem('accessToken', data.token)
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
            const { data } = await api.post('/seller-register', info, { withCredentials: true })
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_user_info = createAsyncThunk(
    'auth/get_user_info',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/get-user', { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const profile_image_upload = createAsyncThunk(
    'auth/profile_image_upload',
    async (image, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/profile-image-upload', image, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const profile_info_add = createAsyncThunk(
    'auth/profile_info_add',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/profile-info-add', info, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const logout = createAsyncThunk(
    'auth/logout',
    async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/logout', { withCredentials: true })
            localStorage.removeItem('accessToken')
            if (role === 'admin') {
                navigate('/admin/login')
            } else {
                navigate('/login')
            }

            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
const returnUserInfo = (token) => {
    if (token) {
        const decodeToken = jwtDecode(token);
        const expireTime = new Date(decodeToken.exp * 1000);
        if (new Date() > expireTime) {
            localStorage.removeItem('accessToken');
            return { role: '', userId: '' }; // Nếu hết hạn, trả về rỗng
        } else {
            return { role: decodeToken.role, userId: decodeToken.id }; // Giả sử ID được lưu dưới thuộc tính 'id'
        }
    } else {
        return { role: '', userId: '' }; // Không có token, trả về rỗng
    }
}

export const upload_id_card = createAsyncThunk(
    'auth/upload_id_card',
    async (id_image, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/upload-id-card', id_image, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            if (error.response) {
                console.error('Error Response 1:', error.response.data);
                return rejectWithValue(error.response.data);
            } else {
                console.error('Error Message:', error.message); 
                return rejectWithValue({ message: 'Network Error' });
            }
        }
    }
);

export const upload_face_image = createAsyncThunk(
    'auth/upload_face_image',
    async (face_image, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/upload-face-image', face_image, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            if (error.response) {
                console.error('Error Response:', error.response.data);
                return rejectWithValue(error.response.data);
            } else {
                console.error('Error Message:', error.message);
                return rejectWithValue({ message: 'Network Error' });
            }
        }
    }
);


export const authReducer =  createSlice({
    name : 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInfo: '',
        role: returnUserInfo(localStorage.getItem(`accessToken`)).role,
        userId: returnUserInfo(localStorage.getItem(`accessToken`)).userId, 
        token: localStorage.getItem(`accessToken`)
    },
    
    reducers : {
        messageClear: (state,_) => {
            state.errorMessage = ""
            state.successMessage = ""
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload; 
        },
    },
    extraReducers: (builder) => {
        builder.addCase(admin_login.pending, (state) => {
            state.loader = true;
        });
        builder.addCase(admin_login.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
        });
        builder.addCase(admin_login.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            state.token = payload.token;
            state.role = returnUserInfo(payload.token);
            state.userInfo = payload.userInfo; 
        });
        
        builder.addCase(seller_register.pending, (state) => {
            state.loader = true; // Set loader to true
        })
        builder.addCase(seller_register.rejected, (state, action) => {
            state.loader = false; // Set loader to false
            state.errorMessage = action.payload.error; // Store the error message
        })
        builder.addCase(seller_register.fulfilled, (state, action) => {
            state.loader = false; 
            state.successMessage = action.payload.message;
            state.token = action.payload.token; 
            state.role = returnUserInfo(action.payload.token); 
        });
    
        builder.addCase(seller_login.pending, (state) => {
            state.loader = true;
        });
        builder.addCase(seller_login.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload?.error || 'Login failed';
        });
        builder.addCase(seller_login.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            state.token = payload.token;
            state.role = returnUserInfo(payload.token);
            state.userInfo = payload.userInfo; 
        });
        builder.addCase(get_user_info.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.userInfo = payload.userInfo; 
             state.role = payload.userInfo.role; 
        });
        builder.addCase(profile_image_upload.pending, (state) => {
            state.loader = true;
        })
        builder.addCase(profile_image_upload.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.userInfo = {
                ...state.userInfo,
                profileImage: payload.userInfo.image,
            };
            state.successMessage = payload.message;
        });
        builder.addCase(profile_info_add.pending, (state) => {
            state.loader = true;
        })
        builder.addCase(profile_info_add.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.userInfo = payload.userInfo;
            state.successMessage = payload.message;
        });
        builder.addCase(upload_id_card.pending, (state) => {
            state.loader = true;
        });
        builder.addCase(upload_id_card.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.userInfo = {
                ...state.userInfo,
                idCardImages: state.userInfo.idCardImages
                    ? {
                          ...state.userInfo.idCardImages,
                          front: payload.userInfo.idCardImages.front,
                          back: payload.userInfo.idCardImages.back,
                      }
                    : {
                          front: payload.userInfo.idCardImages.front,
                          back: payload.userInfo.idCardImages.back,
                      },
            };
            state.successMessage = payload.message;
        });
        
        
        
        builder.addCase(upload_face_image.pending, (state) => {
            state.loader = true;
        });
        builder.addCase(upload_face_image.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.userInfo = {
                ...state.userInfo,
                faceImage: payload.userInfo.faceImage,
            };
            state.successMessage = payload.message;
        });
    }
      
      
})
export const {messageClear} = authReducer.actions
export default authReducer.reducer