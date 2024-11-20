const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../../../models/index.js");
const uploadPicture = require("./uploadProfilePicture.js");
const jwtDecoder = require("../../Helper/jwtDecoder.js");
const sendMail = require("../../Helper/sendMailer.js");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|heic|heif)$/)) {
      return cb(
        new Error("Only .jpg, .jpeg, .heic, .heif, or .png images are allowed.")
      );
    }
    cb(null, true);
  },
});

const updateProfile = async (req, res) => {
  console.log("Req.body ---- ", req.body);
  const responseFromToken = await jwtDecoder(req);
  if (!responseFromToken) {
    return res.status(400).send({
      success: false,
      message: "Unauthorized! Please Login First",
    });
  }

  const userId = responseFromToken.id;
  const incomingData = req.body;

  console.log(incomingData);
  const updateUserDetails = async (data) => {
    console.log("Inside updateUserDetails : ", data);
    await db.User.update(data, { where: { id: userId } });

    // if (data.email) {
    //   const VerifiedToken = await req.headers.authorization.split(" ")[1];
    //   const verificationUrl = `${process.env.CORS_ALLOWED_URL}/varify-email/${VerifiedToken}`;
    //   await sendMail(
    //     data.email,
    //     "Verify Your Email",
    //     `Hi, ${data.first_name}, please verify your email by clicking the link below: ${verificationUrl}`,
    //     `<h1>Hello, ${data.first_name}</h1>
    //      <p>Thank you for Updating Your Profile! Please verify your email by clicking the link below:</p>
    //      <a href="${verificationUrl}">Verify Email</a>`
    //   );
    //   return res.status(200).send({
    //     success: true,
    //     message: "Please Verify Your Email!",
    //     user: data,
    //   });
    // }

    return res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      user: data,
    });
  };

  try {
    const oldUser = await db.User.findOne({ where: { id: userId } });
    if (!oldUser) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }

    let data = { id: userId };

    ["first_name", "last_name", "email"].forEach((field) => {
      console.log("incomingData[field] --- ", incomingData);
      if (incomingData[field]) {
        data[field] = incomingData[field];
      }
    });

    upload.single("profile_picture")(req, res, async (err) => {
      const incomingData = req.body;
      console.log("upload.single runs : ", incomingData);
      console.log("upload.single runs : ", req.file);
      console.log("upload.single __dir : ", __dirname);

      if (err) {
        return res.status(400).send({ success: false, message: err.message });
      }

      if (req.file) {
        const oldProfilePicturePath = `./public/users/${
          oldUser.profile_picture === null
            ? "default.png"
            : oldUser.profile_picture
        }`;

        if (fs.existsSync(oldProfilePicturePath)) {
          fs.unlinkSync(oldProfilePicturePath);
        }

        // Save new profile picture
        const newFileName = Date.now() + ".jpeg";
        const base64Data = req.file.buffer;
        var newPath = `./public/users/${newFileName}`;
        fs.writeFile(newPath, base64Data, "base64", function (err) {
          if (err) {
            console.error("Error saving new profile picture:", err);
            return res.status(400).send({
              success: false,
              message: "Error saving profile picture. Please try again.",
            });
          }

          ["first_name", "last_name", "email"].forEach((field) => {
            console.log("incomingData[field] --- ", incomingData);
            if (incomingData[field]) {
              data[field] = incomingData[field];
            }
          });
          data.profile_picture = newFileName;
          updateUserDetails(data);
        });
      } else {
        // If no new picture is uploaded, just update other details
        console.log("Don't have Any Images : ", data);
        updateUserDetails(data);
      }
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(400).send({
      success: false,
      message: "Please Try Again After Some Time",
    });
  }
};

module.exports = updateProfile;
