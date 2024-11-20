const db = require("../../../models/index.js");
const jwtDecoder = require("../../Helper/jwtDecoder.js");
const Paths = require("../../Config/Paths.js");

const fetchUsers = async (req, res) => {
  try {
    console.log("req.query : ", req.query.id);
    // Decode the token and get the user's ID from it
    if (!req.query.id) {
      const responseFromToken = await jwtDecoder(req);
      if (!responseFromToken || !responseFromToken.id) {
        return res.status(400).json({
          success: false, 
          message: "Unauthorized! Please log in first",
        });
      }
      
      // Fetch the specific user using the ID from the token
      const getSpecificUser = await db.User.findOne({
        where: { id: responseFromToken.id },
      });

      if (!getSpecificUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Construct the response for the specific user
      const userResponse = {
        id: getSpecificUser.id,
        first_name: getSpecificUser.first_name,
        last_name: getSpecificUser.last_name,
        email: getSpecificUser.email,
        profile_picture: Paths.profile_url + getSpecificUser.profile_picture,
      };

      // Fetch all users
      const allUsers = await db.User.findAll();

      if (!allUsers || allUsers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No users found",
        });
      }

      // Send the response back with the specific user and all users data
      return res.status(200).json({
        success: true,
        currentUser: userResponse,
        allUsers: allUsers,
      });
    } else {
      const userId = req.query.id;
      console.log("UserId : ", userId);
      try {
        const responseFromToken = await jwtDecoder(req);

        console.log(responseFromToken);
        if (!responseFromToken) {
          return res.status(400).json({
            success: false,
            message: "Unauthorized! Please log in first",
          });
        }

        const getSpecificUser = await db.User.findOne({
          where: { id: userId },
        });

        if (!getSpecificUser) {
          return res.status(404).json({
            success: false,
            message: "User Not Found",
          });
        }

        const getSpecificUserData = {
          id: getSpecificUser.id,
          first_name: getSpecificUser.first_name,
          last_name: getSpecificUser.last_name,
          email: getSpecificUser.email,
          profile_picture: Paths.profile_url + getSpecificUser.profile_picture,
        };

        return res.status(200).json({
          success: true,
          user: getSpecificUserData,
        });
      } catch (error) {}
    }
  } catch (error) {
    console.error("Error in getUsers function:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

module.exports = fetchUsers;
