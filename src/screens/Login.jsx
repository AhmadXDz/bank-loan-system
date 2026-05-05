import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      let message = 'خطأ غير متوقع. يرجى المحاولة لاحقاً.';
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'تم حظر الدخول مؤقتاً بسبب محاولات كثيرة خاطئة. جرب لاحقاً.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'صيغة البريد الإلكتروني غير صحيحة.';
      }
      
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center animate-fade" style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            backgroundColor: 'var(--primary)', 
            borderRadius: '15px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary)'
          }}>
            <span className="material-icons-round" style={{ fontSize: '30px' }}>lock</span>
          </div>
          <h2>{t('auth.loginTitle')}</h2>
          <p style={{ color: 'var(--text-3)' }}>مرحباً بك مجدداً في نظامنا الآمن</p>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin}>
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
            {loading ? t('common.loading') : t('auth.submitLogin')}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-2)' }}>
            {t('auth.noAccount')} <Link to="/signup" style={{ color: 'var(--secondary)', fontWeight: '700' }}>{t('common.signup')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
