const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const CoupounCode = require("../model/coupounCode");
const router = express.Router();

router.post(
  "/create-coupon-code",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const isCoupounCodeExists = await CoupounCode.find({
        name: req.body.name,
      });

      if (isCoupounCodeExists.length !== 0) {
        return next(new ErrorHandler("Mã giảm giá đã có!", 400));
      }

      const coupounCode = await CoupounCode.create({
        ...req.body,
        applicableToAllProducts: true, 
      });

      res.status(201).json({
        success: true,
        coupounCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.get(
  "/get-coupon/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCodes = await CoupounCode.findById(req.params.id);

      if (!couponCodes) {
        return next(new ErrorHandler("Coupon không tồn tại!", 404));
      }

      res.status(201).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.delete(
  "/delete-coupon/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findByIdAndDelete(req.params.id);

      if (!couponCode) {
        return next(new ErrorHandler("Coupon code không tồn tại!", 400));
      }

      res.status(201).json({
        success: true,
        message: "Coupon code đã xoá thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
router.get(
  "/get-all-coupon",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCodes = await CoupounCode.find({});  
      
      res.status(200).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findOne({ name: req.params.name });

      if (!couponCode || !couponCode.applicableToAllProducts) {
        return next(new ErrorHandler("Mã giảm giá không tồn tại hoặc không áp dụng cho toàn bộ sản phẩm", 400));
      }

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
