const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a category title"],
    trim: true,
  },
  subTitle: {
    type: String,
    trim: true,
  },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
