import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = "https://doctor-appointment-booking-system-cfnn.onrender.com/";
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : null
  );
  const [appointment, setAppointment] = useState([]);
  const [dashData, setDashdata] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/v1/doctor/appointmentDoctor",
        {
          headers: {
            dtoken: dToken, // header key should be lowercase if backend uses lowercase
          },
        }
      );

      if (data.success) {
        setAppointment(data.appointments.reverse());
        // toast.success(data.message);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const completeAppointments = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/v1/doctor/appointmentComplete",
        { appointmentId },
        {
          headers: {
            dtoken: dToken,
          },
        }
      );
      if (data?.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointments = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/v1/doctor/appointmentCancelled",
        { appointmentId },
        {
          headers: {
            dtoken: dToken,
          },
        }
      );
      if (data?.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashdata = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/v1/doctor/doctorDashboard",
        {
          headers: {
            dToken: dToken,
          },
        }
      );
      if (data.success) {
        setDashdata(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/v1/doctor/profile", {
        headers: { dToken },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    getAppointments,
    appointment,
    setAppointment,
    completeAppointments,
    cancelAppointments,
    dashData,
    getDashdata,
    profileData,
    setProfileData,
    getProfileData,
  };
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
