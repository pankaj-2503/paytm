const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://pk:A9CLbBxlj265ZOEk@cluster0.s0ien9j.mongodb.net/")

const userSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})



const User=mongoose.model("User",userSchema);

const accountSchema=new mongoose.Schema({
    userId:{
        //reference to user schema
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    balance: {
        type:Number,
        required:true
    }
})

const Account=mongoose.model("Account",accountSchema);
module.exports={
    User,
    Account,
}