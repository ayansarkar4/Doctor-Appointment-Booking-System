import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  placeOrderStripe,
} from "../controller/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const route = Router();
route.post("/register", registerUser);
route.post("/login", loginUser);
route.get("/profile", authUser, getUserProfile);
route.post("/updateProfile", authUser, upload.single("image"), updateProfile);

route.post("/book-appointment", authUser, bookAppointment);
route.get("/appointments", authUser, listAppointments);
route.post("/cancel-appointment", authUser, cancelAppointment);
route.post("/place-order-stripe", authUser, placeOrderStripe);

export default route;
