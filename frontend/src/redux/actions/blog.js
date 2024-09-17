import axios from "axios";
import { server } from "../../server";

export const createBlog = (title, description, category, tags, images) => async (dispatch) => {
  try {
    dispatch({
      type: "blogCreateRequest",
    });

    const { data } = await axios.post(
      `${server}/blog/create-blog`,
      { title, description, category, tags, images },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({
      type: "blogCreateSuccess",
      payload: data.blog,
    });
  } catch (error) {
    dispatch({
      type: "blogCreateFail",
      payload: error.response.data.message,
    });
  }
};

export const getAllBlogs = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllBlogsRequest" });

    const { data } = await axios.get(`${server}/blog/all-blog`);

    dispatch({ type: "getAllBlogsSuccess", payload: data.blogs });
  } catch (error) {
    dispatch({ type: "getAllBlogsFailed", payload: error.response.data.message });
  }
};
// Get blog by ID
export const getBlogById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getBlogByIdRequest",
    });

    const { data } = await axios.get(`${server}/blog/get-blog/${id}`);

    dispatch({
      type: "getBlogByIdSuccess",
      payload: data.blog,
    });
  } catch (error) {
    dispatch({
      type: "getBlogByIdFailed",
      payload: error.response.data.message,
    });
  }
};

// Update blog
export const updateBlog = (id, title, description, category, tags, images) => async (dispatch) => {
  try {
    dispatch({
      type: "updateBlogRequest",
    });

    const { data } = await axios.put(
      `${server}/blog/update-blog/${id}`,
      { title, description, category, tags, images },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({
      type: "updateBlogSuccess",
      payload: data.blog,
    });
  } catch (error) {
    dispatch({
      type: "updateBlogFailed",
      payload: error.response.data.message,
    });
  }
};

// Delete blog
export const deleteBlog = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteBlogRequest",
    });

    const { data } = await axios.delete(`${server}/blog/delete-blog/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: "deleteBlogSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteBlogFailed",
      payload: error.response.data.message,
    });
  }
};

// Add review to a blog
export const addReview = (user, comment, blogId) => async (dispatch) => {
  try {
    dispatch({
      type: "addReviewRequest",
    });

    const { data } = await axios.put(
      `${server}/blog/review`,
      { user, comment, blogId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({
      type: "addReviewSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "addReviewFailed",
      payload: error.response.data.message,
    });
  }
};

// Get all reviews of a blog
export const getReviews = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getReviewsRequest",
    });

    const { data } = await axios.get(`${server}/blog/${id}/reviews`);

    dispatch({
      type: "getReviewsSuccess",
      payload: data.reviews,
    });
  } catch (error) {
    dispatch({
      type: "getReviewsFailed",
      payload: error.response.data.message,
    });
  }
};
