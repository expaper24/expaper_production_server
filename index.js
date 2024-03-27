require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routers/users_route");
const paperRouter = require("./routers/paper_route");
const cors = require("cors");
const uri="mongodb+srv://heyjob_admin:<heyjob>@heyjob.zywq78i.mongodb.net/?retryWrites=true&w=majority&appName=HeyJob"
const PORT = process.env.PORT;
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
