import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    title: "",
    subTitle: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/v2/category/get-category/${id}`, { withCredentials: true });
        console.log(data);        
        setCategory(data.category);
      } catch (error) {
        toast.error("Lỗi khi tìm kiếm thông tin chi tiết về danh mục");
      }
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${server}/category/update-category/${id}`, category, { withCredentials: true });
      toast.success("Đã cập nhật danh mục thành công!");
      navigate("/admin-category");
    } catch (error) {
      toast.error("Lỗi khi cập nhật danh mục");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Sửa Danh Mục</h5>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="pb-2">
            Tên Danh Mục
          </label>
          <input
            type="text"
            name="title"
            value={category.title}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Nhập tên danh mục..."
          />
        </div>
        <div>
          <label className="pb-2">
            Mô tả
          </label>
          <input
            type="text"
            name="subTitle"
            value={category.subTitle}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Nhập mô tả..."
          />
        </div>
        <input
          type="submit"
          value="Cập nhật Danh Mục"
          className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default EditCategory;
