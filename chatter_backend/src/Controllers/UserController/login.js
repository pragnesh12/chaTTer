const db = require("../../../models/index.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require("../../Helper/sendMailer.js");

const loginUser = async (req, res) => {
  const body = await req.body;
  console.log(body);
  try {
    const existingUser = await db.User.findOne({
      where: {
        email: body.email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    console.log("Verification Status: ", existingUser.isVerifiedEmail);
    if (!existingUser.isVerifiedEmail) {
      return res.status(400).json({
        success: false,
        message: "Please Verify Your Email",
      });
    }

    console.log(existingUser);
    console.log("Password: ", body.password);
    console.log("Existing User's Password: ", existingUser.password);

    bcrypt.compare(
      body.password,
      existingUser.password,
      async (err, result) => {
        console.log("Error: ", err);
        console.log("Password Match Result: ", result);

        if (err) {
          return res.status(500).send({
            success: false,
            message: "Something went wrong",
            err,
          });
        } else if (result) {
          const secretkey = process.env.ACCESS_TOKEN;
          const expiresIn = "365d";
          let token = jwt.sign(
            { id: existingUser.id, email: existingUser.email },
            secretkey,
            {
              expiresIn,
            }
          );

          console.log(token);
          return res.status(200).send({
            success: true,
            message: "Login successful.",
            token,
            data: {
              first_name: existingUser.first_name,
              last_name: existingUser.last_name,
              email: existingUser.email,
              profile_picture: existingUser.profile_picture,
            },
          });
        } else {
          return res.status(500).send({
            success: false,
            message: "Invalid credentials provided",
          });
        }
      }
    );
  } catch (error) {
    console.log("Error During Login: ", error);
    return res.status(400).send({
      success: false,
      message: "Invalid Login",
    });
  }
};

module.exports = loginUser;
