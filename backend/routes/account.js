const express=require("express");
const {Account}=require("../db");
const {middleware}=require("../middleware");
const mongoose=require("mongoose");
const router=express.Router();

router.get("/balance",middleware,async(req,res)=>{
    const account= await Account.findOne({
        userId:req.userId
    });
    res.json({
        balance:account.balance
    })
});

router.post("/transfer",middleware,async(req,res)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    const {amount,to}=req.body;
    //fetch account
    const account=await Account.findOne({userId:req.userId}).session(session);
    if(!account || account.balance<amount){
        await session.abortTransaction();
        return res.status(411).json({
            message:"Insufficient Balance"
        });
    }
   //fetch account
    const toaccount=await Account.findOne({userId:to}).session(session);
    if(!toaccount){
        await session.abortTransaction();
        return res.status(411).json({
            message:"Invalid account"
        });
    }
    //perform the transaction
    await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
    await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session);
    await session.commitTransaction();

    res.json({
        message:"Transfer successful"
    })
})


module.exports=router;