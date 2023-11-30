require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const router = require("./routes/router");
 const routerQ = require("./routes/Query")
const cors = require("cors");
const cookiParser = require("cookie-parser")
const port = 5000;
const routerleave = require("./routes/Leave")

// app.get("/",(req,res)=>{
//     res.status(201).json("server created")
// });

app.use(express.json());
app.use(cookiParser());
app.use(cors());
app.use("/user",router);
 app.use("/query",routerQ);
 app.use("/leave",routerleave);


app.listen(port,()=>{
    console.log(`server start at port no : ${port}`);
})