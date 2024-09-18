import React, { useEffect, useState } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import { Link } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import { AiOutlineArrowRight } from "react-icons/ai";
import { server } from "../server";
import { toast } from "react-toastify";

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  
  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

  const handleOpenDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderId(null);
  };

  const handleCancelOrder = async () => {
    if (selectedOrderId) {
      try {
        const response = await fetch(`${server}/order/update-payment-status/${selectedOrderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Đơn hàng đã được hủy thành công");
          handleCloseDialog();
          dispatch(getAllOrdersOfAdmin());
        } else {
          toast.error(`${data.message}`);
          handleCloseDialog();
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi hủy đơn hàng");
      }
    }
  };
  
  const columns = [
    { field: "id", headerName: "ID Đơn Hàng", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Trạng thái",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        if (params.getValue(params.id, "statusPayment") === "0") {
          return "Đã huỷ";
        }
        return params.getValue(params.id, "status");
      },
      cellClassName: (params) => {
        return params.getValue(params.id, "statusPayment") === "0"
          ? "redColor"
          : params.getValue(params.id, "status") === "Xử lý"
          ? "greenColor"
          : "";
      },
    },
    {
      field: "itemsQty",
      headerName: "Số lượng mặt hàng",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Tổng cộng",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: "Ngày đặt hàng",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        const isCancelled = params.getValue(params.id, "statusPayment") === "0";
        
        return (
          <>
            {!isCancelled ? (
              <>
                <Link to={`/order/${params.id}`}>
                  <Button>
                    <AiOutlineArrowRight size={20} />
                  </Button>
                </Link>
                <Button
                  onClick={() => handleOpenDialog(params.id)}
                  style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
                >
                  Hủy đơn
                </Button>
              </>
            ) : (
              <Button
                disabled
                style={{ marginLeft: "10px", backgroundColor: "gray", color: "white" }}
              >
                Đã huỷ
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: formatPrice(item?.totalPrice) + " đ",
        status: item?.status,
        statusPayment: item?.statusPayment,
        createdAt: item?.createdAt.slice(0,10),
      });
    });

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
          </div>

          <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center">
            <div className="w-[97%] flex justify-center">
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={4}
                disableSelectionOnClick
                autoHeight
              />
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={handleCancelOrder} color="secondary">
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDashboardOrders;
