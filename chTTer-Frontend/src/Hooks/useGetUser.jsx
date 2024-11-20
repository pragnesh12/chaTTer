import React, { useContext, useState } from "react";
import JwtService from "../apiServices/authService";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { GetUserContext } from "../Store/user-store";

const useGetUser = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUserId } = useContext(GetUserContext);

  const currentUserId = async () => {
    setLoading(true);
    try {
      const isGetted = await JwtService.getCurrentUser()
        .then((resp) => {
          console.log(resp.data);
          localStorage.setItem("currentUser", JSON.stringify(resp.data.user));
          setCurrentUserId(resp.data.user);
          // localStorage.setItem("gettedData", JSON.stringify(resp));
          // toast.success("Current Id Getted Successfull");
        })
        .catch((err) => {
          console.log("Error in useGetUser Hook : ", err);
          // toast.error("Invalid Email Or Password");
        });
      console.log(isGetted);
    } catch (error) {
      console.log(error);
      // toast.error("Invalid Email Or Password");
    } finally {
      setLoading(false);
    }
  };

  return { currentUserId, loading };
};

export default useGetUser;
