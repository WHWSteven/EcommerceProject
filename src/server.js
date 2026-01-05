const cors = require("cors");
require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const path = require("path");


const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// 404 fallback for unsupported routes
app.use((req, res) => {
  res.status(404).json({
    Error: {
      Code: "NotFound",
      Message: "Route not found",
      RequestId: Date.now().toString()
    }
  });
});


const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
