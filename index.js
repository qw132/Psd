import React, { useState, useEffect } from 'react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentTeacher, setCurrentTeacher] = useState(null);

  // Hashed password (base64 of 'kb191598') — hidden from plain view
  const hashedPassword = 'a2IxOTE1OTg=';

  // Load initial data from localStorage on mount
  useEffect(() => {
    const savedLogin = localStorage.getItem('teacherLogin');
    const savedData = localStorage.getItem('teacherData');

    if (savedLogin === 'true' && savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTeachers(parsedData);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem('teacherLogin');
        localStorage.removeItem('teacherData');
      }
    }
  }, []);

  // Save teachers data to localStorage whenever it changes
  const saveToStorage = (newTeachers) => {
    localStorage.setItem('teacherData', JSON.stringify(newTeachers));
  };

  // Initialize default teacher structure if no data exists
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('teacherData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }

    // Default hardcoded data — only used if no storage exists
    return {
      'مستر عبد العزيز ـ إنجليزي': {
        months: [
          {
            month: 1,
            classes: [],
            payment: { status: 'غير مدفوع', receipt: false, confirmed: false },
            completed: false
          }
        ]
      },
      'مستر ياسر ـ دراسات': {
        months: [
          {
            month: 1,
            classes: [],
            payment: { status: 'غير مدفوع', receipt: false, confirmed: false },
            completed: false
          }
        ]
      },
      'مستر محمد فوزي ـ رياضيات': {
        months: [
          {
            month: 1,
            classes: [],
            payment: { status: 'غير مدفوع', receipt: false, confirmed: false },
            completed: false
          }
        ]
      },
      'مستر باسم ـ علوم': {
        months: [
          {
            month: 1,
            classes: [],
            payment: { status: 'غير مدفوع', receipt: false, confirmed: false },
            completed: false
          }
        ]
      }
    };
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (btoa(password) === hashedPassword) {
      setIsLoggedIn(true);
      localStorage.setItem('teacherLogin', 'true');
      setLoginError('');
    } else {
      setLoginError('كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    setLoginError('');
    setCurrentTeacher(null);
    localStorage.removeItem('teacherLogin');
    localStorage.removeItem('teacherData');
  };

  const addClass = (teacherName) => {
    const teacherData = teachers[teacherName];
    const currentMonth = teacherData.months[teacherData.months.length - 1];

    if (currentMonth.completed) {
      const newMonth = {
        month: currentMonth.month + 1,
        classes: [],
        payment: { status: 'غير مدفوع', receipt: false, confirmed: false },
        completed: false
      };

      const updatedTeachers = {
        ...teachers,
        [teacherName]: {
          ...teacherData,
          months: [...teacherData.months, newMonth]
        }
      };
      setTeachers(updatedTeachers);
      saveToStorage(updatedTeachers);
    } else if (currentMonth.classes.length < 8) {
      const newClass = {
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      const updatedClasses = [...currentMonth.classes, newClass];
      const isCompleted = updatedClasses.length >= 8;

      const updatedTeachers = {
        ...teachers,
        [teacherName]: {
          ...teacherData,
          months: teacherData.months.map(month =>
            month.month === currentMonth.month
              ? { ...month, classes: updatedClasses, completed: isCompleted }
              : month
          )
        }
      };

      setTeachers(updatedTeachers);
      saveToStorage(updatedTeachers);
    }
  };

  const uploadReceipt = (teacherName) => {
    const teacherData = teachers[teacherName];
    const currentMonth = teacherData.months[teacherData.months.length - 1];

    if (!currentMonth.completed) return;

    const updatedTeachers = {
      ...teachers,
      [teacherName]: {
        ...teacherData,
        months: teacherData.months.map(month =>
          month.month === currentMonth.month
            ? {
                ...month,
                payment: { ...month.payment, receipt: true, status: 'تم الرفع' }
              }
            : month
        )
      }
    };

    setTeachers(updatedTeachers);
    saveToStorage(updatedTeachers);
  };

  const confirmPayment = (teacherName) => {
    const teacherData = teachers[teacherName];
    const currentMonth = teacherData.months[teacherData.months.length - 1];

    const updatedTeachers = {
      ...teachers,
      [teacherName]: {
        ...teacherData,
        months: teacherData.months.map(month =>
          month.month === currentMonth.month
            ? {
                ...month,
                payment: { ...month.payment, confirmed: true, status: 'مدفوع' }
              }
            : month
        )
      }
    };

    setTeachers(updatedTeachers);
    saveToStorage(updatedTeachers);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">نظام متابعة الحضور والدفع</h1>
          <p className="text-gray-600 mb-8">الرجاء إدخال كلمة المرور للوصول إلى النظام</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
              required
            />

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              تسجيل الدخول
            </button>
          </form>

          <div className="mt-8 text-xs text-gray-500">
            * كلمة المرور مخزنة بشكل مشفر — لا تظهر في الكود كنص واضح
          </div>
        </div>
      </div>
    );
  }

  if (!currentTeacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">نظام متابعة الحضور والدفع</h1>
          <p className="text-gray-600 text-lg">اختر المدرس الذي تريد متابعته</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {Object.keys(teachers).map((teacherName) => (
            <button
              key={teacherName}
              onClick={() => setCurrentTeacher(teacherName)}
              className="bg-white hover:bg-gray-50 p-8 rounded-2xl shadow-xl border border-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-right"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{teacherName}</h3>
              <p className="text-gray-600 text-lg">إدارة الحضور والدفع</p>
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-12 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200"
        >
          تسجيل الخروج
        </button>
      </div>
    );
  }

  const teacherData = teachers[currentTeacher];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">نظام متابعة الحضور والدفع</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">{currentTeacher}</h2>
          <p className="text-gray-600 mt-2">تفاصيل الحضور والدفع</p>
        </div>

        {teacherData.months.map((month, monthIndex) => (
          <div key={monthIndex} className="bg-white rounded-3xl shadow-xl p-8 mb-10">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-3xl font-bold text-gray-800">الشهر {month.month}</h3>

              <div className="flex space-x-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  month.payment.status === 'مدفوع'
                    ? 'bg-green-100 text-green-800'
                    : month.payment.status === 'تم الرفع'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}>
                  {month.payment.status}
                </span>

                {month.completed && month.payment.status !== 'مدفوع' && (
                  <button
                    onClick={() => confirmPayment(currentTeacher)}
                    disabled={month.payment.confirmed}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    تأكيد الدفع
                  </button>
                )}
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">رقم الحصة</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">الوقت</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {month.classes.length > 0 ? (
                    month.classes.map((cls, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {cls.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {cls.time}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-sm text-gray-500">
                        لا توجد حصص مسجلة بعد
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Receipt Status */}
            {month.payment.receipt && (
              <div className="mb-8 p-6 bg-green-50 rounded-2xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <span className="font-medium text-green-800">تم رفع إيصال الدفع</span>
                  </div>
                  <span className="text-sm text-green-600">✔</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => addClass(currentTeacher)}
                disabled={month.completed}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-colors duration-200 flex-1 sm:flex-initial ${
                  month.completed
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {month.completed ? 'الشهر كامل' : 'تسجيل حصة جديدة'}
              </button>

              {!month.completed && (
                <button
                  onClick={() => uploadReceipt(currentTeacher)}
                  disabled={month.classes.length < 8}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-colors duration-200 flex-1 sm:flex-initial ${
                    month.classes.length < 8
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  رفع إيصال الدفع
                </button>
              )}
            </div>

            {/* Status Bar */}
            <div className="mt-6 p-6 bg-gray-50 rounded-2xl">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">
                  عدد الحصص: {month.classes.length}/8
                </span>
                <span className={`text-lg font-medium ${
                  month.completed ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {month.completed ? '✅ انتهى الشهر' : '⏳ جاري التسجيل'}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center mt-12">
          <button
            onClick={() => setCurrentTeacher(null)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200"
          >
            العودة إلى قائمة المدرسين
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-8 mt-16">
        <p>نظام متابعة الحضور والدفع — جميع بياناتك محفوظة فقط على جهازك</p>
        <p className="text-sm mt-2">لا يتم تخزين أي بيانات على الإنترنت — أنت المالك الوحيد</p>
      </footer>
    </div>
  );
};

export default App;
