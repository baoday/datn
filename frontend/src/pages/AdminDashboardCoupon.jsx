import React from 'react'
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AdminAllCoupons from "../components/Admin/AdminAllCoupons";

const AdminAllCoupouns = () => {
  return (
    <div>
        <AdminHeader />
        <div className="flex justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={11} />
            </div>
            <div className="w-full justify-center flex">
                <AdminAllCoupons />
            </div>
          </div>
    </div>
  )
}

export default AdminAllCoupouns