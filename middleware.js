const User = require("./models/user");


const isUserAdmin = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1].trim();
    const user = await User.findOne({ jwt_token: token });
    if (!user || user.is_admin == false) {
        return res.status(400).json({
            status: 'failed',
            message: "You are not an admin",
        });
    }
    next();
}

module.exports = isUserAdmin;