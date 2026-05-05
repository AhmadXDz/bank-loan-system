import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading) return (
    <div className="flex-center" style={{ height: '80vh' }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="container animate-fade" style={{ padding: '40px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ maxWidth: '750px', width: '100%', overflow: 'hidden', padding: '0' }}>
        {/* Header/Cover - Reduced Height */}
        <div style={{ 
          height: '100px', 
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          position: 'relative'
        }}>
          <div style={{ 
            position: 'absolute',
            bottom: '-40px',
            right: '40px',
            width: '80px',
            height: '80px',
            backgroundColor: 'var(--secondary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid white',
            boxShadow: 'var(--shadow-md)'
          }}>
            <span className="material-icons-round" style={{ fontSize: '40px', color: 'var(--primary)' }}>person</span>
          </div>
        </div>

        <div style={{ padding: '50px 30px 30px' }}>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '5px' }}>{userData?.fullName || 'مستخدم البنك'}</h2>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>{auth.currentUser?.email}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Info Section */}
            <div>
              <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                <span className="material-icons-round" style={{ fontSize: '20px' }}>contact_mail</span>
                المعلومات الشخصية
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>{t('auth.fullName')}</span>
                  <span style={infoValueStyle}>{userData?.fullName}</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>{t('auth.nationalId')}</span>
                  <span style={infoValueStyle}>{userData?.nationalId}</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>{t('auth.email')}</span>
                  <span style={infoValueStyle} title={auth.currentUser?.email}>
                    {auth.currentUser?.email?.length > 20 ? auth.currentUser.email.substring(0, 17) + '...' : auth.currentUser?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div style={{ 
              padding: '20px', 
              backgroundColor: 'var(--bg-input)', 
              borderRadius: '16px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <span className="material-icons-round" style={{ color: 'var(--success)', fontSize: '20px' }}>check_circle</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>الهوية الوطنية موثقة</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <span className="material-icons-round" style={{ color: 'var(--success)', fontSize: '20px' }}>check_circle</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>البريد الإلكتروني نشط</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '10px' }}>
                عضو منذ: {new Date(auth.currentUser?.metadata.creationTime).toLocaleDateString('ar-EG')}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '15px' }}>
            <button className="btn-outline" onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: '10px' }}>
              لوحة التحكم
            </button>
            <button 
              onClick={handleLogout}
              style={{ 
                flex: 1, 
                backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                color: 'var(--danger)', 
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const infoItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 0',
  borderBottom: '1px solid var(--border-light)'
};

const infoLabelStyle = {
  color: 'var(--text-3)',
  fontSize: '0.9rem'
};

const infoValueStyle = {
  fontWeight: '600',
  color: 'var(--text-1)'
};

export default Profile;
