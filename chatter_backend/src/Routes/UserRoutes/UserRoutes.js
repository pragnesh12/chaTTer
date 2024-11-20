const express = require("express");
const registerUser = require("../../Controllers/UserController/register.js");
const loginUser = require("../../Controllers/UserController/login.js");
const verifyEmail = require("../../Controllers/UserController/verifyEmail.js");
const fetchUsers = require("../../Controllers/UserController/fetchUsers.js");
const updateUser = require("../../Controllers/UserController/updateUser.js");
// import getUsers from "../../Controllers/userControllers/getUsers.js";
// import updateUser from "../../Controllers/userControllers/updateUser.js";
// import deleteUser from "../../Controllers/userControllers/deleteUser.js";
// import forgetPassword from "../../Controllers/userControllers/forget-password/forgetPassword.js";
// import resetPassword from "../../Controllers/userControllers/forget-password/resetPassword.js";
const userRouter = express.Router();
console.log("User Router Has Been Called");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/verify_email", verifyEmail);
userRouter.get("/users", fetchUsers);
userRouter.put("/update-profile", updateUser);
// userRouter.delete("/delete-profile", deleteUser);
// userRouter.post("/forget-password", forgetPassword);
// userRouter.post("/reset_password", resetPassword);

module.exports = userRouter;
