import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${server}/order/get-order/${id}`, { withCredentials: true });
        setOrder(response.data.order);
        setStatus(response.data.order.status);
      } catch (error) {
        toast.error("Không thể lấy thông tin chi tiết đơn hàng");
      }
    };

    fetchOrder();
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    const savedPhoneNumber = localStorage.getItem("phoneNumber");
    if (savedPhoneNumber) setPhoneNumber(savedPhoneNumber);
    if (savedUserName) setUserName(savedUserName);
  }, []);

  const orderUpdateHandler = async () => {
    try {
      await axios.put(
        `${server}/order/update-order-status/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Đơn hàng đã được cập nhật!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const refundOrderUpdateHandler = async () => {
    try {
      await axios.put(
        `${server}/order/order-refund-success/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Đơn hàng đã được cập nhật!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!order) return <div>Đang tải...</div>;

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Chi tiết đơn hàng</h1>
        </div>
        <div>
          <div className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}>
            Danh sách
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">Mã đơn hàng: <span>#{order._id.slice(0, 8)}</span></h5>
        <h5 className="text-[#00000084]">Đặt vào lúc: <span>{new Date(order.createdAt).toLocaleDateString()}</span></h5>
      </div>

      <br />
      <br />
      {order.cart.map((item, index) => (
        <div key={index} className="w-full flex items-start mb-5">
          <img src={item.images[0]?.url} alt="" className="w-[80px] h-[80px]" />
          <div className="w-full">
            <h5 className="pl-3 text-[20px]">{item.name}</h5>
            <h5 className="pl-3 text-[20px] text-[#00000091]">
              {formatCurrency(item.discountPrice)} x {item.qty} ₫
            </h5>
          </div>
        </div>
      ))}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Tổng giá: <strong>{formatCurrency(order.totalPrice)}</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Thông tin giao hàng:</h4>
          <h4 className="pt-3 text-[20px]">
            Họ và Tên: {order.shippingAddress.fullName}
          </h4>
          <h4 className="pt-3 text-[20px]">
            Số điện thoại: 0{order.shippingAddress.phoneNumber}
          </h4>
          <h4 className="pt-3 text-[20px]">
            Địa chỉ: {order.shippingAddress.address1}
          </h4>
          <h4 className="pt-3 text-[20px]">
            Ghi Chú: {order.shippingAddress.address2}
          </h4>
          <h4 className="pt-3 text-[20px]">
            Tỉnh/Thành Phố: {order.shippingAddress.province}
          </h4>
          <h4 className="pt-3 text-[20px]">
            Quận/Huyện: {order.shippingAddress.district}
          </h4>
          <h4 className="pt-3 text-[20px]">
            Phường/Xã: {order.shippingAddress.ward}
          </h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Thông tin thanh toán:</h4>
          <h4>Trạng thái: {order.paymentInfo.status ? order.paymentInfo.status : "Chưa thanh toán"}</h4>
        </div>
      </div>
      <br />
      <br />
      <h4 className="pt-3 text-[20px] font-[600]">Trạng thái đơn hàng:</h4>
      {order.status !== "Đang xử lý hoàn tiền" && order.status !== "Hoàn tiền thành công" && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {["Xử lý", "Đang vận chuyển", "Đã giao hàng"]
            .slice(
              ["Xử lý", "Đang vận chuyển", "Đã giao hàng"].indexOf(order.status)
            )
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
        </select>
      )}
      {order.status === "Đang xử lý hoàn tiền" || order.status === "Hoàn tiền thành công" ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {["Đang xử lý hoàn tiền", "Hoàn tiền thành công"]
            .slice(
              ["Đang xử lý hoàn tiền", "Hoàn tiền thành công"].indexOf(order.status)
            )
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
        </select>
      ) : null}

      <div
        className={`${styles.button} mt-5 !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px]`}
        onClick={order.status !== "Đang xử lý hoàn tiền" ? orderUpdateHandler : refundOrderUpdateHandler}
      >
        Cập Nhật
      </div>
    </div>
  );
};

export default OrderDetails;
