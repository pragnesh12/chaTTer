import fetch from "../interceptor/fetchInterceptor.js";

const JwtService = {};

// FOR REGISTER END POINT
JwtService.register = function (data) {
  console.log("Data from register : ", data.profile_picture);
  if (data.profile_picture) {
    return fetch({
      url: "/register",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: data,
    });
  } else {
    return fetch({
      url: "/register",
      method: "post",
      data: data,
    });
  }
};

// FOR LOGIN END POINT
JwtService.login = function (data) {
  return fetch({
    url: "/login",
    method: "post",
    headers: {
      headers: {
        "public-request": "true",
      },
    },
    data: data,
  });
};

// FOR GET_USER END POINT
JwtService.getCurrentUser = function (id) {
  const isAuthToken = localStorage.getItem("auth");
  console.log("IS AUTH : ", typeof isAuthToken);

  if (id) {
    return fetch({
      url: `/users?id=${id}`,
      method: "get",
      headers: {
        "public-request": "true",
        Authorization: `Bearer ${isAuthToken}`,
      },
    });
  } else {
    return fetch({
      url: `/users`,
      method: "get",
      headers: {
        "public-request": "true",
        Authorization: `Bearer ${isAuthToken}`,
      },
    });
  }
};

// FOR GET_USER END POINT
JwtService.varifyEmail = function (token) {
  const isAuthToken = localStorage.setItem("auth", token);
  console.log("IS AUTH : ", typeof isAuthToken);

  return fetch({
    url: `/verify_email?token=${token}`,
    method: "put",
    headers: {
      "public-request": "true",
      Authorization: `Bearer ${token}`,
    },
  });
};

// FOR FORGET PASSWORD
JwtService.forgetPassword = function (email) {
  return fetch({
    url: `/forget-password`,
    method: "post",
    data: email,
  });
};

// FOR RESET PASSWORD
JwtService.resetPassword = function (token, newPassword) {
  console.log("Password : : : ", newPassword);
  return fetch({
    url: `/reset_password`,
    method: "post",
    headers: {
      "public-request": "true",
      Authorization: `Bearer ${token}`,
    },
    data: { newPassword },
  });
};

export default JwtService;
