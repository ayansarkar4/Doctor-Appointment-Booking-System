import { User } from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { Doctor } from "../models/doctorModel.js";
import { Appointment } from "../models/appointmentModel.js";
import Stripe from "stripe";

// ------------------- USER REGISTER -------------------
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
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

  const user = await User.create({ name, email, password });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ success: true, token });
});

// ------------------- USER LOGIN -------------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please enter all the details",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }
  const passwordMatch = await user.isPasswordCorrect(password);
  if (!passwordMatch) {
    return res.json({ success: false, message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ success: true, token });
});

// ------------------- GET USER PROFILE -------------------
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userData = await User.findById(userId).select("-password");
  res.json({ success: true, userData });
});

// ------------------- UPDATE PROFILE -------------------
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, password, phone, dob, gender, address } = req.body;
  const imageFile = req.file;

  // Fetch existing user data
  const user = await User.findById(userId);
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  // Only update fields if they exist in req.body
  if (name) user.name = name;
  if (password) user.password = password;
  if (phone) user.phone = phone;
  if (dob) user.dob = dob;
  if (gender) user.gender = gender;
  if (address) user.address = JSON.parse(address || "{}");

  // If new image provided, upload to Cloudinary
  if (imageFile) {
    const upload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    user.image = upload.secure_url;
  }

  await user.save();

  res.json({ success: true, message: "Profile updated successfully" });
});

// ------------------- BOOK APPOINTMENT -------------------
const bookAppointment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { doctorId, slotDate, slotTime } = req.body;
  const doctorData = await Doctor.findById(doctorId).select("-password");

  if (!doctorData.available) {
    return res.json({ success: false, message: "Doctor is not available" });
  }

  let slots_booked = doctorData.slots_booked;
  if (slots_booked[slotDate]) {
    if (slots_booked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: "Slot is not available" });
    } else {
      slots_booked[slotDate].push(slotTime);
    }
  } else {
    slots_booked[slotDate] = [slotTime];
  }

  const userData = await User.findById(userId).select("-password");
  delete doctorData.slots_booked;

  const newAppointment = new Appointment({
    doctorId,
    userId,
    userData,
    doctorData,
    slotDate,
    slotTime,
    amount: doctorData.fees,
    date: Date.now(),
  });
  await newAppointment.save();

  await Doctor.findByIdAndUpdate(doctorId, { slots_booked });

  res.json({ success: true, message: "Appointment booked successfully" });
});

// ------------------- LIST APPOINTMENTS -------------------
const listAppointments = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const appointments = await Appointment.find({ userId }).sort({ date: -1 });
  res.json({ success: true, appointments });
});

// ------------------- CANCEL APPOINTMENT -------------------
const cancelAppointment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { appointmentId } = req.body;
  const appointmentData = await Appointment.findById(appointmentId);

  if (appointmentData.userId.toString() !== userId) {
    return res.json({ success: false, message: "Not authorized to cancel" });
  }

  await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });

  const { doctorId, slotDate, slotTime } = appointmentData;
  const doctorData = await Doctor.findById(doctorId);
  let slots_booked = doctorData.slots_booked;
  slots_booked[slotDate] = slots_booked[slotDate].filter((t) => t !== slotTime);
  await Doctor.findByIdAndUpdate(doctorId, { slots_booked });

  res.json({ success: true, message: "Appointment cancelled successfully" });
});

// ------------------- STRIPE PAYMENT -------------------
const placeOrderStripe = asyncHandler(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { appointmentId } = req.body;
  const userId = req.user.id;

  if (!appointmentId) {
    return res.json({ success: false, message: "Appointment ID is required" });
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return res.json({ success: false, message: "Appointment not found" });
  }
  if (!appointment.amount || typeof appointment.amount !== "number") {
    return res.json({ success: false, message: "Invalid appointment amount" });
  }

  const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
  const doctorName = appointment.doctorData?.name || "Doctor";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Appointment with Dr. ${doctorName}`,
          },
          unit_amount: appointment.amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${frontendURL}/my-appointments?success=true`,
    cancel_url: `${frontendURL}/my-appointments?canceled=true`,
    metadata: {
      appointmentId: appointment._id.toString(),
      userId,
    },
  });
  await Appointment.findByIdAndUpdate(appointmentId, { payment: true });

  res.json({ success: true, sessionId: session.id });
});

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  placeOrderStripe,
};
