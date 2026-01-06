import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, backendURL, loadUserData, token } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfile = async () => {
    try {
      const formData = new FormData();

      if (userData.name) formData.append("name", userData.name);
      if (userData.phone) formData.append("phone", userData.phone);
      if (userData.address)
        formData.append("address", JSON.stringify(userData.address));
      if (userData.dob) formData.append("dob", userData.dob);
      if (userData.gender) formData.append("gender", userData.gender);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        backendURL + "/api/v1/user/updateProfile",
        formData,
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    userData && (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-6">
          {isEdit ? (
            <label
              htmlFor="image"
              className="relative inline-block cursor-pointer"
            >
              {/* Profile Image */}
              <img
                className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="Profile"
              />

              {/* Upload Icon Badge */}
              <div className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full shadow-md">
                <img
                  className="w-5 h-5"
                  src={assets.upload_icon}
                  alt="Upload"
                />
              </div>

              {/* Hidden Input */}
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />
            </label>
          ) : (
            <img
              src={userData.image}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
            />
          )}

          <div>
            {isEdit ? (
              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border p-2 rounded-lg w-full focus:outline-indigo-500"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800">
                {userData.name}
              </h2>
            )}
          </div>
        </div>

        <hr className="my-4" />

        {/* Contact Info */}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Contact Information
          </h3>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center gap-2">
              <p className="font-medium min-w-[80px]">Email:</p>
              <p>{userData.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <p className="font-medium min-w-[80px]">Phone:</p>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="border p-2 rounded-lg w-full focus:outline-indigo-500"
                />
              ) : (
                <p>{userData.phone}</p>
              )}
            </div>

            {/* Address Column */}
            <div className="flex items-start gap-2">
              <p className="font-medium min-w-[80px]">Address:</p>
              {isEdit ? (
                <div className="flex flex-col space-y-2 w-full">
                  <input
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    className="border p-2 rounded-lg w-full focus:outline-indigo-500"
                    type="text"
                  />
                  <input
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    className="border p-2 rounded-lg w-full focus:outline-indigo-500"
                    type="text"
                  />
                </div>
              ) : (
                <div className="flex flex-col">
                  <p>{userData.address.line1}</p>
                  <p>{userData.address.line2}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Basic Information
          </h3>
          <div className="space-y-3 text-gray-600">
            {/* Gender Inline */}
            <div className="flex items-center gap-2">
              <p className="font-medium min-w-[80px]">Gender:</p>
              {isEdit ? (
                <select
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  value={userData.gender}
                  className="border p-2 rounded-lg w-full focus:outline-indigo-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p>{userData.gender}</p>
              )}
            </div>

            {/* Birthday Inline */}
            <div className="flex items-center gap-2">
              <p className="font-medium min-w-[80px]">Birthday:</p>
              {isEdit ? (
                <input
                  type="date"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  value={
                    userData.dob
                      ? new Date(userData.dob).toISOString().split("T")[0] // yyyy-MM-dd
                      : ""
                  }
                  className="border p-2 rounded-lg w-full focus:outline-indigo-500"
                />
              ) : (
                <p>
                  {userData.dob
                    ? new Date(userData.dob).toISOString().split("T")[0]
                    : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="text-right">
          {isEdit ? (
            <button
              onClick={updateUserProfile}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Save Information
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
