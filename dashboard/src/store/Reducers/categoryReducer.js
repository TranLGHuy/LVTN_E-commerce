import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'
export const categoryAdd = createAsyncThunk(
    'category/categoryAdd',
    async ({ name, image }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('image', image)
            console.log('Fields:', typeof name); // In ra toàn bộ fields
            console.log('Files:', typeof image);
            const { data } = await api.post('/category-add', formData, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_category = createAsyncThunk(
    'category/get_category',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (categoryId, { rejectWithValue, fulfillWithValue }) => {
      try {

        const { data } = await api.delete(`/category-delete/${categoryId}`, { withCredentials: true });
        return fulfillWithValue(data); 
      } catch (error) {
        return rejectWithValue(error.response.data); 
      }
    }
  );

export const categoryReducer = createSlice({
    name: 'category',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        categories: [],
        totalCategory : 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
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
            .addCase(categoryAdd.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.categories.push(payload.category);
            })
            .addCase(get_category.fulfilled, (state, { payload }) => {
                state.totalCategory = payload.totalCategory;
                state.categories = payload.categories;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loader = true;
            })
            .addCase(deleteCategory.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
            })
            .addCase(deleteCategory.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            state.categories = state.categories.filter(category => category.id !== payload.categoryId);
            });
    },
    

})
export const { messageClear } = categoryReducer.actions
export default categoryReducer.reducer