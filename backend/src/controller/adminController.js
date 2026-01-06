import asyncHandler from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { Doctor } from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import { Appointment } from "../models/appointmentModel.js";
import { User } from "../models/userModel.js";

//api tp adding doctors
const addDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    speciality,
    degree,
    experience,
    about,
    fees,
    address,
  } = req.body;
  const imageFile = req.file;
  if (
    !name ||
    !email ||
    !password ||
    !speciality ||
    !degree ||
    !experience ||
    !about ||
    !fees ||
    !address
  ) {
    return res.json({
      success: false,
      message: "Please enter all the details",
    });
  }
  if (!email.includes("@")) {
    return res.json({ success: false, message: "Invalid email address" });
  }
  if (password.length < 4) {
    return res.json({
      success: false,
      message: "Password must be atleast 4 characters long",
    });
  }
  //upload image on cloudinary

  const uploadImage = await cloudinary.uploader.upload(imageFile.path, {
    resource_type: "image",
  });
  const imageUrl = uploadImage.secure_url;

  const doctorData = {
    name,
    email,
    image: imageUrl,
    password,
    speciality,
    degree,
    experience,
    about,
    fees,
    date: Date.now(),
    address: JSON.parse(address),
  };
  const newDoctor = new Doctor(doctorData);
  await newDoctor.save();
  return res.json({ success: true, message: "New doctor added successfully" });
});

//login api for admin

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET);

    return res.json({ success: true, token });
  } else {
    return res.json({ success: false, message: "Invalid email or password" });
  }
});

//api to get all doctors list for admin panel

const allDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({}).select("-password");
  return res.json({ success: true, doctors });
});

//api to get all appointments for admin panel

const allAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({});
  return res.json({ success: true, appointments: appointments.reverse() });
});

//api for appointment cancellation by admin

const appointmentCancel = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;
  const appointmentData = await Appointment.findById(appointmentId);

  await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });

  const { doctorId, slotDate, slotTime } = appointmentData;
  const doctorData = await Doctor.findById(doctorId);
  let slots_booked = doctorData.slots_booked;
  slots_booked[slotDate] = slots_booked[slotDate].filter((t) => t !== slotTime);
  await Doctor.findByIdAndUpdate(doctorId, { slots_booked });

  res.json({ success: true, message: "Appointment cancelled successfully" });
});

//api to get dashboard stats
const dashboardStats = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({});
  const appointments = await Appointment.find({});
  const user = await User.find({});

  const dashData = {
    totalDoctors: doctors.length,
    totalAppointments: appointments.length,
    totalUsers: user.length,
    latestAppointments: appointments.reverse().slice(0, 5),
  };
  res.json({ success: true, dashData });
});

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  allAppointments,
  appointmentCancel,
  dashboardStats,
};
