import React, { useEffect, useState } from "react";
import JwtService from "../../apiServices/authService";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import NotFound from "../404NotFound/NotFound";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  let { token } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    (async () => {
      await JwtService.varifyEmail(token)
        .then((resp) => {
          console.log("Response : ", resp);
          if (resp) {
            setShow(true);
            setTimeout(() => {
              toast.success("Varification Completed Now Login");
              navigate("/login");
            }, 5000);
          } else {
            setShow(false);
          }
        })
        .catch((err) => {
          setShow(false);
          console.log(err);
        });
    })();
  }, []);

  return (
    <>
      {show ? (
        <div class="flex space-x-2 justify-center items-center bg-white h-screen dark:invert">
          <span class="sr-only">Loading...</span>
          <div class="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div class="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div class="h-8 w-8 bg-black rounded-full animate-bounce"></div>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default VerifyEmail;
