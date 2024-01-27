require('dotenv').config();

const mongoose = require('mongoose');
const URI = process.env.MONGO_URI;



mongoose.connect(URI)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
