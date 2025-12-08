import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

export default function verfyjwt(req, res, next) {
    const header = req.header("Authorization");
    if (header != null) {
        const token = header.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT verification error:", err);
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            req.user = decoded;
            next();
        });
    } else {
        next();
    }
}