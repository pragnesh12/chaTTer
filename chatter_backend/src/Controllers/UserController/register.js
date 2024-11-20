const multer = require("multer");
const db = require("../../../models/index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uploadPicture = require("./uploadProfilePicture.js");
const sendMail = require("../../Helper/sendMailer.js");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|heic|heif)$/)) {
      return cb(
        new Error("Only .jpg, .jpeg, .heic, .heif or .png images are allowed.")
      );
    }
    cb(null, true);
  },
});

const registerUser = async (req, res) => {
  console.log("register called");
  const data = req.body;
  console.log("Simple Data Without Profile_picture : ", data);

  upload.single("profile_picture")(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const data = req.body;
    console.log("daaaaataaaaaaaa : ", data);

    if (!data.first_name || !data.last_name || !data.email || !data.password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required." });
    }

    try {
      // Check if the user already exists
      const oldUser = await db.User.findOne({ where: { email: data.email } });
      // if (oldUser) {
      //   return res.status(203).json({
      //     success: false,
      //     message: "User Already Registered With This Email",
      //   });
      // }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      let profilePicture = null;

      // Upload the profile picture if available
      if (req.file) {
        console.log("Inside File Uploading...");
        const getUploadPicture = await uploadPicture(req);
        profilePicture = getUploadPicture ? getUploadPicture.Filename : null;
      }

      // Create new user data
      const newUser = await db.User.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hashedPassword,
        profile_picture: profilePicture,
        isVerifiedEmail: false, // Add a field to track email verification status
      });

      const findCurrentUser = await db.User.findOne({
        where: {
          email: data.email,
        },
      });
      console.log(findCurrentUser.id);
      // Ensure the user has been created successfully and has an ID
      if (!findCurrentUser.id) {
        throw new Error("User ID could not be retrieved after creation");
      }

      console.log("New User ID: ", findCurrentUser.id);

      // Generate email verification token
      const secretKey = process.env.VERIFY_TOKEN;
      const verificationToken = jwt.sign(
        { id: findCurrentUser.id, email: newUser.email }, // Using newUser.id here
        secretKey,
        { expiresIn: "1h" }
      );
      const verificationUrl = `${process.env.CORS_ALLOWED_URL}/verify_email/${verificationToken}`;

      // Send the verification email
      await sendMail(
        data.email,
        "Verify Your Email",
        `Hi, ${data.first_name}, please verify your email by clicking the link below: ${verificationUrl}`,
        `<h1>Hello, ${data.first_name}</h1> 
         <p>Thank you for registering! Please verify your email by clicking the link below:</p>
         <a href="${verificationUrl}">Verify Email</a>`
      );

      return res.status(200).json({
        success: true,
        message:
          "User Registered Successfully. Please check your email to verify your account.",
        data: {
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.log("Error during registration: ", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  });
};

module.exports = registerUser;
