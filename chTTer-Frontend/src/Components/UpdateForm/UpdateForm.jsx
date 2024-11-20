import React, { useState } from "react";
import { API_IMAGE_URL } from "../../config/AppConfig";
import useUpdate from "../../Hooks/useUpdate";
import Loader from "../Loader/Loader";

const UpdateForm = ({ currentUser }) => {
  const [file, setFile] = useState();

  const [show, setShow] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const [showThree, setShowThree] = useState(false);

  const [inputs, setInputs] = useState({
    first_name: currentUser.first_name,
    last_name: currentUser.last_name,
    email: currentUser.email,
    profile_picture: "",
  });

  const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const [formErrors, setFormErrors] = useState({});

  const { updateProfile, loading } = useUpdate();

  const validateForm = (values) => {
    const error = {};

    console.log("valuessss : ", values);
    if (!values.first_name && currentUser.first_name) {
      error.first_name = "First name is required";
    }
    if (!values.last_name && currentUser.last_name) {
      error.last_name = "Last name is required";
    }
    if (!values.email && currentUser.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email) && !regex.test(currentUser.email)) {
      error.email = "This is not a valid email format!";
    }
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(inputs);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form data: ", inputs);
    }

    const id = currentUser.id;
    await updateProfile({ id, inputs });
  };

  return (
    <div className="bg-white shadow rounded-lg border md:px-[2rem] px-[1rem] mt-[2rem] overflow-hidden ">
      <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
        <div className="shrink-0 mr-auto sm:py-3 ">
          <p className="font-medium">Account Details</p>
          <p className="text-sm text-gray-600">Edit your account details</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data ">
        <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p className="shrink-0 w-32 font-medium">
            Name<span className="text-red-500">*</span>
          </p>
          <div className="w-full flex flex-col">
            <input
              placeholder="First Name"
              className="mb-2 w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 sm:mr-4 sm:mb-0 focus:ring-1"
              value={!show ? currentUser.first_name : inputs.first_name}
              onChange={(e) => {
                setInputs({ ...inputs, first_name: e.target.value });
                formErrors.first_name = "";
                setShow(true);
              }}
            />
            {formErrors.first_name && !currentUser.first_name && (
              <p className="text-red-500">{formErrors.first_name}</p>
            )}
          </div>
          <div className="w-full flex flex-col">
            <input
              placeholder="Last Name"
              className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
              value={!showTwo ? currentUser.last_name : inputs.last_name}
              onChange={(e) => {
                setInputs({ ...inputs, last_name: e.target.value });
                formErrors.last_name = "";
                setShowTwo(true);
              }}
            />
            {formErrors.last_name && !currentUser.last_name && (
              <p className="text-red-500">{formErrors.last_name}</p>
            )}
          </div>
        </div>
        {/* <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p className="shrink-0 w-32 font-medium">
            Email<span className="text-red-500">*</span>
          </p>
          <div className="w-full flex flex-col">
            <input
              placeholder="your.email@domain.com"
              className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
              value={!showThree ? currentUser.email : inputs.email}
              onChange={(e) => {
                setInputs({ ...inputs, email: e.target.value });
                formErrors.email = "";
                setShowThree(true);
              }}
            />
            {formErrors.email && !currentUser.email && (
              <p className="text-red-500">{formErrors.email}</p>
            )}
          </div>
        </div> */}
        <div className="flex flex-col gap-4 py-4 lg:flex-row">
          <div className="shrink-0 w-32 sm:py-4">
            <p className="mb-auto font-medium">Avatar</p>
            <p className="text-sm text-gray-600">Change your avatar</p>
          </div>
          <div className="flex h-56 w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 p-5 text-center">
            <img
              src={
                !file
                  ? `${
                      currentUser.profile_picture
                        ? currentUser.profile_picture
                        : "default-image.png"
                    }`
                  : `${file}`
              }
              className="h-16 w-16 rounded-full object-cover ring-3 ring-gray-100"
              onError={(event) => {
                event.target.src = "default-image.png";
              }}
            />
            <p className="text-sm text-gray-600">
              Select Your Image For Upload
            </p>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                id="example1"
                type="file"
                className="block w-full text-sm text-gray-500 file:me-4 file:py-2
                  file:px-4 file:rounded-lg file:border-0 file:text-sm
                  file:font-semibold file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700 file:disabled:opacity-50
                  file:disabled:pointer-events-none dark:text-neutral-500
                  dark:file:bg-blue-500 dark:hover:file:bg-blue-400"
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    profile_picture: e.target.files[0],
                  });
                  setFile(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </label>
          </div>
        </div>
        <div className="flex justify-end py-4">
          {/* <button
            className="mr-2 rounded-lg border-2 px-4 py-2 font-medium text-gray-500 focus:outline-none focus:ring hover:bg-gray-200"
            type="reset"
          >
            Reset
          </button> */}
          <button
            className="rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white focus:outline-none focus:ring hover:bg-blue-700"
            type="submit"
          >
            {loading ? <Loader /> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateForm;
