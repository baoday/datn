import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminAddCategory = () => {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const newForm = {
      images,
      title,
      subTitle,
    };

    try {
      const { data } = await axios.post(`http://localhost:8000/api/v2/category/create-category`, newForm, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Đã tạo danh mục thành công!");
      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Thêm Danh Mục</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Tên Danh Mục<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={title}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tên danh mục..."
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
              value="Thêm Danh Mục"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={loading}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminAddCategory;
