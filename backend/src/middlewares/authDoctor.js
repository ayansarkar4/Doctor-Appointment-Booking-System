import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({ success: false, message: "Token missing" });
    }

    const token_decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    req.doc = { id: token_decoded.id }; // ✅ safer place to store userId

    next();
  } catch (error) {
    console.log("Error in authUser middleware", error);
    res.json({ success: false, message: error.message });
  }
};
export default authDoctor;
