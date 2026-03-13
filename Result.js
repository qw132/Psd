
const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
    studentName:String,
    studentPhone:String,
    examCode:String,
    answers:[String],
    score:Number,
    submittedAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Result", ResultSchema);
