import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
const AllProducts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setData(res.data.products);
      });
  }, []);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/product/delete-user-product/${id}`, { withCredentials: true });
      setData(data.filter((item) => item._id !== id));
      toast.success("Đơn hàng đã được xoá!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const columns = [
    { field: "id", headerName: "ID Sản Phẩm", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Tên",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Giá",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Số Lượng",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Bán hết",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Xem",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Sửa",
      flex: 0.5,
      headerName: "",
      minWidth: 80,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/edit-product/${params.id}`}>
          <AiOutlineEdit size={20} className="cursor-pointer" />
        </Link>
      ),
    },
    {
      field: "Xoá",
      flex: 0.5,
      headerName: "",
      minWidth: 80,
      sortable: false,
      renderCell: (params) => (
        <AiOutlineDelete
          size={20}
          className="cursor-pointer text-red-500"
          onClick={() => handleDelete(params.id)}
        />
      ),
    },
  ];

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: formatPrice(item.discountPrice) + " đ",
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default AllProducts;
