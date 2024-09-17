import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { toast } from "react-toastify";
import axios from "axios";
const AdminAddProduct = () => {
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v2/category/get-all-categories"
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      navigate("/admin-products");
      window.location.reload();
    }
  }, [dispatch, error, success]);
  const handlePriceChange = (setter) => (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setter(value);
    } else {
      toast.error("Giá tiền không được là số âm!");
    }
  };

  const handleStockChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setStock(value);
    } else {
      toast.error("Số lượng tồn kho không được là số âm!");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    const newForm = new FormData();

    images.forEach((image) => {
      newForm.append("images", image);
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);

    newForm.append("userId", userId);
    newForm.append("userName", userName);
    dispatch(
      createProduct({
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        userId: userId,
        userName: userName,
        images,
      })
    );
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Thêm Sản Phẩm</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên sản phẩm..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Mô tả <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả sản phẩm..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Danh Mục <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Chọn Danh Mục</option>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option value={cat.title} key={cat._id}>
                  {cat.title}
                </option>
              ))
            ) : (
              <option value="">Loading categories...</option>
            )}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Thẻ</label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Nhập thẻ sản phẩm của bạn..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Giá Gốc</label>
          <input
            type="number"
            name="originalPrice"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handlePriceChange(setOriginalPrice)}
            placeholder="Nhập giá sản phẩm của bạn..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Giá (Sau khi giảm) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="discountPrice"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handlePriceChange(setDiscountPrice)}
            placeholder="Nhập giá sản phẩm của bạn với mức giảm giá..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Sản phẩm tồn kho <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleStockChange}
            placeholder="Nhập kho sản phẩm của bạn..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Tải lên hình ảnh <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((i) => (
                <img
                  src={i}
                  key={i}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
          <br />
          <div>
            <input
              type="submit"
              value="Thêm Sản Phẩm"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;
