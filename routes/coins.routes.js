const { Router } = require("express");
const { CoinsModel } = require("../models/coins.model");
const { authentication } = require("../middlewares/authMiddleware");

const coinsRouter = Router();

// GET route for retrieving for logged in users coins
coinsRouter.get("/my_coins/:id", authentication, async (req, res) => {
  try {
    const result = await CoinsModel.find({ userId: req.params.id });
    res.send(result);
  } catch (error) {
    res.json({ message: "Error: " + error.message });
  }
});

// POST route for buying coins
coinsRouter.post("/buy_coins", authentication, async (req, res) => {
  try {
    const {
      image,
      name,
      market_cap,
      change_24hr,
      price,
      quantity,
      total_price,
      userId,
    } = req.body;

    // Create a new coin document and save it
    const coin = new CoinsModel({
      image,
      name,
      market_cap,
      change_24hr,
      price,
      quantity,
      total_price,
      userId,
    });
    await coin.save();

    res.send(coin);
  } catch (error) {
    res.json({ message: "Error: " + error.message });
  }
});

// DELETE route for deleting a specific coin
coinsRouter.delete("/delete_coin/:id", authentication, async (req, res) => {
  try {
    const coinId = req.params.id;

    // Find the coin by its unique _id and remove it
    const deletedCoin = await CoinsModel.findByIdAndDelete(coinId);

    if (!deletedCoin) {
      return res.status(404).json({ message: "Coin not found" });
    }

    res.status(200).json({ message: "Coin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
});

module.exports = { coinsRouter };
