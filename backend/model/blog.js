const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter your blog title!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your blog description!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your blog category!"],
  },
  tags: {
    type: String,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  reviews: [
    {
      user: {
        type: Object,
      },
      comment: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
