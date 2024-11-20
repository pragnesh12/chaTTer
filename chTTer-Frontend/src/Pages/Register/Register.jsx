import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useRegister from "../../Hooks/useRegister";
import Loader from "../../Components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [btn, setBtn] = useState(false);
  const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const { register, loading } = useRegister();
  const [inputs, setInputs] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    profile_picture: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.fname) {
      error.fname = "First name is required";
    }
    if (!values.lname) {
      error.lname = "Last Name is required";
    }
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      error.password = "Password cannot exceed more than 10 characters";
    }
    return error;
  };

  const handleOnSubmit = (e) => {
    console.log("Your Data : ", inputs);
    e.preventDefault();
    setFormErrors(validateForm(inputs));
    console.log(validateForm(inputs));
    if (!inputs.first_name || !inputs.email || !inputs.password) {
      setBtn(true);
    }

    if (
      regex.test(inputs.email) &&
      inputs.password.length > 3 &&
      inputs.first_name.length > 2 &&
      inputs.last_name.length > 2
    ) {
      setBtn(false);
    }
    if (
      !btn &&
      inputs.email &&
      inputs.password.length > 3 &&
      regex.test(inputs.email)
    ) {
      (async () => {
        await register(inputs);
        // toast.warning("Please Varify Your Email..");
      })();
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="grid place-items-center mx-2 my-20 sm:my-auto">
          <div
            className="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
            px-6 py-10 sm:px-10 sm:py-6 
            bg-white rounded-lg shadow-md lg:shadow-lg"
          >
            <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
              Register
            </h2>

            <form
              className="mt-10"
              // encType="multipart/form-data"
              onSubmit={handleOnSubmit}
            >
              <label
                htmlFor="firstname"
                className="block text-xs font-semibold text-gray-600 uppercase"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                placeholder="First Name"
                className="block w-full py-3 px-1 mt-2 
                    text-gray-800 appearance-none 
                    border-b-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
                value={inputs.first_name}
                onChange={(e) => {
                  setInputs({ ...inputs, first_name: e.target.value });
                }}
              />
              {!inputs.first_name && (
                <p className="text-red-500">{formErrors.fname}</p>
              )}
              <label
                htmlFor="lastname"
                className="block text-xs font-semibold text-gray-600 uppercase mt-2"
              >
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                placeholder="Last Name"
                className="block w-full py-3 px-1 mt-2 
                    text-gray-800 appearance-none 
                    border-b-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
                value={inputs.last_name}
                onChange={(e) => {
                  setInputs({ ...inputs, last_name: e.target.value });
                }}
              />
              {!inputs.last_name && (
                <p className="text-red-500">{formErrors.lname}</p>
              )}
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-600 uppercase mt-2"
              >
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="text"
                name="email"
                placeholder="e-mail address"
                className="block w-full py-3 px-1 mt-2 
                    text-gray-800 appearance-none 
                    border-b-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
                value={inputs.email}
                onChange={(e) => {
                  setInputs({ ...inputs, email: e.target.value });
                  formErrors.email = "";
                }}
              />
              {!inputs.email && (
                <p className="text-red-500">{formErrors.email}</p>
              )}
              {!regex.test(inputs.email) && inputs.email && (
                <p className="text-red-500">{formErrors.email}</p>
              )}
              <label
                htmlFor="password"
                className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"} // Toggle between text and password
                  name="password"
                  placeholder="password"
                  className="block w-full py-3 px-1 mt-2 
                    text-gray-800 appearance-none 
                    border-b-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
                  value={inputs.password}
                  onChange={(e) => {
                    setInputs({ ...inputs, password: e.target.value });
                    formErrors.password = "";
                  }}
                />
                {!inputs.password && (
                  <p className="text-red-500 mb-4">{formErrors.password}</p>
                )}
                {inputs.password && inputs.password.length < 4 && (
                  <p className="text-red-500 mb-4">{formErrors.password}</p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // Toggle the state
                  className="absolute right-3 top-3 text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"} {/* Text based on state */}
                </button>
              </div>

              <label
                htmlFor="example1"
                className=" blocktext-gray-800 font-semibold block my-3 text-md "
              >
                Upload file <span className="text-red-500">*</span>
              </label>
              <input
                id="example1"
                type="file"
                className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-800 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-950  focus:outline-none disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    profile_picture: e.target.files[0],
                  });
                  if (
                    regex.test(inputs.email) &&
                    inputs.password.length > 3 &&
                    inputs.first_name.length > 2
                  ) {
                    setBtn(false);
                  }
                }}
              />

              <button
                type="submit"
                className={`w-full py-3 mt-10 bg-blue-500 rounded-sm
                    font-medium text-white uppercase
                    focus:outline-none hover:bg-blue-400 hover:shadow-none ${
                      btn && "cursor-not-allowed"
                    }`}
                // disabled={btn}
              >
                {loading ? <Loader /> : "Register"}
              </button>
              <NavLink to="/login">
                <button
                  type="button"
                  className="w-full py-3 mt-2 bg-green-800 rounded-sm
                    font-medium text-white uppercase
                    focus:outline-none hover:bg-green-700 hover:shadow-none"
                >
                  Login
                </button>
              </NavLink>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
