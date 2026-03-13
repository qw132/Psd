
const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");

router.post("/create", async (req,res)=>{
    const exam = new Exam(req.body);
    await exam.save();
    res.json(exam);
});

router.get("/:code", async (req,res)=>{
    const exam = await Exam.findOne({code:req.params.code});
    res.json(exam);
});

module.exports = router;
