const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const userRoute = require("./route/userRoute.js");
const adminRoute = require("./route/adminRoute.js");

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoute);
app.use("/api/appointments",adminRoute);

app.get("/",(req,res)=>{
    res.send("server running")
})

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});