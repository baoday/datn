import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { server } from "../../server";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${server}/product/get-product/${id}`, { withCredentials: true });
        setName(data.product.name);
        setDescription(data.product.description);
        setCategory(data.product.category);
        setTags(data.product.tags);
        setOriginalPrice(data.product.originalPrice);
        setDiscountPrice(data.product.discountPrice);
        setStock(data.product.stock);
        setImages(data.product.images);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${server}/category/get-all-categories`, { withCredentials: true });
        setCategories(data.categories);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm danh mục:", error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      name,
      description,
      category,
      tags: tags.split(", "),
      originalPrice,
      discountPrice,
      stock,
      images,
    };

    try {
      await axios.put(`${server}/product/update-product/${id}`, updatedProduct, { withCredentials: true });
      toast.success("Sản phẩm đã cập nhật thành công!");
      navigate("/admin-products");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files.map(file => URL.createObjectURL(file)));
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Cập Nhật Sản Phẩm</h5>
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
              <option value="">Đang tải...</option>
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
            name="price"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
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
            name="price"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
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
            name="price"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
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
              images.map((image) => (
                <img
                  src={image.url}
                  key={image.url}
                  alt="HungDev"
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
        </div>
        <br />
        <div>
          <input
            type="submit"
            value="Cập Nhật Sản Phẩm" 
            className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
