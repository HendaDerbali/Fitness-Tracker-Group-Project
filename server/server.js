const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use("/public", express.static("public"));
require("dotenv").config();
app.use(cookieParser(), express.json(), express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
require("./config/mongoose.config");

const ActivityRoutes = require("./routes/activity.route");
const UsersRoutes = require("./routes/user.route");
ActivityRoutes(app);
UsersRoutes(app);
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`>>> Server running on Port: ${port}`);
});