import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: "Token missing" });
    }

    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: token_decoded.id }; // ✅ safer place to store userId

    next();
  } catch (error) {
    console.log("Error in authUser middleware", error);
    res.json({ success: false, message: error.message });
  }
};
export default authUser;
