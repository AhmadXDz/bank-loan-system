import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Home from './screens/Home';
import Loans from './screens/Loans';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import ApplyLoan from './screens/ApplyLoan';
import Profile from './screens/Profile';

function App() {
  const { t } = useTranslation();

  return (
    <div className="app-wrapper">
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apply/:loanId" element={<ApplyLoan />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      
      <footer style={{ 
        backgroundColor: 'var(--primary)', 
        color: 'white', 
        padding: '50px 0 30px', 
        marginTop: '80px',
        borderTop: '4px solid var(--secondary)'
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '40px',
            marginBottom: '40px',
            textAlign: 'right'
          }}>
            {/* Bank Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <span className="material-icons-round" style={{ color: 'var(--secondary)' }}>account_balance</span>
                <h3 style={{ color: 'white', margin: 0 }}>{t('common.bankName')}</h3>
              </div>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', lineHeight: '1.6' }}>
                نظام بنكي متطور مدعوم بالذكاء الاصطناعي لتسهيل الحصول على القروض البنكية بأفضل المعايير الهندسية.
              </p>
            </div>

            {/* Student Info */}
            <div>
              <h4 style={{ color: 'var(--secondary)', marginBottom: '15px', fontSize: '0.9rem', textTransform: 'uppercase' }}>إعداد الطالب</h4>
              <p style={{ fontWeight: '700', marginBottom: '5px' }}>أحمد بدر عبد الهادي أبو عمر</p>
              <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>الرقم الجامعي: 0150012120126</p>
              <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>تخصص هندسة البرمجيات</p>
            </div>

            {/* Professor Info */}
            <div>
              <h4 style={{ color: 'var(--secondary)', marginBottom: '15px', fontSize: '0.9rem', textTransform: 'uppercase' }}>إشراف الدكتور</h4>
              <p style={{ fontWeight: '700', marginBottom: '5px' }}>إبراهيم محمد الدلق</p>
              <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>مشرف مساق هندسة البرمجيات</p>
            </div>
          </div>

          <div style={{ 
            borderTop: '1px solid rgba(255,255,255,0.1)', 
            paddingTop: '20px', 
            textAlign: 'center' 
          }}>
            <p style={{ opacity: 0.4, fontSize: '0.8rem' }}>
              &copy; 2026 {t('common.bankName')}. جميع الحقوق محفوظة لمشروع التخرج الأكاديمي.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
