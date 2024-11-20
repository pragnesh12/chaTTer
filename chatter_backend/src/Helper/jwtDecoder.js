const jwt = require("jsonwebtoken");

const jwtDecoder = async (req, res) => {
  try {
    // if (!req.headers.authorization) {
    //   console.log("Error Showing");
    //   return res.status(400).send({
    //     success: false,
    //     message: "Invalid Credentials",
    //   });
    // }

    const VerifiedToken = await req.headers.authorization.split(" ")[1];
    const secretKey = process.env.ACCESS_TOKEN;
    if (VerifiedToken && secretKey) {
      const isVerifiedToken = jwt.verify(VerifiedToken, secretKey);

      if (!isVerifiedToken) {
        return res.status(400).send({
          success: false,
          message: "Unauthorized! Please Login First",
        });
      }
      return isVerifiedToken;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Please Try To Login Again!",
    });
  }
};

module.exports = jwtDecoder;
