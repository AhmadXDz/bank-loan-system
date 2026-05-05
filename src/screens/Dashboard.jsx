import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        try {
          const q = query(
            collection(db, 'loan_applications'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          
          const querySnapshot = await getDocs(q);
          const apps = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setApplications(apps);
        } catch (indexErr) {
          const qFallback = query(
            collection(db, 'loan_applications'),
            where('userId', '==', user.uid)
          );
          const querySnapshot = await getDocs(qFallback);
          const apps = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setApplications(apps);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("تعذر تحميل البيانات. يرجى التأكد من اتصالك بالإنترنت.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'مقبول': return 'var(--success)';
      case 'مرفوض': return 'var(--danger)';
      default: return 'var(--warning)';
    }
  };

  if (loading) return (
    <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
      <div className="loader"></div>
      <p style={{ color: 'var(--text-2)' }}>{t('common.loading')}</p>
    </div>
  );

  return (
    <div className="container animate-fade" style={{ padding: '40px 24px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1>{t('common.dashboard')}</h1>
        <p style={{ color: 'var(--text-2)' }}>
          {userData ? `أهلاً بك، ${userData.fullName}.` : 'أهلاً بك.'}
        </p>
      </header>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--primary)' }}>{applications.length}</h3>
          <p style={{ color: 'var(--text-3)' }}>إجمالي الطلبات</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--success)' }}>{applications.filter(a => a.status === 'مقبول').length}</h3>
          <p style={{ color: 'var(--text-3)' }}>طلبات مقبولة</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--warning)' }}>{applications.filter(a => a.status === 'قيد المراجعة').length}</h3>
          <p style={{ color: 'var(--text-3)' }}>قيد المراجعة</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '1.5fr 1fr' : '1fr', gap: '30px', transition: 'all 0.3s ease' }}>
        {/* Applications List */}
        <div className="card" style={{ padding: '0' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
            <h3>{t('dashboard.trackLoans')}</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-input)' }}>
                  <th style={{ padding: '16px 24px' }}>{t('dashboard.loanType')}</th>
                  <th style={{ padding: '16px 24px' }}>{t('dashboard.amount')}</th>
                  <th style={{ padding: '16px 24px' }}>{t('dashboard.status')}</th>
                  <th style={{ padding: '16px 24px' }}></th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>{t('dashboard.noApplications')}</td></tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} 
                        onClick={() => setSelectedApp(app)}
                        style={{ 
                          borderBottom: '1px solid var(--border)', 
                          cursor: 'pointer',
                          backgroundColor: selectedApp?.id === app.id ? 'var(--secondary)05' : 'transparent'
                        }}>
                      <td style={{ padding: '16px 24px', fontWeight: '600' }}>{t(`loans.${app.loanType}`)}</td>
                      <td style={{ padding: '16px 24px' }}>{app.amount} $</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          backgroundColor: `${getStatusColor(app.status)}15`, 
                          color: getStatusColor(app.status), 
                          padding: '4px 12px', 
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '700'
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span className="material-icons-round" style={{ fontSize: '18px', color: 'var(--text-3)' }}>chevron_left</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Details Sidebar */}
        {selectedApp && (
          <div className="card animate-fade" style={{ height: 'fit-content', border: '2px solid var(--secondary)30' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-icons-round" style={{ color: 'var(--secondary)' }}>analytics</span>
                تفاصيل تحليل الـ AI
              </h3>
              <button onClick={() => setSelectedApp(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <span className="material-icons-round">close</span>
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--bg-input)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span>نسبة الفائدة السنوية:</span>
                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{selectedApp.interestRate || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span>القسط الشهري:</span>
                <span style={{ fontWeight: '700' }}>{selectedApp.monthlyPayment || 'N/A'} $</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <span>إجمالي المبلغ المستحق:</span>
                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{selectedApp.totalRepayment || 'N/A'} $</span>
              </div>
            </div>

            <div style={{ 
              padding: '16px', 
              borderRadius: '12px', 
              backgroundColor: `${getStatusColor(selectedApp.status)}10`,
              border: `1px dashed ${getStatusColor(selectedApp.status)}50`
            }}>
              <p style={{ fontWeight: '700', marginBottom: '8px', color: getStatusColor(selectedApp.status) }}>قرار النظام الذكي:</p>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{selectedApp.aiReason || 'جاري معالجة التحليل...'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


