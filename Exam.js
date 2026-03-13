
const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    text:String,
    type:String,
    options:[String],
    answer:String
});

const ExamSchema = new mongoose.Schema({
    title:String,
    code:String,
    duration:Number,
    questions:[QuestionSchema],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Exam", ExamSchema);
