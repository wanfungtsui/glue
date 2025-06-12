import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  showBackButton?: boolean;
  showNextButton?: boolean;
  nextButtonText?: string;
  onNextClick?: () => void;
  isNextButtonEnabled?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  showBackButton = true,
  showNextButton = true,
  nextButtonText = 'Next',
  onNextClick,
  isNextButtonEnabled = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const routes = ['/', '/analysis', '/generator', '/export'];
    const currentIndex = routes.indexOf(location.pathname);
    if (currentIndex > 0) {
      navigate(routes[currentIndex - 1]);
    }
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--md-sys-color-surface)',
      borderBottom: '1px solid var(--md-sys-color-outline)',
      zIndex: 50,
      boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            {showBackButton && (
              <button
                onClick={handleBack}
                style={{
                  marginRight: '16px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  backgroundColor: 'transparent',
                  color: 'var(--md-sys-color-primary)',
                  border: '1px solid var(--md-sys-color-outline)',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span>
                Back
              </button>
            )}
          </div>
          
          <h1 className="md-typescale-title-large" style={{
            color: 'var(--md-sys-color-on-surface)',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '500',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            margin: 0,
            whiteSpace: 'nowrap'
          }}>
            Glue – AI Web Component Composer
          </h1>
          
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {showNextButton && (
              <button
                onClick={onNextClick}
                disabled={!isNextButtonEnabled}
                style={{
                  padding: '8px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: isNextButtonEnabled ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  backgroundColor: isNextButtonEnabled 
                    ? 'var(--md-sys-color-primary)' 
                    : 'var(--md-sys-color-surface)',
                  color: isNextButtonEnabled 
                    ? 'var(--md-sys-color-on-primary)' 
                    : 'var(--md-sys-color-on-surface-variant)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '100px',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (isNextButtonEnabled) {
                    e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary-container)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isNextButtonEnabled) {
                    e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary)';
                  }
                }}
              >
                {nextButtonText}
                <span className="material-icons" style={{ fontSize: '18px' }}>arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 