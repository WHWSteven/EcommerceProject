const mongoose = require("mongoose");

const VALID_BRANDS = ["Nike", "Adidas", "Puma", "New Balance", "Converse"];
const VALID_TYPES = ["Sneakers", "Running", "Casual"];


const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, enum: VALID_BRANDS },
    type: { type: String, required: true, enum: VALID_TYPES },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true, trim: true },
    sizes: {
      type: [String],
      default: [],
      validate: {
        validator: arr => Array.isArray(arr),
        message: "sizes must be an array of strings"
      }
    },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = {
  Product,
  VALID_BRANDS,
  VALID_TYPES
};
