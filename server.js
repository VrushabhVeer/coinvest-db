const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.routes");
const { coinsRouter } = require("./routes/coins.routes");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to coinvest");
});

// Use modularized route handling
app.use("/user", userRouter);
app.use("/coins", coinsRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connection successful");
  } catch (error) {
    console.error(error);
  }
  console.log(`Server is running on port ${port}`);
});
