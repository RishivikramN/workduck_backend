const jwt = require("jsonwebtoken");
const config = require('../Config/config.json');

async function AuthUser(req,res,next){
    const token = req.header("x-auth-token");

    if (!token) return res.status(401).send("Access denied. No token provided");

    try {
        const decoded = jwt.verify(token, config.jwtkey);
        if (decoded) {
        next();
        } else return res.status(401).send("Access denied");

    } catch (ex) {
        res.status(400).send("Invalid Token.");
    }
}

module.exports = AuthUser;