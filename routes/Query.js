const express = require("express");
const router = express.Router();
const querydb = require("../models/QuerySchema")


/////create Query

router.post("/create", async (req, res) => {

    const { category, voice, title,desc,userid } = req.body;
  
    if (!category || !voice || !title || !desc ||!userid ) {
        res.status(422).json({ error: "fill all the details" })
    }
  
    try {
  
      const finalQuery = new querydb({
        category, voice, title,desc,userid    });
  
    // here password hasing
//console.log(finalQuery)
  
    const storeData = await finalQuery.save();
  //  console.log("usre")

  
    // console.log(storeData);
    res.status(200).json({ status: 200, storeData })
  
    } catch (error) {
        //res.status(400).json(error);
        console.log("catch block error");
    }
  
  });


  ////updating mentor id

  router.put("/querypick/:_id", async (req, res) => {
    try {
     // console.log(req.params._id);
    //  console.log(req.query._id);
      const post = await querydb.findByIdAndUpdate(
        req.query._id,
        {mentorid: req.params._id },
        { new: true }
        
      );
      if (!post) return res.status(404).send("Post not found");
      res.send(post);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  

  ////////status update


  
  router.put("/queryreopen/:_id", async (req, res) => {
    try {
      //console.log(req.params._id);
    //  console.log(req.query._id);
      const post = await querydb.findByIdAndUpdate(
        {_id:req.params._id},
        {status:"Reopen or Close" },
        { new: true }
        
      );
      if (!post) return res.status(404).send("Post not found");
      res.send(post);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  

  /////status close


  router.put("/queryclose/:_id", async (req, res) => {
    try {
     // console.log(req.params._id);
    //  console.log(req.query._id);
      const post = await querydb.findByIdAndUpdate(
        {_id:req.params._id},
        {status:"closed" },
        { new: true }
        
      );
      if (!post) return res.status(404).send("Post not found");
      res.send(post);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  //////////////
  router.put("/querystudentreopen/:_id", async (req, res) => {
    try {
     // console.log(req.params._id);
    //  console.log(req.query._id);
      const post = await querydb.findByIdAndUpdate(
        {_id:req.params._id},
        {status:"Assigned" },
        { new: true }
        
      );
      if (!post) return res.status(404).send("Post not found");
      res.send(post);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  
  
  
  
  router.get("/getUserQuery/:_id", async function (req, res, next) {
    try {
        console.log(req.params._id)
  
  
      const response = await querydb.findOne({_id:req.params._id});
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


  //////getUserQuery

  
  router.get("/getUserQueryonly/:_id", async function (req, res, next) {
    try {
      const response = await querydb.find({userid:req.params._id});
      console.log(req.params._id)
      // if (response.length > 0) {
        res.status(200).json({
          message: "Query Fetched Successfully!!!",
          data: response,
          success: true,
        });
      // } else {
      //   res.status(200).json({
      //     message: "No Query!!!",
      //     data: [],
      //     success: false,
      //   });
     // }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error,
        success: false,
      });
    }
  });

  
  ////////getuser
  
  router.get("/getAllQuery", async function (req, res, next) {
    try {
      const response = await querydb.find();
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


  /////
  router.get("/getAllQuery/:_id", async function (req, res, next) {
    try {
        console.log(req.params._id)


      const response = await querydb.findOne({_id:req.params._id});
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
  
  ////////////////
  router.get("/getmentorQuery/:_id", async function (req, res, next) {
    try {
        console.log(req.params._id)


      const response = await querydb.find({mentorid:req.params._id});
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
  
  
  

module.exports = router;
