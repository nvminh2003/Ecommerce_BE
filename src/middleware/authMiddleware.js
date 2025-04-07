const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
    // console.log("checkToken", req.headers.token);
    const token = req.headers.token?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided.",
            status: "Error",
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: "The authemtication",
                status: "Error",
            });
        }
        if (user?.isAdmin) {
            next();
        } else {
            return res.status(404).json({
                message: "The authemtication",
                status: "Error",
            });
        }
        // console.log("user", user);
    });
};

const authUserMiddleware = (req, res, next) => {
    // console.log("checkToken", req.headers.token);
    const token = req.headers.token?.split(" ")[1];
    const userId = req.params.id;
    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided.",
            status: "Error",
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: "The authemtication",
                status: "Error 1",
            });
        }
        // console.log("user", user);
        if (user?.isAdmin || user?.id === userId) {
            next();
        } else {
            return res.status(404).json({
                message: "The authemtication",
                status: "Error",
            });
        }
        // console.log("user", user);
    });
};

module.exports = {
    authMiddleware,
    authUserMiddleware,
};
