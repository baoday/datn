import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt=""
          />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <div>
            <img
              src={`${seller.avatar?.url}`}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
