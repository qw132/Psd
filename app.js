/* --- بيانات مؤقتة في LocalStorage --- */
let examsData = JSON.parse(localStorage.getItem('examsData') || '[]');
let examResults = JSON.parse(localStorage.getItem('examResults') || '[]');

/* --- تنبيهات --- */
function showAlert(element, message, type){
    element.textContent = message;
    element.className = 'alert ' + (type==='error'?'alert-error':'alert-success');
    element.style.display='block';
    setTimeout(()=>{ element.style.display='none'; },3000);
}

/* --- الصفحة الرئيسية للطالب --- */
function initHome(){
    const app = document.getElementById('app');
    app.innerHTML=`
    <div class="card" style="text-align:center;">
        <h1>مرحباً بك في منصة الامتحانات</h1>
        <p style="margin-bottom:30px; color: var(--gray);">أدخل كود الامتحان للبدء</p>
        <div class="form-group">
            <input type="text" id="exam-code" placeholder="" style="text-align:center; font-size:20px; letter-spacing:2px;">
        </div>
        <button onclick="checkExamCode()">بدء الامتحان</button>
        <div id="home-alert" class="alert"></div>
    </div>`;
}

function checkExamCode(){
    const code = document.getElementById('exam-code').value.trim();
    const alertBox = document.getElementById('home-alert');
    if(!code){ showAlert(alertBox,'الرجاء إدخال كود الامتحان','error'); return; }
    const exam = examsData.find(e => e.code===code);
    if(!exam){ showAlert(alertBox,'كود الامتحان غير صحيح','error'); return; }
    sessionStorage.setItem('currentExamId', exam.id);
    window.location.href='exam.html';
}

/* --- صفحة الامتحان للطالب --- */
function initExamPage(){
    const app = document.getElementById('app');
    const examId = sessionStorage.getItem('currentExamId');
    if(!examId){ window.location.href='index.html'; return; }
    const exam = examsData.find(e => e.id===examId);
    if(!exam){ app.innerHTML='<p>الامتحان غير موجود</p>'; return; }

    app.innerHTML=`
    <div class="card">
        <h2>${exam.title}</h2>
        <p style="color:var(--gray);">المدة: ${exam.duration} دقيقة</p>
        <div id="student-info">
            <div class="form-group"><label>الاسم الرباعي</label><input type="text" id="student-name" required></div>
            <div class="form-group"><label>رقم الهاتف</label><input type="tel" id="student-phone" required></div>
            <button onclick="startExam('${exam.id}')">دخول الامتحان</button>
        </div>
    </div>`;
}

let examTimerInterval, timeLeft;

function startExam(examId){
    const name = document.getElementById('student-name').value.trim();
    const phone = document.getElementById('student-phone').value.trim();
    if(!name||!phone){ alert('املأ جميع البيانات'); return; }

    const exam = examsData.find(e => e.id===examId);
    if(!exam) return;

    sessionStorage.setItem('currentStudent', JSON.stringify({name, phone}));
    sessionStorage.setItem('currentAnswers', JSON.stringify({}));

    // عرض الأسئلة
    renderQuestions(exam);
    startTimer(exam.duration*60);
}

function renderQuestions(exam){
    const app = document.getElementById('app');
    let html = `<div class="card"><h2>${exam.title}</h2>
    <div class="timer-box" id="exam-timer">00:00</div>
    <form id="exam-form" onsubmit="submitExam(event)">`;

    if(exam.questions.length===0){ html+='<p>لا توجد أسئلة بعد</p>'; }

    exam.questions.forEach((q,index)=>{
        html+=`<div class="question-card">
        <div class="question-text">${index+1}. ${q.text} (${q.grade} درجة)</div>`;
        if(q.type==='mcq'||q.type==='truefalse'){
            const options = q.type==='truefalse'?['صح','خطأ']:q.options;
            html+=`<div class="options-group">`;
            options.forEach(opt=>{
                html+=`<label><input type="radio" name="q_${q.id}" value="${opt}">${opt}</label>`;
            });
            html+=`</div>`;
        } else if(q.type==='short'){ html+=`<input type="text" name="q_${q.id}" placeholder="اكتب إجابتك هنا...">`; }
        else if(q.type==='paragraph'){ html+=`<textarea name="q_${q.id}" rows="4" placeholder="اكتب إجابتك هنا..."></textarea>`; }
        html+=`</div>`;
    });
    html+=`<button type="submit">تسليم الامتحان</button></form></div>`;
    app.innerHTML=html;
}

function startTimer(duration){
    timeLeft=duration;
    const display = document.getElementById('exam-timer');
    examTimerInterval = setInterval(()=>{
        let minutes=Math.floor(timeLeft/60);
        let seconds=timeLeft%60;
        display.textContent=`${minutes<10?'0':''}${minutes}:${seconds<10?'0':''}${seconds}`;
        if(--timeLeft<0){ clearInterval(examTimerInterval); submitExam(null,true); }
    },1000);
}

function submitExam(e,isAuto=false){
    if(e) e.preventDefault();
    if(!isAuto && !confirm('هل أنت متأكد من تسليم الامتحان؟')) return;
    clearInterval(examTimerInterval);

    const student = JSON.parse(sessionStorage.getItem('currentStudent'));
    const form = document.getElementById('exam-form');
    const formData = new FormData(form);
    const examId = sessionStorage.getItem('currentExamId');
    const exam = examsData.find(e=>e.id===examId);

    const answers = {};
    exam.questions.forEach(q=>{
        const val = formData.get(`q_${q.id}`);
        answers[q.id] = val||'';
    });

    examResults.push({student, examTitle: exam.title, answers, submittedAt: new Date()});
    localStorage.setItem('examResults', JSON.stringify(examResults));

    document.getElementById('app').innerHTML=`
    <div class="card" style="text-align:center;">
        <h2 style="color:var(--success)">تم التسليم بنجاح</h2>
        <p>شكراً لإتمام الامتحان</p>
        <button onclick="window.location.href='index.html'">عودة للرئيسية</button>
    </div>`;
}

/* --- لوحة الإدارة --- */
function initAdmin(){
    const app = document.getElementById('app');
    app.innerHTML=`
    <div class="card">
        <h2>لوحة إدارة الامتحانات</h2>
        <button onclick="showAdminSection('create')">إنشاء امتحان جديد</button>
        <button class="secondary" onclick="showAdminSection('results')">عرض النتائج</button>
        <div id="admin-content"></div>
    </div>`;
    showAdminSection('create');
}

function showAdminSection(section){
    const content = document.getElementById('admin-content');
    if(section==='create'){
        content.innerHTML=`
        <div class="form-group"><label>اسم الامتحان</label><input id="adm-title"></div>
        <div class="form-group"><label>كود الامتحان</label><input id="adm-code"></div>
        <div class="form-group"><label>مدة الامتحان بالدقائق</label><input type="number" id="adm-duration"></div>
        <div class="form-group"><label>رابط مباشر للامتحان (اختياري)</label><input type="text" id="adm-link"></div>
        <button onclick="createAdminExam()">إنشاء الامتحان</button>
        <h3>إدارة الأسئلة</h3>
        <div id="question-manager"></div>`;
    } else if(section==='results'){
        if(examResults.length===0){ content.innerHTML='<p>لا توجد نتائج بعد</p>'; return; }
        let table = '<table><tr><th>الطالب</th><th>الهاتف</th><th>الامتحان</th><th>تاريخ</th></tr>';
        examResults.forEach(r=>{
            table+=`<tr><td>${r.student.name}</td><td>${r.student.phone}</td><td>${r.examTitle}</td><td>${new Date(r.submittedAt).toLocaleString()}</td></tr>`;
        });
        table+='</table><button onclick="exportCSV()">تحميل CSV</button>';
        content.innerHTML=table;
    }
}

function createAdminExam(){
    const title=document.getElementById('adm-title').value.trim();
    const code=document.getElementById('adm-code').value.trim();
    const duration=parseInt(document.getElementById('adm-duration').value.trim());
    const link=document.getElementById('adm-link').value.trim();
    if(!title||!code||!duration){ alert('املأ جميع البيانات'); return; }
    const id='exam'+(examsData.length+1);
    examsData.push({id,title,code,duration,link,questions:[]});
    localStorage.setItem('examsData',JSON.stringify(examsData));
    alert('تم إنشاء الامتحان بنجاح');
    renderQuestionManager(id);
}

/* --- إدارة الأسئلة لكل امتحان --- */
function renderQuestionManager(examId){
    const manager = document.getElementById('question-manager');
    const exam = examsData.find(e=>e.id===examId);
    if(!exam) return;
    manager.innerHTML=`
        <div class="form-group"><label>نص السؤال</label><input id="q-text"></div>
        <div class="form-group"><label>نوع السؤال</label>
            <select id="q-type">
                <option value="mcq">اختياري</option>
                <option value="truefalse">صح/خطأ</option>
                <option value="short">نص قصير</option>
                <option value="paragraph">فقرة</option>
            </select>
        </div>
        <div class="form-group" id="q-options-group"></div>
        <div class="form-group"><label>الدرجة</label><input type="number" id="q-grade"></div>
        <button onclick="addQuestion('${examId}')">إضافة السؤال</button>
        <div id="questions-list"></div>
    `;
    document.getElementById('q-type').addEventListener('change',function(){
        const optDiv=document.getElementById('q-options-group');
        if(this.value==='mcq'){
            optDiv.innerHTML='<label>الخيارات مفصولة بفاصلة:</label><input id="q-options">';
        } else{ optDiv.innerHTML=''; }
    });
    renderQuestionsList(examId);
}

function addQuestion(examId){
    const exam=examsData.find(e=>e.id===examId);
    const text=document.getElementById('q-text').value.trim();
    const type=document.getElementById('q-type').value;
    const grade=parseInt(document.getElementById('q-grade').value.trim())||1;
    let options=[];
    if(type==='mcq'){ options=document.getElementById('q-options').value.split(',').map(s=>s.trim()); }
    if(!text){ alert('اكتب نص السؤال'); return; }
    const id='q'+(exam.questions.length+1);
    exam.questions.push({id,text,type,options,grade});
    localStorage.setItem('examsData',JSON.stringify(examsData));
    renderQuestionsList(examId);
    document.getElementById('q-text').value='';
    document.getElementById('q-grade').value='';
    if(type==='mcq') document.getElementById('q-options').value='';
}

function renderQuestionsList(examId){
    const exam=examsData.find(e=>e.id===examId);
    const listDiv=document.getElementById('questions-list');
    if(!exam) return;
    if(exam.questions.length===0){ listDiv.innerHTML='<p>لا توجد أسئلة بعد</p>'; return; }
    let html='<h4>قائمة الأسئلة</h4><ul>';
    exam.questions.forEach(q=>{
        html+=`<li>${q.text} (${q.type}, ${q.grade} درجة)</li>`;
    });
    html+='</ul>';
    listDiv.innerHTML=html;
}

/* --- تصدير CSV للنتائج --- */
function exportCSV(){
    let csv='الطالب,الهاتف,الامتحان,تاريخ\n';
    examResults.forEach(r=>{
        csv+=`${r.student.name},${r.student.phone},${r.examTitle},${new Date(r.submittedAt).toLocaleString()}\n`;
    });
    const blob=new Blob([csv],{type:'text/csv'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='results.csv';
    a.click();
      }
