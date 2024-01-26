// backend/routes/user.js
const express = require('express');
const zod=require("zod");
const router = express.Router();
const {User} =require("../db");
const {JWT_SECRET}=require("../config");
const jwt=require("jsonwebtoken");
const {middleware} =require("../middleware");

const signupSchema=zod.object({
    username:zod.string(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string()
})



router.post("/signup",async (req,res)=>{
    const body=req.body;
    const {success}=signupSchema.safeParse(body);

    //validation
    if(!success){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const user=User.findOne({
        username:body.username
    })

    //checking if exist already or not
    if(user._id){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const dbUser=await User.create({
        username: body.username,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
    });

    const userId=dbUser._id;
    //create new account
    await Account.create({
        userId,
        balance:1 +Math.random()*10000
    })




    const token=jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        message: "User created successfully",
	    token: token
    })
})

const signinSchema=zod.object({
    username:zod.string().email(),
    password:zod.string()
})

router.post("/signin",async (req,res)=>{
    const {success}=signinSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect Inputs"
        })
    }
    const dbuser=await User.findOne({
        username:req.body.username,
        password:req.body.password
    })

    if(dbuser){
        const token=jwt.sign({
            userId:dbuser._id
        })
        res.json({
            token:token
        })
        return ;
    }
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody=zod.object({
    password:zod.string().optional(),
    firstname:zod.string().optional(),
    lastName:zod.string().optional(),
})

router.put("/",middleware,async(req,res)=>{
     const {success}=updateBody.safeParse(req.body);
     if(!success){
        res.status(411).json({
           message:"Error while updating the information"
        })
     }
     await User.updateOne(req.body,{
        _id:req.userId
     })
     res.json({
        message:"Updated Successfully"
     })
})

router.get("/bulk",async(req,res)=>{
    const filter=req.query.filter || "";
    const users=await User.find({
        $or:[
            {
                firstName:{
                    "regex":filter
                }
            },
            {
                lastName:{
                    "regex":filter
                }
            }
        ]
    });

    res.json({
        user:users.map(user=>({
            username:user.username,
            firstname:user.firstName,
            lastname:user.lastName,
            _id:user._id
        }))
    })

})

module.exports = router;