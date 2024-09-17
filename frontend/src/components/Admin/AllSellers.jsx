import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/sellers";
import { Link } from "react-router-dom";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllSellers());
  };

  const handleApprove = async (id) => {
    await axios
      .put(`${server}/shop/approve-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast.error("Có lỗi xảy ra!");
      });

    dispatch(getAllSellers());
  };

  const columns = [
    { field: "id", headerName: "ID Nhân Viên", minWidth: 150, flex: 0.7 },

    {
      field: "name",
      headerName: "Họ và Tên",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "address",
      headerName: "Địa chỉ nhân viên",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "joinedAt",
      headerName: "Đã tham gia",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "isApproved",
      headerName: "Phê duyệt",
      type: "boolean",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => {
        return params.value ? (
          <span className="text-green-500">Đã phê duyệt</span>
        ) : (
          <Button onClick={() => handleApprove(params.id)}>
            Phê duyệt
          </Button>
        );
      },
    },
   
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Xóa Nhân Viên",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button onClick={() => setUserId(params.id) || setOpen(true)}>
            <AiOutlineDelete size={20} />
          </Button>
        );
      },
    },
  ];

  const row = [];
  sellers &&
    sellers.forEach((item) => {
      row.push({
        id: item._id,
        name: item?.name,
        email: item?.email,
        joinedAt: item.createdAt.slice(0, 10),
        address: item.address,
        isApproved: item.isApproved,
      });
    });

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">Tất cả nhân viên</h3>
        <div className="w-full min-h-[45vh] bg-white rounded">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Bạn có chắc chắn muốn xóa người dùng này không?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  Huỷ
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() => setOpen(false) || handleDelete(userId)}
                >
                  Xác Nhận
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellers;
