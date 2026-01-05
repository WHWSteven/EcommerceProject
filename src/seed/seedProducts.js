// Load environment variables (for MONGO_URI)
require("dotenv").config();

const mongoose = require("mongoose");
const { Product } = require("../models/Product");

// Data from Athletic_Shoe_Information_Table.md (official/retailer direct image URLs)
const PRODUCTS = [
  // Nike
  { name: "Air Force 1 '07", brand: "Nike", type: "Sneakers", price: 110, imageUrl: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png" },
  { name: "Dunk Low Retro", brand: "Nike", type: "Sneakers", price: 110, imageUrl: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/76dcb414-9af1-4b3a-ae4b-08b5a0f77fec/WMNS+NIKE+DUNK+LOW.png" },
  { name: "Pegasus 40", brand: "Nike", type: "Running", price: 130, imageUrl: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/6785ad85-33be-4269-bac1-fa769af96cb4/W+AIR+ZOOM+PEGASUS+41.png" },
  { name: "Infinity Run 4", brand: "Nike", type: "Running", price: 160, imageUrl: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/4f3bf650-45f1-499c-87a5-19ba3e3cc1c7/NIKE+INFINITY+G+NN+%28W%29.png" },
  { name: "Blazer Mid '77", brand: "Nike", type: "Casual", price: 100, imageUrl: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/fb7eda3c-5ac8-4d05-a18f-1c2c5e82e36e/BLAZER+MID+%2777+VNTG.png" },
  { name: "Air Max 90", brand: "Nike", type: "Casual", price: 130, imageUrl: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/0e71bc38-e888-4723-81a0-8b68aacf0a57/AIR+MAX+90.png" },

  // Adidas
  { name: "Superstar", brand: "Adidas", type: "Sneakers", price: 100, imageUrl: "https://img.91app.com/webapi/imagesV3/Original/SalePage/11135165/0/639026835618930000?v=1" },
  { name: "NMD_R1", brand: "Adidas", type: "Sneakers", price: 150, imageUrl: "https://img.91app.com/webapi/imagesV3/Original/SalePage/9414313/0/639032297014430000?v=1" },
  { name: "Ultraboost Light", brand: "Adidas", type: "Running", price: 190, imageUrl: "https://img.91app.com/webapi/imagesV3/Original/SalePage/9997489/0/639032304751100000?v=1" },
  { name: "Adizero Adios Pro 3", brand: "Adidas", type: "Running", price: 250, imageUrl: "https://img.91app.com/webapi/imagesV3/Original/SalePage/10512904/0/639004490977970000?v=1" },
  { name: "Stan Smith", brand: "Adidas", type: "Casual", price: 100, imageUrl: "https://img.91app.com/webapi/imagesV3/Original/SalePage/10340090/0/639032272100530000?v=1" },
  { name: "Gazelle", brand: "Adidas", type: "Casual", price: 100, imageUrl: "https://img.91app.com/webapi/imagesV3/Original/SalePage/10713577/0/639032299152470000?v=1" },

  // Puma
  { name: "RS-X", brand: "Puma", type: "Sneakers", price: 110, imageUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/405731/01/sv01/fnd/PNA/fmt/png/RS-X-Mid-Black-Ice-Mid-Top-Sneakers" },
  { name: "Slipstream", brand: "Puma", type: "Sneakers", price: 90, imageUrl: "https://img.91app.com/webapi/imagesV3/Original/SalePage/9496147/0/639021121638600000?v=1" },
  { name: "Velocity Nitro 3", brand: "Puma", type: "Running", price: 130, imageUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/377748/18/sv01/fnd/PNA/fmt/png/Velocity-NITRO™-3-Men's-Running-Shoes" },
  { name: "Deviate Nitro 2", brand: "Puma", type: "Running", price: 160, imageUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/378948/01/sv01/fnd/PNA/fmt/png/Deviate-NITRO™-Elite-2-Fireglow-Women's-Running-Shoes" },
  { name: "Suede Classic", brand: "Puma", type: "Casual", price: 70, imageUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/399781/07/sv01/fnd/PNA/fmt/png/Suede-Classic-Sneakers" },
  { name: "Palermo", brand: "Puma", type: "Casual", price: 90, imageUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/396463/11/sv01/fnd/PNA/fmt/png/Palermo-Sneakers" },

  // New Balance
  { name: "574 Core", brand: "New Balance", type: "Sneakers", price: 90, imageUrl: "https://nb.scene7.com/is/image/NB/u574skb_nb_02_i?$pdpflexf2MD2x$&qlt=80&fmt=webp&wid=1026&hei=1026" },
  { name: "550", brand: "New Balance", type: "Sneakers", price: 110, imageUrl: "https://nb.scene7.com/is/image/NB/bb550pb1_nb_02_i?$pdpflexf2MD2x$&qlt=80&fmt=webp&wid=1026&hei=1026" },
  { name: "Fresh Foam X 1080v13", brand: "New Balance", type: "Running", price: 165, imageUrl: "https://nb.scene7.com/is/image/NB/m108014f_nb_02_i?$dw_detail_main_lg$&bgc=f1f1f1&layer=1&bgcolor=f1f1f1&blendMode=mult&scale=10&wid=1600&hei=1600" },
  { name: "FuelCell Rebel v4", brand: "New Balance", type: "Running", price: 140, imageUrl: "https://nb.scene7.com/is/image/NB/mfcx4tr_nb_02_i?$pdpflexf2MD2x$&qlt=80&fmt=webp&wid=1026&hei=1026" },
  { name: "327", brand: "New Balance", type: "Casual", price: 100, imageUrl: "https://nb.scene7.com/is/image/NB/ws327glb_nb_02_i?$pdpflexf2MD2x$&qlt=80&fmt=webp&wid=1026&hei=1026" },
  { name: "9060", brand: "New Balance", type: "Casual", price: 150, imageUrl: "https://nb.scene7.com/is/image/NB/u9060etn_nb_02_i?$pdpflexf22x$&qlt=80&fmt=webp&wid=880&hei=880" },

  // Converse
  { name: "Chuck Taylor All Star", brand: "Converse", type: "Sneakers", price: 60, imageUrl: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw4a9e4d7f/images/a_107/M7652_A_107X1.jpg?sw=964&strip=false" },
  { name: "Chuck 70", brand: "Converse", type: "Sneakers", price: 90, imageUrl: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw34a014b4/images/a_107/162050C_A_107X1.jpg?sw=964&strip=false" },
  { name: "Run Star Hike", brand: "Converse", type: "Running", price: 110, imageUrl: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dwb968de2b/images/a_107/168816C_A_107X1.jpg?sw=964&strip=false" },
  { name: "Weapon", brand: "Converse", type: "Running", price: 100, imageUrl: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dwf1d5bfd0/images/a_107/A17934C_A_107X1.jpg?sw=964&strip=false" },
  { name: "One Star Pro", brand: "Converse", type: "Casual", price: 75, imageUrl: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw233b0d49/images/a_107/172950C_A_107X1.jpg?sw=964&strip=false" },
  { name: "Star Player 76", brand: "Converse", type: "Casual", price: 80, imageUrl: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dwa77fde2a/images/a_107/A01608C_A_107X1.jpg?sw=964&strip=false" }
];

const DEFAULT_SIZES = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12", "US 13", "US 14"];

const makeProducts = () =>
  PRODUCTS.map(p => ({
    name: p.name,
    brand: p.brand,
    type: p.type,
    price: p.price,
    imageUrl: p.imageUrl,
    description: `${p.brand} ${p.name} - ${p.type}`,
    sizes: DEFAULT_SIZES
  }));

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ 錯誤：MONGO_URI 未定義！");
      process.exit(1);
    }

    console.log("正在連接到 MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ 已連接到 MongoDB，開始種子資料...");

    await Product.deleteMany({});
    console.log("Cleared existing products.");

    const products = makeProducts();
    const inserted = await Product.insertMany(products);

    console.log(`Seed complete. Inserted ${inserted.length} products.`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exit(1);
  }
};

seed();
