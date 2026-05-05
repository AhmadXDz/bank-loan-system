import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        nationalId,
        email,
        createdAt: new Date().toISOString()
      });
      
      navigate('/dashboard');
    } catch (err) {
      let message = 'حدث خطأ غير متوقع. حاول مرة أخرى.';
      
      if (err.code === 'auth/email-already-in-use') {
        message = 'هذا البريد الإلكتروني مسجل مسبقاً، جرب تسجيل الدخول.';
      } else if (err.code === 'auth/weak-password') {
        message = 'كلمة المرور ضعيفة جداً، يجب أن تكون 6 أحرف على الأقل.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'صيغة البريد الإلكتروني غير صحيحة.';
      } else if (err.message.includes('Database')) {
        message = 'قاعدة البيانات غير مفعلة، يرجى تفعيل Firestore من لوحة التحكم.';
      }
      
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center animate-fade" style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            backgroundColor: 'var(--secondary)', 
            borderRadius: '15px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <span className="material-icons-round" style={{ fontSize: '30px' }}>person_add</span>
          </div>
          <h2>{t('auth.signupTitle')}</h2>
          <p style={{ color: 'var(--text-3)' }}>انضم إلى نخبة عملاء بنك الاستثمار</p>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSignup}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                {t('auth.fullName')}
              </label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أحمد محمد"
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-input)'
                }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                {t('auth.nationalId')}
              </label>
              <input 
                type="text" 
                required
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="000-000-000"
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-input)'
                }} 
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {t('auth.email')}
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@bank.com"
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: 'var(--radius-sm)', 
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-input)'
              }} 
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {t('auth.password')}
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: 'var(--radius-sm)', 
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-input)'
              }} 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              padding: '16px', 
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              fontSize: '1rem',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(26,26,46,0.2)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? t('common.loading') : t('auth.submitSignup')}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-2)' }}>
            {t('auth.haveAccount')} <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: '700' }}>{t('common.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
