const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"pending"
    },
    gender:{
        type:String,
        enum:["male","female","other"],default:"other"
    },
    adminResponse:{
        type:String,
    },
    suggestedDate:{
        type:String,
    }
},{timestamps:true});

module.exports = mongoose.model("appointement",appointmentSchema);