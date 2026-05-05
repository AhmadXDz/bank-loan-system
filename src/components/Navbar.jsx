import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Scroll tracking logic
    const handleScroll = () => {
      if (location.pathname !== '/') return;
      
      const loansSection = document.getElementById('loans-section');
      if (loansSection) {
        const rect = loansSection.getBoundingClientRect();
        // If the top of the loans section is near the top of the viewport
        if (rect.top <= 150) {
          setActiveSection('loans');
        } else {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const navLinks = [
    { name: t('common.home'), path: '/' },
    { name: t('common.loans'), path: '/loans' },
    ...(user ? [{ name: t('common.dashboard'), path: '/dashboard' }] : []),
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="glass" style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000, 
      borderBottom: '1px solid var(--border)',
      height: '80px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: 'var(--primary)', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary)'
          }}>
            <span className="material-icons-round">account_balance</span>
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--primary)' }}>
            {t('common.bankName')}
          </span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', gap: '30px' }}>
          {navLinks.map((link) => {
            const isHomePath = link.path === '/';
            const isLoansPath = link.path === '/loans';
            const isHomeActive = isHomePath && activeSection === 'home' && location.pathname === '/';
            const isLoansActive = isLoansPath && (activeSection === 'loans' || location.pathname === '/loans');
            const isActive = isHomeActive || isLoansActive || (location.pathname === link.path && !isHomePath && !isLoansPath);
            
            return (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={(e) => {
                  if (location.pathname === '/') {
                    if (isLoansPath) {
                      e.preventDefault();
                      document.getElementById('loans-section')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (isHomePath) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }
                }}
                style={{ 
                  fontWeight: '600',
                  color: isActive ? 'var(--secondary)' : 'var(--text-1)',
                  position: 'relative',
                  padding: '10px 0'
                }}
              >
                {link.name}
                {isActive && (
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    height: '3px', 
                    backgroundColor: 'var(--secondary)',
                    borderRadius: '10px'
                  }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth Section */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/profile" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                color: location.pathname === '/profile' ? 'var(--secondary)' : 'var(--text-1)',
                fontWeight: '600'
              }}>
                <span className="material-icons-round">account_circle</span>
                {t('common.profile')}
              </Link>
              <button onClick={handleLogout} style={{ 
                border: 'none', 
                background: 'none', 
                color: 'var(--danger)', 
                fontWeight: '600', 
                cursor: 'pointer' 
              }}>
                {t('common.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-1)', fontWeight: '600' }}>
                {t('common.login')}
              </Link>
              <Link to="/signup" style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                padding: '10px 24px', 
                borderRadius: 'var(--radius-sm)',
                fontWeight: '600'
              }}>
                {t('common.signup')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

