import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = "https://doctor-appointment-booking-system-cfnn.onrender.com/";
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/v1/admin/all-doctors",
        {}, // request body (empty here)
        {
          headers: {
            atoken: aToken,
          },
        }
      );

      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/v1/admin/change-availability",
        { docId },
        {
          headers: {
            atoken: aToken,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/v1/admin/all-appointments",

        {
          headers: {
            atoken: aToken,
          },
        }
      );
      if (data.success) {
        setAppointment(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const appointmentCancel = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/v1/admin/appointment-cancel",
        { appointmentId },
        {
          headers: {
            atoken: aToken,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/v1/admin/dashboard", {
        headers: {
          atoken: aToken,
        },
      });
      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    getAllAppointments,
    appointment,
    setAppointment,
    appointmentCancel,
    dashData,
    getDashData,
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
