const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const VerifiedToken = await req.headers.authorization.split(" ")[1];
    const secretKey = process.env.ACCESS_TOKEN;
    const isVerifiedToken = jwt.verify(VerifiedToken, secretKey);

    if (!isVerifiedToken) {
      return res.status(400).send({
        success: false,
        message: "Unauthorized! Please Login First",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Please Try To Login Again!",
    });
  }
};
