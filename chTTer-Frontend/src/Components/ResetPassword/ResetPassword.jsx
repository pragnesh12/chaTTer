import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JwtService from "../../apiServices/authService";
import Loader from "../Loader/Loader";
import { BASE_URL } from "../../config/AppConfig";
import useGetUser from "../../Hooks/useGetUser";
import useResetPassword from "../../Hooks/useResetPassword";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const { token } = useParams();

  const { resetPassword, loading } = useResetPassword();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prevState) => !prevState);
  };

  // const { updateProfile, loading } = useUpdate();
  const { currentUserId } = useGetUser();

  useEffect(() => {
    (async () => {
      await currentUserId();
      localStorage.setItem("auth", token);
    })();
  }, []);

  const [inputs, setInputs] = useState({
    password: "",
    confirmpassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmpassword: "",
    notMatched: "",
  });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    const newErrors = { ...errors };
    if (inputs.password === "") {
      newErrors.password = "Please Enter Password";
      setErrors(newErrors);
      return false;
    }
    if (inputs.confirmpassword === "") {
      newErrors.confirmpassword = "Please Enter Confirm Password";
      setErrors(newErrors);
      return false;
    }
    if (inputs.password !== inputs.confirmpassword) {
      newErrors.notMatched = "Passwords Don't Match";
      setErrors(newErrors);
      return false;
    }
    // await updateProfile(id, inputs);
    await resetPassword(token, inputs.password);
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 md:ml-[-4rem]">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Change Password
            </h2>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={handleOnSubmit}
            >
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      setInputs({ ...inputs, password: e.target.value });
                    }}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {isPasswordVisible ? "Hide" : "Show"}
                  </button>
                </div>
                {!inputs.password.length && (
                  <div className="text-red-400 text-sm">{errors.password}</div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      setInputs({ ...inputs, confirmpassword: e.target.value });
                    }}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {isConfirmPasswordVisible ? "Hide" : "Show"}
                  </button>
                </div>
                {!inputs.confirmpassword.length && (
                  <div className="text-red-400 text-sm">
                    {errors.confirmpassword}
                  </div>
                )}
              </div>

              {inputs.password !== inputs.confirmpassword && (
                <div className="text-red-400 text-sm">{errors.notMatched}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? <Loader /> : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
