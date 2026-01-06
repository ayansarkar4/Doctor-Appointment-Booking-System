import { Router } from "express";
import {
  doctorList,
  doctorLogin,
  appoitnmentDoctor,
  appointmentCancelled,
  appointmentComplete,
  doctorDashboard,
  updateProfile,
  doctorProfile,
} from "../controller/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const route = Router();
route.get("/doctor-list", doctorList);
route.post("/doctor-login", doctorLogin);
route.get("/appointmentDoctor", authDoctor, appoitnmentDoctor);
route.post("/appointmentCancelled", authDoctor, appointmentCancelled);
route.post("/appointmentComplete", authDoctor, appointmentComplete);
route.get("/doctorDashboard", authDoctor, doctorDashboard);
route.get("/profile", authDoctor, doctorProfile);
route.post("/update-profile", authDoctor, updateProfile);

export default route;
