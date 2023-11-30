const mongoose = require("mongoose");

const DB = process.env.DATABASE

const db = mongoose.connect(DB,{
    useUnifiedTopology: true,
    useNewUrlParser: true,

}).then(()=> console.log("DataBase Connected")).catch((errr)=>{
    console.log(errr);
    const dbb = db.collection("queries").aggregate([{
        $lookup:{
            from:"users",
            localField: "userid",
            foreignField: "_id",
            as: "users"
        }
    }])
})

//mongoose.connect("mongodb+srv://rajmohan51502:vo5zORfxndu72DSl@cluster0.wwgxqxn.mongodb.net/Capstone", {});