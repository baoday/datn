const express = require("express");
const router = express.Router();
const Category = require("../model/category");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
router.post(
  "/create-category",
  catchAsyncErrors(async (req, res, next) => {
    try {

      let images = req.body.images || [];
      if (typeof images === "string") {
        images = [images];
      }

      if (!images.length) {
        return next(new ErrorHandler("No images provided", 400));
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

      const { title, subTitle } = req.body;
      if (!title || title.trim() === "") {
        return next(new ErrorHandler("Title is required", 400));
      }

      const newCategory = await Category.create({
        title,
        subTitle,
        images: imagesLinks,
      });

      res.status(201).json({
        success: true,
        category: newCategory,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);


router.get(
  "/get-all-categories",
  catchAsyncErrors(async (req, res, next) => {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      categories,
    });
  })
);

router.get(
  "/get-category/:id",
  catchAsyncErrors(async (req, res, next) => {
    console.log(req.params.id);
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  })
);

router.put(
  "/update-category/:id",
  catchAsyncErrors(async (req, res, next) => {
    console.log(req.body);
    const { title, subTitle, image_Url } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { title, subTitle, image_Url },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category: updatedCategory,
    });
  })
);

router.delete(
  "/delete-category/:id",
  catchAsyncErrors(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  })
);


module.exports = router;
