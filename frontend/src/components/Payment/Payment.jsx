import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  CardNumberElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Payment = () => {
  const [orderData, setOrderData] = useState({});
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(2);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [language, setLanguage] = useState("vn");
  const [userId, setUserId] = useState("");
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    if (orderData) {
      setOrderData(orderData);
      setShippingName(orderData?.shippingAddress?.name || "");
      setShippingPhone(orderData?.shippingAddress?.phone || "");
    }
  }, []);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    })
      .format(value)
      .replace("₫", "đ");
  };

  const createOrder = async (paymentInfo) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const order = {
      cart: orderData?.cart,
      shippingAddress: {
        ...orderData?.shippingAddress,
        name: shippingName,
        phone: shippingPhone,
      },
      user: userId,
      totalPrice: orderData?.totalPrice,
      paymentInfo,
    };

    try {
      await axios.post(`${server}/order/create-order`, order, config);
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      navigate("/order/successs");
      toast.success("Đặt hàng thành công!");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Không tạo được đơn hàng");
    }
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      if (payer) {
        const paymentInfo = {
          id: payer.payer_id,
          status: "succeeded",
          type: "Paypal",
        };
        createOrder(paymentInfo);
      }
    });
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/payment/process`,
        { amount: Math.round(orderData?.totalPrice * 100) },
        { headers: { "Content-Type": "application/json" } }
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        const paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
          type: "Credit Card",
        };
        createOrder(paymentInfo);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    navigate("/order/successs");

    // const paymentInfo = {
    //   type: "Thanh Toán Bằng Tiền Mặt",
    // };
    // createOrder(paymentInfo);
  };

  const vnpayPaymentHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`${server}/get-vnpay?vnp_OrderInfo=${userId}`);
      const paymentInfo = {
        type: "VNPAY",
      };
      createOrder(paymentInfo);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Không cập nhật được trạng thái đơn hàng");
    }
  };

    return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
            vnpayPaymentHandler={vnpayPaymentHandler}
            select={select}
            setSelect={setSelect}
            userId={userId}
            orderData={orderData}
            formatCurrency={formatCurrency}
            handleLanguageChange={handleLanguageChange}
            language={language}
            shippingName={shippingName}
            setShippingName={setShippingName}
            shippingPhone={shippingPhone}
            setShippingPhone={setShippingPhone}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} formatCurrency={formatCurrency} />
        </div>
      </div>
    </div>
  );
};


const PaymentInfo = ({
  cashOnDeliveryHandler,
  vnpayPaymentHandler,
  select,
  language,
  handleLanguageChange,
  userId,
  orderData,
  setSelect,
  formatCurrency,
  paymentHandler,
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
            onClick={() => setSelect(2)}
          >
            {select === 2 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Thanh Toán bằng VNPay
          </h4>
        </div>

        {select === 2 ? (
          <div className="w-full flex border-b">
            <form
              className="w-full"
              method="post"
              action="http://localhost:8888/order/create_payment_url"
            >
              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Số Tiền</label>
                  <input
                    required
                    id="amount"
                    name="amount"
                    value={orderData?.totalPrice}
                    className={`${styles.input} !w-[95%] text-[#444]`}
                 hidden
                 />
                  <input
                    value={formatCurrency(orderData?.totalPrice)}
                    className={`${styles.input} !w-[95%] text-[#444]`}
                 
                 />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">Phương Thức</label>
                  <input
                    type="radio"
                    name="bankCode"
                    value=""
                    id="defaultPaymentMethod"
                    checked
                  />
                  Thanh toán qua trang VNPay
                </div>
              </div>
              <div className="form-group flex-language">
                <div className="controls">
                  <label className="radio-inline">
                    <input
                      type="hidden"
                      name="language"
                      value="vn"
                      checked={language === "vn"}
                      onChange={handleLanguageChange}
                    />
                  </label>
                </div>
              </div>
              <input type="hidden" name="userId" value={userId} />
              <input
                type="submit"
                value="Thanh Toán"
                className={`${styles.button} !bg-[#f27a1a] text-[#fff]`}
              />
            </form>
          </div>
        ) : null}

        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
            onClick={() => setSelect(3)}
          >
            {select === 3 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Thanh Toán khi Nhận Hàng
          </h4>
        </div>

        {select === 3 ? (
          <div className="w-full flex border-b">
            <form className="w-full" onSubmit={cashOnDeliveryHandler}>
              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Số Tiền</label>
                  <input
                    required
                    id="amount"
                    name="amount"
                    value={formatCurrency(orderData?.totalPrice)}
                    className={`${styles.input} !w-[95%] text-[#444]`}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">Phương Thức</label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    id="cod"
                    checked
                  />
                  Thanh toán khi nhận hàng
                </div>
              </div>
              <input
                type="submit"
                value="Thanh Toán"
                className={`${styles.button} !bg-[#f27a1a] text-[#fff]`}
              />
            </form>
          </div>
        ) : null}

      </div>
    </div>
  );
};

const CartData = ({ orderData, formatCurrency }) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5">
      <h4 className="text-[18px] font-[600] text-[#000000b1]">
        Thông Tin Đơn Hàng
      </h4>
      <div className="flex flex-col mt-5">
        <div className="flex justify-between py-2">
          <h4 className="text-[#000000a3]">Tổng Số Lượng:</h4>
          <span>{orderData?.cart?.length || 0}</span>
        </div>
        <div className="flex justify-between py-2">
          <h4 className="text-[#000000a3]">Tổng Tiền:</h4>
          <span>{formatCurrency(orderData?.totalPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default Payment;
