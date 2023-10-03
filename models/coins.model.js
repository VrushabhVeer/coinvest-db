const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema({
  image: { type: String },
  name: { type: String },
  market_cap: { type: Number },
  change_24hr: { type: Number },
  price: { type: Number },
  quantity: { type: Number },
  total_price: { type: Number },
  userId: { type: String, required: true },
});

const CoinsModel = mongoose.model("boughtCoin", coinSchema);

module.exports = {
  CoinsModel,
};
