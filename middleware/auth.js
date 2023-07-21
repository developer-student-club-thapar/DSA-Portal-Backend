const jwt = require('jsonwebtoken');

const Authenticator = (req, res, next) => {
    const token = req.header('Authorization');

    try {
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({
              status: 'Invalid or Missing Token'
            });
        }

        const tokenWithoutBearer = token.split(' ')[1];

        const decodedToken = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({
                status: 'Invalid Token'
            });
        }

        next();
    } catch (error) {
        res.status(401).json({
            status: 'Invalid Token'
        });
    }
};

module.exports = Authenticator;