require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routers/users_route");
const paperRouter = require("./routers/paper_route");
const cors = require("cors");
const DB_URL = process.env.DB_URL;

const PORT = process.env.PORT || 3000;
const DB = process.env.DB_URL;

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(paperRouter);

mongoose.connect(DB).then(() => {
    console.log("DB Connection Successful");
}).catch((e) => {
    console.log("Error :", e);
});

app.listen(PORT, () => {
    console.log("server started and running on port " + PORT);
});
