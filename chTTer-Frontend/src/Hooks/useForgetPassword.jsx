import React, { useContext, useState } from "react";
import JwtService from "../apiServices/authService";
import toast from "react-hot-toast";
// import { ToastContainer, toast } from "react-toastify";

const useForgetPassword = () => {
  const [loading, setLoading] = useState(false);

  const forgetPassword = async (email) => {
    console.log("Update Hook Called.");
    console.log("Email From Forget Password Hook : ", email);

    try {
      setLoading(true);
      await JwtService.forgetPassword(email)
        .then((resp) => {
          console.log("Updated response : ", resp);
          // setCurrentUserId(resp.data);
          toast.success("Please Check Your Mailbox We Sended The Link");
          // setTimeout(() => {
          //   window.location.reload();
          // }, 2000);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Please Register Yourself!");
          console.log("Error : ", error);
        });
    } catch (error) {
      console.log("Error occure while forgetting the user : ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return { forgetPassword, loading };
};

export default useForgetPassword;
