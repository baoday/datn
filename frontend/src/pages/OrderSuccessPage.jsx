import React, { useEffect, useState } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "react-lottie";
import animationData from "../Assests/animations/107043-success.json";
import axios from "axios";
import { server } from "../server";
import { toast } from "react-toastify";

// cal API o day luon kieu gi no cx thanh cong

const OrderSuccessPage = () => {
  const createOrder = async (paymentInfo) => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    const storedUserId = localStorage.getItem("userId");

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const order = {
      cart: orderData?.cart,
      shippingAddress: {
        ...orderData?.shippingAddress,
        name: orderData?.shippingAddress?.name || "",
        phone: orderData?.shippingAddress?.phone || "",
      },
      user: storedUserId,
      totalPrice: orderData?.totalPrice,
      paymentInfo,
    };
    try {
      await axios.post(`${server}/order/create-order`, order, config);
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      toast.success("Đặt hàng thành công!");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Không tạo được đơn hàng");
    }
  };
  useEffect(() => {
    const paymentInfo = {
      type: "Thanh Toán VNPay",
    };
    createOrder(paymentInfo);
  }, []);

  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
        Đơn hàng của bạn đã thành công 😍
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;
