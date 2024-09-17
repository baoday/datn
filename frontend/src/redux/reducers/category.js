import { createReducer } from "@reduxjs/toolkit";
const initialState = {
  isLoading: true,
  };
  
  export const categoryReducer = createReducer(initialState, {
    categoryCreateRequest: (state) => {
      state.isLoading = true;
    },
    categoryCreateSuccess: (state, action) => {
      state.isLoading = false;
      state.category = action.payload;
      state.success = true;
    },
    categoryCreateFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    },
  
    // get all products of shop
    getAllCategoryRequest: (state) => {
      state.isLoading = true;
    },
    getAllCategorySuccess: (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    },
    getAllCategoryFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  
    // delete product of a shop
    deleteCategoryRequest: (state) => {
      state.isLoading = true;
    },
    deleteCategorySuccess: (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
    },
    deleteCategoryFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  
    // get all products
    getAllCategorysRequest: (state) => {
      state.isLoading = true;
    },
    getAllCategorysSuccess: (state, action) => {
      state.isLoading = false;
      state.allCategories = action.payload;
    },
    getAllCategorysFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    clearErrors: (state) => {
      state.error = null;
    },
  });
  