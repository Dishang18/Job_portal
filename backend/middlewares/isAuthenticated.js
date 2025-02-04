import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated. Token missing.',
                success: false
            });
        }

        // Verify the token
        let decode;
        try {
            decode = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return res.status(401).json({
                message: 'Invalid or expired token.',
                success: false
            });
        }

        // Attach user ID to request object
        req.id = decode.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error.message);
        res.status(500).json({
            message: 'Internal server error.',
            success: false
        });
    }
};

export default isAuthenticated;
