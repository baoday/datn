import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedWardName, setSelectedWardName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/")
      .then(response => {
        setProvinces(response.data);
      })
      .catch(error => console.error("Lỗi:", error));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then(response => {
          setDistricts(response.data.districts);
          setWards([]); // Clear wards when province changes
          setSelectedProvinceName(response.data.name); // Save province name
        })
        .catch(error => console.error("Lỗi khi tìm kiếm quận:", error));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then(response => {
          setWards(response.data.wards);
          setSelectedDistrictName(response.data.name);
          setSelectedWard(""); 
        })
        .catch(error => console.error("Lỗi khi tải phường:", error));
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedWard) {
      axios.get(`https://provinces.open-api.vn/api/w/${selectedWard}`)
        .then(response => {
          setSelectedWardName(response.data.name); // Save ward name
        })
        .catch(error => console.error("Lỗi khi tải phường:", error));
    }
  }, [selectedWard]);

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN") + " đ";
  };

  const paymentSubmit = () => {
    if (!address1 || !selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error("Vui lòng nhập đầy đủ thông tin giao hàng của bạn!");
    } else {
      const shippingAddress = {
        address1,
        address2,
        zipCode,
        province: selectedProvinceName,
        district: selectedDistrictName,
        ward: selectedWardName,
        fullName: user ? user.name : "",
      phoneNumber: user ? user.phoneNumber : "",
      };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
        user,
      };

      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const shipping = 30000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode.trim(); 
  
    try {
      const response = await axios.get(`${server}/coupon/get-coupon-value/${name}`);
  
      const couponCodeData = response.data.couponCode;
  
      if (couponCodeData) {
        const { value: couponCodeValue } = couponCodeData;
  
        
        const eligiblePrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);
  
        const discountPrice = (eligiblePrice * couponCodeValue) / 100;
        setDiscountPrice(discountPrice);
        setCouponCodeData(couponCodeData);
      } else {
        toast.error("Mã giảm giá không tồn tại!");
      }
  
      setCouponCode("");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi kiểm tra mã giảm giá!");
      console.error(error);
      setCouponCode("");
    }
  };
  

  const discountPercentage = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentage).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            provinces={provinces}
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            districts={districts}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            wards={wards}
            selectedWard={selectedWard}
            setSelectedWard={setSelectedWard}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
            selectedProvinceName={selectedProvinceName}
            selectedDistrictName={selectedDistrictName}
            selectedWardName={selectedWardName}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={formatCurrency(totalPrice)}
            shipping={formatCurrency(shipping)}
            subTotalPrice={formatCurrency(subTotalPrice)}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentage={formatCurrency(discountPercentage)}
          />
        </div>
      </div>
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Đi đến Thanh toán</h5>
      </div>
    </div>
  );
};
const ShippingInfo = ({
  user,
  provinces,
  selectedProvince,
  setSelectedProvince,
  districts,
  selectedDistrict,
  setSelectedDistrict,
  wards,
  selectedWard,
  setSelectedWard,
  address1,
  setAddress1,
  address2,
  setAddress2
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Địa chỉ giao hàng</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Họ và tên đầy đủ</label>
            <input
              type="text"
              value={user && user.name}
              required
              className={`${styles.input} !w-[95%]`}
              readOnly
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Địa chỉ Email</label>
            <input
              type="email"
              value={user && user.email}
              required
              className={`${styles.input}`}
              readOnly
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Số điện thoại</label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
          <label className="block pb-2">Tỉnh/Thành phố</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
          <label className="block pb-2">Quận/Huyện</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedProvince}
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[50%]">
          <label className="block pb-2">Phường/Xã</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              disabled={!selectedDistrict}
            >
              <option value="">Chọn phường/xã</option>
              {wards.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
          <label className="block pb-2">Địa chỉ chi tiết</label>
            <input
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              required
              className={`${styles.input}`}
              placeholder="Số nhà, tên đường"
            />
          </div>
          <div className="w-[50%]">
          
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[100%]">
            <label className="block pb-2">Ghi chú (Tùy chọn)</label>
            <textarea
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className={`${styles.input} resize-none`}
              placeholder="Ghi chú thêm cho đơn hàng"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentage,
}) => {
  return (
    <div className="w-full bg-white rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h5 className="text-[18px] font-[500]">Giá trị đơn hàng</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h5 className="text-[16px] font-[400]">Tổng phụ:</h5>
        <h5 className="text-[16px] font-[400]">{subTotalPrice}</h5>
      </div>
      <div className="flex justify-between">
        <h5 className="text-[16px] font-[400]">Phí vận chuyển:</h5>
        <h5 className="text-[16px] font-[400]">{shipping}</h5>
      </div>
      <div className="flex justify-between border-b pb-3">
        <h5 className="text-[16px] font-[400]">Giảm giá:</h5>
        <h5 className="text-[16px] font-[400]">
          {discountPercentage ? `-${discountPercentage}` : "-"}
        </h5>
      </div>
      <div className="flex justify-between border-b pb-3">
        <h5 className="text-[16px] font-[400]">Tổng cộng:</h5>
        <h5 className="text-[16px] font-[400]">{totalPrice}</h5>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Mã giảm giá"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
          required
          value="Áp dụng mã giảm giá"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Checkout;
