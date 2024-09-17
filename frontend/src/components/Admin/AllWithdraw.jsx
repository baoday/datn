import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus,setWithdrawStatus] = useState('Processing');
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "ID Yêu cầu", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Tên Người Yêu Cầu",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "shopId",
      headerName: "ID Người Yêu Cầu",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "amount",
      headerName: "Số tiền",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      type: "text",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "createdAt",
      headerName: "Yêu cầu lúc",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: " ",
      headerName: "Cập nhật trạng thái",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => {

        return (
          <BsPencil
            size={20}
            className={`${params.row.status !== "Processing" ? 'hidden' : '' } mr-5 cursor-pointer`}
            onClick={() => setOpen(true) || setWithdrawData(params.row)}
          />
        );
      },
    },
  ];

  const handleSubmit = async () => {
    if (!withdrawData) return;

    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
          status: withdrawStatus,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Yêu cầu rút tiền đã được cập nhật thành công!");
        setData(res.data.withdraws);
        setOpen(false);
      })
      .catch((err) => {
        toast.error("Không thể cập nhật yêu cầu rút tiền!");
      });
  };



  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        amount: formatPrice(item.amount) + " đ",
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      });
    });
  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-[25px] text-center font-Poppins">
            Cập nhật trạng thái Rút tiền
            </h1>
            <br />
            <select
              name=""
              id=""
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className="w-[200px] h-[35px] border rounded"
            >
              <option value={withdrawStatus}>{withdrawData.status}</option>
              <option value={withdrawStatus}>Thành công</option>
            </select>
            <button
              type="submit"
              className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
              onClick={handleSubmit}
            >
              Cập nhật
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
