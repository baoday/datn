import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
      style={{
        backgroundImage:
          "url(https://wallpaperaccess.com/full/530368.jpg)",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#ffffff] font-[600] capitalize`}
        >
          Siêu Giảm Giá <br /> cho năm 2024.
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#ffffffba]">
          Siêu giảm giá cho năm 2024. Sản Phẩm Chính Hãng Giá Tốt Nhất Thị Trường,
          <br /> Sự hài lòng của khách hàng chính là động lực giúp ShopO không ngừng hoàn thiện,
          <br/> mang lại ngày càng nhiều giá trị tích cực cho cộng đồng.   
        </p>
        <Link to="/products" className="inline-block">
            <div className={`${styles.button} mt-5`}>
                 <span className="text-[#000] font-[Poppins] text-[18px]">
                   Mua Ngay
                 </span>
            </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
