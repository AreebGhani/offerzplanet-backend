const express = require("express");
const ErrorHandler = require("./middleware/error");
const api = express();
const router = express.Router();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const serverless = require("serverless-http");
// connect db
const connectDatabase = require("./db/Database");
connectDatabase();
require("dotenv").config({
  path: ".env",
});

api.use(cors({
  origin: 'https://offerzplanet.vercel.app',
  credentials: true
}));

api.use(express.json());
api.use(cookieParser());
api.use("/static", express.static(path.join(__dirname, "./uploads")));
api.use("/", (req, res) => {
  res.send("Hello world!");
});
api.use('/.netlify/functions/', router);
api.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const categories = require("./controller/categories");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");
const brands = require("./controller/brands");
const sponsors = require("./controller/sponsors");
const config = require("./controller/config");

api.use("/api/user", user);
api.use("/api/conversation", conversation);
api.use("/api/message", message);
api.use("/api/order", order);
api.use("/api/shop", shop);
api.use("/api/product", product);
api.use("/api/categories", categories);
api.use("/api/event", event);
api.use("/api/coupon", coupon);
api.use("/api/payment", payment);
api.use("/api/withdraw", withdraw);
api.use("/api/brands", brands);
api.use("/api/sponsors", sponsors);
api.use("/api/config", config);

// it's for ErrorHandling
api.use(ErrorHandler);

module.exports.handler = serverless(api);
