const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'Token_Secret');

        // Extract the user ID and role from the decoded token
        const userId = decodedToken.id;

        // Validate the user ID based on their role
        if (
            ( req.body.userId && req.body.userId !== userId)
        ) {
            throw 'Invalid user ID';
        } else {
            req.user = { id:userId };
            next();
        }
    } catch (error) {
        res.status(401).json({ error: new Error('Invalid request!') });
    }
};
