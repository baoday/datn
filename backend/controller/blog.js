const express = require("express");
const router = express.Router();
const Blog = require("../model/blog");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.post(
  "/create-blog",
  catchAsyncErrors(async (req, res, next) => {
    const { title, description, category, tags, images } = req.body;
    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "blogs",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    const blog = await Blog.create({
      title,
      description,
      category,
      tags,
      images: imagesLinks,
    });

    res.status(201).json({
      success: true,
      blog,
    });
  })
);

router.get(
  "/all-blog",
  catchAsyncErrors(async (req, res, next) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      blogs,
    });
  })
);

router.get(
  "/get-blog/:id",
  catchAsyncErrors(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }
    res.status(200).json({
      success: true,
      blog,
    });
  })
);

router.put(
  "/update-blog/:id",
  catchAsyncErrors(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    const { title, description, category, tags, images } = req.body;

    if (images) {
      let imagesLinks = [];
      for (let i = 0; i < blog.images.length; i++) {
        await cloudinary.v2.uploader.destroy(blog.images[i].public_id);
      }

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "blogs",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      blog.images = imagesLinks;
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.category = category || blog.category;
    blog.tags = tags || blog.tags;

    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  })
);

router.delete(
  '/delete-blog/:id',
  catchAsyncErrors(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(new ErrorHandler('Không tìm thấy bài viết', 404));
    }

    await blog.remove();

    for (let i = 0; i < blog.images.length; i++) {
      await cloudinary.v2.uploader.destroy(blog.images[i].public_id);
    }

    res.status(200).json({
      success: true,
      message: 'Xóa bài viết thành công',
    });
  })
);
router.put(
  "/review",
  catchAsyncErrors(async (req, res, next) => {
    const { user, comment, blogId } = req.body;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    const review = {
      user: user, 
      comment: comment,
    };

    blog.reviews.push(review);

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Review added successfully",
    });
  })
);
router.get(
  "/:id/reviews",
  catchAsyncErrors(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    res.status(200).json({
      success: true,
      reviews: blog.reviews,
    });
  })
);

module.exports = router;
