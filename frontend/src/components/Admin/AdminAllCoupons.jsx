import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";

const AdminAllCoupon = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [value, setValue] = useState(null);
  const dispatch = useDispatch();

 useEffect(() => {
  setIsLoading(true);
  axios
    .get(`${server}/coupon/get-all-coupon`, {
      withCredentials: true,
    })
    .then((res) => {
      setIsLoading(false);
      setCoupons(res.data.couponCodes);
    })
    .catch((error) => {
      setIsLoading(false);
      toast.error("Lỗi khi lấy dữ liệu coupon: " + error.message);
    });
}, [dispatch]);


  const handleDelete = async (id) => {
    axios
      .delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success("Mã giảm giá đã được xóa thành công!");
        window.location.reload();
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          maxAmount,
          value,
          applicableToAllProducts: true,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Mã giảm giá đã được tạo thành công!");
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const columns = [
    { field: "id", headerName: "ID Mã", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Mã Giảm Giá",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Phần Trăm",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Xoá",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  coupons &&
    coupons.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.value + " %",
        sold: 10,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Tạo Mã Giảm Giá</span>
            </div>
          </div>
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-4">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">
                Tạo Mã Giảm Giá
                </h5>
                <form onSubmit={handleSubmit} aria-required={true}>
                  <br />
                  <div>
                    <label className="pb-2">
                      Tên Mã <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nhập tên mã phiếu giảm giá của bạn..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">
                    Phần trăm giảm giá{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={value}
                      required
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Nhập giá trị mã phiếu giảm giá của bạn..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Số tiền tối thiểu</label>
                    <input
                      type="number"
                      name="minAmount"
                      value={minAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="Số tiền tối thiểu..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Số tiền tối đa</label>
                    <input
                      type="number"
                      name="maxAmount"
                      value={maxAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Số tiền tối đa..."
                    />
                  </div>
                  <br />
                  <br />
                  <div>
                    <input
                      type="submit"
                      value="Tạo Mã"
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AdminAllCoupon;
