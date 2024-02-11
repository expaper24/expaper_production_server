const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { createToken, validateToken } = require("../jwt");
const sendMail = require("../mail");
const { getResetPasswordHtml } = require("../htmlTemplate");
const isUserAdmin = require("../middleware");

const userRouter = express.Router();

userRouter.post("/api/register", async (req, res) => {
    try {
        if (!req.body.username || !req.body.email || !req.body.password) return res.status(400).json({ status: "failed", message: "Please ENter all fields" })
        let userExists = await User.findOne({ username: req.body.username.trim() });
        if (userExists) {
            return res.status(400).json({
                "status": "failed",
                "message": "Username already taken"
            });
        }
        userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({
                "status": "failed",
                "message": "Account exists with this mail"
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password.trim(), 10);

        const user = await User.create({
            username: req.body.username.trim(),
            email: req.body.email.trim(),
            password: hashedPassword,
        });

        const hashedUsername = await bcrypt.hash(req.body.username, 10);

        user.verification_code = hashedUsername;
        await user.save();

        sendMail(req.body.username, req.body.email, hashedUsername, res, true);
    }
    catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error.message,
        });
    }
});

userRouter.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
        res.status(400).json({
            "status": "failed",
            "message": "User Does Not Exist"
        });
        return;
    }
    if (user.is_verified == false) {
        res.status(400).json({
            "status": "failed",
            "message": "User Not Verified ! Please Verify Your Email"
        });
        return;
    }
    const dbPassword = user.password;
    bcrypt.compare(password, dbPassword).then(async (match) => {
        if (match) {
            const accessToken = createToken(user);
            user.jwt_token = accessToken;
            await user.save();
            res.json({
                "status": "success",
                "message": "User Logged In",
                "data": {
                    "id_token": accessToken,
                    "user": user,
                }
            });
        }
        else {
            res.status(400).json({
                "status": "failed",
                "message": "Incorrect Password"
            });
        }
    }).catch((e) => {
        res.status(400).json({
            "status": "failed",
            "message": e.message
        });
    });
});


userRouter.get("/api/verify", async (req, res) => {
    try {
        const user = await User.findOne({ verification_code: req.query.id });
        if (!user) {
            return res.status(200).send("<center><h1>User already verified</h1></center>");
        }
        user.is_verified = true;
        user.verification_code = null;
        await user.save();
        res.send(`
        <!DOCTYPE html>
        <head>
        <title>Successfully Verified</title>
        </head>
        <body>
            <center>
            <h1>Email Verified Successfully</h1>
            </center>
        </body>
        </html>
        `)
    }
    catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message,
        });
    }
});

userRouter.post("/api/verifyJWT", async (req, res) => {
    try {
        const token = req.body.token;
        const user = await User.findOne({ jwt_token: token });
        if (!user) return res.status(200).json({ "user": null });
        return res.status(200).json({
            "status": "success",
            "user": user
        });
    }
    catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message,
        });
    }
});

userRouter.patch("/api/logout", validateToken, async (req, res) => {
    try {
        const user = req.user;
        user.jwt_token = null;
        await user.save();
        return res.status(200).json({
            "status": "success",
            "message": "Logged Out Succesfully",
        });
    }
    catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message,
        });
    }
});


userRouter.get("/api/reset", async (req, res) => {
    try {
        const id = req.query.id;
        const user = await User.findOne({ verification_code: id });
        if (!user) {
            return res.send("<center><h1>Link Expired</h1></center>")
        }
        const temp = getResetPasswordHtml(user.username);
        res.send(temp);
    }
    catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message,
        });
    }
});

userRouter.post("/api/changePass", async (req, res) => {
    try {
        const { username, newPassword } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.send("<center><h1>Link Expired</h1></center>")
        }
        user.verification_code = null;
        const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
        user.password = hashedPassword;
        await user.save();
        res.json({
            status: "success",
            message: "Password Changed Successfully"
        });
    }
    catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message,
        });
    }

});


userRouter.post("/api/sendResetLink", async (req, res) => {
    try {
        const mail = req.body.email.trim();
        const user = await User.findOne({ email: mail });
        if (!user) {
            res.status(400).json({
                "status": "failed",
                "message": "User Does Not Exist"
            });
            return;
        }
        if (!user.is_verified) {
            return res.status(400).json({
                "status": "failed",
                "message": "Please verify mail before reseting your password"
            });
        }
        const hash = await bcrypt.hash(mail, 10);
        user.verification_code = hash;
        await user.save();
        sendMail(user.username, mail, hash, res, false);
    }
    catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message,
        });
    }
});



module.exports = userRouter;