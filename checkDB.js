require("dotenv").config();
const mongoose = require("mongoose");
const { Product } = require("./src/models/Product");

const check = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://steven125369:steven125369@cluster0.hxqhuto.mongodb.net/ecommerce?retryWrites=true&w=majority';
    await mongoose.connect(mongoUri);
    console.log("Connected to DB. Fetching products...");

    const products = await Product.find({}).limit(5);
    
    console.log("\n--- Current Products in DB ---");
    products.forEach(p => {
      console.log(`Name: ${p.name}`);
      console.log(`Image: ${p.imageUrl}`);
      console.log("-------------------");
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();



