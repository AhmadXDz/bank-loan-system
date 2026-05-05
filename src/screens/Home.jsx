import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <section style={{
        minHeight: '80vh',
        background: 'linear-gradient(rgba(10,10,25,0.85), rgba(10,10,25,0.95)), url("https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=2070")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        borderRadius: '0 0 40px 40px',
        padding: '60px 20px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '850px', marginBottom: '30px', position: 'relative', zIndex: 2 }}>
          <p style={{
            color: 'var(--secondary)',
            fontSize: '3.5rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '25px'
          }}>
            جامعة القدس المفتوحة
          </p>
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            marginBottom: '10px',
            fontWeight: '800'
          }}>
            {t('common.welcome')}
          </h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '0', opacity: 0.8, fontWeight: '300' }}>
            {t('loans.description')}
          </p>
        </div>

        {/* Compact Academic Badge */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          padding: '20px 35px',
          borderRadius: '20px',
          display: 'flex',
          gap: '30px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Student Info */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '2px', textTransform: 'uppercase' }}>اعداد الطالب </p>
            <h3 style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '3px' }}>أحمد بدر عبد الهادي أبو عمر</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>الرقم الجامعي: 0150012120126</p>
          </div>

          <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(212,175,55,0.1)' }} />

          {/* Professor Info */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '2px', textTransform: 'uppercase' }}>إشراف الدكتور</p>
            <h3 style={{ fontWeight: '700', fontSize: '1.2rem', color: 'white', marginBottom: '0' }}>إبراهيم محمد الدلق</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>مادة هندسة البرمجيات</p>
          </div>
        </div>

        {/* Compact Buttons */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', position: 'zIndex: 2' }}>
          <button
            onClick={() => document.getElementById('loans-section').scrollIntoView({ behavior: 'smooth' })}
            style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--primary)',
              padding: '12px 35px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {t('common.applyNow')}
          </button>
          <Link to="/signup" style={{
            border: '1.5px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '12px 35px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}>
            {t('common.signup')}
          </Link>
        </div>
      </section>

      {/* Features/Loans Section */}
      <section id="loans-section" className="container" style={{ padding: '80px 24px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>{t('loans.title')}</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {[
            { id: 'personal', title: t('loans.personal'), profit: '4.5%', duration: '5 سنوات', max: '50,000 $', icon: 'person' },
            { id: 'housing', title: t('loans.housing'), profit: '3.2%', duration: '25 سنة', max: '500,000 $', icon: 'home' },
            { id: 'car', title: t('loans.car'), profit: '5.0%', duration: '7 سنوات', max: '80,000 $', icon: 'directions_car' },
            { id: 'investment', title: t('loans.investment'), profit: '6.5%', duration: '10 سنوات', max: '1,000,000 $', icon: 'trending_up' },
          ].map((loan) => (
            <div key={loan.id} className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border)',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  width: '45px', height: '45px', backgroundColor: 'var(--secondary-light)',
                  borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)'
                }}>
                  <span className="material-icons-round">{loan.icon}</span>
                </div>
                <div style={{
                  backgroundColor: 'var(--secondary-light)', color: 'var(--primary)',
                  padding: '5px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '800',
                  boxShadow: 'inset 0 0 5px rgba(0,0,0,0.05)'
                }}>
                  {loan.profit} ربح
                </div>
              </div>

              <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>{loan.title}</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                <div>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>{t('loans.duration')}</p>
                  <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{loan.duration}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>{t('loans.maxAmount')}</p>
                  <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{loan.max}</p>
                </div>
              </div>

              <Link
                to={`/apply/${loan.id}`}
                style={{
                  marginTop: 'auto', backgroundColor: 'var(--primary)', color: 'white',
                  padding: '12px', borderRadius: '8px', fontWeight: '700', width: '100%', textAlign: 'center'
                }}
              >
                {t('loans.apply')}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
