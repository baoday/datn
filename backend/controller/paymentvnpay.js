const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../model/user");
const User = mongoose.model("User");
const Order = mongoose.model("Order"); 
router.get("/get-vnpay", async (req, res) => {
  const vnp_OrderInfo = req.query.vnp_OrderInfo;

  try {
    const userId = vnp_OrderInfo; 

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "0 tìm thấy user" });
    }


    res.redirect("http://localhost:3000/order/success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
