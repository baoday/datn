import axios from "axios";
import { server } from "../../server";

export const createCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch({ type: "categoryCreateRequest" });

    if (!categoryData.title || categoryData.title.trim() === "") {
      throw new Error("Title is required");
    }

    const formData = new FormData();
    formData.append("title", categoryData.title);
    formData.append("subTitle", categoryData.subTitle || "");

    categoryData.images.forEach((image) => {
      formData.append("images", image);
    });

    const { data } = await axios.post(`${server}/category/create-category`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({ type: "categoryCreateSuccess", payload: data.category });

  } catch (error) {
    dispatch({
      type: "categoryCreateFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};
