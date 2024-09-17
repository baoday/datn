const express = require("express");
const { isAuthenticated} = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const User = require("../model/user");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    
    
    try {
      const userId = req.body.userId;
      const user = await User.findById(userId);
      console.log(user);
      
      if (!user) {
        return next(new ErrorHandler("User Id is invalid!", 400));
      } else {
        let images = [];

        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }
      
        const imagesLinks = [];
      
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });
      
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      
        const productData = req.body;
        productData.images = imagesLinks;
        productData.userId = user._id;
        productData.userName = user.name;

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
router.post(
  "/create-product-staff",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.body.userId;
      const user = await Shop.findById(userId);
      console.log(user);
      
      if (!user) {
        return next(new ErrorHandler("Nhân viên không hợp lệ!", 400));
      } else {
        let images = [];

        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }
      
        const imagesLinks = [];
      
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });
      
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      
        const productData = req.body;
        productData.images = imagesLinks;
        productData.userId = user._id;
        productData.userName = user.name;

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
router.get( 
  "/get-product/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id).select("-postedBy");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm",
        });
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


router.delete(
  "/delete-user-product/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Không tìm thấy sản phẩm có id này", 404));
      }

      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }

      await Product.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Đã xóa sản phẩm thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);


router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      console.log(products, "167")
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            rev.rating = rating;
            rev.comment = comment;
            rev.user = user;
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Đã nhận xét thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
router.put(
  "/update-product/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        name,
        description,
        category,
        originalPrice,
        discountPrice,
        stock,
        images,
      } = req.body;

      let product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm",
        });
      }

      if (images) {
        for (let i = 0; i < product.images.length; i++) {
          await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        product.images = images;
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.originalPrice = originalPrice || product.originalPrice;
      product.discountPrice = discountPrice || product.discountPrice;
      product.stock = stock || product.stock;

      await product.save();

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  })
);


module.exports = router;
