
const express = require("express");
const cors = require("cors");
const connectDB = require("./database");

const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);

app.get("/", (req,res)=>{
    res.send("Exam Platform Running");
});

app.listen(5000, ()=>{
    console.log("Server running on port 5000");
});
