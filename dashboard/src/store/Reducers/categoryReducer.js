import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const categoryAdd = createAsyncThunk(
    'category/categoryAdd',
    async ({ name, image }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('image', image);
            const { data } = await api.post('/category-add', formData, { withCredentials: true });
            console.log(data)
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// export const get_category = createAsyncThunk(
//     'category/get_category',
//     async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
//         try {
//             const { data } = await api.get(`/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true });
//             return fulfillWithValue(data);
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );

export const categoryReducer = createSlice({
    name: 'category',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        categories: [],
        totalCategory: 0,
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(categoryAdd.pending, (state) => {
                state.loader = true;
            })
            .addCase(categoryAdd.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
        //     .addCase(categoryAdd.fulfilled, (state, { payload }) => {
        //         state.loader = false;
        //         state.successMessage = payload.message;
        //         state.categories.push(payload.category); // Sử dụng push để thêm danh mục mới
        //     })
        //     .addCase(get_category.pending, (state) => {
        //         state.loader = true; // Thêm trạng thái pending cho get_category
        //     })
        //     .addCase(get_category.rejected, (state, { payload }) => {
        //         state.loader = false;
        //         state.errorMessage = payload.error; // Thêm xử lý lỗi cho get_category
        //     })
        //     .addCase(get_category.fulfilled, (state, { payload }) => {
        //         state.loader = false; // Đặt loader về false khi hoàn thành
        //         state.totalCategory = payload.totalCategory;
        //         state.categories = payload.categories; // Cập nhật danh sách danh mục
        //     });
    },
});

export const { messageClear } = categoryReducer.actions;
export default categoryReducer.reducer;
