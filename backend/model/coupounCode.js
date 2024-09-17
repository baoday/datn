const mongoose = require("mongoose");

const coupounCodeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
      },
      value: {
        type: Number,
        required: true,
      },
      minAmount: {
        type: Number,
        default: 0,  
      },
      maxAmount: {
        type: Number,
        default: Infinity, 
      },
      applicableToAllProducts: {
        type: Boolean,
        default: true,
      },
      selectedProducts: {
        type: [String],  
        default: [], 
      },
      createdAt: {
        type: Date,
        default: Date.now,  
      },
});

module.exports = mongoose.model("CoupounCode", coupounCodeSchema);
