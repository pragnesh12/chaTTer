const path = require("path");

// Create an empty object to export
const Paths = {};

// Get the resolved path to the current file
// Directly use __filename in CommonJS

// Define paths
const PUBLIC = path.join(__dirname, "public");
Paths.profile_url = process.env.BASE_URL + "/public/";
Paths.profile_path = path.join(PUBLIC, "public");

// Export Paths
module.exports = Paths;
