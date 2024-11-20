import React, { useContext, useState } from "react";
import uploadService from "../apiServices/uploadService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config/AppConfig";
import { useNavigate } from "react-router-dom";

const useUpdate = () => {
  const [loading, setLoading] = useState(false);
  // const { setCurrentUserId } = useContext(GetUserContext);

  const navigate = useNavigate();

  const updateProfile = async ({ id, inputs }) => {
    console.log("Update Hook Called.");
    console.log("Id From useUpdate Hook : ", id);
    console.log("Data From useUpdate Hook : ", inputs);

    try {
      setLoading(true);
      await uploadService
        .updateProfile({ id, inputs })
        .then((resp) => {
          console.log("Updated response : ", resp);
          // setCurrentUserId(resp.inputs);
          toast.success(resp.message);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch((error) => {
          console.log("Error : ", error);
        });
    } catch (error) {
      console.log("Error occure while updating : ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
    <ToastContainer />;
  };

  return { updateProfile, loading };
};

export default useUpdate;
