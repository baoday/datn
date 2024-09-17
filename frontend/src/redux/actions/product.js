import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });
    let payload = productData;

    const { data, status } = await axios(`${server}/product/create-product`, {
      method: "post",
      data: payload,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (status === 201) {
      toast.success("Sản phẩm đã được tạo thành công!");
    }

    dispatch({ type: "productCreateSuccess", payload: data.product });
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response.data.message,
    });
  }
};
export const createProductStaff = (productData) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });
    let payload = productData;

    const { data, status } = await axios(`${server}/product/create-product-staff`, {
      method: "post",
      data: payload,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
    dispatch({ type: "productCreateSuccess", payload: data.product });
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response.data.message,
    });
  }
};

export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const { data } = await axios.get(`${server}/product/get-product/${id}`);

    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.product, 
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response.data.message,
    });
  }
};



export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest",
    });

    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response.data.message,
    });
  }
};

export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    const { data } = await axios.get(`${server}/product/get-all-products`);
   console.log(data);
    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
    
  } catch (error) {
    console.log(error);
    
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response.data.message,
    });
  }
};
