import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Loans = () => {
  const { t } = useTranslation();

  const loanTypes = [
    { id: 'personal', title: t('loans.personal'), profit: '4.5%', duration: '5 سنوات', max: '50,000 $', icon: 'person' },
    { id: 'housing', title: t('loans.housing'), profit: '3.2%', duration: '25 سنة', max: '500,000 $', icon: 'home' },
    { id: 'car', title: t('loans.car'), profit: '5.0%', duration: '7 سنوات', max: '80,000 $', icon: 'directions_car' },
    { id: 'investment', title: t('loans.investment'), profit: '6.5%', duration: '10 سنوات', max: '1,000,000 $', icon: 'trending_up' },
  ];

  return (
    <div className="container animate-fade" style={{ padding: '60px 24px' }}>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ marginBottom: '20px' }}>{t('loans.title')}</h1>
        <p style={{ color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto' }}>
          {t('loans.description')}
        </p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '40px' 
      }}>
        {loanTypes.map((loan) => (
          <div key={loan.id} className="card" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.3s ease',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: 'var(--primary-light)', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--secondary)'
              }}>
                <span className="material-icons-round">{loan.icon}</span>
              </div>
              <div style={{ 
                backgroundColor: 'var(--secondary-light)', 
                color: 'var(--primary)', 
                padding: '5px 15px', 
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '700'
              }}>
                {t('loans.profitRate')}: {loan.profit}
              </div>
            </div>

            <h3 style={{ marginBottom: '20px', fontSize: '1.4rem' }}>{loan.title}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div>
                <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>{t('loans.duration')}</p>
                <p style={{ fontWeight: '600' }}>{loan.duration}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>{t('loans.maxAmount')}</p>
                <p style={{ fontWeight: '600' }}>{loan.max}</p>
              </div>
            </div>

            <Link 
              to={`/apply/${loan.id}`}
              style={{ 
                marginTop: 'auto',
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '600',
                width: '100%',
                textAlign: 'center'
              }}
            >
              {t('loans.apply')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loans;
