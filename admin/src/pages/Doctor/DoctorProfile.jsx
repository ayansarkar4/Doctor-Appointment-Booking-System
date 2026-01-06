import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, setProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/v1/doctor/update-profile",
        updateData,
        {
          headers: {
            dtoken: dToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } // ✅ fixed missing closing brace
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  if (!profileData) return null;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl overflow-hidden">
        {/* Header Section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="absolute -bottom-16 left-8 flex items-center space-x-4">
            <img
              src={profileData.image}
              alt="Doctor"
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {profileData.name}
              </h2>
              <p className="text-gray-600">
                {profileData.degree} – {profileData.speciality}
              </p>
              <p className="text-sm text-gray-500">
                {profileData.experience} years experience
              </p>
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className="pt-20 px-8 pb-8">
          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
            <p className="text-gray-600 leading-relaxed">
              {profileData.about || "No description available."}
            </p>
          </div>

          {/* Fees & Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-gray-600 text-sm">Appointment Fee</p>
              <p className="text-xl font-bold text-gray-800">
                {currency}{" "}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  profileData.fees
                )}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between">
              <p className="text-gray-700 font-medium">Available</p>
              <input
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                type="checkbox"
                checked={profileData.available}
                className="w-5 h-5 accent-blue-600"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Address
            </h3>
            <p className="text-gray-600">
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={profileData.address?.line1 || ""}
                  className="border rounded px-2 py-1 w-full mb-2"
                />
              ) : (
                profileData.address?.line1
              )}
              <br />
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={profileData.address?.line2 || ""}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                profileData.address?.line2
              )}
            </p>
          </div>

          {/* Edit Button */}
          <div className="text-center">
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 shadow-md"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 shadow-md"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
