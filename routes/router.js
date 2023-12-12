const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const nodemailer = require("nodemailer");
const jwt  = require("jsonwebtoken");

const keysecret = process.env.SECRET_KEY



// email config

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
}) 


// for user registration

router.post("/register", async (req, res) => {

    const { fname, email,role,course,phonenumber,password, cpassword } = req.body;

    if (!fname || !email || !course || !phonenumber|| !password || !cpassword) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {

        const preuser = await userdb.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This Email is Already Exist" })
        } else if (password !== cpassword) {
            res.status(422).json({ error: "Password and Confirm Password Not Match" })
        } else {
            const finalUser = new userdb({
                fname, email, role,course,phonenumber,password, cpassword
            });

            // here password hasing

            const storeData = await finalUser.save();

            // console.log(storeData);
            res.status(200).json({ status: 200, storeData })
        }

    } catch (error) {
        res.status(422).json(error);
       // console.log("catch block error");
    }

});







///getAllUsers



router.get("/getAllUser/:_id", async function (req, res, next) {
    try {
        console.log(req.params._id)


      const response = await userdb.findOne({_id:req.params._id});
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

  ////////getuser

  router.get("/getAllUser", async function (req, res, next) {
    try {
      const response = await userdb.find();
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




  /////////////////get users only



  router.get("/getStudentonly", async function (req, res, next) {
    try {
      const response = await userdb.find({role:"student"});
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


  //////////////////get mentor


    router.get("/getMentoronly", async function (req, res, next) {
    try {
      const response = await userdb.find({role:"mentor"});
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

  



    


// user Login

router.post("/login", async (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {
       const userValid = await userdb.findOne({email:email});

        if(userValid){

            const isMatch = await bcrypt.compare(password,userValid.password);

            if(!isMatch){
                res.status(422).json({ error: "invalid details"})
            }else{

                // token generate
                const token = await userValid.generateAuthtoken();

                // cookiegenerate
                res.cookie("usercookie",token,{
                    expires:new Date(Date.now()+9000000),
                    httpOnly:true
                });

                const result = {
                    userValid,
                    token
                }
                res.status(200).json({status:200,result})
            }
        }else{
            res.status(400).json({status:400,message:"invalid details"});
        }

    } catch (error) {
        res.status(400).json({status:400,error});
       // console.log("catch block");
    }
});



// user valid
router.get("/validuser",authenticate,async(req,res)=>{
    try {
        const ValidUserOne = await userdb.findOne({_id:req.userId});
        res.status(200).json({status:200,ValidUserOne});
    } catch (error) {
        res.status(400).json({status:400,error});
    }
});


// user logout

router.get("/logout",authenticate,async(req,res)=>{
    try {
        req.rootUser.tokens =  req.rootUser.tokens.filter((curelem)=>{
            return curelem.token !== req.token
        });

        res.clearCookie("usercookie",{path:"/"});

        req.rootUser.save();

        res.status(200).json({status:200})

    } catch (error) {
        res.status(400).json({status:400,error})
    }
});



// send email Link For reset Password
router.post("/sendpasswordlink",async(req,res)=>{
    //console.log(req.body)

    const {email} = req.body;

    if(!email){
        res.status(400).json({status:400,message:"Enter Your Email"})
    }

    try {
        const userfind = await userdb.findOne({email:email});

        // token generate for reset password
        const token = jwt.sign({_id:userfind._id},keysecret,{
            expiresIn:"120s"
        });
        
        const setusertoken = await userdb.findByIdAndUpdate({_id:userfind._id},{verifytoken:token},{new:true});


        if(setusertoken){
            const mailOptions = {
                from:process.env.EMAIL,
                to:email,
                subject:" Email For password Reset from MOHAN Application",
                text:`This Link Valid For 2 MINUTES https://capstonebackend-ivdw.onrender.com/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`
            }

            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log("error",error);
                    res.status(400).json({status:400,message:"Email not send"})
                }else{
                    console.log("Email sent",info.response);
                    res.status(200).json({status:200,message:"Email sent Succsfully"})
                }
            })

        }

    } catch (error) {
        res.status(401).json({status:401,message:"invalid user"})
    }

});


// verify user for forgot password time
router.get("/forgotpassword/:id/:token",async(req,res)=>{
    const {id,token} = req.params;

    try {
        const validuser = await userdb.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token,keysecret);

       // console.log(verifyToken)

        if(validuser && verifyToken._id){
            res.status(200).json({status:200,validuser})
        }else{
            res.status(400).json({status:400,message:"user not exist"})
        }

    } catch (error) {
        res.status(400).json({status:400,error})
    }
});


////logoutuser


router.get('/users/logout', async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


//filteruser

// Get a single user by id and update 
router.put("/:_id", async (req, res) => {
  try {
    
    const post = await userdb.findByIdAndUpdate(
      req.params._id,
      { fname: req.body.fname, email: req.body.email, role:req.body.role,
         course:req.body.course, phonenumber:req.body.phonenumber },
      { new: true }
      
    );
    console.log(req.params._id)

    if (!post) return res.status(404).send("Post not found");
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single post by id
router.get("/:id", async (req, res) => {
  try {
    const post = await userdb.findById(req.params._id);
    if (!post) return res.status(404).send("Post not found");
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Deleting a post by id
router.delete("/:_id", async (req, res) => {
  try {
    const post = await userdb.findByIdAndRemove(req.params._id);
    if (!post) return res.status(404).send("Post not found");
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
    
  }
});




// change password


router.post("/:id/:token",async(req,res)=>{
    const {id,token} = req.params;

    const {password} = req.body;

    try {
        const validuser = await userdb.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token,keysecret);

        if(validuser && verifyToken._id){
            const newpassword = await bcrypt.hash(password,12);

            const setnewuserpass = await userdb.findByIdAndUpdate({_id:id},{password:newpassword});

            setnewuserpass.save();
            res.status(200).json({status:200,setnewuserpass})

        }else{
            res.status(400).json({status:400,message:"user not exist"})
        }
    } catch (error) {
        res.status(400).json({status:400,error})
    }
})



module.exports = router;



// 2 way connection
// 12345 ---> e#@$hagsjd
// e#@$hagsjd -->  12345

// hashing compare
// 1 way connection
// 1234 ->> e#@$hagsjd
// 1234->> (e#@$hagsjd,e#@$hagsjd)=> true