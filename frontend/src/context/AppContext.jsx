import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currency = "$";

  const backendURL =
    "https://doctor-appointment-booking-system-cfnn.onrender.com";

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [userData, setUserData] = useState(false);

  const getDoctorData = async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/v1/doctor/doctor-list"
      );
      if (data?.success) {
        setDoctors(data?.doctors);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch doctors"
      );
    }
  };

  const loadUserData = async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/v1/user/profile",
        {
          headers: { token },
        }
      );
      if (data?.success) {
        setUserData(data?.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to load user data"
      );
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserData();
    } else {
      setUserData(false);
    }
  }, [token]);

  const value = {
    doctors,
    getDoctorData,
    currency,
    token,
    setToken,
    backendURL,
    userData,
    setUserData,
    loadUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
