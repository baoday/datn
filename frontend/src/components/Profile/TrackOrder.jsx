import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      {" "}
      <>
        {data && data?.status === "Xử lý" ? (
          <h1 className="text-[20px]">Đơn hàng của bạn đang được xử lý tại cửa hàng.</h1>
        ) : data?.status === "Transferred to delivery partner" ? (
          <h1 className="text-[20px]">
           Đơn hàng của bạn đang trên đường chuyển đến đối tác giao hàng.
          </h1>
        ) : data?.status === "Đang vận chuyển" ? (
          <h1 className="text-[20px]">
           Đơn hàng của bạn đang trên đường vận chuyển bởi đối tác giao hàng của chúng tôi.
          </h1>
        ) : data?.status === "Received" ? (
          <h1 className="text-[20px]">
           Đơn hàng của bạn đang ở thành phố của bạn. Nhân viên giao hàng của chúng tôi sẽ giao hàng.
          </h1>
        ) : data?.status === "On the way" ? (
          <h1 className="text-[20px]">
            Nhân viên giao hàng của chúng tôi sẽ giao đơn hàng của bạn.
          </h1>
        ) : data?.status === "Đã giao hàng" ? (
          <h1 className="text-[20px]">Đơn hàng của bạn đã được giao!</h1>
        ) : data?.status === "Processing refund" ? (
          <h1 className="text-[20px]">Đang xử lý hoàn tiền cho bạn!</h1>
        ) : data?.status === "Refund Success" ? (
          <h1 className="text-[20px]">Việc hoàn tiền của bạn đã thành công!</h1>
        ) : null}
      </>
    </div>
  );
};

export default TrackOrder;
