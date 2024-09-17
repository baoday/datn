import React from 'react'
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AdminAddProduct from '../components/Admin/AdminCreateProduct'

const AdminCreateProduct = () => {
  return (
    <div>
        <AdminHeader />
        <div className="flex items-center justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <AdminSideBar active={3} />
            </div>
            <div className="w-full justify-center flex">
                <AdminAddProduct />
            </div>
          </div>
    </div>
  )
}

export default AdminCreateProduct