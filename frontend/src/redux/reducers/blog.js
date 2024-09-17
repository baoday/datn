import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  allBlogs: [],
  error: null,
  success: false,
};
console.log("avc")
export const blogReducer = createReducer(initialState, {
  blogCreateRequest: (state) => {
    state.isLoading = true;
  },
  blogCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.allBlogs.push(action.payload);    
    state.success = true;
  },
  blogCreateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  getAllBlogsRequest: (state) => {
    state.isLoading = true;
  },
  getAllBlogsSuccess: (state, action) => {
    state.isLoading = false;
    state.allBlogs = action.payload; 
  },
  getAllBlogsFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  deleteBlogRequest: (state) => {
    state.isLoading = true;
  },
  deleteBlogSuccess: (state, action) => {
    state.isLoading = false;
    state.allBlogs = state.allBlogs.filter((blog) => blog._id !== action.payload);
  },
  deleteBlogFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
});
