import useLogin from "../../Hooks/useLogin.jsx";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Components/Loader/Loader.jsx";

const Login = () => {
  const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const { login, loading } = useLogin();
  const [formErrors, setFormErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [btn, setBtn] = useState(false);

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
    }
    return error;
  };

  const handleOnSubmit = (e) => {
    console.log("Your Data : ", inputs);
    e.preventDefault();
    setFormErrors(validateForm(inputs));
    if (!inputs.email || !inputs.password) {
      setBtn(true);
    }

    if (!inputs.email) {
      toast.error("Please Enter Email");
    }

    if (
      !btn &&
      inputs.email &&
      inputs.password.length > 3 &&
      regex.test(inputs.email)
    ) {
      (async () => {
        await login(inputs.email, inputs.password);
      })();
    }
  };

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const isVarifiedAuth = localStorage.getItem("auth") !== null;
    console.log(isVarifiedAuth);
    if (isVarifiedAuth) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, []);

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
              Login
            </h2>

            <form className="mt-10" onSubmit={handleOnSubmit}>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-600 uppercase mt-2"
              >
                <span className="text-red-500">*</span> E-mail
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
                <span className="text-red-500">*</span> Password
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
                    if (
                      regex.test(inputs.email) &&
                      inputs.password.length < 4
                    ) {
                      setBtn(false);
                    }
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

              <button
                type="submit"
                className={`w-full py-3 mt-10 bg-blue-500 rounded-sm
                  font-medium text-white uppercase
                  focus:outline-none hover:bg-blue-400 hover:shadow-none ${
                    btn && "cursor-not-allowed"
                  }`}
              >
                {loading ? <Loader /> : "Login"}
              </button>

              <div className="sm:flex sm:flex-wrap mt-8 sm:mb-4 text-sm text-center ">
                <NavLink
                  to="/register"
                  className="flex-2 underline hover:text-blue-500 hover:underline"
                >
                  Create an Account
                </NavLink>

                <p className="flex-1 text-gray-500 text-md mx-4 my-1 sm:my-auto">
                  or
                </p>

                <NavLink
                  to="/forget-password"
                  className="flex-2 underline hover:text-blue-500 hover:underline"
                >
                  Forgot password?
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
