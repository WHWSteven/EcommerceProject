const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById
} = require("../controllers/productController");

router.get("/", getProducts);

router.get("/details/:id", getProductById);

module.exports = router;
