const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info from the token to `req.user`
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        res.status(403).json({ error: 'Invalid token.' });
    }

};

module.exports = verifyToken;