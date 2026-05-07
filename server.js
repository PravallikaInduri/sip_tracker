const express=require("express");
const investorRoutes = require("./routes/sipinvestorroute");

const app=express();
app.use(express.json());
app.use("/", investorRoutes);

app.listen(3000,()=>{
    console.log("server started");
})