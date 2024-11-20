import React, { useState } from "react";
import JwtService from "../apiServices/authService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { GetUserContext } from "../store/user-store";

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const { setCurrentUserId } = useContext(GetUserContext);

  const register = async ({
    first_name,
    last_name,
    email,
    password,
    profile_picture,
  }) => {
    console.log({
      first_name,
      last_name,
      email,
      password,
      profile_picture,
    });

    const isAnyError = handleInputError({
      first_name,
      last_name,
      email,
      password,
      profile_picture,
    });

    if (!isAnyError) return;

    setLoading(true);
    try {
      await JwtService.register({
        first_name,
        last_name,
        email,
        password,
        profile_picture,
      })
        .then((resp) => {
          console.log(resp.success);

          if (resp.success === false) {
            toast.error(resp.message);
          } else {
            toast("Varification Link Sended To Your Account");
            // setCurrentUserId(resp.data);
            if (resp.success === true) {
              setTimeout(() => {
                // window.location.reload();
                navigate("/login");
              }, 2000);
            }
          }
        })
        .catch((err) => {
          console.log("err");
          toast.error("Invalid server error");
        });
    } catch (error) {
      console.log("error occuring at useRegister : ", error);
    } finally {
      setLoading(false);
    }
  };
  <ToastContainer />;
  return { register, loading };
};

export default useRegister;

// VALIDATION CHECKS :
function handleInputError({ first_name, email, password }) {
  if (!first_name || !email || !password) {
    toast.error("Please fill all details");
    return false;
  }

  // if (password !== confirmpassword) {
  //   toast.error("Passwords not matched");
  //   return false;
  // }

  if (password < 6) {
    toast.error("Password must be atleast 6 characters");
    return false;
  }

  return true;
}
