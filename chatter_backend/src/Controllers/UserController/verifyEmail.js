const jwt = require("jsonwebtoken");
const db = require("../../../models/index.js");

const verifyEmail = async (req, res) => {
  console.log("Verify Called");
  const userToken = req.query.token; // We will no longer need req.query.id

  try {
    // Check if token is provided
    if (!userToken) {
      return res.status(400).json({
        success: false,
        message: "Token is missing.",
      });
    }

    // Verify the token and extract the user ID from it
    const decodedToken = jwt.verify(userToken, process.env.VERIFY_TOKEN);
    const userId = decodedToken.id; // Extract the userId from the decoded token payload

    console.log("User id: ", decodedToken.id);

    // Find the user based on the extracted userId
    const existingUser = await db.User.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    // Update user to mark email as verified
    if (decodedToken) {
      await db.User.update({ isVerifiedEmail: 1 }, { where: { id: userId } });
      return res.status(200).json({
        success: true,
        message: "Your email has been verified successfully.",
        user: {
          id: existingUser.id,
          email: existingUser.email,
          first_name: existingUser.first_name,
          last_name: existingUser.last_name,
        },
      });
    }
  } catch (error) {
    console.log("Error during verification: ", error);

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Token has expired. Please request a new verification email.",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "Invalid token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during verification.",
    });
  }
};

module.exports = verifyEmail;
