import { Router } from "express";
import {
  addDoctor,
  loginAdmin,
  allDoctors,
  allAppointments,
  appointmentCancel,
  dashboardStats,
} from "../controller/adminController.js";
const router = Router();
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controller/doctorController.js";

router.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
router.post("/login-admin", loginAdmin);
router.post("/all-doctors", authAdmin, allDoctors);
router.post("/change-availability", authAdmin, changeAvailability);
router.get("/all-appointments", authAdmin, allAppointments);
router.post("/appointment-cancel", authAdmin, appointmentCancel);
router.get("/dashboard", authAdmin, dashboardStats);

export default router;
