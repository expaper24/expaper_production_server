

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routers/users_route");
const paperRouter = require("./routers/paper_route");
const bcrypt = require('bcrypt');
const User = require('./models/user');

const PORT = process.env.PORT || 3000; // Set default port to 3000 if not provided in .env
const DB = process.env.DB_URL;

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(paperRouter);

mongoose.connect(DB).then(() => {
    console.log("DB Connection Successful");
}).catch((e) => {
    console.log("Error :", e);
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username exists
        const user = await User.findOne({ username });

        if (!user) {
            // Username not found
            return res.status(400).send('Incorrect username or password');
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            // Incorrect password
            return res.status(400).send('Incorrect username or password');
        }

        // Login successful, redirect to another page
        res.redirect('/dashboard'); // Change '/dashboard' to your desired redirect URL
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log("Server started and running on port " + PORT);
});

