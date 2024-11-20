import React, { useContext, useState } from "react";
import JwtService from "../apiServices/authService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetUserContext } from "../Store/user-store";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setCurrentUserId } = useContext(GetUserContext);
  const [response, setResp] = useState({});

  const login = async (email, password) => {
    const isCorrect = handleInputError({ email, password });

    if (!isCorrect) return;
    setLoading(true);
    try {
      const isLogin = await JwtService.login({ email, password })
        .then((resp) => {
          // console.log("login response : ", resp);
          if (resp.success === true) {
            toast.success(resp.message);
            console.log("User Data From useLogin : ", resp);
            setCurrentUserId(resp.data);
            localStorage.setItem("auth", resp.token);
            localStorage.setItem("currentUser", `${JSON.stringify(resp.data)}`);
            setTimeout(() => {
              navigate("/home");
            }, 3000);
          } else {
            toast.error(resp.message);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        })
        .catch((err) => {
          console.log("Error in useLogin Hook : ", err);
          toast.warning(err?.message);
          console.log();
        });
    } catch (error) {
      toast.error("Invalid Email Or Password");
    } finally {
      setLoading(false);
    }
  };

  <ToastContainer />;
  return { login, loading };
};

export default useLogin;

function handleInputError({ email, password }) {
  if (!email || !password) {
    toast.error("Please fill all details");
    return false;
  }

  if (password < 4) {
    toast.error("Password must be atleast 6 characters");
    return false;
  }

  return true;
}
