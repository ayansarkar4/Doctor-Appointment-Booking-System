import { Appointment } from "../models/appointmentModel.js";
import { Doctor } from "../models/doctorModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const changeAvailability = asyncHandler(async (req, res) => {
  const { docId } = req.body;
  const docData = await Doctor.findById(docId);

  await Doctor.findByIdAndUpdate(docId, {
    available: !docData.available,
  });

  res.json({
    success: true,
    message: "Availability status changed",
  });
});

//doctor list

const doctorList = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({}).select(["-password", "-email"]);
  res.json({ success: true, doctors });
});

//doctor login

const doctorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if doctor exists
  const doctor = await Doctor.findOne({ email });
  if (!doctor) {
    return res.json({ success: false, message: "Invalid Credentials" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, doctor.password);
  if (!isMatch) {
    return res.json({ success: false, message: "Invalid Password" });
  }

  // Generate token

  const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);

  return res.json({ success: true, message: "Login Successful", token });
});

// api to get doctor appointments for doctor panel

const appoitnmentDoctor = asyncHandler(async (req, res) => {
  const doctorId = req.doc.id;
  const appointments = await Appointment.find({ doctorId });

  res.json({
    success: true,
    message: "Appointments fetched successfully",
    appointments,
  });
});

//api to mark appointment completed for doctor panel

const appointmentComplete = asyncHandler(async (req, res) => {
  const doctorId = req.doc.id;
  const { appointmentId } = req.body;
  const appointmentData = await Appointment.findById(appointmentId);
  if (appointmentData && appointmentData.doctorId === doctorId) {
    await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true });
    return res.json({
      success: true,
      message: "Appointment Completed Successfully",
    });
  }
});

//api to mark appointment cancelled for doctor panel

const appointmentCancelled = asyncHandler(async (req, res) => {
  const doctorId = req.doc.id;
  const { appointmentId } = req.body;
  const appointmentData = await Appointment.findById(appointmentId);
  if (appointmentData && appointmentData.doctorId === doctorId) {
    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
    return res.json({
      success: true,
      message: "Appointment Cancelled Successfully",
    });
  }
});

//api for doctor dashboard

const doctorDashboard = asyncHandler(async (req, res) => {
  const doctorId = req.doc.id;
  const appointment = await Appointment.find({ doctorId: doctorId });
  let earnings = 0;

  appointment.map((item) => {
    if (item.isCompleted || item.payment) {
      earnings += item.amount;
    }
  });
  let patients = [];

  appointment.map((item) => {
    if (!patients.includes(item.userId)) {
      patients.push(item.userId);
    }
  });

  const dashData = {
    earnings,
    appointment: appointment.length,
    patients: patients.length,
    latestAppointments: appointment.reverse().slice(0, 5),
  };
  return res.json({
    success: true,
    message: "Dashboard fetched successfully",
    dashData,
  });
});

//api to get doctor profile for doctor panel

const doctorProfile = asyncHandler(async (req, res) => {
  const doctorId = req.doc.id;
  const profileData = await Doctor.findById(doctorId).select("-password");
  return res.json({
    success: true,
    message: "Profile fetched successfully",
    profileData,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const doctorId = req.doc.id;
  const { fees, address, available } = req.body;

  await Doctor.findByIdAndUpdate(doctorId, { fees, address, available });
  return res.json({ success: true, message: "Profile updated successfully" });
});
export {
  changeAvailability,
  doctorList,
  doctorLogin,
  appoitnmentDoctor,
  appointmentComplete,
  appointmentCancelled,
  doctorDashboard,
  doctorProfile,
  updateProfile,
};
