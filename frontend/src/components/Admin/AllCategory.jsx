import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { DataGrid } from "@material-ui/data-grid";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllCategories = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${server}/category/get-all-categories`, { withCredentials: true });
      setData(res.data.categories);
    } catch (error) {
      toast.error("Lỗi khi tìm kiếm danh mục");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/category/delete-category/${id}`, { withCredentials: true });
      toast.success("Đã xóa danh mục thành công");
      fetchCategories(); 
    } catch (error) {
      toast.error("Lỗi khi xóa danh mục");
    }
  };

  const columns = [
    { field: "id", headerName: "ID Danh Mục", minWidth: 150, flex: 0.7 },
    { field: "title", headerName: "Tên", minWidth: 150, flex: 1.4 },
    {
      field: "edit",
      headerName: "Sửa",
      minWidth: 100,
      flex: 0.6,
      renderCell: (params) => (
        <Link to={`/edit-category/${params.row.id}`}>
          <AiOutlineEdit size={20} className="cursor-pointer" color="#555" />
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Xoá",
      minWidth: 100,
      flex: 0.6,
      renderCell: (params) => (
        <AiOutlineDelete
          size={20}
          className="cursor-pointer text-red-500"
          onClick={() => handleDelete(params.row.id)}
        />
      ),
    },
  ];

  const rows = data.map((item) => ({
    id: item._id,
    title: item.title,
  }));

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default AllCategories;
