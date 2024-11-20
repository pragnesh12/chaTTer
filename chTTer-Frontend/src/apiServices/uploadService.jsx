import fetch from "../interceptor/fetchInterceptor.js";

const uploadService = {};

uploadService.updateProfile = function ({ id, inputs }) {
  console.log("id From auth service Update : ", id);
  console.log("inputs From auth service Update : ", inputs);
  const isAuthToken = localStorage.getItem("auth");
  if (inputs.profile_picture) {
    console.log("Inside Profile_Picture");
    return fetch({
      url: `/update-profile`,
      method: "put",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${isAuthToken}`,
      },
      data: inputs,
    });
  } else {
    console.log("Inside Without Profile_Picture");
    return fetch({
      url: `/update-profile`,
      method: "put",
      headers: {
        Authorization: `Bearer ${isAuthToken}`,
      },
      data: inputs,
    });
  }
};

export default uploadService;
