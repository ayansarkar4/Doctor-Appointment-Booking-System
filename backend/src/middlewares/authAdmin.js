import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const token = req.headers.atoken; // ✅ MUST match frontend

    if (!token) {
      return res.json({ success: false, message: "Invalid Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.json({ success: false, message: "Not Authorized" });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: "Invalid Token" });
  }
};

export default authAdmin;
