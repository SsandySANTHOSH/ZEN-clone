const express = require("express");
const leavedb = require("../models/LeaveSchema");
const router = express.Router();


/////create Query

router.post("/create", async (req, res) => {

    const { days, from, to,reason,userid} = req.body;
  
    if (!days || !from || !to || !reason ||!userid ) {
        res.status(422).json({ error: "fill all the details" })
    }
  
    try {
  
      const finalleave = new leavedb({
        days, from, to,reason,userid     });
  
    // here password hasing
  
    const storeData = await finalleave.save();

  
    // console.log(storeData);
    res.status(200).json({ status: 200, storeData })
  
    } catch (error) {
        //res.status(400).json(error);
        console.log("catch block error");
    }
  
  });
  
  
  ///////////userleave

  router.get("/getUserleaveOnly/:_id", async function (req, res, next) {
    try {
        console.log(req.params._id)
  
  
      const response = await leavedb.find({userid:req.params._id});
     // if (response.length > 0) {
        res.status(200).json({
          message: "Query Fetched Successfully!!!",
          data: response,
          success: true,
        });
    //   } else {
    //     res.status(200).json({
    //       message: "No Users!!!",
    //       success: false,
    //     });
    //   }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error,
        success: false,
      });
    }
  });


  //////
  
  router.get("/getUserLeave/:_id", async function (req, res, next) {
    try {
        console.log(req.params._id)
  
  
      const response = await leavedb.findOne({_id:req.params._id});
     // if (response.length > 0) {
        res.status(200).json({
          message: "Users Fetched Successfully!!!",
          data: response,
          success: true,
        });
    //   } else {
    //     res.status(200).json({
    //       message: "No Users!!!",
    //       success: false,
    //     });
    //   }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error,
        success: false,
      });
    }
  });


  /////


  router.put("/leavepick/:_id", async (req, res) => {
    try {
     // console.log(req.params._id);
    //  console.log(req.query._id);
      const post = await leavedb.findByIdAndUpdate(
        {userid: req.params._id },
        { new: true }
        
      );
      if (!post) return res.status(404).send("Post not found");
      res.send(post);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  
  ////////getallleave
  
  router.get("/getAllLeave", async function (req, res, next) {
    try {
      const response = await leavedb.find();
      if (response.length > 0) {
        res.status(200).json({
          message: "Users Fetched Successfully!!!",
          data: response,
          success: true,
        });
      } else {
        res.status(200).json({
          message: "No Users!!!",
          data: [],
          success: false,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error,
        success: false,
      });
    }
  });
  
  
  

module.exports = router;
