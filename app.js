
function startExam(){
const code=document.getElementById("code").value;
localStorage.setItem("examCode",code);
window.location="exam.html";
}

async function createExam(){

const title=document.getElementById("title").value;
const code=document.getElementById("code").value;
const duration=document.getElementById("duration").value;

await fetch("/api/exams/create",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({title,code,duration,questions:[]})
});

alert("Exam Created");
}

async function loadExam(){

const code=localStorage.getItem("examCode");

const res=await fetch("/api/exams/"+code);
const exam=await res.json();

document.getElementById("title").innerText=exam.title;

}

if(window.location.pathname.includes("exam.html")){
loadExam();
}

function submitExam(){
alert("تم التسليم");
}
