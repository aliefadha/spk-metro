const prisma = require("../configs/database.js");
const { decodeToken } = require("../utils/jwt.js");

const authenticate = async (req, res, next) => {
    try {
        const token = req.get("Authorization");

        if (!token || !token.startsWith("Bearer")) {
            return res.status(401).json({
                message: "You are unauthorized, please login first",
            });
        }

        const extractedToken = token.substr(7);
        if (!extractedToken || extractedToken === "null") {
            return res.status(401).json({
                message: "You are unauthorized, please login first",
            });
        }

        let claims;
        try {
            claims = decodeToken(extractedToken);
        } catch (error) {
            return res.status(401).json({
                message: "Invalid or expired token",
            });
        }


        if (!claims || !claims.uuid) {
            return res.status(401).json({
                message: "You are unauthorized, please login first",
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: claims.uuid },
            include: { token: true },
        });

        if (!user) {
            return res.status(401).json({
                message: "You are unauthorized, please login first",
            });
        }

        const sessionToken = await prisma.token.findFirst({
            where: {
                token: extractedToken,
                user_id: claims.uuid,
            },
        });

        if (!sessionToken) {
            return res.status(401).json({
                message: "Session expired or invalid, please login again",
            });
        }

        req.user = user;
        req.sessionToken = sessionToken;

        next();
    } catch (error) {
        res.status(500).json({
            message: "An error occurred during authentication",
        });
    }
};

const authorize = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role || req.user.role !== requiredRole) {
            return res.status(403).json({
                message: "You do not have permission to access this resource",
            });
        }
        next();
    };
};

module.exports = { authenticate, authorize };