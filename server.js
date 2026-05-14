require("dotenv").config();
const express=require("express");
const cors = require("cors");
const investorRoutes = require("./routes/sipinvestorroute");

const app=express();
app.use(cors());
app.use(express.json());
app.use("/api", investorRoutes);

app.listen(5000,()=>{
    console.log("Server started on http://localhost:5000");
})