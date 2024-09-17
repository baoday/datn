import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {  AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
   axios.get(`${server}/event/admin-all-events`, {withCredentials: true}).then((res) =>{
    setEvents(res.data.events);
   })
  }, []);
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const columns = [
    { field: "id", headerName: "ID Sản phẩm", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Tên",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Giá",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Số lượng",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Bán hết",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Xem",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}?isEvent=true`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  events &&
    events.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: formatPrice(item.discountPrice) + " đ",
        Stock: item.stock,
        sold: item.sold_out,
      });
    });

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default AllEvents;
