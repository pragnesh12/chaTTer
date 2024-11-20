const fs = require("fs");

const uploadPicture = async (req) => {
  var dir = `./public/`;

  console.log("Files : ", req.file);
  console.log("Daata : ", req.body);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  var fileKeys = req.file;
  var newFileName = `${Date.now()}.jpg`;
  var newPath = `./public/users/${newFileName}`;

  var imageBinary = fileKeys.buffer;

  try {
    fs.writeFile(newPath, imageBinary, "base64", function (err) {});
  } catch (error) {}

  var data = {
    Filename: newFileName,
    Mimetype: fileKeys.mimetype,
    Size: fileKeys.size,
    DateCreated: Date("now"),
  };
  return data;
};

module.exports = uploadPicture;
