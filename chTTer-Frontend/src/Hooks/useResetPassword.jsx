import React, { useContext, useState } from "react";
import JwtService from "../apiServices/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const resetPassword = async (token, newPassword) => {
    console.log("reset password Hook Called.");

    try {
      setLoading(true);
      await JwtService.resetPassword(token, newPassword)
        .then((resp) => {
          console.log("Updated Password response : ", resp);
          // setCurrentUserId(resp.data);
          toast.success("Password Updated Successfully");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something Went Wrong");
          console.log("Error : ", error);
        });
    } catch (error) {
      console.log("Error occure while forgetting the user : ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return { resetPassword, loading };
};

export default useResetPassword;
