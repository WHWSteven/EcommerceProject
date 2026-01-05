const { isDBConnected } = require("../config/db");

const mongoose = require("mongoose");
const { Product, VALID_BRANDS, VALID_TYPES } = require("../models/Product");

const PAGE_SIZE = 9;

exports.getProducts = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({
        Error: {
          Code: "ServiceUnavailable",
          Message: "Database not connected. Please configure MONGO_URI.",
          RequestId: Date.now().toString()
        }
      });
    }

    let { page = 1, brand, type } = req.query;
    page = parseInt(page, 10);

    if (isNaN(page) || page < 1) {
      return res.status(422).json({
        Error: {
          Code: "InvalidParameterValue",
          Message: "Page must be a positive number",
          RequestId: Date.now().toString()
        }
      });
    }

    const filter = {};
    if (brand) {
      const brands = brand.split(";");
      const invalidBrands = brands.filter(b => !VALID_BRANDS.includes(b));

      if (invalidBrands.length > 0) {
        return res.status(422).json({
          Error: {
            Code: "InvalidParameterValue",
            Message: `Invalid brand(s): ${invalidBrands.join(", ")}`,
            RequestId: Date.now().toString()
          }
        });
      }

      filter.brand = { $in: brands };
    }

    if (type) {
      const types = type.split(";");
      const invalidTypes = types.filter(t => !VALID_TYPES.includes(t));

      if (invalidTypes.length > 0) {
        return res.status(422).json({
          Error: {
            Code: "InvalidParameterValue",
            Message: `Invalid type(s): ${invalidTypes.join(", ")}`,
            RequestId: Date.now().toString()
          }
        });
      }

      filter.type = { $in: types };
    }

    const total = await Product.countDocuments(filter);

    if (total === 0) {
      return res.status(404).json({
        Error: {
          Code: "NotFound",
          Message: "No products found",
          RequestId: Date.now().toString()
        }
      });
    }

    const products = await Product.find(filter)
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    res.status(200).json({
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
      products
    });
  } catch (err) {
    next(err);
  }
};
exports.getProductById = async (req, res) => {
  // 🔐 DB guard — MUST be first
  if (!isDBConnected()) {
    return res.status(503).json({
      Error: {
        Code: "ServiceUnavailable",
        Message: "Database not connected. Please configure MONGO_URI.",
        RequestId: Date.now().toString()
      }
    });
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(422).json({
      Error: {
        Code: "InvalidParameterValue",
        Message: "Invalid product ID format",
        RequestId: Date.now().toString()
      }
    });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      Error: {
        Code: "NotFound",
        Message: "Product doesn’t exist",
        RequestId: Date.now().toString()
      }
    });
  }

  res.status(200).json(product);
};
