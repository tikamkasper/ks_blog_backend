require("dotenv").config({ path: "./.env" });
const { PORT } = require("./config");

const connectDB = require("./db/dbConnection.js");

const { app } = require("./app.js");

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
