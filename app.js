// --- بيانات مؤقتة في LocalStorage ---
let examsData = JSON.parse(localStorage.getItem('examsData') || '[]');
let examResults = JSON.parse(localStorage.getItem('examResults') || '[]');

// --- تنبيهات ---
function showAlert(element, message, type) {
    element.textContent = message;
    element.className = 'alert ' + (type === 'error' ? 'alert-error' : 'alert-success');
    element.style.display = 'block';
    setTimeout(() => { element.style.display = 'none'; }, 3000);
}

// --- الصفحة الرئيسية للطالب ---
function initHome() {
    const app = document.getElementById('app');
    app.innerHTML = `
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

function checkExamCode() {
    const code = document.getElementById('exam-code').value.trim();
    const alertBox = document.getElementById('home-alert');
    if(!code) { showAlert(alertBox,'الرجاء إدخال كود الامتحان','error'); return; }
    const exam = examsData.find(e => e.code === code);
    if(!exam){ showAlert(alertBox,'كود الامتحان غير صحيح','error'); return; }
    sessionStorage.setItem('currentExamId', exam.id);
    window.location.href = 'exam.html';
}

// --- لوحة الإدارة ---
function initAdmin(){
    const app = document.getElementById('app');
    app.innerHTML = `
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
        <button onclick="createAdminExam()">إنشاء الامتحان</button>`;
    } else if(section==='results'){
        if(examResults.length===0){ content.innerHTML='<p>لا توجد نتائج بعد</p>'; return; }
        let table = '<table><tr><th>الطالب</th><th>الهاتف</th><th>الامتحان</th><th>تاريخ</th></tr>';
        examResults.forEach(r => {
            table += `<tr><td>${r.student.name}</td><td>${r.student.phone}</td><td>${r.examTitle}</td><td>${new Date(r.submittedAt).toLocaleString()}</td></tr>`;
        });
        table += '</table><button onclick="exportCSV()">تحميل CSV</button>';
        content.innerHTML = table;
    }
}

// إنشاء الامتحان
function createAdminExam(){
    const title = document.getElementById('adm-title').value.trim();
    const code = document.getElementById('adm-code').value.trim();
    const duration = parseInt(document.getElementById('adm-duration').value.trim());
    const link = document.getElementById('adm-link').value.trim();
    if(!title || !code || !duration){ alert('املأ جميع البيانات'); return; }
    const id = 'exam'+(examsData.length+1);
    examsData.push({id,title,code,duration,link,questions:[]});
    localStorage.setItem('examsData',JSON.stringify(examsData));
    alert('تم إنشاء الامتحان بنجاح');
}

// تصدير CSV
function exportCSV(){
    let csv = 'الطالب,الهاتف,الامتحان,تاريخ\n';
    examResults.forEach(r => { csv += `${r.student.name},${r.student.phone},${r.examTitle},${new Date(r.submittedAt).toLocaleString()}\n`; });
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'results.csv';
    a.click();
                                    }
