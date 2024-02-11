const { sign, verify } = require("jsonwebtoken");
const Users = require("./models/user");
const secret = process.env.JWT_SECRET;
const createToken = (user) => {
    const accessToken = sign({ username: user.username, id: user.id }, secret);

    return accessToken;
}

const validateToken = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1].trim();
        if (!token) {
            res.status(400).json({
                "status": "failed",
                "message": "User Not Authenticated"
            });
        }
        try {
            const validToken = verify(token, secret);
            if (validToken) {
                console.log(token);
                const user = await Users.findOne({ jwt_token: token, username: validToken.username });
                console.log(user);
                if (!user) return res.status(400).json({
                    status: "failed",
                    message: "Session Logged Out, Please Login Again"
                });
                req.user = user;
                next();
            }
            else {
                res.status(400).json({
                    "status": "failed",
                    "message": "Token Expired"
                });
            }
        }
        catch (e) {
            res.status(400).json({
                "status": "failed",
                "message": e.message
            });
        }
    }
    else {
        res.status(400).json({
            "status": "failed",
            "message": "User Not Authenticated"
        });
    }
}


module.exports = { createToken, validateToken };
