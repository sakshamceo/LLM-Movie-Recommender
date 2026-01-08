const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        // 1. get the token from req.header
        const Authorization = req.header("Authorization");

        // 2. Vaildates if token there or not
        if (!Authorization) {
         return res.status(401).json({ error: "Token Not Found" });
        }
        
        const token = Authorization.split(" ")[1];
        //3. use jwt.verify token and process.env.JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()

    }
    catch (err) {
        console.error(`Error in User Controller: ${err}`);
        res.status(500).send(`Server Error in Auth Middleware:  ${err}`);
    }

}